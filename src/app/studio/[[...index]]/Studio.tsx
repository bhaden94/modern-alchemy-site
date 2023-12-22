'use client'

import { NextStudio } from 'next-sanity/studio'
import config from 'sanity.config'

export default function Studio() {
  return (
    <div className="absolute w-screen top-0 left-0">
      <NextStudio config={config} />
    </div>
  )
}
