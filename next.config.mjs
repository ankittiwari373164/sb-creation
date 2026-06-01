/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.cdninstagram.com' },
      { protocol: 'https', hostname: '**.fbcdn.net' },
    ],
    // Next 16's image optimizer blocks hosts that resolve to "private" IPs.
    // On NAT64 / IPv6-only networks, public hosts (e.g. Supabase behind
    // Cloudflare) resolve to the 64:ff9b::/96 prefix and get wrongly flagged.
    // Allow it in local dev only; keep the SSRF protection on in production.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
    // Next 16 defaults images.qualities to [75]; we use 90 in a few places.
    qualities: [75, 90],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Note: We removed the 'eslint' block because Next 15+ handles it differently
};

export default nextConfig;