/**
 * A MediaFile represents the path to a photo or video file
 * and its timestamp. For performance reason this type is
 * complex, as it will be mutated in place.
 * The path can be either an absolute path
 * of the media file or a timestamp that can be
 * used to calculate the absolute path to the media file.
 * The timestamp is the original media timestamp if read from disk.
 * During processing, it can be mutated into an "adjusted" timestamp.
 * The timestamp (rounded to seconds) must be unique in the index,
 * and to resolve duplicates, a sequence number maybe added as
 * a fractional part.
 */
export type MediaFile = {
  path: string | number
  timestamp: number
}

// An alternative type version was considered but that
// makes the organize code more complex
// type Timestamped = {
//   timestamp: number
// }
// type IndexMediaFile = {
//   indexTimestamp: number,
//   timestamp: number
// }
// type MediaFile = {
//   path: string
//   timestamp: number
// }
