import { NextResponse } from 'next/server'

// SocialAPI.ai - Unified social media API with a true forever-free tier
// Free plan: 2 social profiles, 50 interactions/month (unlimited reads), no credit card
// More info: https://social-api.ai/pricing
const SOCIALAPI_KEY = process.env.SOCIALAPI_KEY
const SOCIALAPI_BASE = 'https://api.social-api.ai/v1'
const USERNAME = '_sbcreation'

// Cache configuration - reads (inbox) are unlimited on free tier, no need to be aggressive
// Still cache for 24h to reduce API calls and provide better UX
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

// Bumped whenever a fix changes what counts as valid cached data (e.g. the
// video-URL guard added below) — any cache entry written by older code
// automatically gets treated as stale and re-fetched, instead of silently
// serving a bug's output for up to 24h after the bug itself is fixed.
const CACHE_VERSION = 2

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
  version: number
}

let cache: Cache | null = null

// Belt-and-suspenders: never serve an image_url that's actually a video file,
// no matter where it came from (fresh fetch or an old cache entry). This is
// the same check used when building covers, applied once more as a final
// safety net before anything is cached or returned.
function isVideoUrl(url: string): boolean {
  return /\.mp4(\?|$)/i.test(url) || /video-|\/v\/t2\//i.test(url)
}
function sanitizePosts(posts: InstagramPost[]): InstagramPost[] {
  return posts.map(p => (p.image_url && isVideoUrl(p.image_url)) ? { ...p, image_url: '' } : p)
}

function headers() {
  return {
    'Authorization': `Bearer ${SOCIALAPI_KEY}`,
    'Content-Type': 'application/json',
  }
}

async function apiFetch(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${SOCIALAPI_BASE}${path}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  console.log('[IG-SocialAPI] GET', url.toString())

  const res = await fetch(url.toString(), {
    headers: headers(),
    cache: 'no-store',
  })

  const text = await res.text()
  // Longer slice so we can actually see the shape of items in server logs
  // when diagnosing (the previous 400-char cutoff hid the media/image field).
  console.log('[IG-SocialAPI]', res.status, text.slice(0, 1500))

  let data: any = {}
  try {
    data = JSON.parse(text)
  } catch {}

  return { ok: res.status === 200, status: res.status, data, raw: text }
}

// Live follower/following count + recent media covers, all from ONE request
// to Instagram's public profile endpoint. SocialAPI has no live "refresh
// followers" call for Instagram, and its /inbox/comments response never
// includes a cover image for reels — but this single public endpoint
// (the same one instagram.com's own website calls to render a profile page)
// returns both the counts AND a `edge_owner_to_timeline_media` list with each
// recent post's thumbnail, including reels. So one call here covers both gaps
// at zero extra request cost. No login or extra API key needed — public data.
async function fetchLiveInstagramCounts(username: string): Promise<{
  followers: number
  following: number
  posts_count: number
  mediaByShortcode: Record<string, string>
  error?: string
}> {
  const empty = { followers: 0, following: 0, posts_count: 0, mediaByShortcode: {} }
  try {
    const res = await fetch(
      `https://i.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`,
      {
        headers: {
          // Public web-app id Instagram's own site uses for this endpoint.
          'x-ig-app-id': '936619743392459',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        },
        cache: 'no-store',
      }
    )
    const bodyText = await res.text()
    if (res.status !== 200) {
      // Most common cause in production: Instagram blocking the server's
      // (often datacenter/hosting) IP with a 403/429, not a code bug.
      console.warn('[IG-live] web_profile_info returned', res.status, bodyText.slice(0, 300))
      return { ...empty, error: `HTTP ${res.status}: ${bodyText.slice(0, 200)}` }
    }
    let json: any = {}
    try { json = JSON.parse(bodyText) } catch { return { ...empty, error: 'Non-JSON response' } }

    const user = json?.data?.user
    if (!user) return { ...empty, error: 'No user object in response' }

    // Build shortcode -> thumbnail map from the recent-media edges. This
    // covers both photo posts AND reels — Instagram's own profile grid
    // renders reel covers from this exact same field (thumbnail_src /
    // display_url), which is what you're seeing work on instagram.com itself.
    const mediaByShortcode: Record<string, string> = {}
    const edges = user?.edge_owner_to_timeline_media?.edges
    if (Array.isArray(edges)) {
      for (const edge of edges) {
        const node = edge?.node
        const shortcode = node?.shortcode
        const thumb = node?.thumbnail_src || node?.display_url || node?.thumbnail_resources?.[0]?.src
        if (shortcode && thumb) mediaByShortcode[shortcode] = thumb
      }
    }

    return {
      followers: user?.edge_followed_by?.count ?? 0,
      following: user?.edge_follow?.count ?? 0,
      posts_count: user?.edge_owner_to_timeline_media?.count ?? 0,
      mediaByShortcode,
    }
  } catch (e: any) {
    console.warn('[IG-live] Failed to fetch live counts:', e?.message)
    return { ...empty, error: e?.message || 'Unknown fetch error' }
  }
}

// Parse SocialAPI account/profile response into InstagramProfile.
// Followers/following from SocialAPI itself are always 0 for Instagram (that
// call never returns them post-connection — see fetchLiveInstagramCounts
// above for how we actually get live numbers). This function just handles
// the rest of the profile fields (bio, avatar, etc).
function parseProfile(accountData: any, postsCount: number): InstagramProfile {
  return {
    username: accountData?.username || USERNAME,
    full_name: accountData?.display_name || accountData?.name || '',
    bio: accountData?.bio || accountData?.description || '',
    followers: accountData?.followers_count ?? accountData?.follower_count ?? 0,
    following: accountData?.following_count ?? 0,
    posts_count: accountData?.media_count ?? accountData?.posts_count ?? postsCount,
    profile_pic_url: accountData?.profile_picture_url || accountData?.avatar_url || '',
  }
}

// Parse SocialAPI's "posts with comments" inbox response.
// Confirmed real shape from server logs: each item is FLAT (not nested under
// `post`/`media`), caption is `content`, image is `thumbnail`, and counts are
// `like_count` / `comment_count`. We keep the older guessed field names as
// fallbacks in case a future response shape differs.
// Extracts the /p/XXXX/ or /reel/XXXX/ shortcode from a permalink, used to
// match SocialAPI posts back to Instagram's own media list for cover backfill.
function extractShortcode(permalink: string): string {
  const match = String(permalink || '').match(/\/(?:p|reel)\/([^/]+)/)
  return match ? match[1] : ''
}

function parsePosts(items: any[]): InstagramPost[] {
  if (!Array.isArray(items)) return []

  return items
    .slice(0, 9)
    .map((item: any) => {
      try {
        const post = item?.post || item?.media || item

        const isVideo =
          post?.media_type === 'video' ||
          post?.is_video === true ||
          // SocialAPI's inbox items don't include a media_type/is_video
          // field at all — the only reliable signal is the permalink itself.
          /\/reel\//.test(String(post?.permalink || ''))

        const firstAttachment = post?.attachments?.[0] || post?.media?.[0] || post?.attachment
        const imageUrl =
          post?.thumbnail ||
          post?.media_url ||
          post?.thumbnail_url ||
          post?.image_url ||
          post?.display_picture_url ||
          post?.picture ||
          post?.image ||
          // Reel/video-specific cover fields — SocialAPI's photo posts use
          // `thumbnail`, but reels appear to use a different field for the
          // cover frame. Trying every likely name until we confirm the real
          // one via the raw JSON logged below.
          post?.cover_url ||
          post?.cover ||
          post?.video_thumbnail ||
          post?.video_thumbnail_url ||
          post?.thumbnail_image_url ||
          post?.media?.thumbnail ||
          post?.media?.thumbnail_url ||
          post?.media?.cover_url ||
          firstAttachment?.media_url ||
          firstAttachment?.url ||
          firstAttachment?.image_url ||
          firstAttachment?.thumbnail_url ||
          firstAttachment?.thumbnail ||
          firstAttachment?.cover_url ||
          ''

        const postUrl = post?.permalink || post?.url || post?.post_url || `https://www.instagram.com/${USERNAME}/`

        let timestamp = ''
        if (typeof post?.published_at === 'string' && !Number.isNaN(Date.parse(post.published_at))) {
          timestamp = new Date(post.published_at).toISOString()
        } else if (typeof post?.created_at === 'string' && !Number.isNaN(Date.parse(post.created_at))) {
          timestamp = new Date(post.created_at).toISOString()
        } else if (typeof post?.timestamp === 'string' && !Number.isNaN(Date.parse(post.timestamp))) {
          timestamp = new Date(post.timestamp).toISOString()
        } else if (post?.published_at_timestamp) {
          timestamp = new Date(Number(post.published_at_timestamp) * 1000).toISOString()
        }

        const caption =
          typeof post?.content === 'string' ? post.content :
          typeof post?.text === 'string' ? post.text :
          typeof post?.caption === 'string' ? post.caption : ''

        const commentsCount =
          post?.comment_count ??
          post?.comments_count ??
          (Array.isArray(item?.comments) ? item.comments.length : 0)

        return {
          id: String(post?.id || post?.post_id || post?.platform_id || item?.id || `post-${Math.random().toString(36).slice(2)}`),
          // No placeholder file fallback — leave empty when SocialAPI simply
          // doesn't supply one (confirmed: reels return "thumbnail": null
          // with no other image field present at all, not a naming issue).
          // The frontend renders a proper gradient+icon card for this case
          // instead of trying to load a broken image src.
          image_url: imageUrl,
          caption,
          likes: post?.like_count ?? post?.likes_count ?? 0,
          comments: commentsCount,
          post_url: postUrl,
          timestamp,
          is_video: isVideo,
        }
      } catch (e) {
        console.error('[IG-SocialAPI] Failed to parse post item:', e)
        return null
      }
    })
    .filter((p): p is InstagramPost => p !== null)
}

// Fetch account data and recent posts from SocialAPI
async function fetchAll(): Promise<{ posts: InstagramPost[]; profile: InstagramProfile } | null> {
  if (!SOCIALAPI_KEY?.trim()) {
    console.error('[IG-SocialAPI] SOCIALAPI_KEY not configured')
    return null
  }

  try {
    // 1) List connected accounts to find Instagram profile
    const accountsRes = await apiFetch('/accounts')
    if (!accountsRes.ok) {
      console.error('[IG-SocialAPI] Failed to list accounts:', accountsRes.status)
      return null
    }

    let accounts = accountsRes.data?.data || accountsRes.data?.accounts || []
    if (Array.isArray(accountsRes.data)) {
      accounts = accountsRes.data
    }

    console.log('[IG-SocialAPI] Found accounts:', accounts.length, 'Account platforms:', accounts.map((a: any) => a?.platform))

    const instagramAccount = accounts.find((acc: any) => acc?.platform === 'instagram' || acc?.platform_id === 'instagram')

    if (!instagramAccount) {
      console.error('[IG-SocialAPI] No Instagram account found. Accounts:', accounts.map((a: any) => a?.platform))
      return null
    }

    const accountId = instagramAccount.id || instagramAccount.account_id

    // 2) Fetch recent posts (with their comments/engagement) via the unified
    // inbox endpoint. SocialAPI doesn't expose a separate "/accounts/{id}/posts"
    // route (that returns 404) — post history comes back from
    // /v1/inbox/comments, scoped to this account with the account_id query param.
    const postsRes = await apiFetch('/inbox/comments', { account_id: accountId })
    if (!postsRes.ok) {
      console.error('[IG-SocialAPI] Failed to fetch posts:', postsRes.status)
      return null
    }

    let items = postsRes.data?.data || postsRes.data?.posts || []
    if (Array.isArray(postsRes.data)) {
      items = postsRes.data
    }

    if (!Array.isArray(items) || items.length === 0) {
      console.error('[IG-SocialAPI] No posts returned. Raw:', postsRes.raw.slice(0, 1500))
      return null
    }

    const posts = parsePosts(items)

    // Log the full raw shape of any item with no image at all, purely for
    // visibility — this is now expected for reels (SocialAPI doesn't supply
    // a cover for them), not treated as an error.
    posts.forEach((p, i) => {
      if (!p.image_url && items[i]) {
        console.log(`[IG-SocialAPI] No cover image for item ${i} (is_video=${p.is_video}) — this is expected for reels.`)
      }
    })

    const profile = parseProfile(instagramAccount, items.length)

    // Live follower/following/post counts + reel thumbnails via the free
    // direct Instagram scrape. (SociaVault removed — replaced by RapidAPI
    // sources, to be wired in next.) Falls back to a manually-set number if
    // the direct scrape is rate-limited/blocked, so the UI never just shows 0.
    const source = 'direct-scrape'
    const liveCounts = await fetchLiveInstagramCounts(profile.username || USERNAME)

    if (liveCounts.error) {
      console.warn(`[IG-live] Could not get live counts from ${source}, using fallback if configured:`, liveCounts.error)
      // Fall back to a manually-set number rather than showing 0. Update
      // these occasionally by hand; they're only used when the live fetch fails.
      const followersOverride = Number(process.env.INSTAGRAM_FOLLOWERS_OVERRIDE)
      const followingOverride = Number(process.env.INSTAGRAM_FOLLOWING_OVERRIDE)
      if (Number.isFinite(followersOverride)) profile.followers = followersOverride
      if (Number.isFinite(followingOverride)) profile.following = followingOverride
    } else {
      console.log(`[IG-live] Got live counts from: ${source}`)
      profile.followers = liveCounts.followers
      profile.following = liveCounts.following
      if (liveCounts.posts_count > 0) profile.posts_count = liveCounts.posts_count
    }

    // Backfill any post SocialAPI returned with no cover image (this is
    // always reels, per the logging below) using whichever live source
    // succeeded above — zero extra cost, matched by shortcode.
    let backfilledCount = 0
    for (const p of posts) {
      if (!p.image_url) {
        const shortcode = extractShortcode(p.post_url)
        const liveThumb = shortcode ? liveCounts.mediaByShortcode[shortcode] : undefined
        console.log(`[IG-live] Looking for shortcode "${shortcode}" (from ${p.post_url}) — ${liveThumb ? 'FOUND' : 'not in live source list'}`)
        if (liveThumb) {
          p.image_url = liveThumb
          backfilledCount++
        }
      }
    }
    if (backfilledCount > 0) {
      console.log(`[IG-live] Backfilled ${backfilledCount} reel cover(s) from ${source}`)
    }

    const noImageCount = posts.filter(p => !p.image_url).length
    if (noImageCount > 0) {
      console.log(`[IG-SocialAPI] ${noImageCount}/${posts.length} posts still have no cover image (older reels beyond what the profile endpoint returns, or the live fetch was blocked this cycle)`)
    }
    console.log('[IG-SocialAPI] Parsed', posts.length, 'posts from', items.length, 'items')

    if (posts.length === 0) return null

    return { posts, profile }
  } catch (err: any) {
    console.error('[IG-SocialAPI] Fatal error during fetch:', err.message)
    return null
  }
}

// ── GET handler ───────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const isBust = searchParams.get('bust') === '1'
  const isDebug = searchParams.get('debug') === '1'

  if (isBust) {
    cache = null
    console.log('[IG-SocialAPI] Cache cleared')
  }

  // ?debug=1 — lightweight diagnostics
  if (isDebug) {
    if (!SOCIALAPI_KEY?.trim()) {
      return NextResponse.json({
        error: 'SOCIALAPI_KEY not set. Add it to your .env.local or hosting dashboard (e.g., Vercel Project Settings → Environment Variables).',
        docs: 'https://docs.social-api.ai/quickstart',
      }, { status: 500 })
    }

    try {
      const accountsRes = await apiFetch('/accounts')
      let accounts = accountsRes.data?.data || accountsRes.data?.accounts || []
      if (Array.isArray(accountsRes.data)) {
        accounts = accountsRes.data
      }
      const instagramAccount = accounts.find((acc: any) => acc?.platform === 'instagram')

      let postsStatus: number | null = null
      let postsLength: number | null = null
      let postsSnippet = ''

      if (instagramAccount?.id) {
        const postsRes = await apiFetch('/inbox/comments', { account_id: instagramAccount.id })
        postsStatus = postsRes.status
        postsSnippet = postsRes.raw.slice(0, 1500)
        const items = Array.isArray(postsRes.data) ? postsRes.data : (postsRes.data?.data || postsRes.data?.posts)
        postsLength = Array.isArray(items) ? items.length : null
      }

      return NextResponse.json({
        key_prefix: SOCIALAPI_KEY?.slice(0, 12),
        accounts_status: accountsRes.status,
        accounts_count: accounts.length,
        instagram_account: instagramAccount ? {
          id: instagramAccount.id,
          username: instagramAccount.username,
          display_name: instagramAccount.display_name,
          followers: instagramAccount.followers_count,
          platform: instagramAccount.platform,
        } : null,
        posts_status: postsStatus,
        posts_count: postsLength,
        posts_snippet: postsSnippet,
        live_counts: instagramAccount?.username
          ? await fetchLiveInstagramCounts(instagramAccount.username)
          : null,
      })
    } catch (err: any) {
      return NextResponse.json({
        error: err.message,
        debug: 'Check your SOCIALAPI_KEY and Instagram account connection',
      }, { status: 500 })
    }
  }

  if (!SOCIALAPI_KEY?.trim()) {
    if (cache) {
      return NextResponse.json({
        posts: sanitizePosts(cache.posts),
        profile: cache.profile,
        cached: true,
        stale: true,
        error: 'Missing SOCIALAPI_KEY - serving stale cache',
      })
    }
    return NextResponse.json({
      error: 'Missing SOCIALAPI_KEY',
      posts: [],
      profile: null,
    }, { status: 500 })
  }

  // Serve from cache if valid AND written by the current code version — a
  // version mismatch means the cache predates a fix (like the video-URL
  // guard) and must not be trusted, even if it hasn't expired yet.
  if (cache && cache.version === CACHE_VERSION && !isBust && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json({
      posts: sanitizePosts(cache.posts),
      profile: cache.profile,
      cached: true,
      cache_age_ms: Date.now() - cache.timestamp,
    })
  }

  try {
    const result = await fetchAll()

    if (!result || result.posts.length === 0) {
      if (cache) {
        console.log('[IG-SocialAPI] Fetch failed, serving stale cache')
        return NextResponse.json({
          posts: sanitizePosts(cache.posts),
          profile: cache.profile,
          cached: true,
          stale: true,
        })
      }
      throw new Error('No posts returned. Visit /api/instagram?debug=1 to diagnose.')
    }

    cache = {
      posts: sanitizePosts(result.posts),
      profile: result.profile,
      timestamp: Date.now(),
      version: CACHE_VERSION,
    }
    console.log(
      `[IG-SocialAPI] Cached ${result.posts.length} posts | followers: ${result.profile?.followers}`,
    )
    return NextResponse.json({
      posts: cache.posts,
      profile: result.profile,
      cached: false,
    })
  } catch (err: any) {
    console.error('[IG-SocialAPI] Fatal error:', err.message)
    if (cache) {
      return NextResponse.json({
        posts: sanitizePosts(cache.posts),
        profile: cache.profile,
        cached: true,
        stale: true,
        error: err.message,
      })
    }
    return NextResponse.json({
      error: err.message,
      posts: [],
      profile: null,
    }, { status: 500 })
  }
}