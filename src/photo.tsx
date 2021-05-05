import { h } from 'preact'
import './photo.css'

export type PhotoProps = Readonly<{
  src: string
  rotation: number // 0 | 90 | 180 | 270
  order: 'prev' | 'current' | 'next'
}>

export function Photo({ src, order, rotation }: PhotoProps) {
  return (
    <div class={`photo photo-${order}`}>
      <img
        class="photo-image"
        style={{ transform: `rotate(${rotation}deg)` }}
        src={src}
        alt="photo"
      />
    </div>
  )
}
