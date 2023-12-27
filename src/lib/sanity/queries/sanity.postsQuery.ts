import { groq } from 'next-sanity'
import { SanityClient } from 'sanity'

import { Post } from '~/types/SanitySchemaTypes'

export const postsQuery = groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc)`
export async function getPosts(client: SanityClient): Promise<Post[]> {
  return await client.fetch(postsQuery)
}

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0]`

export async function getPost(
  client: SanityClient,
  slug: string,
): Promise<Post> {
  return await client.fetch(postBySlugQuery, {
    slug,
  })
}

export async function deletePost(
  client: SanityClient,
  id: string,
): Promise<any> {
  return await client.delete(id)
}

export const postSlugsQuery = groq`
*[_type == "post" && defined(slug.current)][].slug.current
`
