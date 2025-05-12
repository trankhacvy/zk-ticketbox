use anchor_lang::prelude::*;

#[error_code]
pub enum TicketBoxError {
    #[msg("Event name is too long. Maximum is 50 characters.")]
    EventNameTooLong,
    #[msg("Event description is too long. Maximum is 200 characters.")]
    EventDescriptionTooLong,
    #[msg("Event is inactive.")]
    EventInactive,
    #[msg("Maximum supply reached.")]
    MaxSupplyReached,
    #[msg("User has already attended this event.")]
    AlreadyAttended,
    #[msg("Unauthorized action.")]
    Unauthorized,
    #[msg("Mint is not live yet.")]
    MintNotLive,
    #[msg("Mint is already over.")]
    AfterEndDate,
}