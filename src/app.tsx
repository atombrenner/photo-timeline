import { h } from 'preact'
import { useState, useEffect, useRef } from 'preact/hooks'
import { next10, next20, next30, next50, prev10, prev20, prev30, prev50 } from './commands'
import { next, nextDay, nextWeek, nextMonth, nextYear } from './commands'
import { prev, prevDay, prevWeek, prevMonth, prevYear } from './commands'
import type { NavigationCommand } from './commands'
import { Photo } from './photo'
import { Timestamp } from './timestamp'
import './app.css'

// modifiers are appended in Alt Ctrl Shift order
const kbd: Record<string, NavigationCommand | undefined> = {
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

  Space: next,
  SpaceAlt: prev,
  SpaceCtrl: prev,
  SpaceShift: prev,
}

function keyboardCommand(e: KeyboardEvent): NavigationCommand {
  let key = e.code
  if (e.altKey) key += 'Alt'
  if (e.ctrlKey) key += 'Ctrl'
  if (e.shiftKey) key += 'Shift'
  console.log(key)
  const handler = kbd[key]
  if (handler) {
    e.preventDefault()
    return handler
  }
  return (_, current) => current
}

export type AppProps = Readonly<{
  images: string[]
}>

export function App({ images }: AppProps) {
  const [current, setCurrent] = useState(0)
  // const [showHelp, setShowHelp] = useState(false)
  // const [showDate, setShowDate] = useState(false)

  const ref = useRef<HTMLDivElement>()
  useEffect(() => ref.current.focus(), [])

  const handleKeyDown = (e: KeyboardEvent) => setCurrent(keyboardCommand(e)(images, current))

  return (
    <div ref={ref} tabIndex={-1} class="App App-container" onKeyDown={handleKeyDown}>
      <Photo key={prev} src={images[prev(images, current)]} order="prev" />
      <Photo key={current} src={images[current]} order="current" />
      <Photo key={next} src={images[next(images, current)]} order="next" />
      <Timestamp imageUrl={images[current]} />
    </div>
  )
}
