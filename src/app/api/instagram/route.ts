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
  console.log('[IG]', res.status, text.slice(0, 300))
  let data: any = {}
  try { data = JSON.parse(text) } catch {}
  return { ok: res.status === 200, status: res.status, data }
}

// ── Parse profile — matches CONFIRMED response from debug output ───────────────
// user_info_web returns: data.data.user with:
//   edge_followed_by: { count: 2917 }
//   edge_follow: { count: 4 }
//   username, full_name, biography, profile_pic_url_hd
function parseProfile(user: any): InstagramProfile {
  const followers = user?.edge_followed_by?.count
    ?? user?.follower_count
    ?? user?.followers_count
    ?? 0

  const following = user?.edge_follow?.count
    ?? user?.following_count
    ?? user?.following
    ?? 0

  const posts_count = user?.edge_owner_to_timeline_media?.count
    ?? user?.media_count
    ?? user?.posts_count
    ?? 0

  console.log('[IG] Profile parsed — followers:', followers, 'following:', following)

  return {
    username:        user?.username        || USERNAME,
    full_name:       user?.full_name       || '',
    bio:             user?.biography       || '',
    followers,
    following,
    posts_count,
    // Use profile_pic_url (not _hd) — the HD url often has scontent CDN auth issues
    profile_pic_url: user?.profile_pic_url || user?.profile_pic_url_hd || '',
  }
}

// ── Parse posts — matches confirmed edge_owner_to_timeline_media.edges shape ──
function parsePosts(edges: any[]): InstagramPost[] {
  return edges
    .slice(0, 9)
    .map((edge: any) => {
      const n = edge?.node || edge

      const isVideo =
        n?.__typename === 'GraphVideo' ||
        n?.is_video === true ||
        n?.media_type === 2

      const carouselUrl =
        n?.edge_sidecar_to_children?.edges?.[0]?.node?.display_url

      const imageUrl =
        n?.display_url ||
        carouselUrl    ||
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

async function fetchAll(): Promise<{ posts: InstagramPost[]; profile: InstagramProfile } | null> {
  const { ok, data } = await apiFetch(`/v1/user_info_web?username=${USERNAME}`)
  if (!ok) return null

  const user = data?.data?.user
  if (!user) { console.error('[IG] No user in response'); return null }

  const profile = parseProfile(user)
  const edges   = user?.edge_owner_to_timeline_media?.edges

  if (!Array.isArray(edges) || edges.length === 0) {
    console.error('[IG] No post edges found')
    return null
  }

  const posts = parsePosts(edges)
  if (posts.length === 0) { console.error('[IG] Posts mapped to empty'); return null }

  return { posts, profile }
}

// ── GET handler ───────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // ?bust=1 forces a fresh fetch and clears cache
  if (searchParams.get('bust') === '1') {
    cache = null
    console.log('[IG] Cache busted')
  }

  // ?debug=1 — shows raw API response for diagnosis
  if (searchParams.get('debug') === '1') {
    if (!RAPIDAPI_KEY) return NextResponse.json({ error: 'RAPIDAPI_KEY not set' }, { status: 500 })
    const { status, data } = await apiFetch(`/v1/user_info_web?username=${USERNAME}`)
    const user = data?.data?.user
    return NextResponse.json({
      host:        HOST,
      key_prefix:  RAPIDAPI_KEY.slice(0, 8),
      status,
      // Return only the profile fields so the response isn't huge
      profile_raw: user ? {
        username:          user.username,
        full_name:         user.full_name,
        biography:         user.biography,
        edge_followed_by:  user.edge_followed_by,
        edge_follow:       user.edge_follow,
        profile_pic_url:   user.profile_pic_url,
        posts_count:       user.edge_owner_to_timeline_media?.count,
        posts_edges_count: user.edge_owner_to_timeline_media?.edges?.length,
        first_post_shortcode: user.edge_owner_to_timeline_media?.edges?.[0]?.node?.shortcode,
        first_post_display_url: user.edge_owner_to_timeline_media?.edges?.[0]?.node?.display_url?.slice(0, 80),
      } : null,
    })
  }

  if (!RAPIDAPI_KEY?.trim()) {
    if (cache) return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true, stale: true })
    return NextResponse.json({ error: 'Missing RAPIDAPI_KEY', posts: [], profile: null }, { status: 500 })
  }

  // Serve from cache if fresh
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true })
  }

  try {
    const result = await fetchAll()

    if (!result || result.posts.length === 0) {
      throw new Error('No posts returned. Visit /api/instagram?debug=1 to diagnose.')
    }

    cache = { posts: result.posts, profile: result.profile, timestamp: Date.now() }
    console.log(`[IG] Success: ${result.posts.length} posts | followers: ${result.profile?.followers} | following: ${result.profile?.following}`)
    return NextResponse.json({ posts: result.posts, profile: result.profile, cached: false })

  } catch (err: any) {
    console.error('[IG] Error:', err.message)
    if (cache) return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true, stale: true })
    return NextResponse.json({ error: err.message, posts: [], profile: null }, { status: 500 })
  }
}