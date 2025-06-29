import {
  createClient,
  FilteredResponseQueryOptions,
  SanityClient,
} from 'next-sanity'

import { apiVersion, dataset, projectId, useCdn } from '~/lib/sanity/sanity.api'

export function getClient(token?: string): SanityClient {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
    perspective: 'published',
  })
  if (!token) {
    return client
  }
  return client.withConfig({
    token: token,
    useCdn: false,
    ignoreBrowserTokenWarning: true,
  })
}

export function getPreviewClient(preview?: { token: string }): SanityClient {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
    perspective: 'published',
  })
  if (preview) {
    if (!preview.token) {
      throw new Error('You must provide a token to preview drafts')
    }
    return client.withConfig({
      token: preview.token,
      useCdn: false,
      ignoreBrowserTokenWarning: true,
      perspective: 'previewDrafts',
    })
  }
  return client
}

interface ICacheOptions {
  [key: string]: FilteredResponseQueryOptions
}

const TAGS_CACHE: ICacheOptions = {
  ARTIST: { next: { tags: ['artist'] } },
  BOOKING: { next: { tags: ['booking'] } },
  ROOT_LAYOUT_CONTENT: { next: { tags: ['rootLayoutContent'] } },
  LAYOUT_METADATA_CONTENT: { next: { tags: ['layoutMetadataContent'] } },
}

const NO_CACHE: ICacheOptions = {
  ARTIST: { cache: 'no-store' },
  BOOKING: { cache: 'no-store' },
  ROOT_LAYOUT_CONTENT: { cache: 'no-store' },
  LAYOUT_METADATA_CONTENT: { cache: 'no-store' },
}

export const NEXT_CACHE_CONFIG =
  process.env.NODE_ENV === 'production' ? TAGS_CACHE : NO_CACHE
