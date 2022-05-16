use anchor_lang::prelude::*;

declare_id!("FhXTLh3dbnDFFqRKQxh4vuWKQpMk9CNtZ8EWyWNyjSAw");

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Message {
  pub sender: Pubkey,
  pub content: String,
}

#[account]
pub struct Storage {
  pub messages_list: Vec<Message>,
  pub total_messages: u64,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
  #[account(mut)]
  pub sender: Signer<'info>,
  #[account(init, payer = sender, space = 9000)]
  pub storage: Account<'info, Storage>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddMessage<'info> {
  #[account(mut)]
  pub sender: Signer<'info>,
  #[account(mut)]
  pub storage: Account<'info, Storage>,
}

#[program]
pub mod dapp {
  use super::*;

  pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    let storage = &mut ctx.accounts.storage;
    storage.messages_list = vec![];
    storage.total_messages = 0;
    Ok(())
  }

  pub fn add_message(ctx: Context<AddMessage>, content: String) -> Result<()> {
    let sender = &mut ctx.accounts.sender;
    let storage = &mut ctx.accounts.storage;

    let message = Message{
      sender: *sender.to_account_infos()[0].key,
      content: content.to_string(),
    };

    storage.total_messages += 1;
    storage.messages_list.push(message);
    Ok(())
  }
}
