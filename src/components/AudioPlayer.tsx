// a simple styled HTML5 player
export default function AudioPlayer({ src }: { src: string }) {
  if (!src) return null
  return (
    <audio
      controls
      src={src}
      preload="metadata"
      className="w-full rounded-lg bg-gray-100 dark:bg-gray-800"
    />
  )
}
