import Link from 'next/link'

type Episode = {
  id: string
  title: string
  slug: string
}

export default function RelatedEpisodes({
  episodes,
}: {
  episodes: Episode[]
}) {
  if (episodes.length === 0) return null

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Related Episodes</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {episodes.map((ep) => (
          <Link
            key={ep.id}
            href={`/episodes/${ep.slug}`}
            className="block p-4 border rounded-lg hover:shadow-lg transition"
          >
            <h3 className="font-medium">{ep.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  )
}
