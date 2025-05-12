import { SOLANA_RPC_URL } from "@/constants/env";
import { getEventById } from "@ticketbox/db";
import { buildTx, createRpc } from "@lightprotocol/stateless.js";
import { Keypair, PublicKey } from "@solana/web3.js";
import { NextRequest } from "next/server";
import * as sdk from "@repo/sdk";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  const event = await getEventById(eventId);

  if (!event) {
    return new Response("Event not found", {
      status: 404,
    });
  }

  return Response.json({
    label: event.name,
    icon: "https://github.com/trankhacvy/zk-ticketbox/blob/main/apps/admin/public/logo.png?raw=true",
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;

    const event = await getEventById(eventId);

    if (!event) {
      return new Response("Event not found", {
        status: 404,
      });
    }

    const res = await request.json();

    const { account } = res;

    const searchParams = request.nextUrl.searchParams;

    const reference = searchParams.get("reference");

    if (!account || !reference) {
      res.status(400).json({
        error: "Required data missing. Account or reference not provided.",
      });
      return;
    }

    const connection = createRpc(SOLANA_RPC_URL);
    const owner = new PublicKey(account);
    const ticketBoxAddress = new PublicKey(event.address);
    const nftKey = Keypair.generate().publicKey;

    const ix = await sdk.mintPoPIx(
      connection,
      owner,
      null,
      ticketBoxAddress,
      nftKey
    );

    const { blockhash } = await connection.getLatestBlockhash();

    const transaction = buildTx([ix.instruction], owner, blockhash);

    return Response.json({
      transaction: Buffer.from(transaction.serialize()).toString("base64"),
      message: "Confirm to Mint NFT",
    });
  } catch (error: any) {
    console.error("Error in webhook:", error);

    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    });
  }
}
