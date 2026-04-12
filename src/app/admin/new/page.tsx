/* ----------------------------------------------------------------
   app/admin/new/page.tsx        (client component)
   Publishes a new episode with cover-image + audio upload
------------------------------------------------------------------ */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { isAdminEmail } from '@/lib/admin'

/* ---------- small helper to create URL-friendly slugs ---------- */
function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export default function AdminNewEpisode() {
  const router = useRouter()

  /* ---------- 1.  𝐀𝐥𝐥 𝐡𝐨𝐨𝐤𝐬 𝐟𝐢𝐫𝐬𝐭 (no early returns before them!) --- */
  const [checkingAuth, setCheckingAuth] = useState(true)

  const [form, setForm] = useState({
    title: '',
    summary_md: '',
    audio_url: '',
    cover_image_url: '',
    tag: '',
    duration: '',
  })
  const [uploadingAudio, setUploadingAudio] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [saving, setSaving] = useState(false)

  /* ---------- 2.  Auth gate (admin emails only) --------------- */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user?.email
      if (!data.session) {
        router.replace('/login')
      } else if (!isAdminEmail(email)) {
        // Logged in but not an admin — bounce to home, not the dashboard.
        router.replace('/')
      } else {
        setCheckingAuth(false)
      }
    })
  }, [router])

  /* ---------- 3.  While we’re checking session, show nothing ---- */
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050A12] text-white">
        Checking authentication…
      </div>
    )
  }

  /* ---------- 4.  Publish handler ----------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const { error } = await supabase.from('episodes').insert({
      title: form.title,
      slug: slugify(form.title),
      summary_md: form.summary_md,
      audio_url: form.audio_url,
      cover_image_url: form.cover_image_url,
      tag: form.tag,
      duration: form.duration,
    })

    setSaving(false)

    if (error) {
      alert('Publish failed: ' + error.message)
    } else {
      router.push('/episodes')
    }
  }

  /* ---------- 5.  UI ------------------------------------------ */
  return (
    <div className="min-h-screen bg-[#050A12] text-white px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto space-y-6 bg-gray-900 p-8 rounded-lg border border-gray-700"
      >
        <h1 className="text-2xl font-bold mb-4">🎙 Publish new episode</h1>

        {/* Title */}
        <input
          type="text"
          placeholder="Episode title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded"
        />

        {/* Show notes */}
        <textarea
          placeholder="Markdown show notes…"
          rows={6}
          value={form.summary_md}
          onChange={(e) => setForm({ ...form, summary_md: e.target.value })}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded"
        />

        {/* ───────── Cover image upload ───────── */}
        <div>
          <label className="block text-sm mb-1">
            Upload cover image (jpg / png)
          </label>
          <input
            type="file"
            accept="image/png,image/jpeg"
            disabled={uploadingCover}
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return

              setUploadingCover(true)
              const ext = file.name.split('.').pop()
              const fileName = `${Date.now()}.${ext}`

              const { error } = await supabase.storage
                .from('episode-covers')
                .upload(fileName, file, { upsert: true })

              if (error) {
                alert('Cover upload failed: ' + error.message)
              } else {
                const { data } = supabase.storage
                  .from('episode-covers')
                  .getPublicUrl(fileName)
                setForm((prev) => ({ ...prev, cover_image_url: data.publicUrl }))
              }
              setUploadingCover(false)
            }}
            className="w-full px-4 py-8 text-center bg-gray-800 border-2 border-dashed border-gray-600 rounded cursor-pointer disabled:opacity-50"
          />

          {uploadingCover && (
            <p className="mt-1 text-sm text-teal-400 animate-pulse">
              Uploading cover…
            </p>
          )}
          {form.cover_image_url && !uploadingCover && (
            <p className="mt-2 break-all text-xs text-teal-400">
              Cover:&nbsp;
              <a
                href={form.cover_image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {form.cover_image_url}
              </a>
            </p>
          )}
        </div>

        {/* ───────── Audio upload ───────── */}
        <div>
          <label className="block text-sm mb-1">Upload audio file (.mp3)</label>
          <input
            type="file"
            accept="audio/mp3"
            disabled={uploadingAudio}
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return

              setUploadingAudio(true)
              const ext = file.name.split('.').pop()
              const fileName = `${Date.now()}.${ext}`

              const { error: uploadErr } = await supabase.storage
                .from('episode-audio')
                .upload(fileName, file, { upsert: true })

              if (uploadErr) {
                alert('Audio upload failed: ' + uploadErr.message)
              } else {
                const { data } = supabase.storage
                  .from('episode-audio')
                  .getPublicUrl(fileName)
                setForm((prev) => ({ ...prev, audio_url: data.publicUrl }))
              }
              setUploadingAudio(false)
            }}
            className="w-full px-4 py-8 text-center bg-gray-800 border-2 border-dashed border-gray-600 rounded cursor-pointer disabled:opacity-50"
          />

          {uploadingAudio && (
            <p className="mt-1 text-sm text-teal-400 animate-pulse">
              Uploading audio…
            </p>
          )}
          {form.audio_url && !uploadingAudio && (
            <p className="mt-2 break-all text-xs text-teal-400">
              Audio:&nbsp;
              <a
                href={form.audio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {form.audio_url}
              </a>
            </p>
          )}
        </div>

        {/* Tag & duration */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Tag (e.g., Neonatology)"
            value={form.tag}
            onChange={(e) => setForm({ ...form, tag: e.target.value })}
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded"
          />
          <input
            type="text"
            placeholder="Duration (e.g., 12 min)"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            className="w-32 px-4 py-2 bg-gray-800 border border-gray-600 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={saving || uploadingAudio || uploadingCover}
          className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 rounded py-2 font-semibold"
        >
          {saving ? 'Publishing…' : 'Publish'}
        </button>
      </form>
    </div>
  )
}
