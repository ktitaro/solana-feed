import { Buffer } from 'buffer'
import * as solweb from '@solana/web3.js'
import * as anchor from '@project-serum/anchor'
import keypair from './assets/keypair.json'
import idl from '../../dapp/target/idl/dapp.json'

window.Buffer = Buffer
const programID = new solweb.PublicKey(idl.metadata.address)
const secretKeyData = Object.values(keypair._keypair.secretKey)
const secretKeyArray = new Uint8Array(secretKeyData)
const storageAccount = anchor.web3.Keypair.fromSecretKey(secretKeyArray)

export function getSolanaAPI() {
  const { solana } = window
  if (!solana || !solana.isPhantom) {
    throw 'Make sure you have phantom wallet'
  }
  return solana
}

export function getProviderAPI() {
  const solana = getSolanaAPI()
  const network = solweb.clusterApiUrl('devnet')
  const connection = new solweb.Connection(network, 'processed')
  const provider = new anchor.AnchorProvider(connection, solana, 'processed')
	return provider
}

export function getProgramAPI() {
  const provider = getProviderAPI()
  const program = new anchor.Program(idl, programID, provider)
  return program
}

export async function getConnectedWallet() {
  const solana = getSolanaAPI()
  const result = await solana.connect({ onlyIfTrusted: true })
  const pubkey = result.publicKey.toString()
  return pubkey
}

export async function connectNewWallet() {
  const solana = getSolanaAPI()
  const result = await solana.connect()
  const pubkey = result.publicKey.toString()
  return pubkey
}

export async function initializeFeed() {
  const program = getProgramAPI()
  const provider = getProviderAPI()

  await program.rpc.initialize({
    accounts: {
      sender: provider.wallet.publicKey,
      storage: storageAccount.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
    signers: [
      storageAccount,
    ],
  })
}

export async function getMessagesList() {
  const program = getProgramAPI()
  const { storage } = program.account
  const data = await storage.fetch(storageAccount.publicKey)
  return data.messagesList
}

export async function sendMessage(content) {
  const program = getProgramAPI()
  const provider = getProviderAPI()

  await program.rpc.addMessage(content, {
    accounts: {
      sender: provider.wallet.publicKey,
      storage: storageAccount.publicKey,
    },
  })
}
