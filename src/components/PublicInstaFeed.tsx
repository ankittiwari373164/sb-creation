"use client";
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Heart, MessageCircle, Play, X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import type { InstagramPost, InstagramProfile } from '@/app/api/instagram/route';

const INSTAGRAM_URL = 'https://www.instagram.com/_sbcreation';

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

function formatDate(iso: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function getShortcode(postUrl: string): string {
  const match = postUrl.match(/\/p\/([^/]+)/)
  return match ? match[1] : ''
}

// ─── Post Popup ────────────────────────────────────────────────────────────────
function PostPopup({
  post,
  posts,
  profile,
  onClose,
}: {
  post: InstagramPost
  posts: InstagramPost[]
  profile: InstagramProfile | null
  onClose: () => void
}) {
  const [current, setCurrent] = useState(post)
  const idx = posts.findIndex((p) => p.id === current.id)

  const prev = useCallback(() => {
    if (idx > 0) setCurrent(posts[idx - 1])
  }, [idx, posts])

  const next = useCallback(() => {
    if (idx < posts.length - 1) setCurrent(posts[idx + 1])
  }, [idx, posts])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, prev, next])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const shortcode = getShortcode(current.post_url)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-3xl max-h-[90vh] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-gray-100 transition"
        >
          <X size={16} className="text-[#2d2416]" />
        </button>

        {/* Media side */}
        <div className="relative w-full md:w-[55%] bg-black flex-shrink-0 min-h-[300px] md:min-h-[420px]">
          {current.is_video && shortcode ? (
            <iframe
              key={current.id}
              src={`https://www.instagram.com/p/${shortcode}/embed/`}
              className="w-full"
              style={{ border: 'none', minHeight: '420px', width: '100%' }}
              scrolling="no"
              allowFullScreen
            />
          ) : (
            <div className="relative w-full h-full min-h-[300px] md:min-h-[420px]">
              <Image
                src={current.image_url}
                alt={current.caption?.slice(0, 60) || 'Instagram post'}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Prev / Next */}
          {idx > 0 && (
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition"
            >
              <ChevronLeft size={18} className="text-[#2d2416]" />
            </button>
          )}
          {idx < posts.length - 1 && (
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition"
            >
              <ChevronRight size={18} className="text-[#2d2416]" />
            </button>
          )}
        </div>

        {/* Info side */}
        <div className="flex flex-col flex-1 overflow-hidden">

          {/* Profile header */}
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#efefef]">
            <div className="relative w-9 h-9 flex-shrink-0">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-[2px]">
                <div className="w-full h-full rounded-full bg-white p-[1.5px] overflow-hidden relative">
                  {profile?.profile_pic_url ? (
                    <Image src={profile.profile_pic_url} alt="Profile" fill className="object-cover rounded-full" />
                  ) : (
                    <Image src="/logo.png" alt="SB Creation" fill className="object-cover rounded-full" />
                  )}
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#2d2416] text-[13px]">@_sbcreation</p>
              {current.timestamp && (
                <p className="text-[10px] text-[#6b6b6b]">{formatDate(current.timestamp)}</p>
              )}
            </div>
            <Link
              href={current.post_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-[#0F5A7E] font-medium hover:text-[#d92b7a] transition"
            >
              <ExternalLink size={12} />
              Open
            </Link>
          </div>

          {/* Caption */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {current.caption ? (
              <p className="text-[13px] text-[#2d2416] leading-[1.6] whitespace-pre-line">
                <span className="font-semibold mr-1.5">@_sbcreation</span>
                {current.caption}
              </p>
            ) : (
              <p className="text-[13px] text-[#9b9b9b] italic">No caption</p>
            )}
          </div>

          {/* Likes + Comments */}
          <div className="px-4 py-3 border-t border-[#efefef] flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[13px] text-[#2d2416] font-semibold">
              <Heart size={15} className="text-[#e44b2f] fill-[#e44b2f]" />
              {formatCount(current.likes)}
              <span className="font-normal text-[#6b6b6b] text-[12px]">likes</span>
            </span>
            <span className="flex items-center gap-1.5 text-[13px] text-[#2d2416] font-semibold">
              <MessageCircle size={15} className="text-[#0F5A7E]" />
              {formatCount(current.comments)}
              <span className="font-normal text-[#6b6b6b] text-[12px]">comments</span>
            </span>
          </div>

          {/* CTA */}
          <div className="px-4 pb-4">
            <Link
              href={current.post_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#2d2416] text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-[#d92b7a] transition-all"
            >
              <Instagram size={12} />
              View on Instagram
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Post Card ─────────────────────────────────────────────────────────────────
function PostCard({
  post,
  onClick,
}: {
  post: InstagramPost
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      className="block w-full group relative rounded-[10px] overflow-hidden bg-[#f3ede8] cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-square w-full">
        <Image
          src={post.image_url}
          alt={post.caption?.slice(0, 60) || 'Instagram post'}
          fill
          sizes="33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {post.is_video && (
          <div className="absolute top-2 right-2 z-10 bg-black/50 rounded-full p-1">
            <Play size={9} className="text-white fill-white" />
          </div>
        )}
        <div
          className={`absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1.5 transition-opacity duration-300 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-white text-[12px] font-bold drop-shadow">
              <Heart size={13} className="fill-white text-white" />
              {formatCount(post.likes)}
            </span>
            <span className="flex items-center gap-1 text-white text-[12px] font-bold drop-shadow">
              <MessageCircle size={13} className="fill-white text-white" />
              {formatCount(post.comments)}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[#f0ebe6] rounded ${className}`} />
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function PublicInstaFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [profile, setProfile] = useState<InstagramProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activePost, setActivePost] = useState<InstagramPost | null>(null)

  useEffect(() => {
    fetch('/api/instagram')
      .then((r) => r.json())
      .then((data) => {
        if (data.posts?.length) setPosts(data.posts)
        else setError(true)
        if (data.profile) setProfile(data.profile)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      {activePost && (
        <PostPopup
          post={activePost}
          posts={posts}
          profile={profile}
          onClose={() => setActivePost(null)}
        />
      )}

      <section
        className="relative py-6 md:py-10 px-4 md:px-6"
        style={{
          backgroundImage: "url('/instagram-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Soft overlay so content stays readable */}
        <div className="absolute inset-0 bg-white/0 backdrop-blur-[0px]" />

        {/* All content sits above overlay */}
        <div className="relative z-10">
          <div className="container mx-auto max-w-3xl">

            {/* Header */}
            <div className="text-center mb-6 md:mb-8">
              <span className="text-[#0F5A7E] text-[8px] md:text-[10px] font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase block mb-1.5 md:mb-2">
                Follow Us
              </span>
              <h2 className="text-xl md:text-3xl lg:text-4xl font-serif text-[#2d2416] mb-1.5 md:mb-3">
                The <span className="italic font-semibold text-[#d92b7a]">SB Edit</span>
              </h2>
              <p className="text-[#2d2416] text-xs md:text-sm opacity-70">
                Curated moments from our Instagram feed
              </p>
            </div>

            {/* Profile Card */}
            <div className="border border-[#efefef] rounded-2xl p-4 md:p-5 mb-3 md:mb-4 flex items-center justify-between gap-4 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 md:gap-4">

                {/* Avatar */}
                <div className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0">
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-[2.5px]">
                    <div className="w-full h-full rounded-full bg-white p-[2px] overflow-hidden relative">
                      {loading ? (
                        <Skeleton className="w-full h-full rounded-full" />
                      ) : profile?.profile_pic_url ? (
                        <Image src={profile.profile_pic_url} alt="Profile" fill className="object-cover rounded-full" />
                      ) : (
                        <Image src="/logo.png" alt="SB Creation" fill className="object-cover rounded-full" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div>
                  <p className="font-semibold text-[#2d2416] text-[14px] md:text-[15px]">
                    {profile?.username ? `@${profile.username}` : '@_sbcreation'}
                  </p>
                  <div className="flex items-center gap-3 md:gap-4 mt-1.5">
                    {loading ? (
                      <>
                        <Skeleton className="w-12 h-8" />
                        <Skeleton className="w-12 h-8" />
                      </>
                    ) : (
                      <>
                        {[
                          { label: 'Followers', value: profile?.followers ?? 0 },
                          { label: 'Following', value: profile?.following ?? 0 },
                        ].map((stat, i, arr) => (
                          <React.Fragment key={stat.label}>
                            <div className="text-center">
                              <p className="text-[13px] md:text-[14px] font-bold text-[#2d2416] leading-none">
                                {formatCount(stat.value)}
                              </p>
                              <p className="text-[10px] md:text-[11px] text-[#6b6b6b] mt-0.5">{stat.label}</p>
                            </div>
                            {i < arr.length - 1 && <div className="w-px h-6 bg-[#efefef]" />}
                          </React.Fragment>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Follow Button */}
              <Link
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 md:px-5 py-2 md:py-2.5 bg-[#2d2416] text-white rounded-full text-[11px] md:text-[12px] font-semibold hover:bg-[#d92b7a] transition-all"
              >
                <Instagram size={13} />
                Follow
              </Link>
            </div>

            {/* 3-col Grid */}
            {error ? (
              <div className="text-center py-10 text-[#6b6b6b] text-sm">
                Could not load posts.{' '}
                <Link href={INSTAGRAM_URL} target="_blank" className="text-[#d92b7a] underline">
                  Visit our Instagram
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1 md:gap-1.5">
                {loading
                  ? Array.from({ length: 9 }).map((_, i) => (
                      <Skeleton key={i} className="aspect-square w-full rounded-[10px]" />
                    ))
                  : posts.slice(0, 9).map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onClick={() => setActivePost(post)}
                      />
                    ))}
              </div>
            )}

            {/* CTA */}
            <div className="mt-5 md:mt-6 flex justify-center">
              <Link
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 md:px-7 py-2 md:py-2.5 bg-[#2d2416] text-white rounded-full font-bold uppercase text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] shadow-lg hover:bg-[#0F5A7E] transition-all"
              >
                <Instagram size={11} />
                View all on Instagram
              </Link>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}