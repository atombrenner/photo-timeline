import { h, render } from 'preact'
import 'preact/devtools'
import { App } from './app.jsx'
import './index.css'

// @ts-expect-error env property injected by snowpack with magic
const baseUrl = import.meta.env.SNOWPACK_PUBLIC_MEDIA_URL

const fetchJson = (url: string) => fetch(baseUrl + url).then((res) => res.json())

async function loadPhotos() {
  const index: string[] = await fetchJson('/index.json')

  const photos = index.map((file) => `${baseUrl}/${file}`)

  return photos
}

loadPhotos().then((photos) => {
  const root = document.getElementById('root')
  render(<App images={photos} />, root!)
})
