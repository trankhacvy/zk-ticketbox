"use server";

import bs58 from "bs58";
import * as sdk from "@repo/sdk";
import { z } from "zod";
import { actionClient, ActionResponse } from "./safe-action";
import { User } from "@privy-io/server-auth";
import { cookies } from "next/headers";
import { privyServerClient } from "./privy";
import { createRpc } from "@lightprotocol/stateless.js";
import { MASTER_KP, SOLANA_RPC_URL } from "./env";
import { Keypair, PublicKey } from "@solana/web3.js";

export const getUser = actionClient.action<ActionResponse<User>>(async () => {
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

    return {
      success: true,
      data: privyUser,
    };
  } catch (error) {
    console.error("[action][getUser] Get user error:", error);

    return {
      success: false,
      error: "Authentication failed",
    };
  }
});

const exeTxSchema = z.object({
  wallet: z.string(),
  ticketBoxAddress: z.string(),
});

export const executeTransaction = actionClient
  .schema(exeTxSchema)
  .action<ActionResponse<any>>(async ({ parsedInput }) => {
    try {
      const connection = createRpc(SOLANA_RPC_URL);
      const owner = new PublicKey(parsedInput.wallet);
      const ticketBoxAddress = new PublicKey(parsedInput.ticketBoxAddress);
      const nftKey = Keypair.generate().publicKey;
      const masterKp = Keypair.fromSecretKey(bs58.decode(MASTER_KP));

      const ix = await sdk.mintPoPIx(
        connection,
        masterKp.publicKey,
        owner,
        ticketBoxAddress,
        nftKey
      );

      const transaction = await sdk.buildTxWithComputeBudget(
        connection,
        [ix.instruction],
        masterKp.publicKey
      );

      transaction.sign([masterKp]);

      const tx = await connection.sendTransaction(transaction);

      await connection.confirmTransaction(tx);

      return {
        success: true,
        data: tx,
      };
    } catch (error) {
      console.error("[action][getUser] Get user error:", error);

      return {
        success: false,
        error: "Authentication failed",
      };
    }
  });
