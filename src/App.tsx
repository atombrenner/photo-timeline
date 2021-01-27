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

  const [inTransition, setInTransition] = useState(false)

  const ref = createRef()
  useEffect(() => ref.current.focus())

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
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
      <div key={prev} class="photo photo-prev">
        <img class="photo-image" src={images[prev]} />
      </div>
      <div key={current} class="photo photo-current">
        <img class="photo-image" src={images[current]} />
      </div>
      <div key={next} class="photo photo-next">
        <img class="photo-image" src={images[next]} />
      </div>
    </div>
  )
}

export default App
