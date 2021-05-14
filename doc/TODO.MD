# TODO

- delete photos
  - move to trash folder
  - remove from index.json
- persistent photo rotation

  - example: "2014-09-08 224.jpg"
  - rotate current image with css, on navigate, persist change, add cache buster to imager url ?
  - or always rotate the real image and refresh, no css involved? what you see is what happened? r=1, r=2
  - lossless rotation is not possible with jpeg, so multiple rotation degrade quality
  - there is an exif field that specifies rotation, but it isn't respected by browsers
  - seems to be complicated
  - maybe find more rotated examples before doing anything
  - https://stackoverflow.com/questions/12026441/is-there-a-way-to-tell-browsers-to-honor-the-jpeg-exif-orientation

- mouse toggle fullscreen (like F11)

Ingestion:

- escape hatch: if media is found without metadata, move it into a special folder

Other:

- test how much photos can be shrinked with avif encoding, but keeping all existing exif metadata
