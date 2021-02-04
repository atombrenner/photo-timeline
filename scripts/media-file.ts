export type MediaFile = {
  path: string
  created: number // Date
  folder: string
  file: string
}

export type DesiredMediaFile = MediaFile & {
  desiredPath: string
}
