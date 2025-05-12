use anchor_lang::prelude::*;
use instructions::*;
use state::{CreateCollectionV1Args, CreateV1Args, LightInstructionData};

mod errors;
pub mod instructions;
pub mod state;
mod utils;

declare_id!("GNfAaEoSYPnQVH1w8Sbd8um5T6Gr6cYryadt6uE7HbJB");

#[program]
pub mod zk_nft {

    use super::*;

    pub fn create_asset<'info>(
        ctx: Context<'_, '_, '_, 'info, CreateAsset<'info>>,
        inputs: LightInstructionData,
        collection_inputs: Option<LightInstructionData>,
        args: CreateV1Args,
    ) -> Result<()> {
        instructions::create_asset(ctx, inputs, collection_inputs, args)
    }

    pub fn create_collection<'info>(
        ctx: Context<'_, '_, '_, 'info, CreateCollection<'info>>,
        inputs: LightInstructionData,
        args: CreateCollectionV1Args,
    ) -> Result<()> {
        instructions::create_collection(ctx, inputs, args)
    }
}
