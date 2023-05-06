declare module 'exif-reader' {
  // see https://github.com/devongovett/exif-reader/blob/master/index.js#L55-L59
  // some fields are automatically converted to `Date` type
  type Exif = Partial<{
    exif: Partial<{
      DateTimeOriginal: Date
      SubSecTimeOriginal: string
    }>
    image: Partial<{
      ModifyDate: Date
    }>
  }>

  export default function exif(buffer: Buffer): Exif
}
