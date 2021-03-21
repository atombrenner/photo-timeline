import { format } from 'date-fns'
import { h } from 'preact'
import './timestamp.css'

export type TimestampProps = {
  imageUrl: string
}

export const Timestamp = ({ imageUrl }: TimestampProps) => {
  return <div class="timestamp">{getDate(imageUrl)}</div>
  //  return <div>{format(date, 'YYYY-mm-dd HH:MM')}</div>
}

function getDate(path: string) {
  return path.substr(path.lastIndexOf('/') + 1, 14)
}
