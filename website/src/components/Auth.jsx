import { useContext } from 'preact/hooks'
import { Store } from '../App'
import './Auth.css'

export function Auth() {
  const { connectAccount } = useContext(Store)

  return (
    <div className="auth">
      <h1 className="auth-title">Welcome to <b>Feed</b></h1>
      <p className="auth-subtitle">Connect your wallet to get started</p>
      <button className="auth-button btn btn-primary" onClick={connectAccount}>
        Connect My Wallet ⚡️
      </button>
    </div>
  )
}
