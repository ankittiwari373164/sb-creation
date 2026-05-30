import { NextResponse } from 'next/server'

// ─────────────────────────────────────────────────────────────────────────────
// VERCEL ENV VARS NEEDED:
//   RAPIDAPI_KEY  = your existing key (already set)
//   RAPIDAPI_HOST = instagram-public-bulk-scraper.p.rapidapi.com  ← ADD THIS
// ─────────────────────────────────────────────────────────────────────────────

const RAPIDAPI_KEY  = process.env.RAPIDAPI_KEY
const HOST          = process.env.RAPIDAPI_HOST ?? 'instagram-public-bulk-scraper.p.rapidapi.com'
const USERNAME      = '_sbcreation'
const CACHE_TTL     = 4 * 60 * 60 * 1000 // 4 hours

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
  const res = await fetch(url, { headers: headers(), cache: 'no-store' })
  const text = await res.text()
  console.log('[IG] status:', res.status, 'body[:300]:', text.slice(0, 300))
  let data: any = {}
  try { data = JSON.parse(text) } catch {}
  return { ok: res.status === 200, status: res.status, data }
}

// ── Fetch profile via User Info endpoint ──────────────────────────────────────
async function fetchProfile(): Promise<InstagramProfile | null> {
  // Try both endpoints: User Info and User Info By Username
  const paths = [
    `/v1/info?username_or_id_or_url=${USERNAME}`,
    `/v1.1/info?username_or_id_or_url=${USERNAME}`,
    `/user_info?username=${USERNAME}`,
  ]

  for (const path of paths) {
    const { ok, data } = await apiFetch(path)
    if (!ok) continue

    // This API nests data under data.data or data.user
    const u = data?.data?.user || data?.data || data?.user || data
    if (!u || !u.username) continue

    return {
      username:        u.username             || USERNAME,
      full_name:       u.full_name            || '',
      bio:             u.biography            || u.bio || '',
      followers:       u.follower_count       ?? u.followers_count ?? u.edge_followed_by?.count ?? 0,
      following:       u.following_count      ?? u.following ?? u.edge_follow?.count ?? 0,
      posts_count:     u.media_count          ?? u.posts_count ?? 0,
      profile_pic_url: u.profile_pic_url_hd   || u.profile_pic_url || '',
    }
  }
  return null
}

// ── Map raw items → our post shape ────────────────────────────────────────────
function mapPosts(rawItems: any[]): InstagramPost[] {
  return rawItems
    .slice(0, 9)
    .map((item: any) => {
      const node = item?.node || item  // some APIs wrap in { node: ... }

      const isVideo =
        node?.is_video === true ||
        node?.media_type === 2 ||
        node?.__typename === 'GraphVideo'

      const imageUrl =
        node?.display_url ||
        node?.thumbnail_url ||
        node?.image_url ||
        node?.image_versions2?.candidates?.[0]?.url ||
        node?.carousel_media?.[0]?.image_versions2?.candidates?.[0]?.url ||
        node?.edge_sidecar_to_children?.edges?.[0]?.node?.display_url ||
        ''

      const shortcode = node?.shortcode || node?.code || ''
      const postUrl = shortcode
        ? `https://www.instagram.com/p/${shortcode}/`
        : node?.post_url || '#'

      const takenAt = node?.taken_at_timestamp || node?.taken_at
      const timestamp = takenAt
        ? new Date(Number(takenAt) * 1000).toISOString()
        : node?.timestamp || ''

      return {
        id:        String(node?.id || node?.pk || Math.random()),
        image_url: imageUrl,
        caption:
          node?.edge_media_to_caption?.edges?.[0]?.node?.text ||
          node?.caption?.text ||
          node?.caption ||
          '',
        likes:
          node?.edge_media_preview_like?.count ??
          node?.edge_liked_by?.count ??
          node?.like_count ??
          node?.likes_count ??
          0,
        comments:
          node?.edge_media_to_comment?.count ??
          node?.comment_count ??
          node?.comments_count ??
          0,
        post_url:  postUrl,
        timestamp,
        is_video:  isVideo,
      }
    })
    .filter(p => p.image_url)
}

// ── Fetch posts ───────────────────────────────────────────────────────────────
async function fetchPosts(): Promise<InstagramPost[] | null> {
  // User Posts and User Posts - v2 endpoints visible in the screenshot
  const paths = [
    `/v1/posts?username_or_id_or_url=${USERNAME}`,
    `/v1.1/posts?username_or_id_or_url=${USERNAME}`,
    `/v1/posts?username_or_id_or_url=${USERNAME}&count=12`,
    `/user_posts?username=${USERNAME}`,
  ]

  for (const path of paths) {
    const { ok, data } = await apiFetch(path)
    if (!ok) continue

    // Try every possible nesting pattern
    const candidates = [
      data?.data?.items,
      data?.data?.posts,
      data?.items,
      data?.posts,
      data?.data?.user?.edge_owner_to_timeline_media?.edges,
      data?.data?.edge_owner_to_timeline_media?.edges,
    ]

    for (const c of candidates) {
      if (Array.isArray(c) && c.length > 0) {
        const posts = mapPosts(c)
        if (posts.length > 0) {
          console.log('[IG] Posts found via', path, '—', posts.length, 'posts')
          return posts
        }
      }
    }
  }
  return null
}

// ── Main GET handler ──────────────────────────────────────────────────────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // ?bust=1 → force refresh
  if (searchParams.get('bust') === '1') cache = null

  // ?debug=1 → raw diagnostic output
  if (searchParams.get('debug') === '1') {
    if (!RAPIDAPI_KEY) {
      return NextResponse.json({ error: 'RAPIDAPI_KEY not set' }, { status: 500 })
    }
    const [profileRes, postsRes] = await Promise.all([
      apiFetch(`/v1/info?username_or_id_or_url=${USERNAME}`),
      apiFetch(`/v1/posts?username_or_id_or_url=${USERNAME}`),
    ])
    return NextResponse.json({
      host:         HOST,
      key_prefix:   RAPIDAPI_KEY.slice(0, 8),
      key_length:   RAPIDAPI_KEY.length,
      profile_status: profileRes.status,
      profile_data:   profileRes.data,
      posts_status:   postsRes.status,
      posts_data:     postsRes.data,
    })
  }

  // Guard: missing key
  if (!RAPIDAPI_KEY || RAPIDAPI_KEY.trim() === '') {
    console.error('[IG] RAPIDAPI_KEY missing')
    if (cache) return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true, stale: true })
    return NextResponse.json({ error: 'Missing RAPIDAPI_KEY', posts: [], profile: null }, { status: 500 })
  }

  // Serve cache if fresh
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true })
  }

  try {
    // Fetch posts + profile in parallel
    const [posts, profile] = await Promise.all([fetchPosts(), fetchProfile()])

    if (!posts || posts.length === 0) {
      throw new Error(
        `No posts returned from ${HOST}. ` +
        `Add RAPIDAPI_HOST env var if needed. ` +
        `Visit /api/instagram?debug=1 for raw output.`
      )
    }

    cache = { posts, profile, timestamp: Date.now() }
    console.log(`[IG] Cached ${posts.length} posts, profile followers: ${profile?.followers}`)
    return NextResponse.json({ posts, profile, cached: false })

  } catch (err: any) {
    console.error('[IG] Error:', err.message)
    if (cache) {
      return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true, stale: true })
    }
    return NextResponse.json({ error: err.message, posts: [], profile: null }, { status: 500 })
  }
}