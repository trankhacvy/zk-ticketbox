use anchor_lang::prelude::*;
use light_account_checks::discriminator::Discriminator;

use light_hasher::{to_byte_array::ToByteArray, HasherError};
use light_sdk::{
    merkle_context::{PackedAddressMerkleContext, PackedMerkleContext},
    proof::CompressedProof,
};
use light_sdk_macros::{LightDiscriminator, LightHasher};

#[derive(
    Clone,
    Debug,
    Default,
    anchor_lang::AnchorDeserialize,
    anchor_lang::AnchorSerialize,
    LightDiscriminator,
    LightHasher,
)]
pub struct AssetV1 {
    /// The account discriminator.
    pub key: Key,
    /// The owner of the asset.
    #[hash]
    pub owner: Pubkey,
    /// The update authority of the asset.
    pub update_authority: UpdateAuthority,
    /// The name of the asset.
    pub name: String,
    /// The URI of the asset that points to the off-chain data.
    #[hash]
    pub uri: String,
}

#[derive(Clone, Debug, PartialEq, Eq, AnchorSerialize, AnchorDeserialize, Default)]
pub enum Key {
    /// Uninitialized or invalid account.
    Uninitialized,
    /// An account holding an uncompressed asset.
    #[default]
    AssetV1,
    /// A discriminator indicating the collection.
    CollectionV1,
}

impl ToByteArray for Key {
    const NUM_FIELDS: usize = 1;
    const IS_PRIMITIVE: bool = true;

    fn to_byte_array(&self) -> std::result::Result<[u8; 32], HasherError> {
        let variant_value = match self {
            Key::Uninitialized => 0u8,
            Key::AssetV1 => 1u8,
            Key::CollectionV1 => 2u8,
        };

        let mut result = [0u8; 32];

        result[31] = variant_value;

        Ok(result)
    }
}

#[derive(Clone, Debug, PartialEq, Eq, AnchorSerialize, AnchorDeserialize, Default)]
pub enum UpdateAuthority {
    /// No update authority, used for immutability.
    #[default]
    None,
    /// A standard address or PDA.
    Address(Pubkey),
    /// Authority delegated to a collection.
    Collection(Pubkey),
}

// impl UpdateAuthority {
//     /// Get the address of the update authority.
//     pub fn key(&self) -> Pubkey {
//         match self {
//             Self::None => Pubkey::default(),
//             Self::Address(address) => *address,
//             Self::Collection(address) => *address,
//         }
//     }
// }

impl ToByteArray for UpdateAuthority {
    const NUM_FIELDS: usize = 1;
    const IS_PRIMITIVE: bool = true;

    fn to_byte_array(&self) -> std::result::Result<[u8; 32], HasherError> {
        let variant_value = match self {
            UpdateAuthority::None => 0u8,
            UpdateAuthority::Address(_) => 1u8,
            UpdateAuthority::Collection(_) => 2u8,
        };

        let mut result = [0u8; 32];

        result[31] = variant_value;

        Ok(result)
    }
}

#[derive(
    Clone,
    Debug,
    Default,
    anchor_lang::AnchorDeserialize,
    anchor_lang::AnchorSerialize,
    LightDiscriminator,
    LightHasher,
)]
pub struct CollectionV1 {
    /// The account discriminator.
    pub key: Key,
    /// The update authority of the collection.
    #[hash]
    pub update_authority: Pubkey,
    /// The name of the collection.
    pub name: String,
    /// The URI that links to what data to show for the collection.
    #[hash]
    pub uri: String,
    /// The number of assets minted in the collection.
    pub num_minted: u32,
    /// The number of assets currently in the collection.
    pub current_size: u32,
}

#[derive(Debug, AnchorSerialize, AnchorDeserialize)]
pub struct LightInstructionData {
    pub inputs: Vec<Vec<u8>>,
    pub proof: CompressedProof,
    pub merkle_context: PackedMerkleContext,
    pub merkle_tree_root_index: u16,
    pub address_merkle_context: PackedAddressMerkleContext,
    pub address_merkle_tree_root_index: u16,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateCollectionV1Args {
    pub derivation_key: Pubkey,
    pub name: String,
    pub uri: String,
    pub collection: Option<CollectionV1>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateV1Args {
    pub derivation_key: Pubkey,
    pub name: String,
    pub uri: String,
    pub collection_key: Option<Pubkey>,
    pub asset: Option<AssetV1>,
}
