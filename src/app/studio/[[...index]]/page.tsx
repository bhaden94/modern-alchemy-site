import Studio from './Studio'

export const dynamic = 'force-static'

export { metadata } from 'next-sanity/studio/metadata'
export { viewport } from 'next-sanity/studio/viewport'

export const maxDuration = 60 // This function can run for up to 60 seconds

export default function StudioPage() {
  return <Studio />
}
