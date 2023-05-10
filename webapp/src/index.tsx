import { render } from 'preact'
import { App } from './app.jsx'
import { loadPhotos } from './backend.js'
import './index.css'

loadPhotos().then((photos) => {
  render(<App photos={photos} />, document.getElementById('root') as HTMLElement)
  console.log(document.activeElement)
  document.getElementById('app')?.focus()
})
