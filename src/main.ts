import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

type ChatPayload = { sender: string; message: string }

function emitMessage(sender: string, message: string) {
  window.dispatchEvent(
    new CustomEvent<ChatPayload>('chatwidget:message', {
      detail: { sender, message }
    })
  )
}

function emitAlert(sender: string, message: string) {
  window.dispatchEvent(
    new CustomEvent<ChatPayload>('chatwidget:alert', {
      detail: { sender, message }
    })
  )
}

const targetId = 'chatwidget-app'
const target =
  document.getElementById(targetId) ??
  (() => {
    const el = document.createElement('div')
    el.id = targetId
    document.body.appendChild(el)
    return el
  })()

const app = mount(App, { target })

const api = { emitMessage, emitAlert }
Object.assign(globalThis, { ChatWidget: api })

void app
export { emitMessage, emitAlert }
