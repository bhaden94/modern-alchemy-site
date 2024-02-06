import z from 'zod'

export const BOOKS_OPEN = ['OPEN', 'CLOSED'] as const
export const zBooksOpenType = z.enum(BOOKS_OPEN)

export const booksStatusSchema = z.object({
  booksOpen: zBooksOpenType,
  booksOpenAt: z.date().optional(),
})

// extracting the type
export type TBooksStatusSchema = z.infer<typeof booksStatusSchema>

export const BooksStatusField = {
  BooksOpen: {
    id: 'booksOpen',
    label: 'Books Open',
  },
  BooksOpenAt: {
    id: 'booksOpenAt',
    label: 'Books Open At',
    placeholder: 'When will your books open again?',
  },
} as const
