import { h, render } from 'preact'
import 'preact/devtools'
import { App } from './app.jsx'
import './index.css'

const baseUrl = 'http://localhost:9000'

const fetchJson = (url: string) => fetch(baseUrl + url, { mode: 'cors' }).then((res) => res.json())

async function loadPhotos() {
  const index: string[] = await fetchJson('/index.json')

  const photos = index.map((file) => `${baseUrl}/${file}`)

  return photos
}

loadPhotos().then((photos) => {
  const root = document.getElementById('root')
  render(<App images={photos} />, root!)
})
