/* ----------------------------------------------------------------
   app/admin/tools/page.tsx
   Single-HTML tool uploader. Admin emails only.
---------------------------------------------------------------- */
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { isAdminEmail } from '@/lib/admin'

const BUCKET = 'tool-bundles'
const MAX_BYTES = 2 * 1024 * 1024 // 2 MB — single HTML files don't need more

type Tool = {
  id: string
  slug: string
  title: string
  description: string | null
  tag: string | null
  icon: string | null
  html_url: string
  storage_path: string
  status: 'draft' | 'published'
  created_at: string
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export default function AdminToolsPage() {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Form state
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    tag: '',
    icon: '🧪',
  })
  const [slugDirty, setSlugDirty] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [errMsg, setErrMsg] = useState<string | null>(null)

  // List state
  const [tools, setTools] = useState<Tool[]>([])
  const [loadingList, setLoadingList] = useState(true)

  /* ---- auth gate ------------------------------------------- */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user?.email
      if (!data.session) router.replace('/login')
      else if (!isAdminEmail(email)) router.replace('/')
      else setCheckingAuth(false)
    })
  }, [router])

  /* ---- list loader ----------------------------------------- */
  const loadTools = useCallback(async () => {
    setLoadingList(true)
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setTools(data as Tool[])
    setLoadingList(false)
  }, [])

  useEffect(() => {
    if (!checkingAuth) loadTools()
  }, [checkingAuth, loadTools])

  /* ---- form helpers ---------------------------------------- */
  const onTitleChange = (v: string) => {
    setForm((f) => ({
      ...f,
      title: v,
      slug: slugDirty ? f.slug : slugify(v),
    }))
  }

  const onSlugChange = (v: string) => {
    setSlugDirty(true)
    setForm((f) => ({ ...f, slug: slugify(v) }))
  }

  const onFile = (f: File | null) => {
    setErrMsg(null)
    if (!f) return setFile(null)
    if (!f.name.toLowerCase().endsWith('.html')) {
      return setErrMsg('File must be a single .html file.')
    }
    if (f.size > MAX_BYTES) {
      return setErrMsg(`File is ${(f.size / 1024 / 1024).toFixed(1)} MB. Limit is 2 MB.`)
    }
    if (f.type && f.type !== 'text/html') {
      // Not fatal — some browsers report empty type for .html
      console.warn('Unexpected MIME:', f.type)
    }
    setFile(f)
  }

  /* ---- submit ---------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrMsg(null)

    if (!file) return setErrMsg('Pick an .html file first.')
    if (!form.title.trim()) return setErrMsg('Title is required.')
    if (!form.slug.trim()) return setErrMsg('Slug is required.')

    setSaving(true)
    try {
      // 1. Upload file to storage.
      //
      // CRITICAL: we pass an ArrayBuffer (NOT a File or Blob). The Supabase
      // JS SDK has two upload code paths:
      //   - Blob/File  → wraps in multipart/form-data; Supabase Storage often
      //                  ignores the `contentType` option and serves the file
      //                  as text/plain. The iframe then shows source code.
      //   - ArrayBuffer → SDK sets the Content-Type header on the HTTP
      //                   request directly, which Supabase actually honors.
      // So we read the file as an ArrayBuffer and pass that, which is the
      // only reliable way to force `text/html` on the stored object.
      const storagePath = `${form.slug}/${Date.now()}.html`
      const arrayBuffer = await file.arrayBuffer()

      const { error: uploadErr } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, arrayBuffer, {
          contentType: 'text/html',
          cacheControl: '3600',
          upsert: false,
        })
      if (uploadErr) throw uploadErr

      // 2. Get public URL
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)

      // 3. Insert DB row
      const { error: insertErr } = await supabase.from('tools').insert({
        slug: form.slug,
        title: form.title.trim(),
        description: form.description.trim() || null,
        tag: form.tag.trim() || null,
        icon: form.icon || null,
        html_url: urlData.publicUrl,
        storage_path: storagePath,
        status: 'published',
      })
      if (insertErr) {
        // Best-effort cleanup of orphaned upload
        await supabase.storage.from(BUCKET).remove([storagePath])
        throw insertErr
      }

      // 4. Reset and reload
      setForm({ title: '', slug: '', description: '', tag: '', icon: '🧪' })
      setSlugDirty(false)
      setFile(null)
      ;(document.getElementById('tool-file-input') as HTMLInputElement | null)?.value &&
        ((document.getElementById('tool-file-input') as HTMLInputElement).value = '')
      await loadTools()
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setSaving(false)
    }
  }

  /* ---- row actions ----------------------------------------- */
  const toggleStatus = async (tool: Tool) => {
    const next = tool.status === 'published' ? 'draft' : 'published'
    const { error } = await supabase.from('tools').update({ status: next }).eq('id', tool.id)
    if (error) return alert(error.message)
    setTools((ts) => ts.map((t) => (t.id === tool.id ? { ...t, status: next } : t)))
  }

  const deleteTool = async (tool: Tool) => {
    if (!confirm(`Delete "${tool.title}"? This removes the file and cannot be undone.`)) return
    // Delete file first; if it fails we still attempt the row delete to avoid orphans either way.
    await supabase.storage.from(BUCKET).remove([tool.storage_path])
    const { error } = await supabase.from('tools').delete().eq('id', tool.id)
    if (error) return alert(error.message)
    setTools((ts) => ts.filter((t) => t.id !== tool.id))
  }

  /* ---- UI -------------------------------------------------- */
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050A12] text-white">
        Checking authentication…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050A12] text-white">
      {/* Slim admin header */}
      <header className="border-b border-white/5 backdrop-blur-md bg-[#050A12]/80">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-sm text-gray-400 hover:text-teal-300">
              ← Admin
            </Link>
            <span className="text-gray-700">|</span>
            <h1 className="text-lg font-bold">Tools Manager</h1>
          </div>
          <Link
            href="/tools"
            target="_blank"
            className="text-xs text-teal-300 hover:text-teal-200"
          >
            View public page →
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        {/* ───────── Upload form ───────── */}
        <section>
          <h2 className="text-2xl font-bold mb-1">Upload a tool</h2>
          <p className="text-sm text-gray-400 mb-6">
            One self-contained <code className="text-teal-300">.html</code> file. Max 2 MB. It goes
            live the moment you publish.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 bg-white/[0.02] ring-1 ring-white/5 rounded-2xl p-6"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Title">
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => onTitleChange(e.target.value)}
                  required
                  placeholder="Pediatric Fluid Calculator"
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg focus:border-teal-400/50 focus:outline-none"
                />
              </Field>

              <Field label="Slug" hint="auto-generated, edit if you want">
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => onSlugChange(e.target.value)}
                  required
                  placeholder="pediatric-fluid-calculator"
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg font-mono text-sm focus:border-teal-400/50 focus:outline-none"
                />
              </Field>
            </div>

            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                placeholder="Holliday-Segar in three taps. No scratch paper."
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg focus:border-teal-400/50 focus:outline-none"
              />
            </Field>

            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Tag">
                <input
                  type="text"
                  value={form.tag}
                  onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                  placeholder="Endocrinology"
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg focus:border-teal-400/50 focus:outline-none"
                />
              </Field>
              <Field label="Icon (emoji)">
                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                  maxLength={4}
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-center text-xl focus:border-teal-400/50 focus:outline-none"
                />
              </Field>
            </div>

            <Field label="HTML file">
              <label
                htmlFor="tool-file-input"
                className="block w-full px-4 py-8 text-center bg-black/40 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:border-teal-400/40 transition"
              >
                {file ? (
                  <div>
                    <div className="text-teal-300 font-semibold">{file.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {(file.size / 1024).toFixed(1)} KB · click to replace
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-gray-400">Click to choose a .html file</div>
                    <div className="text-xs text-gray-600 mt-1">Max 2 MB</div>
                  </div>
                )}
                <input
                  id="tool-file-input"
                  type="file"
                  accept=".html,text/html"
                  onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                />
              </label>
            </Field>

            {errMsg && (
              <div className="p-3 rounded-lg bg-rose-500/10 ring-1 ring-rose-400/30 text-rose-200 text-sm">
                {errMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-[#04131A] font-bold disabled:opacity-50 hover:shadow-lg hover:shadow-teal-500/30 transition"
            >
              {saving ? 'Publishing…' : 'Publish tool'}
            </button>
          </form>
        </section>

        {/* ───────── Existing tools ───────── */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Published &amp; drafts</h2>

          {loadingList ? (
            <div className="text-gray-500">Loading…</div>
          ) : tools.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white/[0.02] ring-1 ring-white/5 text-center text-gray-500">
              No tools yet. Upload your first one above.
            </div>
          ) : (
            <ul className="divide-y divide-white/5 rounded-2xl bg-white/[0.02] ring-1 ring-white/5 overflow-hidden">
              {tools.map((t) => (
                <li key={t.id} className="flex items-center gap-4 p-4">
                  <span className="text-2xl">{t.icon ?? '🧪'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold truncate">{t.title}</span>
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          t.status === 'published'
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : 'bg-amber-500/15 text-amber-300'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 font-mono truncate">/tools/{t.slug}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/tools/${t.slug}`}
                      target="_blank"
                      className="px-3 py-1 rounded-md text-xs bg-white/5 hover:bg-white/10"
                    >
                      Open
                    </Link>
                    <button
                      onClick={() => toggleStatus(t)}
                      className="px-3 py-1 rounded-md text-xs bg-white/5 hover:bg-white/10"
                    >
                      {t.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => deleteTool(t)}
                      className="px-3 py-1 rounded-md text-xs bg-rose-500/15 text-rose-300 hover:bg-rose-500/25"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
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
    <label className="block">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</span>
        {hint && <span className="text-[10px] text-gray-600">{hint}</span>}
      </div>
      {children}
    </label>
  )
}
