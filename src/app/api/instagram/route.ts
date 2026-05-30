import { NextResponse } from 'next/server'

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '3f5b6051b4mshf5863ac3ae6a88ap118d8ejsn35f5694b53b7'
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

const HEADERS = {
  'Content-Type': 'application/json',
  'x-rapidapi-host': HOST,
  'x-rapidapi-key': RAPIDAPI_KEY,
}

async function fetchUserId(): Promise<string> {
  const res = await fetch(
    `https://${HOST}/get_instagram_user_id?link=${encodeURIComponent(INSTAGRAM_URL)}`,
    { headers: HEADERS }
  )
  const data = await res.json()
  const userId =
    data?.data?.user_id ||
    data?.data?.id ||
    data?.user_id ||
    data?.id ||
    null
  if (!userId) throw new Error(`Could not get user_id. Keys: ${Object.keys(data)}`)
  return String(userId)
}

async function fetchPosts(userId: string): Promise<InstagramPost[]> {
  const res = await fetch(
    `https://${HOST}/get_instagram_posts_details_from_id?user_id=${userId}`,
    { headers: HEADERS }
  )
  if (!res.ok) throw new Error(`Posts fetch failed: ${res.status}`)
  const data = await res.json()

  const rawItems: any[] = data?.data?.posts || []

  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new Error(`No posts found. data.data keys: ${Object.keys(data?.data || {})}`)
  }

  return rawItems
    .slice(0, 12)
    .map((item: any) => {
      const isVideo =
        item?.__typename === 'GraphVideo' ||
        item?.is_video === true

      const carouselImage =
        item?.edge_sidecar_to_children?.edges?.[0]?.node?.display_url

      const imageUrl =
        item?.display_url ||
        carouselImage ||
        item?.thumbnail_url ||
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

async function fetchProfile(): Promise<InstagramProfile | null> {
  try {
    const res = await fetch(
      `https://${HOST}/get_instagram_profile_details?username=${INSTAGRAM_USERNAME}`,
      { headers: HEADERS }
    )
    const data = await res.json()
    const u = data?.data || data?.user || data

    return {
      username: u?.username || INSTAGRAM_USERNAME,
      full_name: u?.full_name || '',
      bio: u?.biography || u?.bio || '',
      followers: u?.followers_count ?? u?.follower_count ?? 0,
      following: u?.following_count ?? u?.following ?? 0,
      posts_count: 0,
      profile_pic_url: u?.profile_pic_url_hd || u?.profile_pic_url || '',
    }
  } catch (e) {
    console.error('[Profile error]', e)
    return null
  }
}

export async function GET() {
  try {
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true })
    }

    const userId = await fetchUserId()
    const [posts, profile] = await Promise.all([
      fetchPosts(userId),
      fetchProfile(),
    ])

    cache = { posts, profile, timestamp: Date.now() }
    return NextResponse.json({ posts, profile, cached: false })

  } catch (error: any) {
    console.error('[Instagram API error]', error.message)
    if (cache) {
      return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true, stale: true })
    }
    return NextResponse.json({ error: error.message, posts: [], profile: null }, { status: 500 })
  }
}