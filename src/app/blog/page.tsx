/* ----------------------------------------------------------------
   app/blog/page.tsx
   Public blog index — published posts only. Server component, ISR.
---------------------------------------------------------------- */
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import SiteHeaderWrapper from '@/components/SiteHeaderWrapper'

export const revalidate = 60

type PostCard = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  excerpt: string | null
  tag: string | null
  cover_image_url: string | null
  reading_time_min: number | null
  published_at: string | null
}

export const metadata = {
  title: 'Blog · PedsPulse',
  description: 'Long-form takes on the topics burning through pediatrics this week.',
}

export default async function BlogIndexPage() {
  const { data } = await supabase
    .from('posts')
    .select('id, slug, title, subtitle, excerpt, tag, cover_image_url, reading_time_min, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const posts: PostCard[] = (data as PostCard[] | null) ?? []

  return (
    <div className="min-h-screen bg-base text-foreground flex flex-col">
      <SiteHeaderWrapper active="/blog" />

      {/* Hero */}
      <section className="py-16 px-6 text-center max-w-3xl mx-auto">
        <p className="text-rose-400 text-sm font-semibold tracking-widest uppercase mb-3">From the Desk</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Fresh from the <span className="text-rose-400">Ward</span>.
        </h1>
        <p className="text-muted text-base sm:text-lg">
          Long-form takes on the topics burning through pediatrics this week. Written between
          call shifts, edited after coffee.
        </p>
      </section>

      {/* Posts grid */}
      <main className="flex-1 max-w-6xl mx-auto px-6 pb-20 w-full">
        {posts.length === 0 ? (
          <div className="p-12 rounded-2xl bg-card ring-1 ring-border text-center text-muted">
            No posts yet — check back soon.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostPreview key={p.id} post={p} />
            ))}
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-xs text-faint border-t border-border">
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> PedsPulse · Built with ❤️ & caffeine
      </footer>
    </div>
  )
}

function PostPreview({ post }: { post: PostCard }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-card ring-1 ring-border hover:ring-rose-400/40 hover:-translate-y-1 transition-all"
    >
      <div className="relative aspect-[16/9] bg-gradient-to-br from-rose-500/20 to-fuchsia-500/10">
        {post.cover_image_url ? (
          <Image src={post.cover_image_url} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl">📝</div>
        )}
        {post.tag && (
          <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-glass backdrop-blur">{post.tag}</span>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h2 className="text-lg font-bold leading-snug group-hover:text-rose-400 transition">{post.title}</h2>
        {post.subtitle && <p className="mt-1 text-sm text-faint line-clamp-1">{post.subtitle}</p>}
        {post.excerpt && <p className="mt-3 text-sm text-muted line-clamp-3 flex-1">{post.excerpt}</p>}
        <div className="mt-4 flex items-center justify-between text-xs text-faint">
          <span>{post.published_at ? new Date(post.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
          {post.reading_time_min && <span>{post.reading_time_min} min read</span>}
        </div>
      </div>
    </Link>
  )
}
