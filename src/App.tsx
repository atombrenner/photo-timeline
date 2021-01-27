import { h, createRef } from 'preact'
import { useState, useEffect, useRef } from 'preact/hooks'
import { images } from './image-data'
import './App.css'
import { assert } from 'chai'

function stepImage(index: number, step: number, count: number) {
  assert(step < count)
  return (index + step + count) % count
}

// const next = (index: number) => stepImage(index, 1, images.length)
// const prev = (index: number) => stepImage(index, -1, images.length)

function App() {
  const [current, setCurrent] = useState(0)
  const next = stepImage(current, 1, images.length)
  const prev = stepImage(current, -1, images.length)

  const ref = createRef()
  useEffect(() => ref.current.focus())

  const ref1 = useRef<HTMLDivElement>()
  const ref2 = useRef<HTMLDivElement>()

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'ArrowRight':
        setCurrent(next)
        break
      case 'ArrowLeft':
        setCurrent(prev)
        break
      default:
        return
    }
    console.log('Event', e)
    e.preventDefault()
  }

  return (
    <div ref={ref} tabIndex={-1} className="App" onKeyDown={handleKeyDown} class="App-container">
      <div key={prev} ref={ref1} class="photo photo-prev">
        <img class="photo-image" src={images[prev]} />
      </div>
      <div key={current} ref={ref1} class="photo photo-current">
        <img class="photo-image" src={images[current]} />
      </div>
      <div key={next} ref={ref2} class="photo photo-next">
        <img class="photo-image" src={images[next]} />
      </div>
    </div>
  )
}

export default App
