import { useContext } from 'preact/hooks'
import { Store } from '../App'
import { Message } from './Message'
import './Messages.css'

export function Messages() {
  const { messages } = useContext(Store)

  return (
    <div className="messages">
      {messages && messages.map((props, idx) => (
        <Message key={idx} {...props}/>
      ))}
    </div>
  )
}
