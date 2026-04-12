/* ----------------------------------------------------------------
   app/about/page.tsx
   Who we are, why this exists, and where it's going.
---------------------------------------------------------------- */
'use client'

import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import NewsletterForm from '@/components/NewsletterForm'

const VALUES = [
  { title: 'Evidence First', blurb: 'Every episode, post, and tool is rooted in the latest guidelines — ISPAD, AAP, WHO, and the research that shapes real wards.', icon: '🔬', accent: '#2DD4BF' },
  { title: 'Story-Led Learning', blurb: "Dry bullet-points don't stick at 3 AM. We wrap concepts in clinical stories because that's how the brain actually retains information.", icon: '📖', accent: '#FB7185' },
  { title: 'Built for the Bedside', blurb: 'Fluid calculators, DKA simulators, quick-reference tools — things you can actually pull up mid-round without embarrassment.', icon: '🩺', accent: '#A78BFA' },
  { title: 'Free & Open', blurb: 'No paywalls, no pharma sponsorships, no guilt-trip popups. Pediatric education should be accessible to every resident on every ward.', icon: '🌍', accent: '#FBBF24' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-base text-foreground flex flex-col">
      <SiteHeader active="/about" />

      {/* Hero */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[36rem] h-[36rem] -translate-x-1/2 rounded-full bg-teal-500/15 blur-[120px]" />
          <div className="absolute top-20 right-10 w-[28rem] h-[28rem] rounded-full bg-fuchsia-500/10 blur-[120px]" />
        </div>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-teal-400 text-sm font-semibold tracking-widest uppercase mb-4">About PedsPulse</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
            Pediatrics education that
            <span className="bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent"> doesn&apos;t put you to sleep</span>.
          </h1>
          <p className="mt-6 text-lg text-muted leading-relaxed max-w-2xl mx-auto">
            PedsPulse started as a side project between call shifts — a place to turn clinical
            chaos into something teachable. It grew into a podcast, a blog, and a set of
            bedside tools that residents actually use. No corporate sponsors, no paywall,
            just pediatrics the way it should be taught.
          </p>
        </div>
      </section>

      {/* The Person */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl bg-card ring-1 ring-border p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400/20 to-fuchsia-400/20 ring-1 ring-border flex items-center justify-center text-4xl shrink-0">👨‍⚕️</div>
              <div>
                <h2 className="text-2xl font-extrabold">Dr. Rashid</h2>
                <p className="mt-1 text-sm text-teal-400 font-medium">Pediatrics Resident &middot; Aga Khan University</p>
                <p className="mt-4 text-muted leading-relaxed">
                  Ward rounds, call nights, morning handovers — and somewhere in between,
                  building the tools and content I wish I&apos;d had as an intern. PedsPulse is
                  my way of making pediatric medicine more human, more accessible, and honestly,
                  a little more fun.
                </p>
                <p className="mt-3 text-faint leading-relaxed">
                  Everything here is written, coded, and curated by hand. If you find something
                  useful or spot something wrong, reach out — the best learning happens in conversation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-rose-500/15 text-rose-400">What We Believe</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">Principles, Not Just Content</h2>
            <p className="mt-3 text-muted max-w-xl mx-auto">Four commitments that shape everything we publish.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {VALUES.map((v) => (
              <div key={v.title} className="group relative p-6 rounded-2xl bg-card ring-1 ring-border hover:-translate-y-1 transition-all overflow-hidden">
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition" style={{ backgroundColor: v.accent }} />
                <div className="relative w-12 h-12 rounded-xl flex items-center justify-center text-2xl ring-1" style={{ backgroundColor: `${v.accent}20`, borderColor: v.accent }}>{v.icon}</div>
                <h3 className="relative mt-4 text-xl font-bold">{v.title}</h3>
                <p className="relative mt-2 text-sm text-muted leading-relaxed">{v.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Inside */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-500/15 text-amber-400">What You&apos;ll Find</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">Podcast. Blog. Tools.</h2>
          <p className="mt-3 text-muted max-w-xl mx-auto">Three formats, one mission: make pediatric learning stick.</p>
          <div className="mt-10 grid sm:grid-cols-3 gap-6 text-left">
            <Link href="/episodes" className="p-6 rounded-2xl bg-card ring-1 ring-border hover:ring-teal-400/30 transition-all group">
              <div className="text-3xl mb-3">🎙️</div>
              <h3 className="font-bold text-lg group-hover:text-teal-400 transition">Episodes</h3>
              <p className="mt-2 text-sm text-muted">Short, punchy deep-dives into the cases and controversies you&apos;ll actually face on the ward.</p>
            </Link>
            <Link href="/blog" className="p-6 rounded-2xl bg-card ring-1 ring-border hover:ring-rose-400/30 transition-all group">
              <div className="text-3xl mb-3">📝</div>
              <h3 className="font-bold text-lg group-hover:text-rose-400 transition">Blog</h3>
              <p className="mt-2 text-sm text-muted">Long-form takes on topics burning through pediatrics this week. Written between shifts, edited after coffee.</p>
            </Link>
            <Link href="/tools" className="p-6 rounded-2xl bg-card ring-1 ring-border hover:ring-amber-400/30 transition-all group">
              <div className="text-3xl mb-3">🧪</div>
              <h3 className="font-bold text-lg group-hover:text-amber-400 transition">Tools</h3>
              <p className="mt-2 text-sm text-muted">Interactive calculators and simulators you can pull up mid-round. Runs in-browser, no install.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="py-20 px-6">
        <div className="max-w-lg mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-500/15 text-emerald-400">The Pulse</span>
          <h2 className="mt-3 text-3xl font-extrabold">Stay in the Loop</h2>
          <p className="mt-3 text-muted">One short email when something new drops. No spam, no pharma reps, no guilt.</p>
          <div className="mt-8"><NewsletterForm /></div>
        </div>
      </section>

      <footer className="py-8 text-center text-xs text-faint border-t border-border">
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> PedsPulse · Built with ❤️, ☕, and questionable sleep.
      </footer>
    </div>
  )
}
