import { h } from 'preact'
import './timestamp.css'

export type TimestampProps = {
  photo: string
}

export const Timestamp = ({ photo }: TimestampProps) => {
  return <div class="timestamp">{getDate(photo)}</div>
}

function getDate(path: string) {
  return path.substr(path.lastIndexOf('/') + 1, 14)
}
