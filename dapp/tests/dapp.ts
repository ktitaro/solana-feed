import { assert } from 'chai'
import { Program } from '@project-serum/anchor'
import * as anchor from '@project-serum/anchor'
import { Dapp } from '../target/types/dapp'

describe('dapp', () => {
  const program = anchor.workspace.Dapp as Program<Dapp>
  const senderAccount = anchor.AnchorProvider.env()
  const storageAccount = anchor.web3.Keypair.generate()
  const { SystemProgram } = anchor.web3

  anchor.setProvider(senderAccount)

  it('Is initialized!', async () => {
    await program.rpc.initialize({
      accounts: {
        sender: senderAccount.wallet.publicKey,
        storage: storageAccount.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [
        storageAccount,
      ],
    })

    const { storage } = program.account
    const data = await storage.fetch(storageAccount.publicKey)
    assert.equal(data.totalMessages.toNumber(), 0)
    assert.equal((data.messagesList as [any]).length, 0)
  })

  it('Is adding messages', async () => {
    const content = 'https://giphy.com/clips/hamlet-jJjb9AUHOiP3nJJMdy'
    await program.rpc.addMessage(content, {
      accounts: {
        sender: senderAccount.wallet.publicKey,
        storage: storageAccount.publicKey,
      },
    })

    const { storage } = program.account
    const data = await storage.fetch(storageAccount.publicKey)

    assert.equal(data.totalMessages.toNumber(), 1)
    assert.equal((data.messagesList as [any]).length, 1)
    assert.equal((data.messagesList as [any])[0].content, content)
    assert.equal(
      (data.messagesList as [any])[0].sender.toString(),
      senderAccount.wallet.publicKey.toString()
    )
  })
})
