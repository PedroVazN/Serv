import { useRef, useState } from 'react'
import './TelegramAssistant.css'

export const TELEGRAM_ASSISTANT_URL = 'https://t.me/SERVMAIS_PI_ASSISTENTE_BOT'

function ChatIcon() {
  return <svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2V11.5a9.5 9.5 0 0 1 19 0Z" /><path d="M7.5 11.5h.01M12 11.5h.01M16.5 11.5h.01" strokeWidth="2.8" strokeLinecap="round" /></svg>
}

function TelegramIcon() {
  return <svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor" aria-hidden="true"><path d="M21.6 3.4a1.2 1.2 0 0 0-1.3-.2L2.9 9.9c-1.2.5-1.2 1.2-.2 1.5l4.5 1.4 1.7 5.2c.2.6.1.8.7.8.4 0 .6-.2.8-.4l2.2-2.1 4.5 3.3c.8.5 1.4.3 1.6-.8l2.9-13.7c.2-.8.1-1.3-.1-1.7ZM9.1 12.5l8.8-5.6c.4-.3.8-.1.5.2l-7.3 6.6-.3 3.1-1.7-4.3Z" /></svg>
}

export default function TelegramAssistant() {
  const dialog = useRef(null)
  const [open, setOpen] = useState(false)

  function showAssistant() {
    if (dialog.current?.open) return
    dialog.current?.showModal()
    setOpen(true)
  }

  function closeAssistant() { dialog.current?.close() }

  function keepFocusInDialog(event) {
    if (event.key !== 'Tab') return
    const controls = dialog.current?.querySelectorAll('button, a[href]')
    const first = controls?.[0], last = controls?.[controls.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus()
    }
  }

  return <>
    <button
      type="button"
      className="telegram-assistant-trigger"
      aria-label="Abrir assistente SERV+"
      aria-haspopup="dialog"
      aria-controls="telegram-assistant-dialog"
      aria-expanded={open}
      onClick={showAssistant}
    >
      <ChatIcon />
      <span>Assistente SERV+</span>
    </button>

    <dialog
      ref={dialog}
      id="telegram-assistant-dialog"
      className="telegram-assistant-dialog"
      aria-labelledby="telegram-assistant-title"
      aria-describedby="telegram-assistant-description"
      onClose={() => setOpen(false)}
      onKeyDown={keepFocusInDialog}
      onClick={event => { if (event.target === event.currentTarget) closeAssistant() }}
    >
      <div className="telegram-assistant-card">
        <div className="telegram-assistant-header">
          <span className="telegram-assistant-mark" aria-hidden="true">S<span>+</span></span>
          <div><h2 id="telegram-assistant-title">Assistente SERV+</h2><p>Vamos conversar?</p></div>
          <button type="button" className="telegram-assistant-close" aria-label="Fechar assistente" onClick={closeAssistant} autoFocus>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <div className="telegram-assistant-body">
          <p className="telegram-assistant-greeting">Precisa de uma ajuda?</p>
          <p id="telegram-assistant-description">Converse com o assistente do SERV+ pelo Telegram e tire suas dúvidas sobre a plataforma.</p>
          <p className="telegram-assistant-handle">@SERVMAIS_PI_ASSISTENTE_BOT</p>
          <a className="telegram-assistant-link" href={TELEGRAM_ASSISTANT_URL} target="_blank" rel="noopener noreferrer" onClick={closeAssistant}>
            <TelegramIcon /><span>Conversar no Telegram</span><span aria-hidden="true">↗</span>
          </a>
          <p className="telegram-assistant-note">Abre o Telegram em uma nova aba.</p>
        </div>
      </div>
    </dialog>
  </>
}
