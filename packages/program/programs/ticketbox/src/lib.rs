use anchor_lang::prelude::*;

use instructions::*;

use state::{CreateTicketBoxParams, LightInstructionData};

declare_id!("91VDSbGsnyEzp4JyveazJvrWiLwKwUTDnCVTzedb9obT");

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;
pub mod utils;

#[program]
pub mod ticketbox {
    use super::*;

    pub fn initialize_ticketbox<'info>(
        ctx: Context<'_, '_, '_, 'info, InitializeTicketBox<'info>>,
        inputs: LightInstructionData,
        collection_inputs: zk_nft::state::LightInstructionData,
        params: CreateTicketBoxParams,
        collection_key: Pubkey,
    ) -> Result<()> {
        instructions::initialize_ticketbox(ctx, inputs, collection_inputs, params, collection_key)
    }

    pub fn mint_pop<'info>(
        ctx: Context<'_, '_, '_, 'info, MintPoP<'info>>,
        inputs: LightInstructionData,
        nft_inputs: zk_nft::state::LightInstructionData,
        asset_key: Pubkey,
    ) -> Result<()> {
        instructions::mint_pop(ctx, inputs, nft_inputs, asset_key)
    }

    pub fn mint_pop_v2<'info>(
        ctx: Context<'_, '_, '_, 'info, MintPoP<'info>>,
        nft_inputs: zk_nft::state::LightInstructionData,
        asset_key: Pubkey,
        event_name: String,
        metadata_uri: String,
    ) -> Result<()> {
        instructions::mint_pop_v2(ctx, nft_inputs, asset_key, event_name, metadata_uri)
    }
}
