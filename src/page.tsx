// app/editor/page.tsx
'use client'

import Editor from './Editor'
import { StrokeLog } from '../types/index'
import { useState } from 'react'

export default function Page() {
  const [logs, setLogs] = useState<StrokeLog[]>([])

  const handleStroke = (log: StrokeLog) => {
    setLogs(prev => [...prev, log])
    console.log(log) // Log each keystroke or deletion
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Creative Notes Editor</h1>
      <Editor onStroke={handleStroke} />
    </div>
  )
}
