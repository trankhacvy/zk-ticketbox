use anchor_lang::{prelude::*, Key};
use light_account_checks::discriminator::Discriminator;
use light_hasher::{DataHasher, Poseidon};
use light_sdk::{
    compressed_account::{
        CompressedAccount, CompressedAccountData, OutputCompressedAccountWithPackedContext,
        PackedCompressedAccountWithMerkleContext,
    },
    light_system_accounts,
    program_merkle_context::unpack_address_merkle_context,
    utils::{create_cpi_inputs_for_account_update, create_cpi_inputs_for_new_account},
    verify::verify,
    CPI_AUTHORITY_PDA_SEED,
};
use light_sdk_macros::LightTraits;

use crate::{
    errors::TicketBoxError,
    state::{
        AssetV1, CollectionV1, CreateV1Args, Key as AssetKey, LightInstructionData, UpdateAuthority,
    },
    utils::create_address,
};

#[light_system_accounts]
#[derive(Accounts, LightTraits)]
pub struct CreateAsset<'info> {
    #[account(mut)]
    #[fee_payer]
    pub signer: Signer<'info>,
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
    pub owner: Option<UncheckedAccount<'info>>,
    // The authority signing for creation
    pub authority: Option<Signer<'info>>,
    /// CHECK: This can be any valid public key.
    pub update_authority: Option<UncheckedAccount<'info>>,
}

pub fn create_asset<'info>(
    ctx: Context<'_, '_, '_, 'info, CreateAsset<'info>>,
    inputs: LightInstructionData,
    collection_inputs: Option<LightInstructionData>,
    args: CreateV1Args,
) -> Result<()> {
    // let mut authority = &ctx.accounts.signer;
    let remaining_accounts = &ctx.remaining_accounts;

    // if let Some(new_authority) = &ctx.accounts.authority {
    //     authority = new_authority;
    // };

    if ctx.accounts.update_authority.is_some() && args.collection_key.is_some() {
        return Err(TicketBoxError::ConflictingAuthority.into());
    }

    let (update_authority, collection) = if args.collection_key.is_some()
        && collection_inputs.is_some()
    {
        let collection_key = args.collection_key.unwrap();
        let inputs = collection_inputs.as_ref().unwrap();

        let address_merkle_context =
            unpack_address_merkle_context(inputs.address_merkle_context, remaining_accounts);

        let address_seed = light_sdk::address::derive_address_seed(
            [collection_key.as_ref()].as_slice(),
            &crate::ID,
            &address_merkle_context,
        );

        let address = light_sdk::address::derive_address(&address_seed, &address_merkle_context);

        (
            UpdateAuthority::Collection(Pubkey::new_from_array(address)),
            Some(CollectionV1::try_from_slice(&inputs.inputs[0])?),
        )
    } else {
        let address = match &ctx.accounts.update_authority {
            Some(update_authority) => update_authority.key(),
            None => *ctx.accounts.signer.key,
        };

        (UpdateAuthority::Address(address), None)
    };

    let owner = match &ctx.accounts.owner {
        Some(owner) => owner.key(),
        None => *ctx.accounts.signer.key,
    };

    {
        // create asset
        let asset_seeds = [args.derivation_key.as_ref()];

        let (new_address_params, asset_address) = create_address(
            asset_seeds.as_slice(),
            remaining_accounts,
            inputs
                .address_merkle_context
                .address_merkle_tree_pubkey_index,
            inputs.address_merkle_context.address_queue_pubkey_index,
            inputs.address_merkle_tree_root_index,
        );

        let new_asset = AssetV1 {
            key: AssetKey::AssetV1,
            owner,
            update_authority: update_authority.clone(),
            name: args.name,
            uri: args.uri,
        };

        let asset_account_data = CompressedAccountData {
            discriminator: AssetV1::discriminator(),
            data: new_asset.try_to_vec().unwrap(),
            data_hash: new_asset.hash::<Poseidon>().unwrap(),
        };

        let asset_output_compressed_account = OutputCompressedAccountWithPackedContext {
            compressed_account: CompressedAccount {
                owner: crate::ID,
                lamports: 0,
                address: Some(asset_address),
                data: Some(asset_account_data),
            },
            merkle_tree_index: inputs.merkle_context.merkle_tree_pubkey_index,
        };

        let cpi_inputs = create_cpi_inputs_for_new_account(
            inputs.proof,
            new_address_params,
            asset_output_compressed_account,
            None,
        );

        let bump = ctx.bumps.cpi_signer;
        let signer_seeds = [CPI_AUTHORITY_PDA_SEED, &[bump]];

        msg!("verifying asset proof");
        verify(&ctx, &cpi_inputs, &[signer_seeds.as_slice()]).unwrap();
        msg!("verified asset proof");
    }

    {
        if args.collection_key.is_some() && collection_inputs.is_some() {
            msg!("start updateting collection");

            let collection_key = args.collection_key.unwrap();
            let inputs = collection_inputs.unwrap();
            let mut collection = collection.unwrap();

            let address_merkle_context =
                unpack_address_merkle_context(inputs.address_merkle_context, remaining_accounts);

            let collection_seeds = light_sdk::address::derive_address_seed(
                [collection_key.as_ref()].as_slice(),
                &crate::ID,
                &address_merkle_context,
            );

            let collection_address =
                light_sdk::address::derive_address(&collection_seeds, &address_merkle_context);

            let compressed_account_data = CompressedAccountData {
                discriminator: CollectionV1::discriminator(),
                data: collection.try_to_vec()?,
                data_hash: collection.hash::<Poseidon>().map_err(ProgramError::from)?,
            };

            let compressed_account = CompressedAccount {
                owner: *ctx.program_id,
                lamports: 0,
                address: Some(collection_address),
                data: Some(compressed_account_data),
            };

            let old_compressed_account = PackedCompressedAccountWithMerkleContext {
                compressed_account,
                merkle_context: inputs.merkle_context,
                root_index: inputs.merkle_tree_root_index,
                read_only: false,
            };

            collection.num_minted = collection
                .num_minted
                .checked_add(1)
                .ok_or(TicketBoxError::NumericalOverflow)?;

            collection.current_size = collection
                .current_size
                .checked_add(1)
                .ok_or(TicketBoxError::NumericalOverflow)?;

            let compressed_account_data = CompressedAccountData {
                discriminator: CollectionV1::discriminator(),
                data: collection.try_to_vec()?,
                data_hash: collection.hash::<Poseidon>().map_err(ProgramError::from)?,
            };

            let compressed_account = CompressedAccount {
                owner: *ctx.program_id,
                lamports: 0,
                address: Some(collection_address),
                data: Some(compressed_account_data),
            };

            let new_compressed_account = OutputCompressedAccountWithPackedContext {
                compressed_account,
                merkle_tree_index: inputs.merkle_context.merkle_tree_pubkey_index,
            };

            msg!("old data: {:?}", old_compressed_account);
            msg!("new data: {:?}", new_compressed_account);

            let cpi_inputs = create_cpi_inputs_for_account_update(
                inputs.proof,
                old_compressed_account,
                new_compressed_account,
                None,
            );

            let bump = ctx.bumps.cpi_signer;
            let signer_seeds = [CPI_AUTHORITY_PDA_SEED, &[bump]];

            msg!("verifying collection proof");
            verify(&ctx, &cpi_inputs, &[signer_seeds.as_slice()]).unwrap();
            msg!("verified collection proof");
        }
    }

    Ok(())
}
