'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import { StrokeAction } from '../types/index'

export default function Editor({
  initialContent,
  onSnapshot,
}: {
  initialContent: any // JSON now
  onSnapshot: (action: StrokeAction) => void
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      const timestamp = Date.now()
      // console.log('[Editor] Capturing snapshot:', json)

      onSnapshot({
        content: json, // save JSON instead of string
        timestamp,
      })
    },
  })

  useEffect(() => {
    if (editor && JSON.stringify(initialContent) !== JSON.stringify(editor.getJSON())) {
      // console.log('[effect] Setting editor content to:', initialContent)
      editor.commands.setContent(initialContent, false)
    }
  }, [initialContent, editor])

  return <EditorContent editor={editor} className="border p-4 rounded-md focus:outline-offset-4" />
}
