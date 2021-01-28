import { h } from 'preact'
import { useState, useEffect, useRef } from 'preact/hooks'
import { images } from './image-data'
import './app.css'
import { Photo } from './photo'

function stepImage(index: number, step: number, count: number) {
  return (index + step + count) % count
}

// const next = (index: number) => stepImage(index, 1, images.length)
// const prev = (index: number) => stepImage(index, -1, images.length)

export function App() {
  const [current, setCurrent] = useState(0)
  const next = stepImage(current, 1, images.length)
  const prev = stepImage(current, -1, images.length)

  const [inTransition, setInTransition] = useState(false)

  const ref = useRef<HTMLDivElement>()
  useEffect(() => ref.current.focus())

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case ' ':
      case 'ArrowRight':
        if (!inTransition) setCurrent(next)
        break
      case 'ArrowLeft':
        if (!inTransition) setCurrent(prev)
        break
      default:
        return
    }
    // for all handled keys
    setInTransition(true)
    e.preventDefault()
  }

  return (
    <div
      ref={ref}
      tabIndex={-1}
      class="App App-container"
      onKeyDown={handleKeyDown}
      onTransitionEnd={(e) => {
        console.log('endtrans', e)
        setInTransition(false)
      }}
    >
      <Photo key={prev} src={images[prev]} order="prev" />
      <Photo key={current} src={images[current]} order="current" />
      <Photo key={next} src={images[next]} order="next" />
    </div>
  )
}
