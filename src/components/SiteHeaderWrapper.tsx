/* Thin client wrapper so server components can use SiteHeader. */
'use client'

import SiteHeader from './SiteHeader'

export default function SiteHeaderWrapper({ active }: { active?: string }) {
  return <SiteHeader active={active} />
}
