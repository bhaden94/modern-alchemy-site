import z from 'zod'

export const budgetOptionsSchema = z.object({
  budgetOptions: z.object({ name: z.string(), key: z.string() }).array(),
})

// extracting the type
export type TBudgetOptionsSchema = z.infer<typeof budgetOptionsSchema>

export const BudgetOptionsField = {
  BudgetOptions: {
    id: 'budgetOptions',
    label: '',
    placeholder: 'Budget/session length option',
  },
} as const
