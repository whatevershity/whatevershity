import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { PrimerButton } from './PrimerButton'
import './NavIsland.css'

const LINKS = [
  { href: '#', label: 'home' },
  { href: '#', label: 'about' },
  { href: '#', label: 'work' },
  { href: '#', label: 'contact' },
]

type NavIslandProps = {
  soundOn: boolean
  onToggleSound: () => void
}

function measure(mobile: boolean) {
  const root = parseFloat(getComputedStyle(document.documentElement).fontSize)
  const viewport = window.innerWidth
  return {
    closedW: (mobile ? 13 : 16) * root,
    closedH: 2.6 * root,
    closedR: 1.3 * root,
    openW: mobile
      ? Math.min(viewport - 2 * root, 26 * root)
      : 22 * root,
    openH: (mobile ? 30 : 27) * root,
    openR: 1.6 * root,
  }
}

export function NavIsland({ soundOn, onToggleSound }: NavIslandProps) {
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState<'pl' | 'en'>('pl')
  const islandRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  const animateTo = useEffectEvent((nextOpen: boolean) => {
    const island = islandRef.current
    if (!island) return

    const mobile = window.matchMedia('(max-width: 600px)').matches
    const size = measure(mobile)
    tweenRef.current?.kill()

    tweenRef.current = gsap.to(island, {
      width: nextOpen ? size.openW : size.closedW,
      height: nextOpen ? size.openH : size.closedH,
      borderRadius: nextOpen ? size.openR : size.closedR,
      duration: 0.8,
      ease: 'power3.inOut',
      overwrite: true,
    })
  })

  useLayoutEffect(() => {
    const island = islandRef.current
    if (!island) return
    const mobile = window.matchMedia('(max-width: 600px)').matches
    const size = measure(mobile)
    gsap.set(island, {
      width: size.closedW,
      height: size.closedH,
      borderRadius: size.closedR,
    })
  }, [])

  useEffect(() => {
    animateTo(open)
  }, [open, animateTo])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="nav-shell">
      <div
        className="nav-overlay"
        data-open={open}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <div className="nav-bar nav-bar--left">
        <PrimerButton onClick={() => setOpen(false)}>contact</PrimerButton>
      </div>

      <div className="nav-bar nav-bar--right">
        <PrimerButton
          onClick={() => setLang((current) => (current === 'pl' ? 'en' : 'pl'))}
        >
          {lang}
        </PrimerButton>
      </div>

      <div
        ref={islandRef}
        className="nav-island"
        data-open={open}
        id="nav-panel"
      >
        <a
          href="#"
          className="nav-brand"
          onClick={() => setOpen(false)}
          aria-label="home"
        >
          <span className="nav-bracket">[</span>
          ws
          <span className="nav-bracket">]</span>
        </a>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="nav-panel"
          aria-label={open ? 'close menu' : 'open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="nav-toggle-label">{open ? 'close' : 'menu'}</span>
        </button>

        <button
          type="button"
          className="nav-music"
          aria-pressed={soundOn}
          onClick={onToggleSound}
        >
          <span
            className="nav-music-dot"
            data-on={soundOn}
            aria-hidden="true"
          />
          sound
        </button>

        <nav className="nav-links" aria-label="menu">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-link"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-social">
          <a
            className="nav-social-link"
            href="#"
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
          >
            github
          </a>
          <a
            className="nav-social-link"
            href="#"
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
          >
            ig
          </a>
        </div>
      </div>
    </div>
  )
}
