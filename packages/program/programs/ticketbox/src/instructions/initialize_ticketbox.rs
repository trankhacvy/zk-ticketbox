use anchor_lang::prelude::*;
use light_account_checks::discriminator::Discriminator;
use light_hasher::{DataHasher, Poseidon};
use light_sdk::{
    compressed_account::{
        CompressedAccount, CompressedAccountData, OutputCompressedAccountWithPackedContext,
    },
    light_system_accounts,
    verify::{verify, InstructionDataInvokeCpi},
    CPI_AUTHORITY_PDA_SEED,
};
use light_sdk_macros::LightTraits;
use zk_nft::cpi::accounts::CreateCollection;

use crate::{
    constants::TICKET_BOX_SEED,
    state::{CreateTicketBoxParams, LightInstructionData, TicketBox},
    utils::create_address,
};

#[light_system_accounts]
#[derive(Accounts, LightTraits)]
pub struct InitializeTicketBox<'info> {
    #[account(mut)]
    #[fee_payer]
    pub signer: Signer<'info>,

    #[self_program]
    pub self_program: Program<'info, crate::program::Ticketbox>,

    /// CHECK: Checked in light-system-program.
    #[authority]
    #[account(
        seeds = [CPI_AUTHORITY_PDA_SEED],
        bump
    )]
    pub cpi_signer: UncheckedAccount<'info>,

    pub zk_nft_program: Program<'info, zk_nft::program::ZkNft>,
    // CHECK: Checked in CPI
    pub zk_nft_cpi_authority_pda: UncheckedAccount<'info>,
}

pub fn initialize_ticketbox<'info>(
    ctx: Context<'_, '_, '_, 'info, InitializeTicketBox<'info>>,
    inputs: LightInstructionData,
    collection_inputs: zk_nft::state::LightInstructionData,
    params: CreateTicketBoxParams,
    collection_key: Pubkey,
) -> Result<()> {
    params.validate()?;

    let signer = &ctx.accounts.signer.key();

    let ticket_box = TicketBox::new(
        *signer,
        *signer,
        params.event_id.clone(),
        params.start_at,
        params.end_at,
        params.max_supply,
        params.event_name.clone(),
        params.metadata_uri.clone(),
    );

    {
        let ticketbox_seeds = [TICKET_BOX_SEED, signer.as_ref(), params.event_id.as_bytes()];

        let (ticketbox_new_address_params, ticketbox_address) = create_address(
            ticketbox_seeds.as_slice(),
            ctx.remaining_accounts,
            inputs
                .address_merkle_context
                .address_merkle_tree_pubkey_index,
            inputs.address_merkle_context.address_queue_pubkey_index,
            inputs.address_merkle_tree_root_index,
        );

        // create_output_account
        let ticketbox_account_data = CompressedAccountData {
            discriminator: TicketBox::discriminator(),
            data: ticket_box.try_to_vec().unwrap(),
            data_hash: ticket_box.hash::<Poseidon>().unwrap(),
        };

        let ticketbox_output_compressed_account = OutputCompressedAccountWithPackedContext {
            compressed_account: CompressedAccount {
                owner: crate::ID,
                lamports: 0,
                address: Some(ticketbox_address),
                data: Some(ticketbox_account_data),
            },
            merkle_tree_index: inputs.merkle_context.merkle_tree_pubkey_index,
        };

        // ix data
        let ix_data = InstructionDataInvokeCpi {
            cpi_context: None,
            is_compress: false,
            compress_or_decompress_lamports: None,
            new_address_params: vec![ticketbox_new_address_params],
            relay_fee: None,
            input_compressed_accounts_with_merkle_context: Vec::new(),
            output_compressed_accounts: vec![ticketbox_output_compressed_account],
            proof: Some(inputs.proof),
        };

        let bump = ctx.bumps.cpi_signer;
        let signer_seeds = [CPI_AUTHORITY_PDA_SEED, &[bump]];

        verify(&ctx, &ix_data, &[signer_seeds.as_slice()]).unwrap();
    }

    {
        // mint collection nft
        let cpi_ctx = ctx.accounts.create_collection_ctx();

        zk_nft::cpi::create_collection(
            cpi_ctx.with_remaining_accounts(ctx.remaining_accounts.to_vec()),
            collection_inputs,
            zk_nft::state::CreateCollectionV1Args {
                derivation_key: collection_key,
                name: ticket_box.event_name,
                uri: ticket_box.metadata_uri,
                collection: None,
            },
        )?;
    }

    Ok(())
}

impl<'info> InitializeTicketBox<'info> {
    pub fn create_collection_ctx(&self) -> CpiContext<'_, '_, '_, 'info, CreateCollection<'info>> {
        let cpi_program = self.zk_nft_program.to_account_info();

        let cpi_accounts = CreateCollection {
            account_compression_authority: self.account_compression_authority.to_account_info(),
            account_compression_program: self.account_compression_program.to_account_info(),
            light_system_program: self.light_system_program.to_account_info(),
            system_program: self.system_program.to_account_info(),
            registered_program_pda: self.registered_program_pda.to_account_info(),
            noop_program: self.noop_program.to_account_info(),
            signer: self.signer.to_account_info(),
            update_authority: None,
            cpi_signer: self.zk_nft_cpi_authority_pda.to_account_info(),
            self_program: self.zk_nft_program.to_account_info(),
        };
        CpiContext::new(cpi_program, cpi_accounts)
    }
}
