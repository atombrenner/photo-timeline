import { h } from 'preact'
import { useState, useEffect, useRef } from 'preact/hooks'
import './app.css'
import { Photo } from './photo'
import { Timestamp } from './timestamp'
import { next, prev, nextMonth, prevMonth, nextYear, prevYear } from './commands'

export type AppProps = Readonly<{
  images: string[]
}>

function goto(e: KeyboardEvent): (images: string[], current: number) => number {
  if (e.code === 'Space') {
    return e.shiftKey || e.altKey || e.ctrlKey ? prev : next
  }

  switch (e.code) {
    case 'ArrowRight':
      return next // (e, next, fastNext, nextMonth, nextYear)
    case 'ArrowLeft':
      return prev // (e, )
    case 'ArrowUp':
      return nextMonth
    case 'ArrowDown':
      return prevMonth
  }

  return (_, current) => current
}

export function App({ images }: AppProps) {
  const [current, setCurrent] = useState(0)
  // uiState, e.g. fullscreen, date visible

  const ref = useRef<HTMLDivElement>()
  useEffect(() => ref.current.focus(), [])

  const handleKeyDown = (e: KeyboardEvent) => {
    //setCurrent(goto(e)(images, current))

    console.log(current)
    const step = e.ctrlKey ? 30 : 1
    const shift = e.shiftKey
    switch (e.code) {
      case 'Space':
      case 'ArrowRight':
        setCurrent(next(images, current))
        break
      case 'ArrowLeft':
        setCurrent(prev(images, current))
        break
      case 'ArrowUp':
        setCurrent(nextMonth(images, current))
        break
      case 'ArrowDown':
        setCurrent(prevMonth(images, current))
        break

      default:
        return
    }
    e.preventDefault()
  }

  return (
    <div ref={ref} tabIndex={-1} class="App App-container" onKeyDown={handleKeyDown}>
      <Photo key={prev} src={images[prev(images, current)]} order="prev" />
      <Photo key={current} src={images[current]} order="current" />
      <Photo key={next} src={images[next(images, current)]} order="next" />
      <Timestamp imageUrl={images[current]} />
    </div>
  )
}
