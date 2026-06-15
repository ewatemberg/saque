import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { aplicarTema } from './lib/tema'
import './styles/tokens.css'
import './styles/global.css'

aplicarTema()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
