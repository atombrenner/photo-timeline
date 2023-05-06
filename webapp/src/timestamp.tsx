import './timestamp.css'
import format from 'date-fns/format'

export type TimestampProps = {
  timestamp: number
}

export const Timestamp = ({ timestamp }: TimestampProps) => (
  <div class="timestamp">{format(timestamp, 'yyyy-MM-dd HH:mm:ss')}</div>
)
