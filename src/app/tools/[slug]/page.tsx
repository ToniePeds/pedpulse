/* ----------------------------------------------------------------
   app/tools/[slug]/page.tsx
   Public viewer for an admin-uploaded HTML tool.

   Rendering strategy:
   We fetch the HTML server-side and inline it into the iframe via
   `srcDoc` instead of pointing `src` at the Supabase storage URL.
   Reason: Supabase Storage is unreliable about honoring the
   Content-Type on uploaded objects — some files end up served as
   text/plain, which makes the iframe display source code instead
   of rendering. srcDoc sidesteps that entirely.

   Security note:
   The uploaded HTML is rendered inside an <iframe> with
   sandbox="allow-scripts" only — NO allow-same-origin. This means
   the iframe gets a unique opaque origin and cannot read any
   PedsPulse cookies, localStorage, or DOM. Even if a malicious
   HTML file slips through admin upload, it can't exfiltrate auth
   state. Tools that need localStorage will not work — that's the
   tradeoff for the security boundary.
---------------------------------------------------------------- */
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export const revalidate = 60 // ISR — cheap, refreshes new uploads within a minute

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const { data } = await supabase
    .from('tools')
    .select('title, description')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  return {
    title: data?.title ? `${data.title} · PedsPulse Tools` : 'Tool · PedsPulse',
    description: data?.description ?? undefined,
  }
}

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params

  const { data: tool, error } = await supabase
    .from('tools')
    .select('id, slug, title, description, tag, icon, html_url, status')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error || !tool) notFound()

  // Fetch the HTML server-side so we can inline it via srcDoc.
  // This avoids Supabase Storage content-type surprises (see file header).
  let html: string | null = null
  try {
    const res = await fetch(tool.html_url, { next: { revalidate: 60 } })
    if (res.ok) html = await res.text()
  } catch {
    html = null
  }

  return (
    <div className="min-h-screen bg-base text-foreground flex flex-col">
      {/* Slim header */}
      <header className="border-b border-border backdrop-blur-md bg-base/80 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              href="/tools"
              className="flex items-center gap-1 text-gray-400 hover:text-teal-300 text-sm shrink-0"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              All Tools
            </Link>
            <span className="text-gray-700">|</span>
            <div className="flex items-center gap-2 min-w-0">
              {tool.icon && <span className="text-xl shrink-0">{tool.icon}</span>}
              <h1 className="font-bold truncate">{tool.title}</h1>
              {tool.tag && (
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-teal-400/15 text-teal-300 shrink-0">
                  {tool.tag}
                </span>
              )}
            </div>
          </div>
          <Link href="/" className="text-teal-300 font-bold text-sm shrink-0">
            PedsPulse
          </Link>
        </div>
        {tool.description && (
          <div className="max-w-7xl mx-auto px-6 pb-3 text-xs text-gray-500">
            {tool.description}
          </div>
        )}
      </header>

      {/* Sandboxed tool iframe — srcDoc when we have the HTML, src as fallback */}
      {html ? (
        <iframe
          srcDoc={html}
          title={tool.title}
          className="flex-1 w-full border-0 bg-white"
          sandbox="allow-scripts"
          referrerPolicy="no-referrer"
          loading="eager"
        />
      ) : (
        <iframe
          src={tool.html_url}
          title={tool.title}
          className="flex-1 w-full border-0 bg-white"
          sandbox="allow-scripts"
          referrerPolicy="no-referrer"
          loading="eager"
        />
      )}
    </div>
  )
}
