import { NextResponse } from 'next/server'

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY
const HOST         = process.env.RAPIDAPI_HOST ?? 'instagram-public-bulk-scraper.p.rapidapi.com'
const USERNAME     = '_sbcreation'
const CACHE_TTL    = 6 * 60 * 60 * 1000 // 6 hours — conserve free tier quota

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
  const url  = `https://${HOST}${path}`
  console.log('[IG] GET', url)
  const res  = await fetch(url, { headers: headers(), cache: 'no-store' })
  const text = await res.text()
  console.log('[IG]', res.status, text.slice(0, 400))
  let data: any = {}
  try { data = JSON.parse(text) } catch {}
  return { ok: res.status === 200, status: res.status, data, raw: text }
}

function parseProfile(user: any): InstagramProfile {
  const followers = user?.edge_followed_by?.count
    ?? user?.follower_count
    ?? user?.followers_count
    ?? 0

  const following = user?.edge_follow?.count
    ?? user?.following_count
    ?? user?.following
    ?? 0

  console.log('[IG] parseProfile → followers:', followers, 'following:', following)

  return {
    username:        user?.username      || USERNAME,
    full_name:       user?.full_name     || '',
    bio:             user?.biography     || '',
    followers,
    following,
    posts_count:     user?.edge_owner_to_timeline_media?.count ?? user?.media_count ?? 0,
    profile_pic_url: user?.profile_pic_url || user?.profile_pic_url_hd || '',
  }
}

function parsePosts(edges: any[]): InstagramPost[] {
  return edges
    .slice(0, 9)
    .map((edge: any) => {
      const n = edge?.node || edge

      const isVideo =
        n?.__typename === 'GraphVideo' ||
        n?.is_video === true ||
        n?.media_type === 2

      const imageUrl =
        n?.display_url ||
        n?.edge_sidecar_to_children?.edges?.[0]?.node?.display_url ||
        n?.thumbnail_url ||
        ''

      const shortcode = n?.shortcode || ''
      const postUrl   = shortcode ? `https://www.instagram.com/p/${shortcode}/` : '#'
      const takenAt   = n?.taken_at_timestamp || n?.taken_at
      const timestamp = takenAt ? new Date(Number(takenAt) * 1000).toISOString() : ''

      return {
        id:        String(n?.id || n?.pk || Math.random()),
        image_url: imageUrl,
        caption:
          n?.edge_media_to_caption?.edges?.[0]?.node?.text ||
          n?.caption?.text || n?.caption || '',
        likes:     n?.edge_media_preview_like?.count ?? n?.like_count ?? 0,
        comments:  n?.edge_media_to_comment?.count   ?? n?.comment_count ?? 0,
        post_url:  postUrl,
        timestamp,
        is_video:  isVideo,
      }
    })
    .filter(p => p.image_url)
}

async function fetchAll(): Promise<{ posts: InstagramPost[]; profile: InstagramProfile } | null> {
  const { ok, status, data } = await apiFetch(`/v1/user_info_web?username=${USERNAME}`)

  if (!ok) {
    console.error('[IG] user_info_web returned', status)
    return null
  }

  // API can return user at different nesting levels — try all
  const user =
    data?.data?.user ||   // expected shape
    data?.data ||         // flat shape (what we're seeing now)
    data?.user ||
    data
  if (!user || typeof user !== 'object') {
    console.error('[IG] No user object. data keys:', Object.keys(data || {}))
    return null
  }

  const profile = parseProfile(user)
  const edges   = user?.edge_owner_to_timeline_media?.edges

  if (!Array.isArray(edges) || edges.length === 0) {
    console.error('[IG] No edges. edge_owner_to_timeline_media:', user?.edge_owner_to_timeline_media)
    return null
  }

  const posts = parsePosts(edges)
  console.log('[IG] Parsed', posts.length, 'posts from', edges.length, 'edges')
  if (posts.length === 0) return null

  return { posts, profile }
}

// ── GET handler ───────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const isBust  = searchParams.get('bust')  === '1'
  const isDebug = searchParams.get('debug') === '1'

  if (isBust) { cache = null; console.log('[IG] Cache cleared') }

  // ?debug=1 — compact diagnostic, won't blow up on huge response
  if (isDebug) {
    if (!RAPIDAPI_KEY) return NextResponse.json({ error: 'RAPIDAPI_KEY not set' }, { status: 500 })
    const { status, data, raw } = await apiFetch(`/v1/user_info_web?username=${USERNAME}`)
    const user = data?.data?.user || data?.data || data?.user || data
    return NextResponse.json({
      host:       HOST,
      key_prefix: RAPIDAPI_KEY?.slice(0, 8),
      status,
      // If rate limited or error, show raw message
      raw_snippet: raw.slice(0, 500),
      profile_fields: user ? {
        username:         user.username,
        full_name:        user.full_name,
        edge_followed_by: user.edge_followed_by,   // should be { count: 2917 }
        edge_follow:      user.edge_follow,         // should be { count: 4 }
        profile_pic_url:  user.profile_pic_url?.slice(0, 60),
        posts_count:      user.edge_owner_to_timeline_media?.count,
        edges_length:     user.edge_owner_to_timeline_media?.edges?.length,
        first_shortcode:  user.edge_owner_to_timeline_media?.edges?.[0]?.node?.shortcode,
      } : null,
    })
  }

  if (!RAPIDAPI_KEY?.trim()) {
    if (cache) return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true, stale: true })
    return NextResponse.json({ error: 'Missing RAPIDAPI_KEY', posts: [], profile: null }, { status: 500 })
  }

  // Serve from cache — DO NOT bust unless explicitly asked
  // This is critical to conserve free tier quota (100 req/day or similar)
  if (cache && !isBust && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true })
  }

  try {
    const result = await fetchAll()

    if (!result || result.posts.length === 0) {
      // If we have stale cache, serve it rather than showing empty
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