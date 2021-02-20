import { h, render } from 'preact'
import 'preact/devtools'
import { App } from './app.jsx'
import './index.css'

const baseUrl = 'http://localhost:9000'

const fetchJson = (url: string) => fetch(baseUrl + url, { mode: 'cors' }).then((res) => res.json())

async function loadPhotos() {
  const index: string[] = await fetchJson('/index.json')
  const photos = await Promise.all(
    index.map((folder) =>
      fetchJson(`/${folder}/index.json`).then((items: string[]) =>
        items.map((item) => `${baseUrl}/${folder}/${item}`),
      ),
    ),
  )
  return photos.flat()
}

loadPhotos().then((photos) => {
  const root = document.getElementsByTagName('body')[0]
  render(<App images={photos} />, root)
})
