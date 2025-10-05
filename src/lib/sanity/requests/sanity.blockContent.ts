import { BlockContent } from '~/schemas/models/blockContent'

export const patchBlockContent = ({
  documentId,
  fieldName,
  value,
}: {
  documentId: string
  fieldName: string
  value: BlockContent | undefined
}): Promise<Response> => {
  return fetch('/api/sanity/block-content', {
    method: 'PATCH',
    body: JSON.stringify({
      documentId,
      fieldName,
      value,
    }),
  })
}
