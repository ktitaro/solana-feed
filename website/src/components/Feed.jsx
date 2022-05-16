import { Sendbox } from './Sendbox'
import { Messages } from './Messages'
import './Feed.css'

export function Feed() {
  return (
    <div className="feed">
      <Sendbox/>
      <Messages/>
    </div>
  )
}
