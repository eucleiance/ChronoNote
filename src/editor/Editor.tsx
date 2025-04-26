'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import { StrokeAction } from '../types/index'

export default function Editor({
  initialContent,
  onSnapshot,
}: {
  initialContent: string
  onSnapshot: (action: StrokeAction) => void
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML() // 👈 Use getHTML() instead of getText()
      const timestamp = Date.now()
      console.log('[Editor] Capturing snapshot:', html)

      onSnapshot({
        content: html,
        timestamp,
      })
    },
  })

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) { // 👈 Compare HTML not Text
      console.log('[effect] Setting editor content to:', initialContent)
      editor.commands.setContent(initialContent, false)
    }
  }, [initialContent, editor])

  return <EditorContent editor={editor} className="border p-4 rounded-md focus:outline-offset-4" />
}
