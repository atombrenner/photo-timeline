import './photo.css'

export type PhotoProps = Readonly<{
  src: string
  rotation: number // 0 | 90 | 180 | 270
}>

export function Photo({ src, rotation }: PhotoProps) {
  return (
    <div class="photo">
      <img
        class="photo-image"
        style={{ transform: `rotate(${rotation}deg)` }}
        src={src}
        alt="photo"
      />
    </div>
  )
}
