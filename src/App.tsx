import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { NavIsland } from './components/NavIsland'
import './App.css'

function formatClock(date: Date) {
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const [clock, setClock] = useState(() => formatClock(new Date()))
  const [soundOn, setSoundOn] = useState(false)

  const onPointerMove = useEffectEvent((event: PointerEvent) => {
    const hero = heroRef.current
    if (!hero) return

    const { innerWidth, innerHeight } = window
    const x = (event.clientX / innerWidth - 0.5) * 18
    const y = (event.clientY / innerHeight - 0.5) * 12
    hero.style.setProperty('--mouse-x-offset', `${x.toFixed(2)}px`)
    hero.style.setProperty('--mouse-y-offset', `${y.toFixed(2)}px`)
  })

  useEffect(() => {
    const tick = window.setInterval(() => {
      setClock(formatClock(new Date()))
    }, 1000)

    return () => window.clearInterval(tick)
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return

    window.addEventListener('pointermove', onPointerMove)
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [onPointerMove])

  const toggleSound = () => {
    const video = videoRef.current
    if (!video) return

    const next = !soundOn
    video.muted = !next
    setSoundOn(next)
  }

  return (
    <>
      <NavIsland soundOn={soundOn} onToggleSound={toggleSound} />

      <main>
        <section className="hero" ref={heroRef} aria-label="Hero">
          <div className="hero__topbar">
            <span className="hero__clock">{clock}</span>
            <button
              type="button"
              className="hero__sound"
              aria-pressed={soundOn}
              onClick={toggleSound}
            >
              <span
                className="hero__sound-dot"
                data-on={soundOn}
                aria-hidden="true"
              />
              sound
            </button>
          </div>

          <div className="hero__frame">
            <video
              ref={videoRef}
              className="hero__video"
              src="/hero.mp4"
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>

          <p className="hero__identity">moje życie to koszmar</p>
        </section>
      </main>
    </>
  )
}

export default App
