import { h, render } from 'preact'
import 'preact/devtools'
import App from './App.js'
import './index.css'

const root = document.getElementsByTagName('body')[0]

if (root) {
  render(<App />, root)
}
