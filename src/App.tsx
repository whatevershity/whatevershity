import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { NavIsland } from './components/NavIsland'
import './App.css'

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const [soundOn, setSoundOn] = useState(false)
  const [playing, setPlaying] = useState(false)

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

  const togglePlayback = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  return (
    <>
      <NavIsland soundOn={soundOn} onToggleSound={toggleSound} />

      <main>
        <section className="hero" ref={heroRef} aria-label="Hero">
          <div className="hero__stage">
            <div className="hero__topbar">
              <button
                type="button"
                className="hero__sound"
                aria-pressed={soundOn}
                onClick={toggleSound}
              >
                sound?
              </button>
            </div>

            <div
              className={`hero__frame${playing ? ' is-playing' : ''}`}
              onClick={togglePlayback}
            >
              <video
                ref={videoRef}
                className="hero__video"
                src="/hero.mp4"
                muted
                loop
                playsInline
                preload="metadata"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              />

              <button
                type="button"
                className="hero__playback"
                aria-label={playing ? 'Pause video' : 'Play video'}
                onClick={(event) => {
                  event.stopPropagation()
                  togglePlayback()
                }}
              >
                <span className="hero__playback-icon" aria-hidden="true">
                  {playing ? (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <rect x="5" y="4" width="5" height="16" rx="1" />
                      <rect x="14" y="4" width="5" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      {/* Same height as pause bars (y 4→20); nudged right for optical center */}
                      <path d="M9 4v16l11-8z" />
                    </svg>
                  )}
                </span>
              </button>
            </div>

            <p className="hero__identity">moje życie to koszmar</p>
          </div>
        </section>
      </main>
    </>
  )
}

export default App
