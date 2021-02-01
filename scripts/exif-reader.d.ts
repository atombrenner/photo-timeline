declare module 'exif-reader' {
  // see https://github.com/devongovett/exif-reader
  type Exif = {
    image: Record<string, string | number | Date> & {
      ModifyDate: Date
    }
    thumbnail: Record<string, number>
    exif: Record<string, string | number | Date | Buffer> & {
      DateTimeOriginal: Date
    }
    gps: any
    interop: any
  }

  export default function exif(buffer: Buffer): Exif
}
