import { h } from 'preact'
import './photo.css'

export type PhotoProps = Readonly<{
  src: string
  rotation: number
  order: 'prev' | 'current' | 'next'
}>

export function Photo({ src, order }: PhotoProps) {
  return (
    <div class={`photo photo-${order}`}>
      <img class="photo-image" src={src} alt="photo" />
    </div>
  )
}
