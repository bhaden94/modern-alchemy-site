import { groq } from 'next-sanity'
import { SanityClient } from 'next-sanity'

import { Blog } from '~/schemas/models/blog'

import { NEXT_CACHE_CONFIG } from '../sanity.client'

const allBlogsQuery = groq`*[_type == "blog"] | order(_createdAt desc){..., artist->}`
export async function getAllBlogs(client: SanityClient): Promise<Blog[]> {
  return await client.fetch(allBlogsQuery, {}, NEXT_CACHE_CONFIG.BLOG)
}

const publishedBlogsQuery = groq`*[_type == "blog" && state == "published"] | order(publishedAt desc){..., artist->}`
export async function getPublishedBlogs(client: SanityClient): Promise<Blog[]> {
  return await client.fetch(publishedBlogsQuery, {}, NEXT_CACHE_CONFIG.BLOG)
}

const blogBySlugQuery = groq`*[_type == "blog" && slug.current == $slug][0]{..., artist->}`
export async function getBlogBySlug(
  client: SanityClient,
  slug: string,
): Promise<Blog> {
  return await client.fetch(
    blogBySlugQuery,
    { slug: slug },
    NEXT_CACHE_CONFIG.BLOG,
  )
}
