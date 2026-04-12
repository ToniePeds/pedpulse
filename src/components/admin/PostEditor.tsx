// components/admin/PostEditor.tsx
// Tiptap-based rich text editor for blog posts.
// Outputs HTML so the public page can render via dangerouslySetInnerHTML
// inside a Tailwind `prose` wrapper.
'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import ImageExtension from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import { useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Code,
  Code2,
  Link as LinkIcon,
  ImagePlus,
  Undo2,
  Redo2,
  Minus,
} from 'lucide-react'

const IMAGE_BUCKET = 'post-images'
const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5 MB

type Props = {
  initialHtml?: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function PostEditor({ initialHtml = '', onChange, placeholder }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      ImageExtension.configure({
        HTMLAttributes: { class: 'rounded-xl' },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? 'Tell the story…',
      }),
      Typography,
    ],
    content: initialHtml || '<p></p>',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    // Critical for Next.js — avoids SSR hydration mismatch.
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose prose-invert prose-lg max-w-none focus:outline-none min-h-[400px] py-6 px-2',
      },
    },
  })

  const handleImageUpload = async (file: File) => {
    if (!editor) return
    if (!file.type.startsWith('image/')) return
    if (file.size > MAX_IMAGE_BYTES) {
      alert('Image must be under 5 MB.')
      return
    }

    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `inline/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, {
      contentType: file.type,
    })
    if (error) {
      alert('Image upload failed: ' + error.message)
      return
    }
    const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path)
    editor.chain().focus().setImage({ src: data.publicUrl, alt: file.name }).run()
  }

  if (!editor) {
    return (
      <div className="rounded-2xl bg-white/[0.02] ring-1 ring-white/5 p-6 text-gray-500">
        Loading editor…
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white/[0.02] ring-1 ring-white/5 overflow-hidden">
      <Toolbar editor={editor} onImageClick={() => fileInputRef.current?.click()} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleImageUpload(f)
          e.target.value = ''
        }}
      />
      <div className="px-6">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

/* ─────────── Toolbar ─────────── */
function Toolbar({ editor, onImageClick }: { editor: Editor; onImageClick: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/5 bg-black/30 sticky top-0 z-10 backdrop-blur">
      <Btn
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        title="Bold (⌘B)"
      >
        <Bold className="w-4 h-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        title="Italic (⌘I)"
      >
        <Italic className="w-4 h-4" />
      </Btn>

      <Sep />

      <Btn
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </Btn>

      <Sep />

      <Btn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        title="Bulleted list"
      >
        <List className="w-4 h-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        title="Numbered list"
      >
        <ListOrdered className="w-4 h-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
        title="Quote"
      >
        <Quote className="w-4 h-4" />
      </Btn>

      <Sep />

      <Btn
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive('code')}
        title="Inline code"
      >
        <Code className="w-4 h-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive('codeBlock')}
        title="Code block"
      >
        <Code2 className="w-4 h-4" />
      </Btn>

      <Sep />

      <Btn
        onClick={() => {
          const previous = editor.getAttributes('link').href as string | undefined
          const url = window.prompt('URL', previous ?? 'https://')
          if (url === null) return
          if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
          }
          editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
        }}
        active={editor.isActive('link')}
        title="Link"
      >
        <LinkIcon className="w-4 h-4" />
      </Btn>

      <Btn onClick={onImageClick} title="Insert image">
        <ImagePlus className="w-4 h-4" />
      </Btn>

      <Btn
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Divider"
      >
        <Minus className="w-4 h-4" />
      </Btn>

      <Sep />

      <Btn onClick={() => editor.chain().focus().undo().run()} title="Undo (⌘Z)">
        <Undo2 className="w-4 h-4" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().redo().run()} title="Redo (⌘⇧Z)">
        <Redo2 className="w-4 h-4" />
      </Btn>
    </div>
  )
}

function Btn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`p-2 rounded-md transition-colors ${
        active ? 'bg-teal-500/20 text-teal-300' : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

function Sep() {
  return <span className="w-px h-5 bg-white/10 mx-1" />
}
