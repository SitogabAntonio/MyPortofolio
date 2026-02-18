import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { gsap } from 'gsap'
import { BrowserRouter } from 'react-router-dom'

gsap.registerPlugin()

const storedTheme = localStorage.getItem('app_theme') || 'neutral'
document.documentElement.setAttribute('data-theme', storedTheme)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)