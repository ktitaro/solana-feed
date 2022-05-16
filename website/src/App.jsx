import { createContext } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { Auth } from './components/Auth'
import { Feed }  from './components/Feed'
import { Loader } from './components/Loader'
import * as api from './wallet'
import './App.css'

export const Store = createContext({})

export function App() {
  const [loading, setLoading] = useState(false)
  const [account, setAccount] = useState(null)
  const [message, setMessage] = useState(null)
  const [messages, setMessages] = useState(null)

  const whileLoading = async (callback) => {
    try {
      setLoading(true)
      await callback()
    } catch(err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    const messages = (await api.getMessagesList()).reverse()
    console.log('messages:', messages)
    setMessages(messages)
  }

  const loadAccount = () => whileLoading(async () => {
    const wallet = await api.getConnectedWallet()
    console.log('Connected wallet:', wallet)
    setAccount(wallet)
    await fetchMessages()
  })

  const connectAccount = () => whileLoading(async () => {
    const wallet = await api.connectNewWallet()
    console.log('Connected new wallet:', wallet)
    setAccount(wallet)
    await fetchMessages()
  })

  const sendMessage = () => whileLoading(async () => {
    await api.sendMessage(message)
    console.log('message sent')
    setMessage(null)
    await fetchMessages()
  })

  useEffect(() => {
    loadAccount()
  }, [])

  const renderContent = () => {
    if (loading) return <Loader/>
    if (!account) return <Auth/>
    return <Feed/>
  }

  return (
    <div className="app-container">
      <Store.Provider value={{
        message,
        messages,
        setMessage,
        sendMessage,
        connectAccount,
      }}>
        {renderContent()}
      </Store.Provider>
    </div>
  )
}
