'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, UserPlus, LogIn, X, PlusCircle, LogOut, UserCircle2 } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Search', href: '/search' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)]/95 text-[var(--editable-nav-text)] shadow-[0_10px_30px_rgba(181,185,240,0.08)] backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[82px] w-full max-w-[var(--editable-container)] items-center gap-5 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3 pr-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-[8px] border border-[var(--slot4-accent)]/45 bg-[var(--slot4-surface-bg)] transition group-hover:border-[var(--slot4-accent)]">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
          </span>
          <span className="hidden min-w-0 md:block">
            <span className="editable-display block max-w-[220px] truncate text-2xl font-extrabold leading-none text-[#B5B9F0]">{SITE_CONFIG.name}</span>
          </span>
        </Link>

        <div className="hidden items-stretch gap-1 lg:flex">
          {navItems.slice(0, 5).map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center rounded-[6px] px-3 py-2 text-sm font-extrabold transition ${
                  active ? 'text-[var(--slot4-page-text)]' : 'text-[var(--slot4-page-text)] hover:bg-[var(--slot4-accent-soft)]'
                }`}
              >
                {item.label}
                {active ? <span className="absolute inset-x-3 -top-4 h-[3px] bg-[#408175]" /> : null}
              </Link>
            )
          })}
        </div>

        <form action="/search" className="mx-auto hidden min-w-0 flex-1 justify-center xl:flex">
          <label className="flex w-full max-w-sm items-center gap-2 rounded-[8px] border border-[var(--editable-border)] bg-[#121817] px-4 py-2.5 transition focus-within:border-[var(--slot4-accent)]">
            <Search className="h-4 w-4 shrink-0 text-[var(--slot4-page-text)]" />
            <input
              name="q"
              type="search"
              placeholder="Search posts"
              className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[var(--slot4-muted-text)]"
            />
          </label>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {session ? (
            <>
              <span className="hidden max-w-[180px] items-center gap-2 truncate rounded-[8px] bg-[var(--slot4-accent-soft)] px-3 py-2 text-xs font-extrabold text-[var(--slot4-page-text)] md:inline-flex">
                <UserCircle2 className="h-4 w-4 shrink-0" /> {session.name || session.email}
              </span>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-[8px] bg-[var(--editable-cta-bg)] px-4 py-2.5 text-sm font-extrabold text-[var(--editable-cta-text)] transition hover:opacity-90 sm:inline-flex"
              >
                <PlusCircle className="h-4 w-4" /> Create
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden items-center gap-2 rounded-[8px] border border-[var(--editable-border)] px-3 py-2.5 text-sm font-extrabold text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] sm:inline-flex"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-2 rounded-[8px] border border-[var(--editable-border)] px-3 py-2.5 text-sm font-extrabold text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] sm:inline-flex"
              >
                <LogIn className="h-4 w-4" /> Login
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-[8px] bg-[var(--editable-cta-bg)] px-4 py-2.5 text-sm font-extrabold text-[var(--editable-cta-text)] transition hover:opacity-90 sm:inline-flex"
              >
                <UserPlus className="h-4 w-4" /> Sign up
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-[8px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-2 lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--editable-nav-bg)] px-4 py-5 lg:hidden">
          <form action="/search" className="mb-5 flex items-center gap-2 border-b border-[var(--slot4-accent)]/30 pb-2">
            <Search className="h-4 w-4 text-[var(--slot4-accent)]" />
            <input name="q" type="search" placeholder="Search posts" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-muted-text)]" />
          </form>
          <div className="grid gap-1">
            {[{ label: 'Home', href: '/' }, ...navItems, ...(session ? [{ label: 'Create', href: '/create' }] : [{ label: 'Login', href: '/login' }, { label: 'Sign up', href: '/signup' }])].map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`border-l-2 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] ${
                    active
                      ? 'border-[var(--slot4-accent)] bg-[var(--slot4-surface-bg)] text-[var(--slot4-accent)]'
                      : 'border-transparent text-[var(--slot4-muted-text)] hover:border-[var(--slot4-accent)]/40 hover:bg-[var(--slot4-surface-bg)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            {session ? (
              <button
                type="button"
                onClick={() => {
                  logout()
                  setOpen(false)
                }}
                className="border-l-2 border-transparent px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.16em] text-[var(--slot4-muted-text)] hover:border-[var(--slot4-accent)]/40 hover:bg-[var(--slot4-surface-bg)]"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
