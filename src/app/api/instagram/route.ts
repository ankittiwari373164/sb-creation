import { NextResponse } from 'next/server'

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
  const url  = `https://${HOST}${path}`
  console.log('[IG] GET', url)
  const res  = await fetch(url, { headers: headers(), cache: 'no-store' })
  const text = await res.text()
  console.log('[IG]', res.status, text.slice(0, 200))
  let data: any = {}
  try { data = JSON.parse(text) } catch {}
  return { ok: res.status === 200, status: res.status, data }
}

// ── Parse profile from the confirmed response shape ───────────────────────────
// data.data.user → { edge_followed_by.count, edge_follow.count, username, full_name, biography, profile_pic_url, fbid }
function parseProfile(user: any): InstagramProfile {
  return {
    username:        user?.username        || USERNAME,
    full_name:       user?.full_name       || '',
    bio:             user?.biography       || '',
    followers:       user?.edge_followed_by?.count  ?? user?.follower_count  ?? 0,
    following:       user?.edge_follow?.count        ?? user?.following_count ?? 0,
    posts_count:     user?.edge_owner_to_timeline_media?.count ?? user?.media_count ?? 0,
    profile_pic_url: user?.profile_pic_url_hd || user?.profile_pic_url || '',
  }
}

// ── Parse posts from the confirmed response shape ─────────────────────────────
// data.data.user.edge_owner_to_timeline_media.edges → [{ node: { ... } }]
function parsePosts(edges: any[]): InstagramPost[] {
  return edges
    .slice(0, 9)
    .map((edge: any) => {
      const n = edge?.node || edge

      const isVideo =
        n?.__typename === 'GraphVideo' ||
        n?.is_video === true ||
        n?.media_type === 2

      // For carousels grab first child image
      const carouselUrl =
        n?.edge_sidecar_to_children?.edges?.[0]?.node?.display_url

      const imageUrl =
        n?.display_url ||
        carouselUrl   ||
        n?.thumbnail_url ||
        n?.image_versions2?.candidates?.[0]?.url ||
        ''

      const shortcode = n?.shortcode || ''
      const postUrl   = shortcode
        ? `https://www.instagram.com/p/${shortcode}/`
        : '#'

      const takenAt   = n?.taken_at_timestamp || n?.taken_at
      const timestamp = takenAt
        ? new Date(Number(takenAt) * 1000).toISOString()
        : ''

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
        post_url:  postUrl,
        timestamp,
        is_video:  isVideo,
      }
    })
    .filter(p => p.image_url)
}

// ── Main fetch: user_info_web gives profile + posts in one call ───────────────
async function fetchAll(): Promise<{ posts: InstagramPost[]; profile: InstagramProfile } | null> {
  const { ok, data } = await apiFetch(`/v1/user_info_web?username=${USERNAME}`)
  if (!ok) {
    console.error('[IG] user_info_web failed')
    return null
  }

  const user  = data?.data?.user
  if (!user) {
    console.error('[IG] No user object in response')
    return null
  }

  const profile = parseProfile(user)
  const edges   = user?.edge_owner_to_timeline_media?.edges
  if (!Array.isArray(edges) || edges.length === 0) {
    console.error('[IG] No posts edges in response')
    return null
  }

  const posts = parsePosts(edges)
  if (posts.length === 0) {
    console.error('[IG] Posts parsed to empty array')
    return null
  }

  return { posts, profile }
}

// ── Fallback: separate user_posts call (if user_info_web stops working) ───────
async function fetchPostsSeparately(userId: string): Promise<InstagramPost[] | null> {
  const { ok, data } = await apiFetch(`/v1/user_posts?username_or_id=${userId}`)
  if (!ok) return null
  const edges = data?.data?.items || data?.data?.edges || data?.items || data?.edges
  if (!Array.isArray(edges) || edges.length === 0) return null
  return parsePosts(edges)
}

// ── GET handler ───────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  if (searchParams.get('bust') === '1') cache = null

  // ?debug=1 — raw output for diagnostics
  if (searchParams.get('debug') === '1') {
    if (!RAPIDAPI_KEY) return NextResponse.json({ error: 'RAPIDAPI_KEY not set' }, { status: 500 })
    const { status, data } = await apiFetch(`/v1/user_info_web?username=${USERNAME}`)
    return NextResponse.json({ host: HOST, key_prefix: RAPIDAPI_KEY.slice(0, 8), status, data })
  }

  // Guard: missing key
  if (!RAPIDAPI_KEY?.trim()) {
    if (cache) return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true, stale: true })
    return NextResponse.json({ error: 'Missing RAPIDAPI_KEY', posts: [], profile: null }, { status: 500 })
  }

  // Serve fresh cache
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true })
  }

  try {
    // Primary: one call gets everything
    let result = await fetchAll()

    // Fallback: try user_posts separately using username directly
    if (!result) {
      console.log('[IG] Trying fallback user_posts endpoint')
      const posts = await fetchPostsSeparately(USERNAME)
      if (posts && posts.length > 0) {
        result = {
          posts,
          profile: {
            username: USERNAME,
            full_name: 'SB Creation',
            bio: '',
            followers: 0,
            following: 0,
            posts_count: 0,
            profile_pic_url: '',
          },
        }
      }
    }

    if (!result || result.posts.length === 0) {
      throw new Error('No posts returned. Visit /api/instagram?debug=1 to diagnose.')
    }

    cache = { posts: result.posts, profile: result.profile, timestamp: Date.now() }
    console.log(`[IG] Cached ${result.posts.length} posts | followers: ${result.profile?.followers}`)
    return NextResponse.json({ posts: result.posts, profile: result.profile, cached: false })

  } catch (err: any) {
    console.error('[IG] Error:', err.message)
    if (cache) return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true, stale: true })
    return NextResponse.json({ error: err.message, posts: [], profile: null }, { status: 500 })
  }
}