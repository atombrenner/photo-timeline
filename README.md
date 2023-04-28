# Photo Timeline

- import photos and videos into an organized folder structure with a simple CLI tool
- a minimal web app to browse and view photos organized by time.
- backup organized files with cloud storage (AWS S3)

![CI Status](https://github.com/atombrenner/photo-timeline/actions/workflows/main.yml/badge.svg?branch=master)

## Motivation

Many years ago, my digital photo library became a mess. I got tired of manually organizing photos into folders or albums and needed an automated task that transfers media files from my camera to my photo folder on my pc. The simplest scheme I could imagine was to order by creation time and to have folders for years and months. This system was relatively easy to implement and worked for me. Vanilla OS tools were sufficient to browse and view all my photos. From then on, I implemented the same tool every few years with a different language and framework, either command line only or as old-school Windows desktop apps, starting with C#, Python, Ruby, Scala, and now Typescript.
With Windows Photo Gallery discontinued, I could not find a simple, free and usable photo video viewer anymore, so I build one myself with web technologies.
I intend to maintain this project for a long time as I believe that web technology (browsers + typescript + node) is mature and stable enough to last for the next decades.

## File structure

All photos are stored in a single root folder ("Photos").
They are grouped by year and month into subfolders.
A normal file manager should be sufficient for browsing photos.
The filename of each photo is derived from its timestamp (DateTimeOriginal).
and it must be unique in the whole file structure, not only in one subfolder.
Sorting by filename should have the same effect as sorting by timestamp.
It is not uncommon to have multiple photos with the same timestamp, e.g.
because you import photos from different cameras (phones) or because
of a low timestamp precision in older cameras (seconds or minutes).
My first strategy was to append a three-digit sequence number to each photo per
folder (=month).

- 2005-10-01-001.jpg
- 2005-10-01-002.jpg
- 2005-10-03-003.jpg
- ...
- 2005-11-02-001.jpg

This was simple to implement. But it had two drawbacks:

1. in one month, I took more than 1000 photos, breaking numbering
2. deleting or adding photos later (e.g. second camera)
   lead to a lot of renaming operations, which leads to
   unnecessary traffic (costs) in cloud backups

To tackle this issue, the filename now contains the full timestamp including seconds.
A sequence number is only appended if there are several photos in the same second.
The internal order is still based on the original photo timestamp with millisecond
precision. In case of duplicates, the order of ingestion decides.
I did not include the millisecond in the filename as it does not solve
the duplicate problem. It can still happen to have duplicate timestamps with millisecond
accuracy, because of multiple cameras or cameras not supporting milliseconds.

```
Photos/  <-- the root of all your photos
├─── 2015
│   ├── 01_January
│   :
│   ├── 10_October
│   │   ├── 20151001-125510.jpg     <-- only one photo
│   │   ├── 20151002-135512-01.jpg  <-- first photos in the same second
│   │   ├── 20151002-135512-02.jpg  <-- second photo in the same second
│   :   :
├── 2016
|   ├── 01_January
:   :
```

Videos and Photos are separated into two different root folders, initially just because I liked it this way. Eventually, it turned out that this enabled a very simple and fast index structure. The key is to be able to generate the full file path just from a 64-bit float timestamp.

```
MyMedia
├─── Photos
├─── Videos
```

## Commands

### Ingest

`npx ingest camera`
`npx ingest ` -- list all implemented sources

### Reindex (Reorganize)

Syncs the existing index.json with existing media files. If files were (re)moved
or deleted index and filenames will be updated

`npx reindex photos`
`npx reindex videos`
`npx reindex photos --folder hullebulle`

## Stats

Analyse existing photos and report some statistics

## Config

Configuration is in [`config.ts`](scripts/config.ts).

## Implementation Details

- if we use `fs-extra` for high-level file operations, e.g. moving files
  accross file systems, we can also use the more covenient wrapper functions
- at least on unix, it seems to be fine to have hundred thousands of move
  operations running in parallel with Promise.all()

### Timestamp based index and filename generation

- for performance reasons, all photos are stored in a JSON index file
  so that we only need to read the index file to browse photos, and don't
  need to traverse the filesystem
- the index must fit in memory for at least one million photos
- the index must contain the original photo timestamp with millisecond precision
- the index should contain the sequence number if necessary to deduplicate photos
- basic idea: index is just an array of numbers, where the integer part is the
  Unix timestamp and the fraction is the sequence number
  - it is important that the path can be derived from the number,
    in case we need to move existing files to a new place
  - this implies that below the media root only one file extension is possible,
    for example `.jpg` or `.mp4`
- a float64 number is precise enough to have timestamps to the year 2100 with
  three decimal places for a sequence number
- the array is sorted in ascending order
- 1 million photos would be roughly 14MB of JSON and 8MB in memory
- compressing the timestamp on serialization (e.g use base64 strings)
  would just increase complexity and only save ~4MB
- Decision: the index is a sorted array of float64 values, where the
  integer part is a UNIX timestamp and the fraction part is the sequence number.
  The precision is good enough for at least the next 100 years

## Setup

- install node > 18
- git clone this repository
- run `npm i` to install dependencies

## Development

### npm start

Runs the app in development mode.

### npm test

Runs all test

### npm run build

It correctly bundles Preact in production mode and optimizes the build for the best performance.

### npm run deploy

Build and copy the app to ~/Data/MyMedia

# Learnings

## Video Metadata

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

- `rdfind somedir` finds duplicates and creates result.txt with findings
- `rdfind -deleteduplicates true somedir` deletes duplicates

## Avif

quality of 80 saves between 50% and 90% but images have visible differences
quality of 90 saves between 25% and 80% but images have still visible differences
compression is very cpu intensive, one image takes 1 to 3 seconds, 4 cores are utilized at 100%
