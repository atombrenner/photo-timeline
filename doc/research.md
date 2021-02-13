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
