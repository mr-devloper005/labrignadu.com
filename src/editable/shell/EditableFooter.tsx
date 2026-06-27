'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const footerLinks = [
    ['Home', '/'],
    ['About', '/about'],
    ['Search', '/search'],
    ['Login', '/login'],
    ['Register', '/signup'],
  ]

  return (
    <footer className="bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_1.05fr_0.7fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-[8px] border border-[var(--slot4-accent)]/60 bg-[var(--slot4-surface-bg)]">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
            </span>
            <span className="editable-display text-2xl font-extrabold tracking-[0.01em] text-[#B5B9F0]">{SITE_CONFIG.name}</span>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-7 text-[#B5B9F0]/70">{globalContent.footer?.description || SITE_CONFIG.description}</p>
        </div>

        <div className="rounded-[8px] border border-[#B5B9F0]/10 bg-[#2E4540]/40 p-6">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#408175] text-[#0B0909]">
            <Mail className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-center text-xl font-extrabold">Subscribe to our list</h3>
          <form className="mt-5 grid gap-3">
            <input aria-label="Email address" placeholder="Email address" className="h-11 rounded-[6px] border border-[#B5B9F0]/15 bg-[#121817] px-3 text-sm text-[#B5B9F0] outline-none" />
            <button className="h-11 rounded-[6px] bg-[#B5B9F0] text-sm font-extrabold text-[#0B0909] transition hover:brightness-95">Subscribe</button>
          </form>
          <p className="mt-4 text-center text-xs text-[#B5B9F0]/50">No spam, only fresh publishing updates.</p>
        </div>

        <div>
          <h3 className="text-sm font-extrabold text-[#B5B9F0]">Site</h3>
          <div className="mt-4 grid gap-2">
            {footerLinks.map(([label, href]) => (
              <Link key={href} href={href} className="text-sm font-medium text-[#B5B9F0]/70 transition hover:text-[#B5B9F0]">{label}</Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-[#B5B9F0]/10 px-4 py-5 text-center text-xs font-medium tracking-[0.12em] text-[#B5B9F0]/50">
        (c) {year} {SITE_CONFIG.name}. All rights reserved.
      </div>
    </footer>
  )
}
