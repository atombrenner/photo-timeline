# Photo Timeline

A minimal web app to view and browse photos organized on a timeline.
Import photos and videos into an organized folder structure with a simple command-line tool.
Sync organized files with cloud storage (AWS S3).

![CI Status](https://github.com/atombrenner/photo-timeline/actions/workflows/main.yml/badge.svg?branch=master)

## Motivation

Many years ago, my digital photo library became a mess. I got tired of manually organizing photos into folders or albums and needed an automated task that transfers media files from my camera to my photo folder on my pc. The simplest scheme I could imagine was to order by creation time and to have folders for years and months. This system was relatively easy to implement and worked for me. Vanilla OS tools were sufficient to browse and view all my photos. From then on, I implemented the same tool every few years with a different language and framework, either command line only or as old-school Windows desktop apps, starting with C#, Python, Ruby, Scala, and now Typescript.
With Windows Photo Gallery discontinued, I could not find a simple, free and usable photo video viewer anymore, so I build one myself with web technologies.
I intend to maintain this project for a long time as I believe that web technology (browsers + typescript + node) is mature and stable enough to last for the next decades.

## File structure

All photos are stored in a single root folder ("Photos").
They are grouped by year and month into subfolders.
A normal file manager should be sufficient for browsing photos.
The filename of each photo is derived from it's timestamp (DateTimeOriginal).
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
   lead to a lot of renaming operations, which leads to a lot
   of unnecessary traffic (and time) in cloud backups

To tackle this issue, the filename now also contains the time of the day.
A sequence number is only appended if there are several photos
with the same timestamp.
The internal order is still based on the original photo timestamp.
In case of duplicates, the order of ingestion decides.

```
Photos/  <-- the root of all your photos
├─── 2015
│   ├── 01_January
│   :
│   ├── 10_October
│   │   ├── 2015-10-01_12-53.jpg      <-- only one photo
│   │   ├── 2015-10-02_13-55_001.jpg  <-- photos in the same second
│   │   ├── 2015-10-02_13-55_002.jpg  <-- second photo
│   :   :
├── 2016
|   ├── 01_January
:   :
```

Videos and Photos are separated into two different root folders, just because I liked it this way.

```
MyMedia
├─── Photos
├─── Videos
```

## Index Implementation Details

- for performance reasons, all photos are stored in a json index file
- we only need to read the index to browse photos, no reason to traverse
  a folder structure and list files
- the index must fit in memory for at least one million photos
- the index must contain the original photo timestamp with millisecond precision
- the index should contain the sequence number if necessary to deduplicate photos
- basic idea: index is just an array of numbers, where the integer part is the
  Unix timestamp and the fraction is the sequence number
- a float64 number is precise enough to have timestamps to the year 2100 with
  three decimal places for a sequence number
- the array is sorted in ascending order
- 1 million photos would be roughly 14MB of json and 8MB in memory
- one could try to compress the timestamp on serialization, but it would just
  increase complexity and only save 5 bytes per photo in json

## Setup

- install node > 18
- git clone this repository
- run `npm i` to install dependencies

## Usage

- Connect a camera or phone with your computer, mount the DCIM folder
- `npm run ingest <path_to_DCIM>`
- `npm run reindex` reorganize all media files (e.g. after manual deletions or other manipulations)

## Development

### npm start

Runs the app in development mode.

### npm test

Runs all test

### npm run build

It correctly bundles Preact in production mode and optimizes the build for the best performance.

### npm run deploy

Build and copy the app to ~/Data/MyMedia
