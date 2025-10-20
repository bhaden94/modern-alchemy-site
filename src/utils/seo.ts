import type { Metadata } from 'next'

import { LayoutMetadataContent } from '~/schemas/pages/layoutMetadataContent'

/**
 * Generate LocalBusiness JSON-LD structured data for local SEO
 */
export function generateLocalBusinessSchema(
  metadata: LayoutMetadataContent,
  url?: string,
): Record<string, any> {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'TattooShop'],
    name: metadata.businessName,
    description: metadata.description,
  }

  if (metadata.address && metadata.city && metadata.state && metadata.zipCode) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: metadata.address,
      addressLocality: metadata.city,
      addressRegion: metadata.state,
      postalCode: metadata.zipCode,
      addressCountry: 'US',
    }
  }

  if (metadata.phoneNumber) {
    schema.telephone = metadata.phoneNumber
  }

  if (metadata.latitude && metadata.longitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: metadata.latitude,
      longitude: metadata.longitude,
    }
  }

  if (metadata.openingHours) {
    schema.openingHours = metadata.openingHours
  }

  if (url) {
    schema.url = url
  }

  // Add social media profiles
  const sameAs: string[] = []
  if (metadata.facebookUrl) sameAs.push(metadata.facebookUrl)
  if (metadata.instagramUrl) sameAs.push(metadata.instagramUrl)
  if (sameAs.length > 0) {
    schema.sameAs = sameAs
  }

  return schema
}

/**
 * Generate Organization JSON-LD structured data
 */
export function generateOrganizationSchema(
  metadata: LayoutMetadataContent,
  logoUrl?: string,
): Record<string, any> {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: metadata.businessName,
    description: metadata.description,
  }

  if (logoUrl) {
    schema.logo = logoUrl
  }

  if (metadata.address && metadata.city && metadata.state && metadata.zipCode) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: metadata.address,
      addressLocality: metadata.city,
      addressRegion: metadata.state,
      postalCode: metadata.zipCode,
      addressCountry: 'US',
    }
  }

  // Add social media profiles
  const sameAs: string[] = []
  if (metadata.facebookUrl) sameAs.push(metadata.facebookUrl)
  if (metadata.instagramUrl) sameAs.push(metadata.instagramUrl)
  if (sameAs.length > 0) {
    schema.sameAs = sameAs
  }

  return schema
}

/**
 * Generate Person JSON-LD structured data for artist pages
 */
export function generatePersonSchema(
  name: string,
  jobTitle: string,
  imageUrl?: string,
  description?: string,
): Record<string, any> {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
  }

  if (imageUrl) {
    schema.image = imageUrl
  }

  if (description) {
    schema.description = description
  }

  return schema
}

/**
 * Generate Article JSON-LD structured data for blog posts
 */
export function generateArticleSchema(
  title: string,
  description: string,
  author: string,
  publishedDate: string,
  imageUrl?: string,
  url?: string,
): Record<string, any> {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished: publishedDate,
  }

  if (imageUrl) {
    schema.image = imageUrl
  }

  if (url) {
    schema.url = url
  }

  return schema
}

/**
 * Enhanced metadata generator with extended OpenGraph (optimized for Facebook/Instagram)
 * Uses Next.js Metadata type for type safety
 */
interface EnhancedMetadataOptions {
  title: string
  description: string
  imageUrl?: string
  url?: string
  type?: 'website' | 'article'
  siteName?: string
  locale?: string
  keywords?: string[]
  robots?: Metadata['robots']
}

export function generateEnhancedMetadata(
  options: EnhancedMetadataOptions,
): Metadata {
  const {
    title,
    description,
    imageUrl,
    url,
    type = 'website',
    siteName,
    locale = 'en_US',
    keywords,
    robots,
  } = options

  const metadata: Metadata = {
    title,
    description,
  }

  // Add keywords if provided
  if (keywords && keywords.length > 0) {
    metadata.keywords = keywords
  }

  // Add robots directives if provided
  if (robots) {
    metadata.robots = robots
  }

  // Add canonical URL if provided
  if (url) {
    metadata.alternates = {
      canonical: url,
    }
  }

  // Enhanced OpenGraph (optimized for Facebook and Instagram)
  metadata.openGraph = {
    title,
    description,
    type,
    locale,
    ...(siteName && { siteName }),
    ...(url && { url }),
    ...(imageUrl && {
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    }),
  }

  // Twitter Card (still good to include for Twitter shares even without an account)
  // This ensures content looks good if anyone shares your site on Twitter
  metadata.twitter = {
    card: 'summary_large_image',
    title,
    description,
    ...(imageUrl && { images: [imageUrl] }),
  }

  return metadata
}

/**
 * Generate location-rich description for SEO
 */
export function generateLocationDescription(
  baseDescription: string,
  metadata: LayoutMetadataContent,
): string {
  const locationParts = [metadata.city, metadata.state]
    .filter(Boolean)
    .join(', ')

  if (locationParts) {
    return `${baseDescription} Located in ${locationParts}.`
  }

  return baseDescription
}

/**
 * Helper to create JSON-LD script tag content
 */
export function createJsonLdScript(schema: Record<string, any>) {
  return {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(schema) },
  }
}
