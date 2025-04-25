'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useRef } from 'react'
import { StrokeAction } from '../types/index'

export default function Editor({
  initialContent,
  onStroke,
}: {
  initialContent: string
  onStroke: (action: StrokeAction) => void
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
  })

  const domRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!editor) return
    const viewDom = editor.view.dom as HTMLElement
    domRef.current = viewDom

    const handleKeyDown = (e: KeyboardEvent) => {
      const state = editor.state
      const pos = state.selection.$head.pos
      const timestamp = Date.now()

      if (e.key === 'Backspace') {
        if (pos > 0) {
          const action: StrokeAction = {
            action: 'delete',
            pos: pos - 1,
            timestamp,
          }
          console.log('[keydown] Logging delete:', action)
          onStroke(action)
        }
      } else if (e.key.length === 1) {
        const action: StrokeAction = {
          action: 'insert',
          char: e.key,
          pos,
          timestamp,
        }
        console.log('[keydown] Logging insert:', action)
        onStroke(action)
      }
    }

    viewDom.addEventListener('keydown', handleKeyDown)
    return () => {
      viewDom.removeEventListener('keydown', handleKeyDown)
    }
  }, [editor, onStroke])

  useEffect(() => {
    if (editor && initialContent !== editor.getText()) {
      console.log('[effect] Setting editor content to:', initialContent)
      editor.commands.setContent(initialContent, false)
    }
  }, [initialContent, editor])

  return <EditorContent editor={editor} className="border p-4 rounded-md focus:outline-offset-4" />
}
