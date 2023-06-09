import { useState } from 'preact/hooks'
import { deletePhoto, photoUrl, rotatePhoto } from './backend'
import { next10, next20, next30, next50, prev10, prev20, prev30, prev50 } from './commands'
import { first, last, start } from './commands'
import { next, nextDay, nextWeek, nextMonth, nextYear } from './commands'
import { prev, prevDay, prevWeek, prevMonth, prevYear } from './commands'
import type { NavigationCommand } from './commands'
import { Photo, Rotation } from './photo'
import { Timestamp } from './timestamp'
import './app.css'

// modifiers are appended in Alt Ctrl Shift order
const getCombinedKeyCode = (e: KeyboardEvent): string => {
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

export const App = ({ photos: initialPhotos }: { photos: number[] }) => {
  const [photos, setPhotos] = useState(initialPhotos)
  const [current, setCurrent] = useState(start(photos)) // index of currently displayed photo
  const [rotations, setRotations] = useState<Record<string, Rotation>>({})
  const [scale, setScale] = useState(1)
  const [showTimestamp, setShowTimestamp] = useState(true)
  const currentPhoto = photos[current]
  const currentRotation = rotations[photos[current]] || 0

  const rotateCurrent = (degrees: 90 | -90) => {
    const rotation = (currentRotation + degrees) % 360
    rotatePhoto(currentPhoto, rotation)
    setRotations({ ...rotations, [currentPhoto]: rotation })
  }

  const deleteCurrent = () => {
    deletePhoto(currentPhoto)
    setPhotos(photos.slice(0, current).concat(photos.slice(current + 1)))
    setCurrent(Math.min(current, photos.length - 2))
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    const key = getCombinedKeyCode(e)
    const navigate = navigationCommands[key]
    if (navigate) setCurrent(navigate(photos, current))
    else if (key === 'KeyD') setShowTimestamp(!showTimestamp)
    else if (key === 'KeyR') rotateCurrent(90)
    else if (key === 'KeyRShift' || key === 'KeyRCtrl') rotateCurrent(-90)
    else if (key === 'Delete') deleteCurrent()
    else if (key.startsWith('Tab')) e.preventDefault()
    else return

    e.preventDefault() // for all handled keys
  }

  return (
    <div
      id="app"
      tabIndex={-1}
      autoFocus // set focus to this element when page loads
      class="App App-container"
      onKeyDown={handleKeyDown}
    >
      <Photo src={photoUrl(currentPhoto)} rotation={currentRotation} scale={scale} />
      {showTimestamp && <Timestamp timestamp={currentPhoto} />}
    </div>
  )
}
