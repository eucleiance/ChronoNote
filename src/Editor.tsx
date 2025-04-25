// function Editor(){

//   return (
//     <>
//     <div className="main">
//       Hello from the other side
//     </div>
//     </>
//   )
// }


// export default Editor;



// components/Editor.tsx
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { StrokeLog } from '../types/index'
import { useEffect } from 'react'

export default function Editor({ onStroke }: { onStroke: (log: StrokeLog) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      const transaction = editor.state.tr
      const timestamp = Date.now()

      onStroke({
        json: editor.getJSON(),
        html: editor.getHTML(),
        text: editor.getText(),
        timestamp,
      })
    },
  })

  return <EditorContent editor={editor} className="prose max-w-none p-4 border rounded-md shadow" />
}
