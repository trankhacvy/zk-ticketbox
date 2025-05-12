use anchor_lang::{prelude::*, Key};
use light_account_checks::discriminator::Discriminator;
use light_hasher::{DataHasher, Poseidon};
use light_sdk::{
    compressed_account::{
        CompressedAccount, CompressedAccountData, OutputCompressedAccountWithPackedContext,
    },
    light_system_accounts,
    utils::create_cpi_inputs_for_new_account,
    verify::verify,
    CPI_AUTHORITY_PDA_SEED,
};
use light_sdk_macros::LightTraits;

use crate::{
    state::{AssetV1, CollectionV1, CreateCollectionV1Args, Key as AssetKey, LightInstructionData},
    utils::create_address,
};

#[light_system_accounts]
#[derive(Accounts, LightTraits)]
pub struct CreateCollection<'info> {
    #[account(mut)]
    #[fee_payer]
    pub signer: Signer<'info>,
    // CHECK: checked by cpi.
    // #[authority]
    // pub cpi_signer: AccountInfo<'info>,
    #[authority]
    #[account(
        seeds = [CPI_AUTHORITY_PDA_SEED],
        bump
    )]
    pub cpi_signer: UncheckedAccount<'info>,
    #[self_program]
    pub self_program: Program<'info, crate::program::ZkNft>,
    /// CHECK: This can be any valid public key.
    pub update_authority: Option<UncheckedAccount<'info>>,
}

pub fn create_collection<'info>(
    ctx: Context<'_, '_, '_, 'info, CreateCollection<'info>>,
    inputs: LightInstructionData,
    args: CreateCollectionV1Args,
) -> Result<()> {
    let remaining_accounts = &ctx.remaining_accounts;

    let authority = match &ctx.accounts.update_authority {
        Some(authority) => authority.key(),
        None => *ctx.accounts.signer.key,
    };

    // create collection
    let collection_seeds = [args.derivation_key.as_ref()];

    let (new_address_params, collection_address) = create_address(
        collection_seeds.as_slice(),
        remaining_accounts,
        inputs
            .address_merkle_context
            .address_merkle_tree_pubkey_index,
        inputs.address_merkle_context.address_queue_pubkey_index,
        inputs.address_merkle_tree_root_index,
    );

    let new_collection = CollectionV1 {
        key: AssetKey::CollectionV1,
        update_authority: authority,
        name: args.name,
        uri: args.uri,
        num_minted: 0,
        current_size: 0,
    };

    let collection_account_data = CompressedAccountData {
        discriminator: AssetV1::discriminator(),
        data: new_collection.try_to_vec().unwrap(),
        data_hash: new_collection.hash::<Poseidon>().unwrap(),
    };

    let output_compressed_account = OutputCompressedAccountWithPackedContext {
        compressed_account: CompressedAccount {
            owner: crate::ID,
            lamports: 0,
            address: Some(collection_address),
            data: Some(collection_account_data),
        },
        merkle_tree_index: inputs.merkle_context.merkle_tree_pubkey_index,
    };

    let cpi_inputs = create_cpi_inputs_for_new_account(
        inputs.proof,
        new_address_params,
        output_compressed_account,
        None,
    );

    let bump = ctx.bumps.cpi_signer;
    let signer_seeds = [CPI_AUTHORITY_PDA_SEED, &[bump]];

    msg!("verifying proof");
    verify(&ctx, &cpi_inputs, &[signer_seeds.as_slice()]).unwrap();

    msg!("updating account");

    Ok(())
}
