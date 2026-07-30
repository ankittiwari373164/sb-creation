import { NextResponse } from 'next/server'

const HIKER_KEY  = process.env.HIKERAPI_KEY
const HIKER_BASE = 'https://api.hikerapi.com'
const USERNAME   = '_sbcreation'

// HikerAPI is pay-per-request with a one-time free-credit signup bonus (not a
// daily refill), so we cache aggressively — 1 full refresh costs 2 requests
// (profile + medias). 24h cache ≈ 60 requests/month, well inside a free trial.
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

export interface InstagramProfile {
  username: string
  full_name: string
  bio: string
  followers: number
  following: number
  posts_count: number
  profile_pic_url: string
}

export interface InstagramPost {
  id: string
  image_url: string
  caption: string
  likes: number
  comments: number
  post_url: string
  timestamp: string
  is_video: boolean
}

interface Cache {
  posts: InstagramPost[]
  profile: InstagramProfile | null
  timestamp: number
}

let cache: Cache | null = null

function headers() {
  return { 'x-access-key': HIKER_KEY! }
}

async function apiFetch(path: string, params: Record<string, string>) {
  const url = new URL(`${HIKER_BASE}${path}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  console.log('[IG] GET', url.toString())
  const res  = await fetch(url.toString(), { headers: headers(), cache: 'no-store' })
  const text = await res.text()
  console.log('[IG]', res.status, text.slice(0, 400))
  let data: any = {}
  try { data = JSON.parse(text) } catch {}
  return { ok: res.status === 200, status: res.status, data, raw: text }
}

function parseProfile(user: any): InstagramProfile {
  return {
    username:        user?.username  || USERNAME,
    full_name:       user?.full_name || '',
    bio:             user?.biography || '',
    followers:       user?.follower_count  ?? 0,
    following:       user?.following_count ?? 0,
    posts_count:     user?.media_count ?? 0,
    profile_pic_url: user?.profile_pic_url || user?.profile_pic_url_hd || '',
  }
}

function parsePosts(items: any[]): InstagramPost[] {
  return items
    .slice(0, 9)
    .map((n: any) => {
      try {
      const isVideo =
        n?.media_type === 2 ||
        n?.is_video === true

      const imageUrl =
        n?.image_versions2?.candidates?.[0]?.url ||
        n?.thumbnail_url ||
        n?.display_url ||
        n?.carousel_media?.[0]?.image_versions2?.candidates?.[0]?.url ||
        ''

      const shortcode = n?.code || n?.shortcode || ''
      const postUrl   = shortcode ? `https://www.instagram.com/p/${shortcode}/` : '#'
      // HikerAPI returns taken_at as an ISO string already, plus taken_at_ts
      // as a unix-seconds fallback. Never assume taken_at is numeric.
      let timestamp = ''
      if (typeof n?.taken_at === 'string' && !Number.isNaN(Date.parse(n.taken_at))) {
        timestamp = new Date(n.taken_at).toISOString()
      } else if (n?.taken_at_ts) {
        timestamp = new Date(Number(n.taken_at_ts) * 1000).toISOString()
      } else if (n?.taken_at_timestamp) {
        timestamp = new Date(Number(n.taken_at_timestamp) * 1000).toISOString()
      }

      // Caption can come back as a string OR { text: '...' } — never hand React an object.
      const rawCaption = n?.caption?.text ?? n?.caption ?? n?.caption_text ?? ''
      const caption = typeof rawCaption === 'string' ? rawCaption : ''

      return {
        id:        String(n?.pk || n?.id || `${shortcode || 'post'}-${Math.random().toString(36).slice(2)}`),
        image_url: imageUrl,
        caption,
        likes:     n?.like_count    ?? 0,
        comments:  n?.comment_count ?? 0,
        post_url:  postUrl,
        timestamp,
        is_video:  isVideo,
      }
      } catch (e) {
        console.error('[IG] Failed to parse one post item, skipping:', e)
        return null
      }
    })
    .filter((p): p is InstagramPost => p !== null && !!p.image_url)
}

async function fetchAll(): Promise<{ posts: InstagramPost[]; profile: InstagramProfile } | null> {
  // 1) Resolve username -> user object (contains pk + follower/following counts)
  const profileRes = await apiFetch('/v1/user/by/username', { username: USERNAME })
  if (!profileRes.ok) {
    console.error('[IG] user/by/username failed', profileRes.status, profileRes.raw.slice(0, 200))
    return null
  }
  const user = profileRes.data
  const pk = user?.pk || user?.id
  if (!pk) {
    console.error('[IG] No pk in profile response. Keys:', Object.keys(user || {}))
    return null
  }
  const profile = parseProfile(user)

  // 2) Fetch recent medias by user id
  const mediasRes = await apiFetch('/v1/user/medias', { user_id: String(pk), amount: '9' })
  if (!mediasRes.ok) {
    console.error('[IG] user/medias failed', mediasRes.status, mediasRes.raw.slice(0, 200))
    return null
  }
  // Response can be a bare array or { items: [...] } depending on endpoint/version
  const items = Array.isArray(mediasRes.data)
    ? mediasRes.data
    : mediasRes.data?.items || []

  if (!Array.isArray(items) || items.length === 0) {
    console.error('[IG] No media items. Raw:', mediasRes.raw.slice(0, 300))
    return null
  }

  const posts = parsePosts(items)
  console.log('[IG] Parsed', posts.length, 'posts from', items.length, 'items')
  if (posts.length === 0) return null

  return { posts, profile }
}

// ── GET handler ───────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const isBust  = searchParams.get('bust')  === '1'
  const isDebug = searchParams.get('debug') === '1'

  if (isBust) { cache = null; console.log('[IG] Cache cleared') }

  // ?debug=1 — compact diagnostic, safe to hit in production
  if (isDebug) {
    if (!HIKER_KEY?.trim()) {
      return NextResponse.json({
        error: 'HIKERAPI_KEY not set in this environment. Add it in your hosting dashboard (e.g. Vercel Project Settings → Environment Variables) and redeploy.',
      }, { status: 500 })
    }
    const profileRes = await apiFetch('/v1/user/by/username', { username: USERNAME })
    const user = profileRes.data
    const pk = user?.pk || user?.id

    let mediasStatus: number | null = null
    let itemsLength: number | null = null
    let mediasRawSnippet = ''
    if (pk) {
      const mediasRes = await apiFetch('/v1/user/medias', { user_id: String(pk), amount: '9' })
      mediasStatus = mediasRes.status
      mediasRawSnippet = mediasRes.raw.slice(0, 300)
      const items = Array.isArray(mediasRes.data) ? mediasRes.data : mediasRes.data?.items
      itemsLength = Array.isArray(items) ? items.length : null
    }

    return NextResponse.json({
      key_prefix: HIKER_KEY?.slice(0, 8),
      profile_status: profileRes.status,
      profile_raw_snippet: profileRes.raw.slice(0, 400),
      profile_fields: user ? {
        pk,
        username:        user.username,
        full_name:       user.full_name,
        follower_count:  user.follower_count,
        following_count: user.following_count,
        media_count:     user.media_count,
        profile_pic_url: user.profile_pic_url?.slice(0, 60),
      } : null,
      medias_status: mediasStatus,
      medias_items_length: itemsLength,
      medias_raw_snippet: mediasRawSnippet,
    })
  }

  if (!HIKER_KEY?.trim()) {
    if (cache) return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true, stale: true })
    return NextResponse.json({ error: 'Missing HIKERAPI_KEY', posts: [], profile: null }, { status: 500 })
  }

  // Serve from cache — DO NOT bust unless explicitly asked. Critical for
  // stretching a one-time free-credit balance across the month.
  if (cache && !isBust && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true })
  }

  try {
    const result = await fetchAll()

    if (!result || result.posts.length === 0) {
      if (cache) {
        console.log('[IG] Fetch failed, serving stale cache')
        return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true, stale: true })
      }
      throw new Error('No posts returned. Visit /api/instagram?debug=1 to diagnose.')
    }

    cache = { posts: result.posts, profile: result.profile, timestamp: Date.now() }
    console.log(`[IG] Cached ${result.posts.length} posts | followers: ${result.profile?.followers}`)
    return NextResponse.json({ posts: result.posts, profile: result.profile, cached: false })

  } catch (err: any) {
    console.error('[IG] Fatal error:', err.message)
    if (cache) return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true, stale: true })
    return NextResponse.json({ error: err.message, posts: [], profile: null }, { status: 500 })
  }
}