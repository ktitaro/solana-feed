import { useContext } from 'preact/hooks'
import { Store } from '../App'
import './Sendbox.css'

export function Sendbox() {
  const {
    message,
    setMessage,
    sendMessage,
  } = useContext(Store)

  const updateMessage = (event) => {
    setMessage(event.target.value)
  }

  const submitMessage = async (event) => {
    event.preventDefault()
    sendMessage()
  }

  return (
    <div className="sendbox">
      <span className="sendbox-title">Say hello to blockchains!</span>
      <form className="sendbox-form" onSubmit={submitMessage}>
        <textarea
          className="sendbox-input form-control"
          placeholder="Enter your message to here..."
          onChange={updateMessage}
          value={message}
        />
        <button className="sendbox-submit btn btn-primary" type="submit">
          Send message 💩
        </button>
      </form>
    </div>
  )
}
