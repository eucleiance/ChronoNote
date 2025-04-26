'use client'

import { useCallback, useEffect, useState } from 'react'
import Editor from './Editor'
import { StrokeAction } from '../types/index'

export default function Page() {
  const [logs, setLogs] = useState<StrokeAction[]>([])
  const [latestContent, setLatestContent] = useState('')
  const [isReplaying, setIsReplaying] = useState(false)

  // Load logs from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('strokeLogs')
    if (stored) {
      try {
        const parsed: StrokeAction[] = JSON.parse(stored)
        console.log('[Page] Loaded logs from localStorage:', parsed)
        setLogs(parsed)
        if (parsed.length > 0) {
          setLatestContent(parsed[parsed.length - 1].content)
        }
      } catch (err) {
        console.error('[Page] Error parsing localStorage:', err)
      }
    }
  }, [])

  // Save logs to localStorage whenever logs change
  useEffect(() => {
    if (logs.length > 0) {
      console.log('[Page] Saving logs to localStorage:', logs)
      localStorage.setItem('strokeLogs', JSON.stringify(logs))
    } else {
      console.warn('[Page] Not saving empty logs to localStorage')
    }
  }, [logs])

  const handleSnapshot = useCallback((action: StrokeAction) => {
    setLogs((prevLogs) => {
      const newLogs = [...prevLogs, action]
      console.log('[Page] Adding new snapshot:', action)
      return newLogs
    })
  }, [])

  const handleReplay = useCallback(() => {
    if (logs.length === 0) return

    setIsReplaying(true)
    let index = 0

    const interval = setInterval(() => {
      setLatestContent(logs[index].content)
      console.log('[Replay] Showing snapshot:', logs[index])

      index++

      if (index >= logs.length) {
        clearInterval(interval)
        setIsReplaying(false)
        console.log('[Replay] Finished replaying.')
      }
    }, 100) // 500ms per snapshot, you can adjust
  }, [logs])

  return (
    <div className="p-6 max-w-3xl mx-auto flex-col align-middle">
      <h1 className="text-2xl font-bold mb-4">Chrono Note</h1>

      <Editor initialContent={latestContent} onSnapshot={handleSnapshot} />

      <p className="text-gray-500 mt-6">
        Snapshots captured: {logs.length}
      </p>

      <div className="mt-2 gap-4">
        <button
          onClick={handleReplay}
          disabled={isReplaying}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
        >
          {isReplaying ? 'Replaying...' : 'Replay'}
        </button>

      </div>
    </div>
  )
}
