import { h } from 'preact'
import { useState, useEffect, useRef } from 'preact/hooks'
import './app.css'
import { Photo } from './photo'
import { Timestamp } from './timestamp'

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

  const ref = useRef<HTMLDivElement>()
  useEffect(() => ref.current.focus(), [])

  const handleKeyDown = (e: KeyboardEvent) => {
    console.log(current)
    const step = e.ctrlKey ? 30 : 1
    switch (e.code) {
      case 'Space':
      case 'ArrowRight':
        setCurrent(stepImage(current, step, images.length))
        break
      case 'ArrowLeft':
        setCurrent(stepImage(current, -step, images.length))
        break
      default:
        return
    }
    e.preventDefault()
  }

  return (
    <div ref={ref} tabIndex={-1} class="App App-container" onKeyDown={handleKeyDown}>
      <Photo key={prev} src={images[prev]} order="prev" />
      <Photo key={current} src={images[current]} order="current" />
      <Photo key={next} src={images[next]} order="next" />
      <Timestamp imageUrl={images[current]} />
    </div>
  )
}
