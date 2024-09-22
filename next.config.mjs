/** @type {import('next').NextConfig} */
const config = {
  images: { remotePatterns: [{ hostname: 'cdn.sanity.io' }] },
  logging: { fetches: { fullUrl: true } },
}

export default config
