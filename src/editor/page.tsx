'use client'

import Editor from './Editor'
import { StrokeAction } from '../types/index'
import { useCallback, useEffect, useState } from 'react'
import { saveSnapshot, loadAllSnapshots } from '../lib/idb'

export default function Page() {
  const [logs, setLogs] = useState<StrokeAction[]>([])
  const [reconstructed, setReconstructed] = useState<any>(null)
  const [storageUsed, setStorageUsed] = useState<number>(0)

  const reconstructContent = useCallback((logs: StrokeAction[]) => {
    if (logs.length === 0) return null
    const latest = logs[logs.length - 1].content
    console.log('[Page] Reconstructed content:', latest)
    return latest
  }, [])

  // Load from IndexedDB on mount
  useEffect(() => {
    async function loadSnapshots() {
      try {
        const snapshots = await loadAllSnapshots()
        console.log('[Page] Loaded from IndexedDB:', snapshots)
        const parsed: StrokeAction[] = snapshots.map((snap) => ({
          content: snap.content,
          timestamp: snap.timestamp
        }))
        setLogs(parsed)
        const content = reconstructContent(parsed)
        setReconstructed(content)

        // Calculate storage usage (in KB)
        const totalBytes = snapshots.reduce((sum, snap) => {
          const contentSize = new TextEncoder().encode(snap.content).length
          return sum + contentSize
        }, 0)
        setStorageUsed(totalBytes / 1024) // KB
      } catch (err) {
        console.error('[Page] Error loading from IndexedDB:', err)
      }
    }
    loadSnapshots()
  }, [reconstructContent])

  // Save a snapshot and calculate the storage used after each keystroke
  const handleSnapshot = useCallback(async (action: StrokeAction) => {
    // Save the snapshot in IndexedDB
    await saveSnapshot(action.content)

    // Add new snapshot to logs
    setLogs((prevLogs) => {
      const newLogs = [...prevLogs, action]
      console.log('[Page] Adding new snapshot:', action)
      return newLogs
    })

    // Recalculate storage usage after adding a new snapshot
    const snapshots = await loadAllSnapshots() // Get all snapshots
    const totalBytes = snapshots.reduce((sum, snap) => {
      const contentSize = new TextEncoder().encode(snap.content).length
      return sum + contentSize
    }, 0)
    setStorageUsed(totalBytes / 1024) // Update storage used (in KB)
  }, [])

  // Replay the content step by step
  const handleReplay = () => {
    console.log('[Page] Starting Replay...')
    if (logs.length === 0) return

    let index = 0
    const interval = setInterval(() => {
      if (index >= logs.length) {
        clearInterval(interval)
        console.log('[Page] Replay finished')
        return
      }
      setReconstructed(logs[index].content)
      index++
    }, 100)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chrono Note</h1>
      <Editor initialContent={reconstructed} onSnapshot={handleSnapshot} />

      <p className="text-gray-500 mt-6">Snapshots saved: {logs.length}</p>
      <p className="text-gray-500">Storage used: {storageUsed.toFixed(2)} KB</p>

      <div className="mt-4 gap-4 items-center">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleReplay}
        >
          Replay
        </button>
      </div>
    </div>
  )
}
