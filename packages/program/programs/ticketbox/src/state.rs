use anchor_lang::prelude::*;
use light_account_checks::discriminator::Discriminator;

use light_sdk::{
    merkle_context::{PackedAddressMerkleContext, PackedMerkleContext},
    proof::CompressedProof,
};
use light_sdk_macros::{LightDiscriminator, LightHasher};

use crate::errors::TicketBoxError;

#[derive(
    Clone,
    Debug,
    Default,
    anchor_lang::AnchorDeserialize,
    anchor_lang::AnchorSerialize,
    LightDiscriminator,
    LightHasher,
)]
pub struct CounterCompressedAccount {
    #[hash]
    pub owner: Pubkey,
    pub counter: u64,
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
pub struct TicketBox {
    #[hash]
    pub authority: Pubkey,
    pub id: String,
    pub start_at: i64,
    pub end_at: i64,
    #[hash]
    pub collection: Pubkey,
    pub total_minted: u64,
    pub max_supply: u64,
    pub is_active: bool,
    // event
    pub event_name: String,
    #[hash]
    pub metadata_uri: String,
}

impl TicketBox {
    pub fn new(
        authority: Pubkey,
        collection: Pubkey,
        event_id: String,
        start_at: i64,
        end_at: i64,
        max_supply: u64,
        event_name: String,
        metadata_uri: String,
    ) -> Self {
        Self {
            authority,
            id: event_id,
            start_at,
            end_at,
            collection,
            total_minted: 0,
            max_supply,
            is_active: true,
            event_name,
            metadata_uri,
        }
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct CreateTicketBoxParams {
    pub event_id: String,
    pub event_name: String,
    pub metadata_uri: String,
    pub start_at: i64,
    pub end_at: i64,
    pub max_supply: u64,
}

impl CreateTicketBoxParams {
    pub fn validate(&self) -> Result<()> {
        if self.event_name.len() > 50 {
            return Err(error!(TicketBoxError::EventNameTooLong));
        }

        Ok(())
    }
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
