// lib/postUtils.ts
// Helpers for derived blog post fields. Browser-only (uses DOM).

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

/** Strip HTML tags and return plain text. Browser-only. */
function plainText(html: string): string {
  if (typeof document === 'undefined') return html.replace(/<[^>]*>/g, ' ')
  const div = document.createElement('div')
  div.innerHTML = html
  return (div.textContent || '').replace(/\s+/g, ' ').trim()
}

/** Estimate reading time in minutes (~200 wpm), minimum 1. */
export function readingTimeMin(html: string): number {
  const words = plainText(html).split(' ').filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

/** First ~180 plain-text characters, ending on a word boundary. */
export function makeExcerpt(html: string, max = 180): string {
  const txt = plainText(html)
  if (txt.length <= max) return txt
  return txt.slice(0, max).replace(/\s+\S*$/, '') + '…'
}
