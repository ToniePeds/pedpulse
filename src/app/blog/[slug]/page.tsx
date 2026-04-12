/* ----------------------------------------------------------------
   app/blog/[slug]/page.tsx
   Public Medium-style article page. Server component, ISR.
---------------------------------------------------------------- */
import Link from 'next/link'
import Image from 'next/image'
import SiteHeaderWrapper from '@/components/SiteHeaderWrapper'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

type Post = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  excerpt: string | null
  tag: string | null
  cover_image_url: string | null
  content_html: string
  reading_time_min: number | null
  published_at: string | null
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const { data } = await supabase.from('posts').select('title, excerpt, cover_image_url').eq('slug', slug).eq('status', 'published').maybeSingle()
  if (!data) return { title: 'Post not found · PedsPulse' }
  return {
    title: `${data.title} · PedsPulse`,
    description: data.excerpt ?? undefined,
    openGraph: { title: data.title, description: data.excerpt ?? undefined, images: data.cover_image_url ? [data.cover_image_url] : undefined },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const { data: post, error } = await supabase
    .from('posts')
    .select('id, slug, title, subtitle, excerpt, tag, cover_image_url, content_html, reading_time_min, published_at')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error || !post) notFound()
  const p = post as Post

  return (
    <div className="min-h-screen bg-base text-foreground flex flex-col">
      <SiteHeaderWrapper active="/blog" />

      <article className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        {p.tag && (
          <Link href="/blog" className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-rose-500/15 text-rose-400 mb-6">
            {p.tag}
          </Link>
        )}

        <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight">{p.title}</h1>

        {p.subtitle && <p className="mt-4 text-xl text-muted leading-relaxed">{p.subtitle}</p>}

        <div className="mt-6 flex items-center gap-4 text-sm text-faint pb-8 border-b border-border">
          {p.published_at && <span>{new Date(p.published_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>}
          {p.reading_time_min && (
            <>
              <span>·</span>
              <span>{p.reading_time_min} min read</span>
            </>
          )}
        </div>

        {p.cover_image_url && (
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mt-8 bg-surface">
            <Image src={p.cover_image_url} alt={p.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" priority />
          </div>
        )}

        <div
          className="prose prose-lg max-w-none mt-10
                     dark:prose-invert
                     prose-headings:font-extrabold prose-headings:tracking-tight
                     prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
                     prose-h3:text-2xl prose-h3:mt-8
                     prose-p:leading-relaxed
                     prose-a:text-teal-500 dark:prose-a:text-teal-300 prose-a:no-underline hover:prose-a:underline
                     prose-blockquote:border-l-rose-400
                     prose-code:text-teal-500 dark:prose-code:text-teal-300 prose-code:bg-surface prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                     prose-pre:bg-surface prose-pre:ring-1 prose-pre:ring-border
                     prose-img:rounded-xl
                     prose-hr:border-border"
          dangerouslySetInnerHTML={{ __html: p.content_html }}
        />

        <div className="mt-16 pt-8 border-t border-border flex items-center justify-between text-sm">
          <Link href="/blog" className="text-muted hover:text-teal-400 transition-colors">← More posts</Link>
          <Link href="/#newsletter" className="text-teal-400 hover:text-teal-300 transition-colors">Get updates →</Link>
        </div>
      </article>

      <footer className="py-6 text-center text-xs text-faint border-t border-border">
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> PedsPulse
      </footer>
    </div>
  )
}
