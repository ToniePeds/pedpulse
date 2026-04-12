// components/landing/HeroVitals.tsx
// Animated SVG "vitals monitor" — ECG sweep + ticking SpO2 / HR readouts.
// Pure SVG + CSS keyframes (defined in globals.css). No new dependencies.
'use client'

import { useEffect, useState } from 'react'

export default function HeroVitals() {
  const [hr, setHr] = useState(118)
  const [spo2, setSpo2] = useState(98)

  // Tiny "live" jitter so the readouts feel alive without being noisy.
  useEffect(() => {
    const id = setInterval(() => {
      setHr((v) => {
        const next = v + (Math.random() > 0.5 ? 1 : -1)
        return Math.min(132, Math.max(108, next))
      })
      setSpo2((v) => {
        const next = v + (Math.random() > 0.7 ? 1 : -1) * (Math.random() > 0.8 ? 1 : 0)
        return Math.min(100, Math.max(96, next))
      })
    }, 900)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Soft glow blobs behind the monitor */}
      <div
        aria-hidden
        className="absolute -top-10 -left-10 w-56 h-56 rounded-full bg-teal-500/20 blur-3xl animate-blob"
      />
      <div
        aria-hidden
        className="absolute -bottom-12 -right-8 w-56 h-56 rounded-full bg-fuchsia-500/20 blur-3xl animate-blob"
        style={{ animationDelay: '-7s' }}
      />

      {/* Monitor frame */}
      <div className="relative rounded-3xl border border-teal-400/30 bg-gradient-to-br from-[#0B1220] to-[#0A0F1C] p-5 shadow-[0_0_60px_-15px_rgba(45,212,191,0.45)] backdrop-blur">
        {/* Top bar: device label + pulse dot */}
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-teal-300/70">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-vital" />
            PedsPulse Monitor
          </span>
          <span className="text-gray-500">Bay 4 · Room 12</span>
        </div>

        {/* ECG strip */}
        <div className="mt-3 rounded-xl bg-black/40 p-3 ring-1 ring-teal-400/10">
          <svg viewBox="0 0 400 110" className="w-full h-28">
            {/* Faint grid */}
            <defs>
              <pattern id="grid" width="20" height="22" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 22" fill="none" stroke="#1F2937" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="400" height="110" fill="url(#grid)" />

            {/* The ECG waveform itself */}
            <path
              d="M0,55 L40,55 L55,55 L60,40 L65,75 L70,20 L75,90 L80,55 L130,55 L145,55 L150,40 L155,75 L160,20 L165,90 L170,55 L220,55 L235,55 L240,40 L245,75 L250,20 L255,90 L260,55 L310,55 L325,55 L330,40 L335,75 L340,20 L345,90 L350,55 L400,55"
              fill="none"
              stroke="#2DD4BF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-ecg drop-shadow-[0_0_6px_rgba(45,212,191,0.6)]"
            />
          </svg>
        </div>

        {/* Readouts */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Readout label="HR" value={hr} unit="bpm" color="text-emerald-300" />
          <Readout label="SpO₂" value={spo2} unit="%" color="text-amber-300" />
          <Readout label="RR" value={32} unit="/min" color="text-fuchsia-300" />
        </div>
      </div>
    </div>
  )
}

function Readout({
  label,
  value,
  unit,
  color,
}: {
  label: string
  value: number
  unit: string
  color: string
}) {
  return (
    <div className="rounded-lg bg-black/40 px-3 py-2 ring-1 ring-white/5">
      <div className="text-[9px] uppercase tracking-wider text-gray-400">{label}</div>
      <div className={`font-mono text-2xl font-bold ${color} tabular-nums`}>
        {value}
        <span className="ml-1 text-[10px] font-normal text-gray-500">{unit}</span>
      </div>
    </div>
  )
}
