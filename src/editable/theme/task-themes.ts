import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const EDITORIAL_FONT = "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif"

const base = {
  dark: false,
  fontDisplay: EDITORIAL_FONT,
  fontBody: EDITORIAL_FONT,
  bg: '#0B0909',
  surface: '#121817',
  raised: '#2E4540',
  text: '#B5B9F0',
  muted: 'rgba(181,185,240,0.68)',
  line: 'rgba(181,185,240,0.18)',
  accent: '#408175',
  accentSoft: 'rgba(64,129,117,0.22)',
  onAccent: '#0B0909',
  glow: 'rgba(64,129,117,0.22)',
  radius: '0.55rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Articles', note: 'In-depth reads, guides, and stories worth your time.' },
  listing: { ...base, kicker: 'Businesses', note: 'Find, compare, and connect with local businesses.' },
  classified: { ...base, kicker: 'Marketplace', note: 'Fresh offers and listings, ready to act on.' },
  image: { ...base, kicker: 'Photos', note: 'A visual feed of standout images and galleries.' },
  sbm: { ...base, kicker: 'Bookmarks', note: 'Curated resources and links worth saving.' },
  pdf: { ...base, kicker: 'Documents', note: 'Downloadable guides, reports, and references.' },
  profile: { ...base, kicker: 'People', note: 'Discover creators, businesses, and profiles.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
