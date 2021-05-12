import { h } from 'preact'
import { useState, useEffect, useRef } from 'preact/hooks'
import { next10, next20, next30, next50, prev10, prev20, prev30, prev50 } from './commands'
import { first, last, start } from './commands'
import { next, nextDay, nextWeek, nextMonth, nextYear } from './commands'
import { prev, prevDay, prevWeek, prevMonth, prevYear } from './commands'
import type { NavigationCommand } from './commands'
import { Photo } from './photo'
import { Timestamp } from './timestamp'
import './app.css'

// modifiers are appended in Alt Ctrl Shift order
function getCombinedKeyCode(e: KeyboardEvent): string {
  let key = e.code
  if (e.altKey) key += 'Alt'
  if (e.ctrlKey) key += 'Ctrl'
  if (e.shiftKey) key += 'Shift'
  return key
}

// modifiers are appended in Alt Ctrl Shift order
const navigationCommands: Record<string, NavigationCommand | undefined> = {
  ArrowRight: next,
  ArrowRightShift: nextDay,
  ArrowRightCtrl: nextWeek,
  ArrowRightCtrlShift: nextMonth,
  ArrowRightAlt: nextYear,

  ArrowLeft: prev,
  ArrowLeftShift: prevDay,
  ArrowLeftCtrl: prevWeek,
  ArrowLeftCtrlShift: prevMonth,
  ArrowLeftAlt: prevYear,

  ArrowDown: next10,
  ArrowDownShift: next20,
  ArrowDownCtrl: next30,
  ArrowDownCtrlShift: next50,

  ArrowUp: prev10,
  ArrowUpShift: prev20,
  ArrowUpCtrl: prev30,
  ArrowUpCtrlShift: prev50,

  PageDown: next50,
  PageUp: prev50,
  Home: first,
  End: last,

  Space: next,
  SpaceAlt: prev,
  SpaceCtrl: prev,
  SpaceShift: prev,
}

export type AppProps = Readonly<{
  images: string[]
}>

export function App({ images }: AppProps) {
  const [current, setCurrent] = useState(start(images))
  const [showTimestamp, setShowTimestamp] = useState(true)
  const [rotation, setRotation] = useState(() => new Array(images.length).fill(0))

  const ref = useRef<HTMLDivElement>()
  useEffect(() => ref.current.focus(), [])

  const handleKeyDown = (e: KeyboardEvent) => {
    const key = getCombinedKeyCode(e)
    const navigate = navigationCommands[key]
    if (navigate) setCurrent(navigate(images, current))
    else if (key === 'KeyD') setShowTimestamp(!showTimestamp)
    else if (key === 'KeyR') setRotation(rotate(rotation, current, 90))
    else if (key === 'KeyRShift' || key === 'KeyRCtrl') setRotation(rotate(rotation, current, -90))
    else return

    e.preventDefault()
  }

  return (
    <div ref={ref} tabIndex={-1} class="App App-container" onKeyDown={handleKeyDown}>
      <Photo src={images[current]} rotation={rotation[current]} />
      {showTimestamp && <Timestamp imageUrl={images[current]} />}
    </div>
  )
}

function rotate(rotation: number[], current: number, offset: number) {
  const rotated = [...rotation]
  rotated[current] = (rotated[current] + offset) % 360
  return rotated
}
