import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { images } from './image-data'
import logo from './logo.png'
import './App.css'
import { assert } from 'chai'

function nextImage(index: number, step: number, count: number) {
  assert(step < count)
  return (index + step + count) % count
}

function App() {
  const [imageIndex, setImageIndex] = useState(0)

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'ArrowRight':
        setImageIndex(nextImage(imageIndex, 1, images.length))
        break
      case 'ArrowLeft':
        setImageIndex(nextImage(imageIndex, -1, images.length))
        break
      default:
        return
    }
    console.log('Event', e)
    e.preventDefault()
  }

  return (
    <div tabIndex={-1} className="App" onKeyDown={handleKeyDown}>
      <header className="App-header">
        <img src={images[imageIndex]} />
      </header>
    </div>
  )
}

export default App
