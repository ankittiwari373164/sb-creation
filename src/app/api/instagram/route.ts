// app/api/instagram/route.ts
import { NextResponse } from 'next/server'

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!
const INSTAGRAM_USERNAME = '_sbcreation'
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

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

async function fetchProfile(): Promise<InstagramProfile | null> {
  try {
    const res = await fetch(
      `https://instagram-scraper-20251.p.rapidapi.com/userinfo/?username_or_id=${INSTAGRAM_USERNAME}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': 'instagram-scraper-20251.p.rapidapi.com',
          'x-rapidapi-key': RAPIDAPI_KEY,
        },
      }
    )
    const data = await res.json()
    console.log('[Instagram Profile] raw keys:', JSON.stringify(Object.keys(data)))

    const u = data?.data || data?.user || data
    return {
      username: u?.username || INSTAGRAM_USERNAME,
      full_name: u?.full_name || u?.fullName || '',
      bio: u?.biography || u?.bio || '',
      followers: u?.follower_count ?? u?.followers ?? u?.edge_followed_by?.count ?? 0,
      following: u?.following_count ?? u?.following ?? u?.edge_follow?.count ?? 0,
      posts_count: u?.media_count ?? u?.posts ?? u?.edge_owner_to_timeline_media?.count ?? 0,
      profile_pic_url: u?.profile_pic_url_hd || u?.profile_pic_url || '',
    }
  } catch (e) {
    console.error('[Instagram Profile] error:', e)
    return null
  }
}

async function fetchPosts(): Promise<InstagramPost[]> {
  const res = await fetch(
    `https://instagram-scraper-20251.p.rapidapi.com/userposts/?username_or_id=${INSTAGRAM_USERNAME}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'instagram-scraper-20251.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY,
      },
    }
  )
  if (!res.ok) throw new Error(`RapidAPI posts error: ${res.status}`)
  const data = await res.json()

  const rawItems: any[] = data?.data?.items || data?.items || data?.data || []
  return rawItems
    .slice(0, 12)
    .map((item: any) => ({
      id: String(item?.id || item?.pk || Math.random()),
      image_url:
        item?.image_versions2?.candidates?.[0]?.url ||
        item?.carousel_media?.[0]?.image_versions2?.candidates?.[0]?.url ||
        item?.thumbnail_url || item?.display_url || '',
      caption: item?.caption?.text || item?.caption || '',
      likes: item?.like_count || 0,
      comments: item?.comment_count || 0,
      post_url: item?.code ? `https://www.instagram.com/p/${item.code}/` : '#',
      timestamp: item?.taken_at ? new Date(item.taken_at * 1000).toISOString() : '',
      is_video: item?.media_type === 2 || false,
    }))
    .filter((p) => p.image_url)
}

export async function GET() {
  try {
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true })
    }

    const [profile, posts] = await Promise.all([fetchProfile(), fetchPosts()])
    cache = { posts, profile, timestamp: Date.now() }

    return NextResponse.json({ posts, profile, cached: false })
  } catch (error: any) {
    console.error('[Instagram API] error:', error.message)
    if (cache) {
      return NextResponse.json({ posts: cache.posts, profile: cache.profile, cached: true, stale: true })
    }
    return NextResponse.json({ error: error.message, posts: [], profile: null }, { status: 500 })
  }
}