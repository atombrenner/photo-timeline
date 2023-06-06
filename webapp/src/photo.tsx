import panzoom from 'panzoom'
import './photo.css'
import { useEffect, useRef } from 'preact/hooks'

export type Rotation = 0 | 90 | 180 | 270
export type Origin = { x: number; y: number }

export type PhotoProps = Readonly<{
  src: string
  rotation: Rotation
  scale: number
}>

export const Photo = ({ src, rotation }: PhotoProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const instance = panzoom(ref.current, {
      minZoom: 1,
      filterKey: () => true,
      disableKeyboardInteraction: true,
    })
    return () => instance.dispose()
  }, [ref, src])

  return (
    <div ref={ref} class="photo">
      <img
        class="photo-image"
        style={{ transform: `rotate(${rotation}deg)` }}
        src={src}
        alt="photo"
      />
    </div>
  )
}
