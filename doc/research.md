# Stoffsammlung

https://tailwindcss.com/
https://css-tricks.com/seamless-responsive-photo-grid/
https://github.com/wiringbits/my-photo-timeline/tree/master/src/main/scala/net/wiringbits/myphototimeline
https://www.exiv2.org/index.html

# Video Metadata

It's a messs,`ffmpeg -dump` can help,

But the best way is to pick the date from mtime (modified) and encode it in the file name
=>2020-01-01_12-59-03_001.mp4
=>when reorganizing, try to detect the pattern and use it as time

ffprobe works for newer formats reliable

## Conversion

.mp4 should be the video container

- `ffmpeg -i input.avi output.mp4` seems to work good enough
- `ffmpeg -i input.wmv output.mp4` seems to work good enough

The `-metadata creation_time=2019-01-01T12:00:00` can set the time to the generated file

## Tools

- `rdfind -deleteduplicates true somedir`
