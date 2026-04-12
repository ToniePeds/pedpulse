// app/page.tsx — PedsPulse landing page
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import NewsletterForm from '@/components/NewsletterForm'
import SiteHeader from '@/components/SiteHeader'
import HeroVitals from '@/components/landing/HeroVitals'
import RotatingTagline from '@/components/landing/RotatingTagline'
import { supabase } from '@/lib/supabaseClient'

type LatestEpisode = {
  id: string
  title: string
  slug: string
  summary_md: string | null
  cover_image_url: string | null
  duration: string | null
  tag: string | null
  published_at: string | null
}

type LivePost = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  tag: string | null
  cover_image_url: string | null
  reading_time_min: number | null
  published_at: string | null
}

type LiveTool = {
  slug: string
  title: string
  description: string | null
  icon: string | null
  tag: string | null
}

export default function LandingPage() {
  const [latest, setLatest] = useState<LatestEpisode | null>(null)
  const [livePosts, setLivePosts] = useState<LivePost[]>([])
  const [liveTools, setLiveTools] = useState<LiveTool[]>([])

  useEffect(() => {
    supabase
      .from('episodes')
      .select('id, title, slug, summary_md, cover_image_url, duration, tag, published_at')
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setLatest(data as LatestEpisode | null))

    supabase
      .from('posts')
      .select('id, slug, title, excerpt, tag, cover_image_url, reading_time_min, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(3)
      .then(({ data }) => setLivePosts((data as LivePost[] | null) ?? []))

    supabase
      .from('tools')
      .select('slug, title, description, icon, tag')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => setLiveTools((data as LiveTool[] | null) ?? []))
  }, [])

  return (
    <main className="min-h-screen bg-base text-foreground flex flex-col overflow-x-hidden">
      <SiteHeader />

      {/* ─────────── Hero ─────────── */}
      <section className="relative">
        {/* Ambient gradient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        >
          <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] -translate-x-1/2 rounded-full bg-teal-500/20 blur-[120px] animate-blob" />
          <div className="absolute top-20 right-0 w-[36rem] h-[36rem] rounded-full bg-fuchsia-500/15 blur-[120px] animate-blob" style={{ animationDelay: '-5s' }} />
          <div className="absolute top-40 left-10 w-[28rem] h-[28rem] rounded-full bg-amber-400/10 blur-[120px] animate-blob" style={{ animationDelay: '-9s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-surface text-teal-300 ring-1 ring-teal-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-vital" />
              Live · 24 episodes · 9 tools
            </span>

            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Pediatrics with a{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-fuchsia-300 bg-clip-text text-transparent">
                  pulse.
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 200 10" preserveAspectRatio="none">
                  <path d="M2 6 Q 50 0 100 6 T 198 6" fill="none" stroke="#FB7185" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="mt-6 text-muted max-w-xl text-base sm:text-lg leading-relaxed">
              Bite-size clinical pearls, deep-dive blog posts, and interactive tools for residents,
              students, and the chronically curious. Made by Dr. Rashid — pediatric resident
              fueled by love &amp; caffeine.
            </p>

            <div className="mt-4">
              <RotatingTagline />
            </div>

            <div className="mt-8 flex gap-3 flex-col sm:flex-row">
              <Link
                href="/episodes"
                className="group relative inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-[#04131A] font-bold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 hover:scale-[1.02] transition"
              >
                🎧 Listen to Episodes
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl border border-fuchsia-400/40 text-fuchsia-300 dark:text-fuchsia-200 hover:bg-fuchsia-500/10 font-semibold transition"
              >
                📝 Read the Blog
              </Link>
              <a
                href="#newsletter"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-muted hover:text-foreground font-medium transition"
              >
                or get updates →
              </a>
            </div>

            {/* Trust strip */}
            <div className="mt-10 flex items-center gap-6 text-xs text-faint">
              <span>Trusted by residents at</span>
              <span className="text-muted font-semibold">AKU</span>
              <span className="text-muted font-semibold">MUHAS</span>
              <span className="text-muted font-semibold">KCMC</span>
            </div>
          </div>

          {/* Right: animated vitals monitor */}
          <div className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <HeroVitals />
          </div>
        </div>

        <Squiggle color="#2DD4BF" />
      </section>

      {/* ─────────── Fresh from the Ward (Blog preview) ─────────── */}
      <section className="relative py-20 bg-base-alt">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading kicker="From the desk" title="Fresh from the Ward" color="#FB7185" blurb="Long-form takes on the topics burning through pediatrics this week." />

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {livePosts.length > 0
              ? livePosts.map((p, i) => <LiveBlogCard key={p.id} post={p} delay={i * 0.08} />)
              : <div className="col-span-full p-10 rounded-2xl bg-card ring-1 ring-border text-center text-muted">Blog posts coming soon…</div>}
          </div>

          <div className="mt-10 text-center">
            <Link href="/blog" className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all" style={{ color: '#FB7185' }}>
              See all posts →
            </Link>
          </div>
        </div>
        <Squiggle color="#FB7185" />
      </section>

      {/* ─────────── Try a Tool ─────────── */}
      <section className="relative py-20 bg-base">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading kicker="Hands-on" title="Try a Tool" color="#FBBF24" blurb="Interactive calculators, walkthroughs, and case simulators. Built for the bedside." />

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveTools.length > 0
              ? liveTools.map((t, i) => <LiveToolCard key={t.slug} tool={t} delay={i * 0.08} />)
              : <div className="col-span-full p-10 rounded-2xl bg-card ring-1 ring-border text-center text-muted">Tools coming soon…</div>}
          </div>

          <div className="mt-10 text-center">
            <Link href="/tools" className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all" style={{ color: '#FBBF24' }}>
              Explore all tools →
            </Link>
          </div>
        </div>
        <Squiggle color="#FBBF24" />
      </section>

      {/* ─────────── Latest Episode strip ─────────── */}
      <section className="relative py-20 bg-base-alt">
        <div className="max-w-5xl mx-auto px-6">
          <SectionHeading kicker="Now playing" title="Latest Episode" color="#A78BFA" blurb="Press play. Take notes later." />

          <div className="mt-12">
            {latest ? (
              <Link
                href={`/episodes/${latest.slug}`}
                className="group flex flex-col md:flex-row gap-6 p-5 rounded-2xl bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-500/10 ring-1 ring-violet-400/20 hover:ring-violet-400/50 transition"
              >
                <div className="relative w-full md:w-56 aspect-video md:aspect-square rounded-xl overflow-hidden bg-surface shrink-0">
                  {latest.cover_image_url ? (
                    <Image
                      src={latest.cover_image_url}
                      alt={latest.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 224px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🎙️</div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition">
                    <div className="w-14 h-14 rounded-full bg-violet-400 flex items-center justify-center text-[#04131A] text-2xl">▶</div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  {latest.tag && (
                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-violet-400/20 text-violet-300">
                      {latest.tag}
                    </span>
                  )}
                  <h3 className="mt-2 text-2xl font-bold group-hover:text-violet-300 transition">{latest.title}</h3>
                  {latest.summary_md && <p className="mt-2 text-muted line-clamp-3">{latest.summary_md}</p>}
                  <div className="mt-4 flex items-center gap-3 text-xs text-faint">
                    {latest.duration && <span>⏱ {latest.duration}</span>}
                    {latest.published_at && <span>· {new Date(latest.published_at).toLocaleDateString()}</span>}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="p-10 rounded-2xl bg-card ring-1 ring-border text-center text-muted">
                Loading the latest pulse…
              </div>
            )}
          </div>
        </div>
        <Squiggle color="#A78BFA" />
      </section>

      {/* ─────────── Newsletter ─────────── */}
      <section id="newsletter" className="relative py-20 bg-base">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <SectionHeading kicker="The Pulse" title="Stay in the Loop" color="#6EE7B7" blurb="One short email when something new drops. No spam, no pharma reps, no guilt." center />
          <div className="mt-10">
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* ─────────── Footer ─────────── */}
      <footer className="py-8 text-center text-xs text-faint border-t border-border">
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> PedsPulse · Built with ❤️, ☕, and questionable sleep.
      </footer>
    </main>
  )
}

/* ────────────────────────────────────────────────
   Local helper components
   ──────────────────────────────────────────────── */

function SectionHeading({ kicker, title, blurb, color, center = false }: { kicker: string; title: string; blurb?: string; color: string; center?: boolean }) {
  return (
    <div className={center ? 'text-center' : ''}>
      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: `${color}20`, color }}>
        {kicker}
      </span>
      <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">{title}</h2>
      {blurb && <p className={`mt-3 text-muted max-w-xl ${center ? 'mx-auto' : ''}`}>{blurb}</p>}
    </div>
  )
}

function Squiggle({ color }: { color: string }) {
  return (
    <div className="w-full overflow-hidden leading-none -mb-px" aria-hidden>
      <svg viewBox="0 0 1200 30" preserveAspectRatio="none" className="w-full h-6 opacity-30">
        <path d="M0,15 Q150,0 300,15 T600,15 T900,15 T1200,15" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function LiveBlogCard({ post, delay }: { post: LivePost; delay: number }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group relative rounded-2xl overflow-hidden bg-card ring-1 ring-border hover:ring-rose-400/40 hover:-translate-y-1 transition-all animate-fade-up flex flex-col" style={{ animationDelay: `${delay}s` }}>
      <div className="relative h-40 bg-gradient-to-br from-rose-500/20 to-fuchsia-500/10">
        {post.cover_image_url ? (
          <Image src={post.cover_image_url} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl">📝</div>
        )}
        {post.tag && <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-glass text-foreground backdrop-blur">{post.tag}</span>}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold leading-snug group-hover:text-rose-300 transition">{post.title}</h3>
        {post.excerpt && <p className="mt-2 text-sm text-muted line-clamp-3 flex-1">{post.excerpt}</p>}
        <div className="mt-4 flex items-center justify-between text-xs text-faint">
          <span>{post.published_at ? new Date(post.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}</span>
          {post.reading_time_min && <span>{post.reading_time_min} min read</span>}
        </div>
      </div>
    </Link>
  )
}

const TOOL_ACCENTS = ['#38BDF8', '#FBBF24', '#F472B6', '#2DD4BF', '#A78BFA', '#FB923C']

function LiveToolCard({ tool, delay }: { tool: LiveTool; delay: number }) {
  const accent = TOOL_ACCENTS[tool.slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % TOOL_ACCENTS.length]
  return (
    <Link href={`/tools/${tool.slug}`} className="group relative rounded-2xl p-6 bg-card ring-1 ring-border hover:-translate-y-1 transition-all animate-fade-up overflow-hidden" style={{ animationDelay: `${delay}s` }}>
      <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity" style={{ backgroundColor: accent }} />
      <div className="relative w-12 h-12 rounded-xl flex items-center justify-center text-2xl ring-1" style={{ backgroundColor: `${accent}20`, borderColor: accent }}>{tool.icon ?? '🧪'}</div>
      <h3 className="relative mt-4 text-lg font-bold">{tool.title}</h3>
      <p className="relative mt-2 text-sm text-muted">{tool.description ?? ''}</p>
      <div className="relative mt-5 text-xs font-semibold opacity-0 group-hover:opacity-100 transition" style={{ color: accent }}>Launch tool →</div>
    </Link>
  )
}
