'use client'

import Link from 'next/link'
import AuthButton from '@/components/AuthButton'

const TOOLS = [
  {
    slug: 'kawasaki_explainer',
    title: 'Kawasaki Disease',
    subtitle: 'Clinical Explainer',
    description: 'Fever for 5 days + strawberry tongue = panic. We break it down so you don\'t.',
    icon: '🫀',
    tag: 'Rheumatology',
    color: 'from-rose-500/20 to-rose-900/10 border-rose-500/30',
    tagColor: 'bg-rose-500/20 text-rose-300',
  },
  {
    slug: 'pedvent-sim-quiz',
    title: 'PedVent Sim',
    subtitle: 'Ventilator Quiz',
    description: 'Quiz yourself on vent settings before the ventilator quizzes you back. In the PICU. At 3am.',
    icon: '🫁',
    tag: 'Critical Care',
    color: 'from-blue-500/20 to-blue-900/10 border-blue-500/30',
    tagColor: 'bg-blue-500/20 text-blue-300',
  },
  {
    slug: 'sle_medications_pathogenesis',
    title: 'SLE',
    subtitle: 'Medications & Pathogenesis',
    description: 'Lupus: the disease that can look like literally anything. Let\'s make sense of the meds.',
    icon: '🦋',
    tag: 'Rheumatology',
    color: 'from-purple-500/20 to-purple-900/10 border-purple-500/30',
    tagColor: 'bg-purple-500/20 text-purple-300',
  },
  {
    slug: 't1dm_natural_history',
    title: 'Type 1 Diabetes',
    subtitle: 'The Hidden Journey',
    description: 'From silent beta-cell murder to clinical diagnosis — the full story your textbook skips.',
    icon: '🩸',
    tag: 'Endocrinology',
    color: 'from-amber-500/20 to-amber-900/10 border-amber-500/30',
    tagColor: 'bg-amber-500/20 text-amber-300',
  },
  {
    slug: 'vasculitis_vessel_size',
    title: 'Vasculitis',
    subtitle: 'Vessel Size Clinical Guide',
    description: 'Small, medium, large — vessel size matters. Like coffee. Sort your vasculitides here.',
    icon: '🔬',
    tag: 'Rheumatology',
    color: 'from-teal-500/20 to-teal-900/10 border-teal-500/30',
    tagColor: 'bg-teal-500/20 text-teal-300',
  },
  {
    slug: 'ventilator-waveforms-tutor',
    title: 'Ventilator Waveforms',
    subtitle: 'Interactive Tutor',
    description: 'Waveforms that look like modern art but mean life or death. We make them make sense.',
    icon: '📈',
    tag: 'Critical Care',
    color: 'from-cyan-500/20 to-cyan-900/10 border-cyan-500/30',
    tagColor: 'bg-cyan-500/20 text-cyan-300',
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[#050A12] text-white flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-teal-400 font-bold text-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 00-9 9v5a3 3 0 003 3h1a2 2 0 002-2v-4a2 2 0 00-2-2H5v-2a7 7 0 0114 0v2h-2a2 2 0 00-2 2v4a2 2 0 002 2h1a3 3 0 003-3v-5a9 9 0 00-9-9z" />
            </svg>
            PedsPulse
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/episodes" className="hover:text-teal-300">Episodes</Link>
            <Link href="/tools" className="text-teal-400 font-semibold">Tools</Link>
            <Link href="/about" className="hover:text-teal-300">About</Link>
            <AuthButton />
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-14 px-6 text-center">
        <p className="text-teal-400 text-sm font-semibold tracking-widest uppercase mb-3">Clinical Tools</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Learn by doing,<br />
          <span className="text-teal-400">not by suffering.</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-base">
          Interactive modules, quizzes, and explainers built for residents who don&apos;t have time to read a textbook but also can&apos;t afford to not know this stuff.
        </p>
      </section>

      {/* Tools Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-6 pb-16 w-full">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/view?src=/tools/${tool.slug}.html`}
              className={`group relative flex flex-col p-6 rounded-2xl border bg-gradient-to-br ${tool.color} hover:scale-[1.02] transition-transform duration-200`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{tool.icon}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${tool.tagColor}`}>
                  {tool.tag}
                </span>
              </div>
              <h2 className="text-xl font-bold">{tool.title}</h2>
              <p className="text-sm text-gray-400 font-medium mb-3">{tool.subtitle}</p>
              <p className="text-gray-300 text-sm flex-1">{tool.description}</p>
              <div className="mt-6 flex items-center gap-2 text-teal-400 text-sm font-semibold group-hover:gap-3 transition-all">
                Launch tool
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-gray-500 border-t border-gray-800">
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> PedsPulse • Built with ❤️ & caffeine
      </footer>
    </div>
  )
}
