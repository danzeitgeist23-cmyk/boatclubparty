import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

export type Station = { key: string; name: string; url: string }

type RadioState = {
  station: Station | null
  playing: boolean
  error: boolean
  play: (s: Station) => void
  toggle: () => void
  stop: () => void
}

const RadioContext = createContext<RadioState | null>(null)

// El <audio> vive aquí (nivel App), no en /music: la radio no se corta al navegar.
export function RadioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [station, setStation] = useState<Station | null>(null)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'none'
    audio.onplaying = () => { setPlaying(true); setError(false) }
    audio.onpause = () => setPlaying(false)
    audio.onerror = () => { setPlaying(false); setError(true) }
    audioRef.current = audio
    return () => { audio.pause(); audio.src = '' }
  }, [])

  const play = (s: Station) => {
    const audio = audioRef.current
    if (!audio) return
    setStation(s)
    setError(false)
    if (audio.src !== s.url) audio.src = s.url
    audio.play().catch(() => setError(true))
  }

  const toggle = () => {
    const audio = audioRef.current
    if (!audio || !station) return
    if (playing) audio.pause()
    else audio.play().catch(() => setError(true))
  }

  const stop = () => {
    const audio = audioRef.current
    if (audio) { audio.pause(); audio.src = '' }
    setStation(null)
    setPlaying(false)
  }

  return (
    <RadioContext.Provider value={{ station, playing, error, play, toggle, stop }}>
      {children}
    </RadioContext.Provider>
  )
}

export function useRadio(): RadioState {
  const ctx = useContext(RadioContext)
  if (!ctx) throw new Error('useRadio must be used inside RadioProvider')
  return ctx
}
