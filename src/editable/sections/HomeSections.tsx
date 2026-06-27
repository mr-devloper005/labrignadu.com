import Link from 'next/link'
import { ArrowRight, BookOpen, MessageCircle, Search, Sparkles } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

function contentOf(post?: SitePost | null) {
  return post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
}

function cleanText(value = '', limit = 150) {
  const clean = value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function excerpt(post?: SitePost | null, limit = 150) {
  const content = contentOf(post)
  return cleanText(
    (typeof content.description === 'string' && content.description) ||
      (typeof content.summary === 'string' && content.summary) ||
      post?.summary ||
      '',
    limit
  )
}

function category(post?: SitePost | null, fallback = 'Article') {
  const content = contentOf(post)
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || fallback
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function allPosts(posts: SitePost[], timeSections: HomeTimeSection[]) {
  return dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
}

function commentsFor(post: SitePost) {
  const key = post.slug || post.id || post.title || 'post'
  let h = 0
  for (let i = 0; i < key.length; i += 1) h = (h * 31 + key.charCodeAt(i)) >>> 0
  return h % 18
}

function SafeImage({ post, className, alt = '' }: { post: SitePost; className: string; alt?: string }) {
  return <img src={getEditablePostImage(post)} alt={alt || post.title || ''} className={className} loading="lazy" />
}

function MetaLine({ post, light = false }: { post: SitePost; light?: boolean }) {
  return (
    <div className={`mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold ${light ? 'text-white/75' : 'text-[var(--slot4-muted-text)]'}`}>
      <span>{category(post)}</span>
      <span className="inline-flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {commentsFor(post)}</span>
    </div>
  )
}

function FeaturedCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group relative block min-h-[360px] overflow-hidden bg-[#0B0909] text-[#B5B9F0] editable-card-hover md:min-h-[430px]">
      <SafeImage post={post} className="absolute inset-0 h-full w-full object-cover opacity-[0.42] transition duration-700 group-hover:scale-[1.04]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,9,9,0.18),rgba(11,9,9,0.9))]" />
      <div className="relative flex h-full min-h-[360px] flex-col justify-end p-6 md:min-h-[430px] md:p-8">
        <span className="w-fit bg-[#408175] px-2.5 py-1 text-[11px] font-extrabold uppercase text-[#0B0909]">{category(post)}</span>
        <h2 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight md:text-4xl">{post.title}</h2>
        <MetaLine post={post} light />
      </div>
    </Link>
  )
}

function OverlayMiniCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group relative block min-h-[210px] overflow-hidden bg-[#2E4540] text-[#B5B9F0] editable-card-hover">
      <SafeImage post={post} className="absolute inset-0 h-full w-full object-cover opacity-[0.62] transition duration-700 group-hover:scale-[1.05]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,9,9,0.05),rgba(11,9,9,0.72))]" />
      <div className="relative flex min-h-[210px] flex-col justify-end p-5">
        <span className="w-fit bg-[#0B0909]/70 px-2 py-1 text-[10px] font-bold">{category(post)}</span>
        <h3 className="mt-3 line-clamp-3 text-lg font-extrabold leading-tight">{post.title}</h3>
      </div>
    </Link>
  )
}

function ImageFirstCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group block overflow-hidden border border-[var(--editable-border)] bg-[#121817] editable-card-hover">
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--slot4-media-bg)]">
        <SafeImage post={post} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        <span className="absolute right-3 top-3 text-xl text-[#B5B9F0]/70">&hearts;</span>
      </div>
      <div className="p-5">
        <h3 className="line-clamp-3 text-lg font-semibold leading-tight text-[var(--slot4-page-text)]">{post.title}</h3>
        <p className="mt-3 text-sm italic text-[var(--slot4-page-text)]/80">{category(post)}</p>
      </div>
    </Link>
  )
}

function CompactCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group flex gap-4 border-b border-[var(--editable-border)] py-4">
      <SafeImage post={post} className="h-16 w-24 shrink-0 object-cover transition duration-500 group-hover:scale-[1.03]" />
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">{post.title}</h3>
        <MetaLine post={post} />
      </div>
    </Link>
  )
}

function HorizontalCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group grid overflow-hidden rounded-[8px] border border-[var(--editable-border)] bg-[#121817] editable-card-hover sm:grid-cols-[240px_minmax(0,1fr)]">
      <div className="relative min-h-[190px] overflow-hidden bg-[var(--slot4-media-bg)]">
        <SafeImage post={post} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
      </div>
      <div className="p-6">
        <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{category(post)}</span>
        <h3 className="mt-3 text-2xl font-extrabold leading-tight text-[var(--slot4-page-text)]">{post.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{excerpt(post, 160) || 'Open the full post for details, links, notes, and community discussion.'}</p>
      </div>
    </Link>
  )
}

function EditorialListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid grid-cols-[54px_minmax(0,1fr)] gap-4 rounded-[8px] border border-[var(--editable-border)] bg-[#121817] p-4 transition hover:border-[var(--slot4-accent)]">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#408175] text-sm font-extrabold text-[#0B0909]">{String(index + 1).padStart(2, '0')}</span>
      <div className="min-w-0">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--slot4-accent)]">{category(post)}</p>
        <h3 className="mt-1 line-clamp-2 text-lg font-extrabold leading-tight text-[var(--slot4-page-text)]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{excerpt(post, 110)}</p>
      </div>
    </Link>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = allPosts(posts, timeSections)
  const [lead, ...rest] = pool
  const side = rest.slice(0, 4)
  if (!lead) return null

  return (
    <section className="relative overflow-hidden bg-[#408175] text-[#0B0909]">
      <div className="pointer-events-none absolute left-[6%] top-[34%] editable-float text-7xl font-black opacity-95">&#9733;</div>
      <div className="pointer-events-none absolute right-[5%] top-[18%] editable-float-delayed text-8xl font-black opacity-95">&#9733;</div>
      <div className="pointer-events-none absolute bottom-12 left-[13%] editable-pulse text-6xl">&#9671;</div>
      <div className={`relative py-7 sm:py-10 ${container}`}>
        <h1 className="max-w-5xl text-balance text-3xl font-light leading-tight sm:text-4xl">
          <span className="font-extrabold underline decoration-white decoration-4 underline-offset-4">Join our growing</span> article community and find what you need
        </h1>

        <div className="mt-8 grid gap-3 lg:grid-cols-[1.02fr_1fr]">
          <FeaturedCard post={lead} href={postHref(primaryTask, lead, primaryRoute)} />
          <div className="grid gap-3 sm:grid-cols-2">
            {side.map((post) => <OverlayMiniCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />)}
          </div>
        </div>

        <form action="/search" className="mt-7 flex max-w-2xl overflow-hidden rounded-[8px] bg-[#B5B9F0] shadow-[0_18px_40px_rgba(11,9,9,0.32)]">
          <label className="flex min-w-0 flex-1 items-center gap-3 px-4">
            <Search className="h-5 w-5 text-[#0B0909]" />
            <input name="q" placeholder="Search articles, profiles, writers, and topics" className="min-w-0 flex-1 bg-transparent py-4 text-sm font-semibold text-[#0B0909] outline-none" />
          </label>
          <button className="bg-[#0B0909] px-6 text-sm font-extrabold text-[#B5B9F0]">Search</button>
        </form>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryRoute }: HomeSectionProps) {
  const tasks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  return (
    <section className="bg-[#0B0909]">
      <div className={`${container} py-12`}>
        <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#408175]">Latest</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[var(--slot4-page-text)]">Articles and News</h2>
          </div>
          <div className="flex flex-wrap gap-2 md:justify-end">
            {tasks.map((task) => (
              <Link key={task.key} href={task.route || primaryRoute} className="rounded-[8px] border border-[var(--editable-border)] bg-[#121817] px-4 py-2 text-sm font-extrabold text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)]">
                {task.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = allPosts(posts, timeSections).slice(0, 8)
  if (!pool.length) return null
  const doubled = [...pool, ...pool]

  return (
    <section className="bg-[#0B0909] pb-12">
      <div className={`${container}`}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pool.map((post) => (
            <ImageFirstCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
          ))}
        </div>
      </div>

      <div className="mt-14 overflow-hidden border-y border-[var(--editable-border)] bg-[#2E4540] py-4">
        <div className="editable-marquee flex w-max gap-4">
          {doubled.map((post, index) => (
            <Link key={`${post.id || post.slug}-${index}`} href={postHref(primaryTask, post, primaryRoute)} className="flex w-[310px] items-center gap-3 rounded-[8px] border border-[var(--editable-border)] bg-[#121817] p-3">
              <SafeImage post={post} className="h-14 w-20 shrink-0 object-cover" />
              <span className="line-clamp-2 text-sm font-extrabold leading-tight text-[var(--slot4-page-text)]">{post.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = allPosts(posts, timeSections)
  if (!pool.length) return null
  const horizontal = pool.slice(8, 11)
  const compact = pool.slice(0, 6)
  const editorial = pool.slice(11, 17)
  const slider = [...pool.slice(0, 10), ...pool.slice(0, 10)]

  return (
    <>
      <section className="bg-[#121817] py-16">
        <div className={`${container} grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center`}>
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#408175]">We created a place to publish and connect</p>
            <h2 className="mt-6 max-w-xl text-4xl font-extrabold leading-tight text-[var(--slot4-page-text)] sm:text-5xl">Best articles, media, profiles, comparisons and news</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[var(--slot4-muted-text)]">Explore practical writing, community profiles, useful resources, and ideas from people sharing what they know.</p>
            <Link href={primaryRoute} className="mt-7 inline-flex rounded-[8px] bg-[#B5B9F0] px-7 py-3 text-sm font-extrabold text-[#0B0909]">Explore</Link>
          </div>
          <div className="relative min-h-[360px]">
            <div className="absolute inset-8 rounded-full border border-[#B5B9F0]/20" />
            <div className="absolute inset-16 rounded-full border border-[#B5B9F0]/20" />
            <div className="absolute left-1/2 top-0 flex h-32 w-32 -translate-x-1/2 items-center justify-center rounded-full bg-[#0B0909] text-center shadow-[0_18px_45px_rgba(11,9,9,0.32)] editable-float">
              <span><b className="block text-3xl text-[#B5B9F0]">5k</b><span className="text-sm text-[var(--slot4-muted-text)]">Readers</span></span>
            </div>
            <div className="absolute right-4 top-28 flex h-28 w-28 items-center justify-center rounded-full bg-[#0B0909] text-center shadow-[0_18px_45px_rgba(11,9,9,0.32)] editable-float-delayed">
              <span><b className="block text-3xl text-[#408175]">3k</b><span className="text-sm text-[var(--slot4-muted-text)]">Articles</span></span>
            </div>
            <div className="absolute bottom-10 left-8 flex h-28 w-28 items-center justify-center rounded-full bg-[#0B0909] text-center shadow-[0_18px_45px_rgba(11,9,9,0.32)] editable-pulse">
              <span><b className="block text-3xl text-[#B5B9F0]">2k</b><span className="text-sm text-[var(--slot4-muted-text)]">Comments</span></span>
            </div>
            <div className="absolute bottom-2 right-24 flex h-24 w-24 items-center justify-center rounded-full bg-[#0B0909] text-center shadow-[0_18px_45px_rgba(11,9,9,0.32)]">
              <span><b className="block text-3xl text-[#408175]">90</b><span className="text-sm text-[var(--slot4-muted-text)]">Authors</span></span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0B0909] py-14">
        <div className={`${container} grid gap-8 lg:grid-cols-[1fr_1fr_1fr]`}>
          <div className="space-y-2">
            {compact.map((post) => <CompactCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />)}
          </div>
          <div className="space-y-5">
            {horizontal.map((post) => <HorizontalCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />)}
          </div>
          <div className="space-y-3">
            {editorial.map((post, index) => <EditorialListCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#2E4540] py-6">
        <div className="editable-marquee-slow flex w-max gap-4">
          {slider.map((post, index) => (
            <div key={`${post.id || post.slug}-slow-${index}`} className="flex w-[280px] items-center gap-3 rounded-[8px] bg-[#0B0909] p-3 text-[#B5B9F0]">
              <BookOpen className="h-5 w-5 shrink-0 text-[#408175]" />
              <span className="line-clamp-1 text-sm font-extrabold">{post.title}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-[#0B0909] py-14">
      <div className={`${container}`}>
        <div className="rounded-[18px] bg-[#2E4540] px-6 py-14 text-center text-[#B5B9F0] sm:px-10">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em]">Bring your next piece to the community</p>
          <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-light leading-tight sm:text-5xl"><span className="font-extrabold">Get in touch,</span> and let us know how we can help</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] bg-[#408175] px-7 py-3 text-sm font-extrabold text-[#0B0909]">Contact Us <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/create" className="inline-flex items-center gap-2 rounded-[6px] border border-[#B5B9F0]/40 px-7 py-3 text-sm font-extrabold text-[#B5B9F0]">Create <Sparkles className="h-4 w-4" /></Link>
          </div>
        </div>
      </div>
    </section>
  )
}
