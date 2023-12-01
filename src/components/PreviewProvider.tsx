import { LiveQueryProvider } from 'next-sanity/preview'
import { useMemo } from 'react'

import { getPreviewClient } from '~/lib/sanity/sanity.client'

export default function PreviewProvider({
  children,
  token,
}: {
  children: React.ReactNode
  token: string
}) {
  const client = useMemo(() => getPreviewClient({ token }), [token])
  return (
    <LiveQueryProvider client={client} logger={console}>
      {children}
    </LiveQueryProvider>
  )
}
