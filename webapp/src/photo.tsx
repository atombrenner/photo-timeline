import './photo.css'

export type Rotation = 0 | 90 | 180 | 270
export type Origin = { x: number; y: number }

export type PhotoProps = Readonly<{
  src: string
  rotation: Rotation
  scale: number
}>

export const Photo = ({ src, rotation, scale }: PhotoProps) => (
  <div class="photo">
    <img
      class="photo-image"
      style={{ transform: `rotate(${rotation}deg) scale(${scale})` }}
      src={src}
      alt="photo"
    />
  </div>
)
