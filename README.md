# Photo Timeline

> ✨ Bootstrapped with Create Snowpack App (CSA).

A minimal web app to view and browse photos organized on a timeline.
Import photos and videos into an organized folder structure with a simple command-line tool.
Sync organized files with cloud storage (AWS S3).

## Motivation

Many years ago, my digital photo library became a mess. I got tired of manually organize photos into folders or albums and needed an automated task that transfers media files from my camera to my photo folder on my pc. The simplest scheme I could imagine was to order by creation time and then group by month. This system was relatively easy to implement and worked for me. Vanilla OS tools were sufficient to browse and view all my photos. From then on, I implemented the same tool every few years with a different language and framework, either command line only or as old school windows desktop apps, starting with C#, Python, Ruby, Scala, and now Typescript.
With Windows Photo Gallery discontinued, I could not found a simple, free and usable photo video viewer anymore, so I build one myself with modern (2021) web technologies.
I intend to maintain this project for a long time as I believe that web technology (browsers + typescript + node) is mature and stable enough to last for the next decades.

## Workflow and file structure

Files are grouped by years and month into this folder structure:

```
Photos/  <-- the root of all your photos
├─── 2015
│   ├── 01-January
│   :
│   ├── 10-October
│   │   ├── 2015-10-01_001.jpg
│   │   ├── 2015-10-01_002.jpg
│   │   ├── 2015-10-02_003.jpg
│   :   :
├── 2016
|   ├── 01-January
:   :
├─── index.html <-- open with your favorite browser to view photos
```

Videos and Photos are separated into two different root folders, just because I liked it this way.

```
MyMedia
├─── Photos
├─── Videos
```

## Setup

- install node > 14
- git clone this repository
- run `npm i` to install dependencies

## Usage

- Connect a camera or phone with your computer, mount the DCIM folder
- `npm run ingest <path_to_DCIM>`

## Future plans

Convert photos to avif to save storage space and enable faster web access

## Development

### npm start

Runs the app in the development mode.
Open http://localhost:8080 to view it in the browser.

### npm test

Launches the test runner in the interactive watch mode.
See the section about running tests for more information.

### npm run build

Builds the app for production to the `build/` folder.
It correctly bundles Preact in production mode and optimizes the build for the best performance.
