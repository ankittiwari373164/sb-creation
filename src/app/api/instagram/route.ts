import { NextResponse } from 'next/server'

// ─────────────────────────────────────────────────────────────────────────────
// SETUP INSTRUCTIONS
//
// Your current API (instagram-scraper-api11) blocks multiple IPs — that's why
// it works locally but fails on Vercel (serverless uses many IPs).
//
// STEP 1: Go to RapidAPI and subscribe (free tier) to ONE of these better APIs:
//   OPTION A (recommended): https://rapidapi.com/mrngstar/api/instagram-bulk-scraper-latest
//   OPTION B:               https://rapidapi.com/DavidGelling/api/instagram-scraper-20251
//   OPTION C:               https://rapidapi.com/codenest-nestforge/api/instagram-scraper-api12
//
// STEP 2: Set RAPIDAPI_KEY in Vercel env vars (you already have this)
// STEP 3: Set RAPIDAPI_HOST in Vercel env vars to match whichever API you chose:
//   OPTION A: instagram-bulk-scraper-latest.p.rapidapi.com
//   OPTION B: instagram-scraper-20251.p.rapidapi.com
//   OPTION C: instagram-scraper-api12.p.rapidapi.com
//
// STEP 4: Redeploy on Vercel
// ─────────────────────────────────────────────────────────────────────────────

const RAPIDAPI_KEY  = process.env.RAPIDAPI_KEY
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST ?? 'instagram-bulk-scraper-latest.p.rapidapi.com'
const INSTAGRAM_USERNAME = '_sbcreation'
const CACHE_DURATION = 4 * 60 * 60 * 1000 // 4 hours

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
    'x-rapidapi-host': RAPIDAPI_HOST,
  }
}

async function get(path: string): Promise<{ status: number; data: any; raw: string }> {
  const url = `https://${RAPIDAPI_HOST}${path}`
  console.log('[IG API] GET', url)
  const res = await fetch(url, { headers: headers(), cache: 'no-store' })
  const raw = await res.text()
  console.log('[IG API] status:', res.status, 'body[:300]:', raw.slice(0, 300))
  let data: any = {}
  try { data = JSON.parse(raw) } catch {}
  return { status: res.status, data, raw }
}

// ── Deep-search any object for a value at a key ───────────────────────────────
function dig(obj: any, ...keys: string[]): any {
  if (!obj || typeof obj !== 'object') return undefined
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key]
  }
  for (const val of Object.values(obj)) {
    if (val && typeof val === 'object') {
      const found = dig(val, ...keys)
      if (found !== undefined) return found
    }
  }
  return undefined
}

// ── Map raw post items → our shape ───────────────────────────────────────────
function mapPosts(rawItems: any[]): InstagramPost[] {
  return rawItems
    .slice(0, 12)
    .map((item: any) => {
      const isVideo =
        item?.__typename === 'GraphVideo' ||
        item?.is_video === true ||
        item?.media_type === 2 ||
        item?.type === 'video'

      const imageUrl =
        item?.display_url ||
        item?.thumbnail_url ||
        item?.image_url ||
        item?.image_versions2?.candidates?.[0]?.url ||
        item?.carousel_media?.[0]?.image_versions2?.candidates?.[0]?.url ||
        item?.edge_sidecar_to_children?.edges?.[0]?.node?.display_url ||
        ''

      const shortcode = item?.shortcode || item?.code || item?.id || item?.pk || ''
      const postUrl = shortcode
        ? `https://www.instagram.com/p/${shortcode}/`
        : item?.post_url || item?.link || '#'

      const takenAt = item?.taken_at_timestamp || item?.taken_at
      const timestamp = takenAt
        ? new Date(Number(takenAt) * 1000).toISOString()
        : item?.timestamp || item?.date || ''

      return {
        id: String(item?.id || item?.pk || Math.random()),
        image_url: imageUrl,
        caption:
          item?.caption?.text ||
          item?.caption ||
          item?.edge_media_to_caption?.edges?.[0]?.node?.text ||
          '',
        likes:
          item?.like_count ??
          item?.likes ??
          item?.edge_media_preview_like?.count ??
          item?.edge_liked_by?.count ??
          0,
        comments:
          item?.comment_count ??
          item?.comments ??
          item?.edge_media_to_comment?.count ??
          0,
        post_url: postUrl,
        timestamp,
        is_video: isVideo,
      }
    })
    .filter((p) => p.image_url)
}

// ── Extract posts from any response shape ─────────────────────────────────────
function extractPosts(data: any): any[] | null {
  const candidates = [
    data?.data?.posts,
    data?.posts,
    data?.data?.items,
    data?.items,
    data?.data?.user?.edge_owner_to_timeline_media?.edges?.map((e: any) => e.node),
    data?.graphql?.user?.edge_owner_to_timeline_media?.edges?.map((e: any) => e.node),
    data?.data?.medias,
    data?.medias,
    data?.data,
  ]
  for (const c of candidates) {
    if (Array.isArray(c) && c.length > 0) return c
  }
  return null
}

// ── Extract profile from any response shape ───────────────────────────────────
function extractProfile(data: any): InstagramProfile | null {
  const u =
    data?.data?.user ||
    data?.data ||
    data?.user ||
    data?.graphql?.user ||
    data

  if (!u || typeof u !== 'object') return null

  const followers =
    u.followers_count ??
    u.follower_count ??
    u.edge_followed_by?.count ??
    dig(u, 'followers_count', 'follower_count') ??
    0

  const following =
    u.following_count ??
    u.following ??
    u.edge_follow?.count ??
    dig(u, 'following_count') ??
    0

  if (!u.username && followers === 0 && following === 0) return null

  return {
    username:        u.username         || INSTAGRAM_USERNAME,
    full_name:       u.full_name        || '',
    bio:             u.biography        || u.bio             || '',
    followers,
    following,
    posts_count:     u.posts_count      ?? u.media_count     ?? 0,
    profile_pic_url: u.profile_pic_url_hd || u.profile_pic_url || u.hd_profile_pic_url_info?.url || '',
  }
}

// ── Attempt: fetch profile + posts by username ────────────────────────────────
async function attemptByUsername(): Promise<{ posts: InstagramPost[]; profile: InstagramProfile | null } | null> {
  // Try common endpoint patterns for different APIs
  const profilePaths = [
    `/get_instagram_profile_details?username=${INSTAGRAM_USERNAME}`,
    `/getUserByUsername?username=${INSTAGRAM_USERNAME}`,
    `/user/info?username=${INSTAGRAM_USERNAME}`,
    `/profile?username=${INSTAGRAM_USERNAME}`,
    `/v1/info?username_or_id_or_url=${INSTAGRAM_USERNAME}`,
  ]

  const postPaths = [
    `/get_instagram_profile_posts?username=${INSTAGRAM_USERNAME}`,
    `/getUserFeed?username=${INSTAGRAM_USERNAME}`,
    `/user/posts?username=${INSTAGRAM_USERNAME}`,
    `/posts?username=${INSTAGRAM_USERNAME}`,
    `/v1/posts?username_or_id_or_url=${INSTAGRAM_USERNAME}`,
    `/feed?username=${INSTAGRAM_USERNAME}`,
  ]

  let profile: InstagramProfile | null = null
  let posts: InstagramPost[] | null = null

  // Try profile endpoints
  for (const path of profilePaths) {
    const { status, data } = await get(path)
    if (status === 200) {
      profile = extractProfile(data)
      if (profile) { console.log('[IG API] Profile found via', path); break }
    }
    if (status === 403 || status === 401) break // auth error — no point retrying
  }

  // Try posts endpoints
  for (const path of postPaths) {
    const { status, data } = await get(path)
    if (status === 200) {
      const raw = extractPosts(data)
      if (raw) {
        posts = mapPosts(raw)
        if (posts.length > 0) { console.log('[IG API] Posts found via', path); break }
      }
    }
    if (status === 403 || status === 401) break
  }

  if (!posts || posts.length === 0) return null
  return { posts, profile }
}

// ── Attempt: get userId then fetch posts ──────────────────────────────────────
async function attemptByUserId(): Promise<{ posts: InstagramPost[]; profile: InstagramProfile | null } | null> {
  const idPaths = [
    `/get_instagram_user_id?link=https://www.instagram.com/${INSTAGRAM_USERNAME}`,
    `/get_instagram_user_id?username=${INSTAGRAM_USERNAME}`,
    `/getUserId?username=${INSTAGRAM_USERNAME}`,
    `/user/id?username=${INSTAGRAM_USERNAME}`,
  ]

  let userId: string | null = null
  let profileFromId: InstagramProfile | null = null

  for (const path of idPaths) {
    const { status, data } = await get(path)
    if (status !== 200) continue
    userId =
      data?.data?.user_id || data?.data?.id || data?.user_id ||
      data?.id || data?.result?.user_id || data?.userId || null

    if (!userId) {
      // Maybe the response includes a full profile with user_id inside
      profileFromId = extractProfile(data)
      if (profileFromId) {
        const u = data?.data || data?.user || data
        userId = String(u?.pk || u?.id || u?.pk_id || '')
      }
    }

    if (userId) { console.log('[IG API] userId resolved:', userId, 'via', path); break }
  }

  if (!userId) return null

  const postsByIdPaths = [
    `/get_instagram_posts_details_from_id?user_id=${userId}`,
    `/getUserPostsById?user_id=${userId}`,
    `/posts?user_id=${userId}`,
    `/user/posts?user_id=${userId}`,
  ]

  for (const path of postsByIdPaths) {
    const { status, data } = await get(path)
    if (status !== 200) continue
    const raw = extractPosts(data)
    if (raw) {
      const posts = mapPosts(raw)
      if (posts.length > 0) {
        console.log('[IG API] Posts by userId found via', path)
        return { posts, profile: profileFromId }
      }
    }
  }

  return null
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const bust = searchParams.get('bust') === '1'
  if (bust) cache = null

  // Guard: missing API key
  if (!RAPIDAPI_KEY || RAPIDAPI_KEY.trim() === '') {
    console.error('[IG API] RAPIDAPI_KEY missing')
    return NextResponse.json(
      { error: 'Missing RAPIDAPI_KEY env var', posts: [], profile: null },
      { status: 500 }
    )
  }

  console.log('[IG API] key prefix:', RAPIDAPI_KEY.slice(0, 8), '| host:', RAPIDAPI_HOST)

  // Return cache if fresh
  if (cache && !bust && Date.now() - cache.timestamp < CACHE_DURATION) {
    return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true })
  }

  try {
    // Strategy 1: by username
    let result = await attemptByUsername()

    // Strategy 2: by userId fallback
    if (!result) {
      console.log('[IG API] Username strategy failed, trying userId strategy')
      result = await attemptByUserId()
    }

    if (!result || result.posts.length === 0) {
      throw new Error(
        `No posts found. Check that RAPIDAPI_HOST="${RAPIDAPI_HOST}" is subscribed and working. Visit /api/instagram?debug=1 for raw responses.`
      )
    }

    cache = { posts: result.posts, profile: result.profile, timestamp: Date.now() }
    console.log(`[IG API] Success: ${result.posts.length} posts`)
    return NextResponse.json({ posts: result.posts, profile: result.profile, cached: false })

  } catch (error: any) {
    console.error('[IG API error]', error.message)
    if (cache) {
      return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true, stale: true })
    }
    return NextResponse.json({ error: error.message, posts: [], profile: null }, { status: 500 })
  }
}