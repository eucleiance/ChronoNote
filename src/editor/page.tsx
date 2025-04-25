'use client'

import Editor from './Editor'
import { StrokeAction } from '../types/index'
import { useCallback, useEffect, useState } from 'react'

export default function Page() {
  const [logs, setLogs] = useState<StrokeAction[]>([])
  const [reconstructed, setReconstructed] = useState('')

  // Reconstruct content from logs
  const reconstructContent = useCallback((logs: StrokeAction[]) => {
    let content = ''
    logs.forEach((log) => {
      if (log.action === 'insert') {
        content =
          content.slice(0, log.pos) +
          log.char +
          content.slice(log.pos)
      } else if (log.action === 'delete') {
        content =
          content.slice(0, log.pos) +
          content.slice(log.pos + 1)
      }
    })
    console.log('[Page] Reconstructed content:', content)
    return content
  }, [])

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('strokeLogs')
    if (stored) {
      try {
        const parsed: StrokeAction[] = JSON.parse(stored)
        console.log('[Page] Loaded logs from localStorage:', parsed)
        setLogs(parsed)
        const content = reconstructContent(parsed)
        setReconstructed(content)
      } catch (err) {
        console.error('[Page] Error parsing localStorage:', err)
      }
    }
  }, [reconstructContent])

  // Save to localStorage when logs change
  useEffect(() => {
    if (logs.length > 0) {
      console.log('[Page] Saving logs to localStorage:', logs)
      localStorage.setItem('strokeLogs', JSON.stringify(logs))
    } else {
      console.warn('[Page] Not saving empty logs to localStorage')
    }
  }, [logs])

  const handleStroke = useCallback((action: StrokeAction) => {
    setLogs((prevLogs) => {
      const newLogs = [...prevLogs, action]
      console.log('[Page] Adding new action:', action)
      return newLogs
    })
  }, [])


  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chrono Note</h1>
      {/* <Editor onStroke={handleStroke} initialContent={reconstructedContent} /> */}
      <Editor initialContent={reconstructed} onStroke={handleStroke} />
      <p className="mt-4 text-gray-500">Keystrokes logged: {logs.length}</p>
    </div>
  )


}
