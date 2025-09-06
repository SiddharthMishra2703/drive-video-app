import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// ✅ Import service worker register helper from vite-plugin-pwa
import { registerSW } from 'virtual:pwa-register'

// ✅ Register the service worker
registerSW({
  onNeedRefresh() {
    console.log('New content available, please refresh.')
  },
  onOfflineReady() {
    console.log('App ready to work offline.')
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
