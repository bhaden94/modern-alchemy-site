'use client'

import { Button } from '@mantine/core'
import { IconShare } from '@tabler/icons-react'
import React, { useEffect } from 'react'

import { useSuccessDialog } from '~/hooks/useSuccessDialog'

export interface IBlogShareButton {
  title?: string
  text?: string
  url?: string
}

const BlogShareButton: React.FC<IBlogShareButton> = ({
  title = document.title,
  text = 'I found this interesting blog post',
  url,
}) => {
  const [shareUrl, setShareUrl] = React.useState(url || '')
  const { openSuccessDialog } = useSuccessDialog()

  // Run effect to set URL since we must wait for the window to be available
  useEffect(() => {
    setShareUrl(window?.location?.href || '')
  }, [])

  const handleShare = async () => {
    // Check if the Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        })
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          fallbackShare()
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      fallbackShare()
    }
  }

  const fallbackShare = () => {
    // Copy URL to clipboard as fallback
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          openSuccessDialog('Link copied to clipboard.')
        })
        .catch(() => {})
    }
  }

  return (
    <Button
      variant="transparent"
      color="academia"
      rightSection={<IconShare size={16} />}
      size="sm"
      onClick={handleShare}
    >
      Share
    </Button>
  )
}

export default BlogShareButton
