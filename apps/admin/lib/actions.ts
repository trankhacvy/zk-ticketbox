"use server";

import { z } from "zod";
import { zfd } from "zod-form-data";
import { actionClient, ActionResponse } from "./safe-action";
import { User, getOrCreateUser, getUserByPrivyId } from "@ticketbox/db";
import { cookies } from "next/headers";
import { privyServerClient } from "./privy";
import { WalletWithMetadata } from "@privy-io/server-auth";
import { TicketBoxUser } from "@/types/user";
import { uploadImage, uploadMetadata } from "./upload";

const createUserIfNotExistSchema = z.object({
  privyId: z.string(),
  wallet: z.string(),
});

export const createUserIfNotExist = actionClient
  .schema(createUserIfNotExistSchema)
  .action<
    ActionResponse<User>
  >(async ({ parsedInput: { privyId, wallet } }) => {
    try {
      const user = await getOrCreateUser({ privyId, wallet });

      return {
        success: true,
        data: user as User,
      };
    } catch (error) {
      console.error("[action][createUserIfNotExist] Verify user error:", error);

      return {
        success: false,
        error: "Authentication failed",
      };
    }
  });

export const getUser = actionClient.action<ActionResponse<TicketBoxUser>>(
  async () => {
    const token = (await cookies()).get("privy-token")?.value;

    if (!token) {
      return {
        success: false,
        error: "No privy token found",
      };
    }

    try {
      const claims = await privyServerClient.verifyAuthToken(token);
      const privyUser = await privyServerClient.getUserById(claims.userId);

      const embeddedWallet = privyUser?.linkedAccounts.find(
        (acct): acct is WalletWithMetadata =>
          acct.type === "wallet" && acct.walletClientType === "privy"
      );

      const user = await getUserByPrivyId(claims.userId);

      if (!user) {
        return {
          success: false,
          error: "User not found",
        };
      }

      return {
        success: true,
        data: {
          ...user,
          privyUser,
          wallet: embeddedWallet,
        } as TicketBoxUser,
      };
    } catch (error) {
      console.error("[action][getUser] Get user error:", error);

      return {
        success: false,
        error: "Authentication failed",
      };
    }
  }
);

const updateThumbnailSchema = z.object({
  thumbnail: zfd.file(),
  name: z.string(),
  description: z.string(),
});

export const uploadThumbnail = actionClient
  .schema(updateThumbnailSchema)
  .action<
    ActionResponse<{ imageUrl: string; metadataUri: string }>
  >(async ({ parsedInput: { thumbnail, name, description } }) => {
    try {
      const thumbnailUrl = await uploadImage(thumbnail);

      if (!thumbnailUrl) {
        return {
          success: false,
          error: "Failed to upload image",
        };
      }

      const metadata = await uploadMetadata(
        name,
        "EVENT",
        description,
        thumbnailUrl
      );

      if (!metadata) {
        return {
          success: false,
          error: "Failed to upload metadata",
        };
      }

      return {
        success: true,
        data: {
          imageUrl: thumbnailUrl,
          metadataUri: metadata.metadataUri,
        },
      };
    } catch (error) {
      console.error("[action][createUserIfNotExist] Verify user error:", error);

      return {
        success: false,
        error: "Authentication failed",
      };
    }
  });
