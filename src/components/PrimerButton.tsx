import { useState, type ButtonHTMLAttributes, type CSSProperties } from 'react'
import { randomHoverColor } from '../colors'
import './PrimerButton.css'

type PrimerButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  random?: boolean
}

export function PrimerButton({
  random = true,
  className = '',
  style,
  children,
  ...props
}: PrimerButtonProps) {
  const [hoverColor] = useState(() => (random ? randomHoverColor().bg : null))

  const mergedStyle: CSSProperties = {
    ...style,
    ...(hoverColor ? { ['--hover-color' as string]: hoverColor } : null),
  }

  return (
    <button
      type="button"
      className={`primer${random ? ' primer--random' : ''}${className ? ` ${className}` : ''}`}
      style={mergedStyle}
      {...props}
    >
      {children}
    </button>
  )
}
