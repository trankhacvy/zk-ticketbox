import useSWR from "swr";
import { createRpc } from "@lightprotocol/stateless.js";
import { PublicKey } from "@solana/web3.js";
import * as sdk from "@repo/sdk";
import { SOLANA_RPC_URL } from "@/lib/env";
import { useUserWallet } from "./use-user-wallet";
import { fetchNFTMetadata } from "@/lib/utils";

export const useAssets = () => {
  const { account } = useUserWallet();

  const { data, ...rest } = useSWR(
    account ? ["assets", account.address] : null,
    async () => {
      const rpc = createRpc(SOLANA_RPC_URL);

      const assets = await sdk.getAssetsByOwner(
        rpc,
        new PublicKey(account.address)
      );

      const assetPromises = assets.map(async (asset) => {
        const data = await fetchNFTMetadata(asset.uri);

        return {
          ...data,
          address: asset.address,
        };
      });

      return Promise.all(assetPromises);
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    assets: data ?? [],
    ...rest,
  };
};
