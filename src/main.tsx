import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import PredictionForm from './mbtp/PredictionForm.tsx' // ⬅️ You'll create this next
import Page from './editor/page.tsx'
import Editor from './editor/Editor.tsx'

import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/prediction" element={<PredictionForm />} />
        <Route path="/editor" element={<Page />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

