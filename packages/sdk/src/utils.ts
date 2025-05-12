import {
  CompressedAccount,
  CompressedProofWithContext,
  NewAddressParams,
  PackedMerkleContext,
  defaultTestStateTreeAccounts,
  getIndexOrAdd,
  hashvToBn254FieldSizeBe,
  packCompressedAccounts,
  packNewAddressParams,
} from "@lightprotocol/stateless.js";
import { PublicKey } from "@solana/web3.js";

export function deriveAddressSeed(
  seeds: Uint8Array[],
  programId: PublicKey,
  addressMerkleTreePubkey: PublicKey = defaultTestStateTreeAccounts()
    .addressTree
): Uint8Array {
  const combinedSeeds: Uint8Array[] = [
    programId.toBytes(),
    addressMerkleTreePubkey.toBytes(),
    ...seeds,
  ];
  const hash = hashvToBn254FieldSizeBe(combinedSeeds);
  return hash;
}

export function packInputData(
  outputCompressedAccounts: CompressedAccount[],
  newAddressesParams: NewAddressParams[],
  proof: CompressedProofWithContext,
  currentRemainingAccounts?: PublicKey[]
) {
  const merkleTree = defaultTestStateTreeAccounts().merkleTree;
  const nullifierQueue = defaultTestStateTreeAccounts().nullifierQueue;

  const { remainingAccounts: _remainingAccounts } = packCompressedAccounts(
    [],
    proof.rootIndices,
    outputCompressedAccounts,
    proof.merkleTrees,
    currentRemainingAccounts
  );

  const { newAddressParamsPacked, remainingAccounts } = packNewAddressParams(
    newAddressesParams,
    _remainingAccounts
  );

  const merkleContext: PackedMerkleContext = {
    leafIndex: 0,
    merkleTreePubkeyIndex: getIndexOrAdd(remainingAccounts, merkleTree),
    nullifierQueuePubkeyIndex: getIndexOrAdd(remainingAccounts, nullifierQueue),
    queueIndex: null,
  };

  const {
    addressMerkleTreeAccountIndex,
    addressMerkleTreeRootIndex,
    addressQueueAccountIndex,
  } = newAddressParamsPacked[0];

  return {
    addressMerkleContext: {
      addressMerkleTreePubkeyIndex: addressMerkleTreeAccountIndex,
      addressQueuePubkeyIndex: addressQueueAccountIndex,
    },
    addressMerkleTreeRootIndex,
    merkleContext,
    remainingAccounts,
  };
}

export function mergeUniqueOrdered<T>(arr1: T[], arr2: T[]): T[] {
  const seen = new Set<T>();
  const result: T[] = [];

  for (const item of [...arr1, ...arr2]) {
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }

  return result;
}
