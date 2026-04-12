// components/landing/RotatingTagline.tsx
// Rotates through a list of witty subheadings with a soft fade.
'use client'

import { useEffect, useState } from 'react'

const TAGLINES = [
  'Written between call shifts.',
  'Powered by caffeine and small humans.',
  'Evidence-based. Vibes-approved.',
  'Pediatrics, minus the textbook fatigue.',
  'For residents who learn at 2 AM.',
]

export default function RotatingTagline() {
  const [i, setI] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % TAGLINES.length), 4200)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="h-6 overflow-hidden">
      <p
        key={i}
        className="text-sm sm:text-base text-teal-300/80 italic animate-fade-up"
      >
        {TAGLINES[i]}
      </p>
    </div>
  )
}
