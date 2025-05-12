use anchor_lang::prelude::*;
use light_account_checks::discriminator::Discriminator;
use light_hasher::{DataHasher, Poseidon};
use light_sdk::{
    compressed_account::{
        CompressedAccount, CompressedAccountData, OutputCompressedAccountWithPackedContext,
        PackedCompressedAccountWithMerkleContext,
    },
    event, light_system_accounts,
    program_merkle_context::unpack_address_merkle_context,
    utils::create_cpi_inputs_for_account_update,
    verify::verify,
    CPI_AUTHORITY_PDA_SEED,
};
use light_sdk_macros::LightTraits;
use zk_nft::cpi::accounts::CreateAsset;

use crate::{
    constants::TICKET_BOX_SEED,
    errors::TicketBoxError,
    state::{LightInstructionData, TicketBox},
};

#[light_system_accounts]
#[derive(Accounts, LightTraits)]
pub struct MintPoP<'info> {
    #[account(mut)]
    #[fee_payer]
    pub signer: Signer<'info>,

    #[authority]
    #[account(
        seeds = [CPI_AUTHORITY_PDA_SEED],
        bump
    )]
    pub cpi_signer: UncheckedAccount<'info>,

    #[self_program]
    pub self_program: Program<'info, crate::program::Ticketbox>,

    pub zk_nft_program: Program<'info, zk_nft::program::ZkNft>,
    // CHECK: Checked in CPI
    pub zk_nft_cpi_authority_pda: UncheckedAccount<'info>,

    /// CHECK: This can be any valid public key.
    pub owner: Option<UncheckedAccount<'info>>,
}

pub fn mint_pop<'info>(
    ctx: Context<'_, '_, '_, 'info, MintPoP<'info>>,
    inputs: LightInstructionData,
    nft_inputs: zk_nft::state::LightInstructionData,
    asset_key: Pubkey,
) -> Result<()> {
    let mut ticketbox = TicketBox::try_from_slice(&inputs.inputs[0])?;

    {
        let clock = Clock::get()?;

        if clock.unix_timestamp < ticketbox.start_at {
            return err!(TicketBoxError::MintNotLive);
        }

        if clock.unix_timestamp >= ticketbox.end_at {
            return err!(TicketBoxError::AfterEndDate);
        }

        if ticketbox.total_minted >= ticketbox.max_supply {
            return err!(TicketBoxError::MaxSupplyReached);
        }
    }

    {
        let ticketbox = TicketBox::try_from_slice(&inputs.inputs[0])?;
        // mint nft
        let cpi_ctx = ctx.accounts.create_asset_ctx();

        zk_nft::cpi::create_asset(
            cpi_ctx.with_remaining_accounts(ctx.remaining_accounts.to_vec()),
            nft_inputs,
            None,
            zk_nft::state::CreateV1Args {
                name: ticketbox.event_name,
                uri: ticketbox.metadata_uri,
                derivation_key: asset_key,
                collection_key: None,
                asset: None,
            },
        )?;
    }

    // update ticketbox
    // {
    //     let remaining_accounts = &ctx.remaining_accounts;

    //     let signer = &ctx.accounts.signer.key();

    //     let ticketbox_seeds = [TICKET_BOX_SEED, signer.as_ref(), ticketbox.id.as_bytes()];

    //     let address_merkle_context =
    //         unpack_address_merkle_context(inputs.address_merkle_context, remaining_accounts);

    //     let address_seed = light_sdk::address::derive_address_seed(
    //         ticketbox_seeds.as_slice(),
    //         &crate::ID,
    //         &address_merkle_context,
    //     );

    //     let address = light_sdk::address::derive_address(&address_seed, &address_merkle_context);

    //     let compressed_account_data = CompressedAccountData {
    //         discriminator: TicketBox::discriminator(),
    //         data: ticketbox.try_to_vec()?,
    //         data_hash: ticketbox.hash::<Poseidon>().map_err(ProgramError::from)?,
    //     };

    //     let compressed_account = CompressedAccount {
    //         owner: *ctx.program_id,
    //         lamports: 0,
    //         address: Some(address),
    //         data: Some(compressed_account_data),
    //     };

    //     let old_compressed_account = PackedCompressedAccountWithMerkleContext {
    //         compressed_account,
    //         merkle_context: inputs.merkle_context,
    //         root_index: inputs.merkle_tree_root_index,
    //         read_only: false,
    //     };

    //     ticketbox.total_minted = ticketbox.total_minted.checked_add(1).unwrap();

    //     let compressed_account_data = CompressedAccountData {
    //         discriminator: TicketBox::discriminator(),
    //         data: ticketbox.try_to_vec()?,
    //         data_hash: ticketbox.hash::<Poseidon>().map_err(ProgramError::from)?,
    //     };

    //     let compressed_account = CompressedAccount {
    //         owner: *ctx.program_id,
    //         lamports: 0,
    //         address: Some(address),
    //         data: Some(compressed_account_data),
    //     };

    //     let new_compressed_account = OutputCompressedAccountWithPackedContext {
    //         compressed_account,
    //         merkle_tree_index: inputs.merkle_context.merkle_tree_pubkey_index,
    //     };

    //     let cpi_inputs = create_cpi_inputs_for_account_update(
    //         inputs.proof,
    //         old_compressed_account,
    //         new_compressed_account,
    //         None,
    //     );

    //     let bump = ctx.bumps.cpi_signer;
    //     let signer_seeds = [CPI_AUTHORITY_PDA_SEED, &[bump]];

    //     verify(&ctx, &cpi_inputs, &[signer_seeds.as_slice()]).unwrap();
    // }

    Ok(())
}

impl<'info> MintPoP<'info> {
    pub fn create_asset_ctx(&self) -> CpiContext<'_, '_, '_, 'info, CreateAsset<'info>> {
        let cpi_program = self.zk_nft_program.to_account_info();

        let owner = match &self.owner {
            Some(owner) => owner.to_account_info(),
            None => self.signer.to_account_info(),
        };

        let cpi_accounts = CreateAsset {
            account_compression_authority: self.account_compression_authority.to_account_info(),
            account_compression_program: self.account_compression_program.to_account_info(),
            light_system_program: self.light_system_program.to_account_info(),
            system_program: self.system_program.to_account_info(),
            registered_program_pda: self.registered_program_pda.to_account_info(),
            noop_program: self.noop_program.to_account_info(),
            signer: self.signer.to_account_info(),
            update_authority: None,
            owner: Some(owner),
            authority: None,
            cpi_signer: self.zk_nft_cpi_authority_pda.to_account_info(),
            self_program: self.zk_nft_program.to_account_info(),
        };

        CpiContext::new(cpi_program, cpi_accounts)
    }
}

pub fn mint_pop_v2<'info>(
    ctx: Context<'_, '_, '_, 'info, MintPoP<'info>>,
    nft_inputs: zk_nft::state::LightInstructionData,
    asset_key: Pubkey,
    event_name: String,
    metadata_uri: String,
) -> Result<()> {
    let cpi_ctx = ctx.accounts.create_asset_ctx();

    zk_nft::cpi::create_asset(
        cpi_ctx.with_remaining_accounts(ctx.remaining_accounts.to_vec()),
        nft_inputs,
        None,
        zk_nft::state::CreateV1Args {
            name: event_name,
            uri: metadata_uri,
            derivation_key: asset_key,
            collection_key: None,
            asset: None,
        },
    )?;

    Ok(())
}
