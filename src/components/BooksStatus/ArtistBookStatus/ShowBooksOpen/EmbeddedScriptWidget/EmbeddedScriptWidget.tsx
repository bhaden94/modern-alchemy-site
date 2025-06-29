'use client'

import { useEffect } from 'react'

import { useArtist } from '~/hooks/useArtist'

const EmbeddedScriptWidget = () => {
  const { artist } = useArtist()

  useEffect(() => {
    const script = document.createElement('script')
    script.src = artist.embeddedWidget?.scriptSrc || '#'
    script.async = true

    const widgetDiv = document.querySelector(
      `.${artist.embeddedWidget?.querySelector}`,
    )
    if (widgetDiv) {
      widgetDiv.appendChild(script)
    }

    return () => {
      if (widgetDiv && widgetDiv.contains(script)) {
        widgetDiv.removeChild(script)
      }
    }
  }, [artist.embeddedWidget?.scriptSrc, artist.embeddedWidget?.querySelector])

  return (
    <>
      <div className={artist.embeddedWidget?.querySelector}></div>
    </>
  )
}

export default EmbeddedScriptWidget
