import './Message.css'

export function Message({ sender, content }) {
  return (
    <div className="message">
      <span className="message-sender">{String(sender)}</span>
      <span className="message-content">{String(content)}</span>
    </div>
  )
}
