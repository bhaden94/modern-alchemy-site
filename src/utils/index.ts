export const formatStylesInSentence = (styles?: string[]): string => {
  const formatter = new Intl.ListFormat('en-US', {
    style: 'short', // uses '&' instead of 'and'
    type: 'conjunction', // uses 'and' instead of 'or'
  })

  return formatter.format(styles || [])
}

export const convertBlobToBase64 = (blob: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.readAsDataURL(blob)
  })

export function formatPhoneNumber(number: string) {
  //Filter only numbers from the input
  let cleaned = ('' + number).replace(/\D/g, '')

  //Check if the input is of correct length
  let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)

  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3]
  }

  return null
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

type RadiusSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none'

const calculateCornerRadius = (w: number, h: number, size: RadiusSize) => {
  if (size === 'none') return 0

  const smallerDimension = Math.min(w, h)

  const scalingFactors = {
    xs: 0.05,
    sm: 0.08,
    md: 0.125,
    lg: 0.2,
    xl: 0.5,
  }

  return smallerDimension * scalingFactors[size]
}

const shimmer = (w: number, h: number, radius: RadiusSize) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
    <clipPath id="rounded">
      <rect width="${w}" height="${h}" rx="${calculateCornerRadius(
        w,
        h,
        radius,
      )}" ry="${calculateCornerRadius(w, h, radius)}" />
    </clipPath>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" rx="${calculateCornerRadius(
    w,
    h,
    radius,
  )}" ry="${calculateCornerRadius(w, h, radius)}" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" rx="${calculateCornerRadius(
    w,
    h,
    radius,
  )}" ry="${calculateCornerRadius(w, h, radius)}" clip-path="url(#rounded)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>
`

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

export function generateNextImagePlaceholder(
  width: number,
  height: number,
  radius: RadiusSize = 'none',
): `data:image/${string}` {
  const generatedShimmer = toBase64(shimmer(width, height, radius))

  return `data:image/svg+xml;base64,${generatedShimmer}`
}

export const Base64heroImage =
  'data:image/jpeg;base64,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'

export const Base64Logo =
  'data:image/png;base64,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'
