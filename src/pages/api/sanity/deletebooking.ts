import type { NextApiRequest, NextApiResponse } from 'next'

import { getClient } from '~/lib/sanity/sanity.client'

const token = process.env.SANITY_API_WRITE_TOKEN

// TODO: move to app/api/sanity/booking
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const client = getClient(token)
  const method = req.method
  const body = JSON.parse(req.body)

  if (method !== 'DELETE')
    return res.status(400).json('requsted method not available')
  if (!body.id) return res.status(400).json('id not given')

  const response = await client
    .delete(body.id)
    .catch((err) => res.status(500).json(err))
  return res.status(200).json(response)
}
