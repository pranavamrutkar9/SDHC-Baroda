import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Wake up the Render free-tier instance as early as possible.
// Without this, the first API call (e.g. /api/products when not logged in)
// hits a cold server and returns 502. The health ping has no visible effect
// on the UI — it just ensures the instance is warm before pages load.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
fetch(`${API_BASE}/health`).catch(() => {}); // silent — errors are intentionally ignored

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
