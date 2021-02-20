import { h } from 'preact'
import { useState, useEffect, useRef } from 'preact/hooks'
import './app.css'
import { Photo } from './photo'

function stepImage(index: number, step: number, count: number) {
  return (index + step + count) % count
}

// const next = (index: number) => stepImage(index, 1, images.length)
// const prev = (index: number) => stepImage(index, -1, images.length)

type AppProps = Readonly<{
  images: string[]
}>

export function App({ images }: AppProps) {
  const [current, setCurrent] = useState(0)
  const next = stepImage(current, 1, images.length)
  const prev = stepImage(current, -1, images.length)

  // a little bit fishy, ignore keyboard events during transitions of photos
  const [inTransition, setInTransition] = useState(false)

  const ref = useRef<HTMLDivElement>()
  useEffect(() => ref.current.focus())

  const handleKeyDown = (e: KeyboardEvent) => {
    console.log(current)
    const step = e.ctrlKey ? 30 : 1
    switch (e.code) {
      case 'Space':
      case 'ArrowRight':
        if (!inTransition) setCurrent(stepImage(current, step, images.length))
        break
      case 'ArrowLeft':
        if (!inTransition) setCurrent(stepImage(current, -step, images.length))
        break
      default:
        return
    }
    //setInTransition(true) // fishy
    e.preventDefault()
  }

  return (
    <div
      ref={ref}
      tabIndex={-1}
      class="App App-container"
      onKeyDown={handleKeyDown}
      onTransitionEnd={() => setInTransition(false)} // fishy: any end transition event will reset the state
    >
      <Photo key={prev} src={images[prev]} order="prev" />
      <Photo key={current} src={images[current]} order="current" />
      <Photo key={next} src={images[next]} order="next" />
    </div>
  )
}
