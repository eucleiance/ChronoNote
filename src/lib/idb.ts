// lib/idb.ts

export const DB_NAME = 'ChronoNoteDB'
export const STORE_NAME = 'Snapshots'

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

export async function saveSnapshot(content: string) {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  tx.objectStore(STORE_NAME).add({ content, timestamp: Date.now() })
  await (tx as any).done // <<< fix here
}

export async function loadAllSnapshots(): Promise<{ content: string, timestamp: number }[]> {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, 'readonly')
  const store = tx.objectStore(STORE_NAME)

  return new Promise((resolve, reject) => {
    const request = store.getAll()
    request.onsuccess = () => {
      resolve(request.result as any)
    }
    request.onerror = () => {
      reject(request.error)
    }
  })
}

export async function clearSnapshots() {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  tx.objectStore(STORE_NAME).clear()
  await (tx as any).done // <<< fix here
}
