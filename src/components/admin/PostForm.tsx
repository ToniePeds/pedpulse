// components/admin/PostForm.tsx
// Shared form for creating and editing blog posts.
// Wraps PostEditor + cover image upload + metadata fields.
'use client'

import { useState } from 'react'
import Image from 'next/image'
import PostEditor from './PostEditor'
import { supabase } from '@/lib/supabaseClient'
import { slugify, readingTimeMin, makeExcerpt } from '@/lib/postUtils'

const COVER_BUCKET = 'post-covers'
const MAX_COVER_BYTES = 5 * 1024 * 1024 // 5 MB

export type PostFormValues = {
  title: string
  subtitle: string
  slug: string
  tag: string
  cover_image_url: string
  content_html: string
}

export type PostSubmitPayload = PostFormValues & {
  excerpt: string
  reading_time_min: number
  status: 'draft' | 'published'
}

type Props = {
  initial?: Partial<PostFormValues> & { status?: 'draft' | 'published' }
  submitLabel?: string
  onSubmit: (payload: PostSubmitPayload) => Promise<void>
}

export default function PostForm({ initial, submitLabel = 'Save', onSubmit }: Props) {
  const [values, setValues] = useState<PostFormValues>({
    title: initial?.title ?? '',
    subtitle: initial?.subtitle ?? '',
    slug: initial?.slug ?? '',
    tag: initial?.tag ?? '',
    cover_image_url: initial?.cover_image_url ?? '',
    content_html: initial?.content_html ?? '',
  })
  const [slugDirty, setSlugDirty] = useState(!!initial?.slug)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errMsg, setErrMsg] = useState<string | null>(null)

  const update = <K extends keyof PostFormValues>(key: K, val: PostFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: val }))

  const onTitleChange = (v: string) => {
    setValues((p) => ({
      ...p,
      title: v,
      slug: slugDirty ? p.slug : slugify(v),
    }))
  }

  const handleCover = async (file: File | null) => {
    setErrMsg(null)
    if (!file) return
    if (!file.type.startsWith('image/')) return setErrMsg('Cover must be an image.')
    if (file.size > MAX_COVER_BYTES) return setErrMsg('Cover must be under 5 MB.')

    setUploadingCover(true)
    try {
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${values.slug || 'untitled'}/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from(COVER_BUCKET).upload(path, file, {
        upsert: true,
        contentType: file.type,
      })
      if (error) throw error
      const { data } = supabase.storage.from(COVER_BUCKET).getPublicUrl(path)
      update('cover_image_url', data.publicUrl)
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : 'Cover upload failed.')
    } finally {
      setUploadingCover(false)
    }
  }

  const submit = async (status: 'draft' | 'published') => {
    setErrMsg(null)
    if (!values.title.trim()) return setErrMsg('Title is required.')
    if (!values.slug.trim()) return setErrMsg('Slug is required.')
    if (!values.content_html || values.content_html === '<p></p>')
      return setErrMsg('Add some content before saving.')

    setSaving(true)
    try {
      await onSubmit({
        ...values,
        title: values.title.trim(),
        subtitle: values.subtitle.trim(),
        slug: values.slug.trim(),
        tag: values.tag.trim(),
        excerpt: makeExcerpt(values.content_html),
        reading_time_min: readingTimeMin(values.content_html),
        status,
      })
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <input
        type="text"
        placeholder="Post title"
        value={values.title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="w-full px-0 py-2 bg-transparent text-4xl font-extrabold border-0 border-b border-white/10 focus:border-teal-400/50 focus:outline-none placeholder:text-gray-700"
      />

      {/* Subtitle */}
      <input
        type="text"
        placeholder="A short, intriguing subtitle (optional)"
        value={values.subtitle}
        onChange={(e) => update('subtitle', e.target.value)}
        className="w-full px-0 py-2 bg-transparent text-xl text-gray-300 border-0 focus:outline-none placeholder:text-gray-700"
      />

      {/* Meta row */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Slug" hint="auto-generated from title">
          <input
            type="text"
            value={values.slug}
            onChange={(e) => {
              setSlugDirty(true)
              update('slug', slugify(e.target.value))
            }}
            placeholder="the-quiet-comeback-of-measles"
            className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg font-mono text-sm focus:border-teal-400/50 focus:outline-none"
          />
        </Field>
        <Field label="Tag">
          <input
            type="text"
            value={values.tag}
            onChange={(e) => update('tag', e.target.value)}
            placeholder="Infectious Disease"
            className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg focus:border-teal-400/50 focus:outline-none"
          />
        </Field>
      </div>

      {/* Cover image */}
      <Field label="Cover image">
        {values.cover_image_url ? (
          <div className="space-y-2">
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-black/40">
              <Image
                src={values.cover_image_url}
                alt="Cover"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
            <div className="flex gap-3">
              <label className="text-xs text-teal-300 hover:text-teal-200 cursor-pointer">
                Replace
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleCover(e.target.files?.[0] ?? null)}
                />
              </label>
              <button
                type="button"
                onClick={() => update('cover_image_url', '')}
                className="text-xs text-gray-500 hover:text-rose-300"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <label
            htmlFor="cover-input"
            className="block w-full px-4 py-10 text-center bg-black/40 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-teal-400/40 transition"
          >
            {uploadingCover ? (
              <span className="text-teal-300">Uploading…</span>
            ) : (
              <span className="text-gray-400">Click to upload cover image (max 5 MB)</span>
            )}
            <input
              id="cover-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleCover(e.target.files?.[0] ?? null)}
            />
          </label>
        )}
      </Field>

      {/* Editor */}
      <Field label="Content">
        <PostEditor
          initialHtml={initial?.content_html ?? ''}
          onChange={(html) => update('content_html', html)}
        />
      </Field>

      {/* Errors */}
      {errMsg && (
        <div className="p-3 rounded-lg bg-rose-500/10 ring-1 ring-rose-400/30 text-rose-200 text-sm">
          {errMsg}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
        <button
          type="button"
          onClick={() => submit('draft')}
          disabled={saving || uploadingCover}
          className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 font-semibold disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save draft'}
        </button>
        <button
          type="button"
          onClick={() => submit('published')}
          disabled={saving || uploadingCover}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-[#04131A] font-bold disabled:opacity-50 hover:shadow-lg hover:shadow-teal-500/30 transition"
        >
          {saving ? 'Publishing…' : submitLabel}
        </button>
      </div>
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</span>
        {hint && <span className="text-[10px] text-gray-600">{hint}</span>}
      </div>
      {children}
    </div>
  )
}
