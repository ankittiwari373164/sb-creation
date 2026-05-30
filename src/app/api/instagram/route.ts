import { NextResponse } from 'next/server'

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY
const INSTAGRAM_USERNAME = '_sbcreation'
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_USERNAME}`
const CACHE_DURATION = 60 * 60 * 1000
const HOST = 'instagram-scraper-api11.p.rapidapi.com'

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

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'x-rapidapi-host': HOST,
    'x-rapidapi-key': RAPIDAPI_KEY!,
  }
}

// ── Strategy 1: get_instagram_user_id with full URL ───────────────────────────
async function fetchUserIdByUrl(): Promise<string | null> {
  try {
    const url = `https://${HOST}/get_instagram_user_id?link=${encodeURIComponent(INSTAGRAM_URL)}`
    const res = await fetch(url, { headers: getHeaders(), cache: 'no-store' })
    const text = await res.text()
    console.log('[S1 fetchUserIdByUrl] status:', res.status, 'raw:', text.slice(0, 400))
    if (!res.ok) return null
    const data = JSON.parse(text)
    return (
      data?.data?.user_id ||
      data?.data?.id ||
      data?.user_id ||
      data?.id ||
      data?.result?.user_id ||
      data?.result?.id ||
      null
    )
  } catch (e) {
    console.error('[S1 fetchUserIdByUrl error]', e)
    return null
  }
}

// ── Strategy 2: get profile details by username ───────────────────────────────
async function fetchUserIdByUsername(): Promise<string | null> {
  try {
    const url = `https://${HOST}/get_instagram_profile_details?username=${INSTAGRAM_USERNAME}`
    const res = await fetch(url, { headers: getHeaders(), cache: 'no-store' })
    const text = await res.text()
    console.log('[S2 fetchUserIdByUsername] status:', res.status, 'raw:', text.slice(0, 400))
    if (!res.ok) return null
    const data = JSON.parse(text)
    const u = data?.data || data?.user || data
    return u?.pk || u?.id || u?.user_id || u?.pk_id || null
  } catch (e) {
    console.error('[S2 fetchUserIdByUsername error]', e)
    return null
  }
}

// ── Strategy 3: fetch posts directly by username ──────────────────────────────
async function fetchPostsByUsername(): Promise<InstagramPost[] | null> {
  try {
    const url = `https://${HOST}/get_instagram_profile_posts?username=${INSTAGRAM_USERNAME}`
    const res = await fetch(url, { headers: getHeaders(), cache: 'no-store' })
    const text = await res.text()
    console.log('[S3 fetchPostsByUsername] status:', res.status, 'raw:', text.slice(0, 400))
    if (!res.ok) return null
    const data = JSON.parse(text)
    const rawItems: any[] =
      data?.data?.posts ||
      data?.posts ||
      data?.data?.items ||
      data?.items ||
      []
    if (!Array.isArray(rawItems) || rawItems.length === 0) return null
    return mapPosts(rawItems)
  } catch (e) {
    console.error('[S3 fetchPostsByUsername error]', e)
    return null
  }
}

// ── Strategy 4: fetch posts by user_id ───────────────────────────────────────
async function fetchPostsByUserId(userId: string): Promise<InstagramPost[]> {
  const url = `https://${HOST}/get_instagram_posts_details_from_id?user_id=${userId}`
  const res = await fetch(url, { headers: getHeaders(), cache: 'no-store' })
  const text = await res.text()
  console.log('[S4 fetchPostsByUserId] status:', res.status, 'raw:', text.slice(0, 400))
  if (!res.ok) throw new Error(`Posts fetch failed: ${res.status}`)
  const data = JSON.parse(text)
  const rawItems: any[] =
    data?.data?.posts ||
    data?.posts ||
    data?.data?.items ||
    data?.items ||
    []
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new Error(`No posts found. Keys: ${Object.keys(data?.data || data)}`)
  }
  return mapPosts(rawItems)
}

// ── Shared post mapper ────────────────────────────────────────────────────────
function mapPosts(rawItems: any[]): InstagramPost[] {
  return rawItems
    .slice(0, 12)
    .map((item: any) => {
      const isVideo =
        item?.__typename === 'GraphVideo' ||
        item?.is_video === true ||
        item?.media_type === 2

      const carouselImage =
        item?.edge_sidecar_to_children?.edges?.[0]?.node?.display_url ||
        item?.carousel_media?.[0]?.image_versions2?.candidates?.[0]?.url

      const imageUrl =
        item?.display_url ||
        carouselImage ||
        item?.thumbnail_url ||
        item?.image_versions2?.candidates?.[0]?.url ||
        ''

      return {
        id: String(item?.id || item?.pk || Math.random()),
        image_url: imageUrl,
        caption:
          item?.edge_media_to_caption?.edges?.[0]?.node?.text ||
          item?.caption?.text ||
          item?.caption ||
          '',
        likes:
          item?.edge_media_preview_like?.count ??
          item?.edge_liked_by?.count ??
          item?.like_count ??
          item?.likes ??
          0,
        comments:
          item?.edge_media_to_comment?.count ??
          item?.comment_count ??
          item?.comments ??
          0,
        post_url: item?.shortcode
          ? `https://www.instagram.com/p/${item.shortcode}/`
          : item?.code
          ? `https://www.instagram.com/p/${item.code}/`
          : '#',
        timestamp: item?.taken_at_timestamp
          ? new Date(item.taken_at_timestamp * 1000).toISOString()
          : item?.taken_at
          ? new Date(item.taken_at * 1000).toISOString()
          : '',
        is_video: isVideo,
      }
    })
    .filter((p) => p.image_url)
}

// ── Profile fetch ─────────────────────────────────────────────────────────────
async function fetchProfile(): Promise<InstagramProfile | null> {
  try {
    const url = `https://${HOST}/get_instagram_profile_details?username=${INSTAGRAM_USERNAME}`
    const res = await fetch(url, { headers: getHeaders(), cache: 'no-store' })
    const text = await res.text()
    console.log('[fetchProfile] status:', res.status, 'raw:', text.slice(0, 400))
    if (!res.ok) return null
    const data = JSON.parse(text)
    const u = data?.data || data?.user || data
    return {
      username: u?.username || INSTAGRAM_USERNAME,
      full_name: u?.full_name || '',
      bio: u?.biography || u?.bio || '',
      followers: u?.followers_count ?? u?.follower_count ?? u?.edge_followed_by?.count ?? 0,
      following: u?.following_count ?? u?.following ?? u?.edge_follow?.count ?? 0,
      posts_count: u?.posts_count ?? u?.media_count ?? 0,
      profile_pic_url: u?.profile_pic_url_hd || u?.profile_pic_url || '',
    }
  } catch (e) {
    console.error('[fetchProfile error]', e)
    return null
  }
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const debug = searchParams.get('debug') === '1'

  // ── Guard: missing API key ────────────────────────────────────────────────
  if (!RAPIDAPI_KEY || RAPIDAPI_KEY.trim() === '') {
    console.error('[Instagram API] RAPIDAPI_KEY is missing or empty')
    if (cache) {
      return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true, stale: true })
    }
    return NextResponse.json(
      { error: 'Server configuration error: missing API key', posts: [], profile: null },
      { status: 500 }
    )
  }

  console.log('[Instagram API] Key present, prefix:', RAPIDAPI_KEY.slice(0, 8))

  // ── Debug endpoint: /api/instagram?debug=1 ────────────────────────────────
  // Hits all strategies and returns raw results — use this to diagnose
  if (debug) {
    const s1url = `https://${HOST}/get_instagram_user_id?link=${encodeURIComponent(INSTAGRAM_URL)}`
    const s2url = `https://${HOST}/get_instagram_profile_details?username=${INSTAGRAM_USERNAME}`
    const s3url = `https://${HOST}/get_instagram_profile_posts?username=${INSTAGRAM_USERNAME}`

    const [r1, r2, r3] = await Promise.all([
      fetch(s1url, { headers: getHeaders(), cache: 'no-store' }).then(async r => ({
        status: r.status, body: await r.text()
      })).catch(e => ({ status: 0, body: String(e) })),
      fetch(s2url, { headers: getHeaders(), cache: 'no-store' }).then(async r => ({
        status: r.status, body: await r.text()
      })).catch(e => ({ status: 0, body: String(e) })),
      fetch(s3url, { headers: getHeaders(), cache: 'no-store' }).then(async r => ({
        status: r.status, body: await r.text()
      })).catch(e => ({ status: 0, body: String(e) })),
    ])

    return NextResponse.json({
      key_prefix: RAPIDAPI_KEY.slice(0, 8),
      key_length: RAPIDAPI_KEY.length,
      s1_get_user_id_by_url: { status: r1.status, body: r1.body.slice(0, 800) },
      s2_get_profile_details: { status: r2.status, body: r2.body.slice(0, 800) },
      s3_get_profile_posts: { status: r3.status, body: r3.body.slice(0, 800) },
    })
  }

  try {
    // Return cache if still fresh
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true })
    }

    let posts: InstagramPost[] | null = null
    let profile: InstagramProfile | null = null

    // Strategy 3 first — posts by username directly
    posts = await fetchPostsByUsername()

    if (!posts) {
      console.log('[Instagram API] S3 failed, trying user_id strategies')

      let userId = await fetchUserIdByUrl()

      if (!userId) {
        console.log('[Instagram API] S1 failed, trying S2')
        userId = await fetchUserIdByUsername()
      }

      if (!userId) {
        throw new Error('Could not resolve Instagram user_id via any strategy')
      }

      console.log('[Instagram API] Resolved userId:', userId)
      posts = await fetchPostsByUserId(userId)
    }

    profile = await fetchProfile()

    if (!posts || posts.length === 0) {
      throw new Error('No posts returned from any strategy')
    }

    console.log(`[Instagram API] Success: ${posts.length} posts, profile: ${!!profile}`)
    cache = { posts, profile, timestamp: Date.now() }
    return NextResponse.json({ posts, profile, cached: false })

  } catch (error: any) {
    console.error('[Instagram API error]', error.message)
    if (cache) {
      console.log('[Instagram API] Returning stale cache')
      return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true, stale: true })
    }
    return NextResponse.json({ error: error.message, posts: [], profile: null }, { status: 500 })
  }
}