import { h } from 'preact'
import './timestamp.css'

export type TimestampProps = {
  imageUrl: string
}

export const Timestamp = ({ imageUrl }: TimestampProps) => {
  return <div class="timestamp">{getDate(imageUrl)}</div>
}

function getDate(path: string) {
  return path.substr(path.lastIndexOf('/') + 1, 14)
}
