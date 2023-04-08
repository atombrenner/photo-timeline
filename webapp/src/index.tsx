import { h, render } from 'preact'
import 'preact/devtools'
import { App } from './app.jsx'
import './index.css'

render(<App />, document.getElementById('root') as HTMLElement)
