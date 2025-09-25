import './style.css'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div class="bg-amber-300">
  <h1>Hello</h1>
    
  </div>
`

setupCounter(document.querySelector('#counter'))
