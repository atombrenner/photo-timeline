import { h, render } from 'preact'
import 'preact/devtools'
import { App } from './app.jsx'
import './index.css'

const baseUrl = 'http://localhost:9000'

const fetchJson = (url: string) => fetch(baseUrl + url, { mode: 'cors' }).then((res) => res.json())

async function loadPhotos() {
  const index: Record<string, string[]> = await fetchJson('/index.json')

  const filename = (folder: string, file: string) =>
    folder.substr(0, 4) + '-' + folder.substr(5, 2) + '-' + file

  const photos = Object.entries(index).flatMap(([folder, files]) =>
    files.map((file) => `${baseUrl}/${folder}/${filename(folder, file)}`),
  )

  return photos
}

loadPhotos().then((photos) => {
  const root = document.getElementsByTagName('body')[0]
  render(<App images={photos} />, root)
})
