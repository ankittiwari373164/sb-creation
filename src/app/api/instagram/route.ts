import { NextResponse } from 'next/server'

// ─────────────────────────────────────────────────────────────────────────────
// VERCEL ENV VARS:
//   RAPIDAPI_KEY  = (already set — keep as is)
//   RAPIDAPI_HOST = instagram-public-bulk-scraper.p.rapidapi.com  ← ADD THIS
// ─────────────────────────────────────────────────────────────────────────────

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY
const HOST         = process.env.RAPIDAPI_HOST ?? 'instagram-public-bulk-scraper.p.rapidapi.com'
const USERNAME     = '_sbcreation'
const CACHE_TTL    = 4 * 60 * 60 * 1000 // 4 hours

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
  return {
    'x-rapidapi-key':  RAPIDAPI_KEY!,
    'x-rapidapi-host': HOST,
  }
}

async function apiFetch(path: string) {
  const url = `https://${HOST}${path}`
  console.log('[IG] GET', url)
  const res  = await fetch(url, { headers: headers(), cache: 'no-store' })
  const text = await res.text()
  console.log('[IG]', res.status, text.slice(0, 300))
  let data: any = {}
  try { data = JSON.parse(text) } catch {}
  return { ok: res.status === 200, status: res.status, data }
}

// ── Map raw post items → our shape ────────────────────────────────────────────
function mapPosts(rawItems: any[]): InstagramPost[] {
  return rawItems
    .slice(0, 9)
    .map((item: any) => {
      const n = item?.node || item

      const isVideo =
        n?.is_video === true ||
        n?.media_type === 2 ||
        n?.__typename === 'GraphVideo'

      const imageUrl =
        n?.display_url ||
        n?.thumbnail_url ||
        n?.image_url ||
        n?.image_versions2?.candidates?.[0]?.url ||
        n?.carousel_media?.[0]?.image_versions2?.candidates?.[0]?.url ||
        n?.edge_sidecar_to_children?.edges?.[0]?.node?.display_url ||
        ''

      const shortcode = n?.shortcode || n?.code || ''
      const postUrl   = shortcode ? `https://www.instagram.com/p/${shortcode}/` : '#'

      const takenAt   = n?.taken_at_timestamp || n?.taken_at
      const timestamp = takenAt ? new Date(Number(takenAt) * 1000).toISOString() : ''

      return {
        id:        String(n?.id || n?.pk || Math.random()),
        image_url: imageUrl,
        caption:
          n?.edge_media_to_caption?.edges?.[0]?.node?.text ||
          n?.caption?.text ||
          n?.caption || '',
        likes:
          n?.edge_media_preview_like?.count ??
          n?.edge_liked_by?.count ??
          n?.like_count ?? 0,
        comments:
          n?.edge_media_to_comment?.count ??
          n?.comment_count ?? 0,
        post_url: postUrl,
        timestamp,
        is_video: isVideo,
      }
    })
    .filter(p => p.image_url)
}

// ── Extract profile from user object ─────────────────────────────────────────
function extractProfile(u: any): InstagramProfile | null {
  if (!u || typeof u !== 'object') return null
  return {
    username:        u.username          || USERNAME,
    full_name:       u.full_name         || '',
    bio:             u.biography         || u.bio || '',
    followers:       u.follower_count    ?? u.followers_count ?? u.edge_followed_by?.count ?? 0,
    following:       u.following_count   ?? u.following ?? u.edge_follow?.count ?? 0,
    posts_count:     u.media_count       ?? u.posts_count ?? 0,
    profile_pic_url: u.profile_pic_url_hd || u.profile_pic_url || '',
  }
}

// ── Extract posts array from any response shape ───────────────────────────────
function extractRawPosts(data: any): any[] | null {
  const candidates = [
    // user_info_web — posts nested under user
    data?.data?.user?.edge_owner_to_timeline_media?.edges,
    // user_posts endpoint
    data?.data?.items,
    data?.data?.posts,
    data?.items,
    data?.posts,
    // graphql
    data?.graphql?.user?.edge_owner_to_timeline_media?.edges,
  ]
  for (const c of candidates) {
    if (Array.isArray(c) && c.length > 0) return c
  }
  return null
}

// ── STRATEGY 1: user_info_web — one call gets profile + posts ─────────────────
async function strategyInfoWeb(): Promise<{ posts: InstagramPost[]; profile: InstagramProfile | null } | null> {
  const { ok, data } = await apiFetch(`/v1/user_info_web?username=${USERNAME}`)
  if (!ok) return null

  const u = data?.data?.user || data?.user || data?.data
  const profile = extractProfile(u)

  const raw = extractRawPosts(data)
  if (!raw) return null

  const posts = mapPosts(raw)
  if (posts.length === 0) return null

  return { posts, profile }
}

// ── STRATEGY 2: user_info + user_posts separately ────────────────────────────
async function strategyInfoAndPosts(): Promise<{ posts: InstagramPost[]; profile: InstagramProfile | null } | null> {
  // First get user info to resolve user ID (needed for posts endpoint)
  const infoRes = await apiFetch(`/v1/user_info?username_or_id=${USERNAME}`)
  
  let profile: InstagramProfile | null = null
  let userId: string | null = null

  if (infoRes.ok) {
    const u = infoRes.data?.data?.user || infoRes.data?.data || infoRes.data?.user
    profile = extractProfile(u)
    userId  = String(u?.id || u?.pk || u?.user_id || '')
  }

  // Fetch posts — try by username first, then by userId
  const postTargets = [
    `/v1/user_posts?username_or_id=${USERNAME}`,
    ...(userId ? [`/v1/user_posts?username_or_id=${userId}`] : []),
  ]

  for (const path of postTargets) {
    const { ok, data } = await apiFetch(path)
    if (!ok) continue
    const raw = extractRawPosts(data)
    if (!raw) continue
    const posts = mapPosts(raw)
    if (posts.length > 0) return { posts, profile }
  }

  return null
}

// ── Main GET handler ──────────────────────────────────────────────────────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  if (searchParams.get('bust') === '1') cache = null

  // ?debug=1 — raw diagnostic
  if (searchParams.get('debug') === '1') {
    if (!RAPIDAPI_KEY) return NextResponse.json({ error: 'RAPIDAPI_KEY not set' }, { status: 500 })
    const [r1, r2, r3] = await Promise.all([
      apiFetch(`/v1/user_info_web?username=${USERNAME}`),
      apiFetch(`/v1/user_info?username_or_id=${USERNAME}`),
      apiFetch(`/v1/user_posts?username_or_id=${USERNAME}`),
    ])
    return NextResponse.json({
      host: HOST, key_prefix: RAPIDAPI_KEY.slice(0, 8),
      user_info_web:  { status: r1.status, data: r1.data },
      user_info:      { status: r2.status, data: r2.data },
      user_posts:     { status: r3.status, data: r3.data },
    })
  }

  // Guard
  if (!RAPIDAPI_KEY?.trim()) {
    if (cache) return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true, stale: true })
    return NextResponse.json({ error: 'Missing RAPIDAPI_KEY', posts: [], profile: null }, { status: 500 })
  }

  // Serve fresh cache
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true })
  }

  try {
    // Strategy 1: one call — user_info_web (profile + posts together)
    let result = await strategyInfoWeb()

    // Strategy 2: two calls — user_info + user_posts
    if (!result) {
      console.log('[IG] Strategy 1 failed, trying Strategy 2')
      result = await strategyInfoAndPosts()
    }

    if (!result || result.posts.length === 0) {
      throw new Error('No posts returned. Check Vercel logs and /api/instagram?debug=1')
    }

    cache = { posts: result.posts, profile: result.profile, timestamp: Date.now() }
    console.log(`[IG] Success: ${result.posts.length} posts, followers: ${result.profile?.followers}`)
    return NextResponse.json({ posts: result.posts, profile: result.profile, cached: false })

  } catch (err: any) {
    console.error('[IG] Error:', err.message)
    if (cache) return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true, stale: true })
    return NextResponse.json({ error: err.message, posts: [], profile: null }, { status: 500 })
  }
}