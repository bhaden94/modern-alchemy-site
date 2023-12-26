import z from 'zod'

export const booksStatusSchema = z.object({
  booksOpen: z.boolean({
    required_error: 'Please select whether your books are open or closed',
  }),
  booksOpenAt: z.date().optional(),
})

// extracting the type
export type TBooksStatusSchema = z.infer<typeof booksStatusSchema>

export enum BooksStatusField {
  BooksOpen = 'booksOpen',
  BooksOpenAt = 'booksOpenAt',
}
