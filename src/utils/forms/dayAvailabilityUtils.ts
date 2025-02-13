import z from 'zod'

export const dayAvailabilitySchema = z.object({
  dayAvailability: z
    .string()
    .array()
    .min(1, 'Please select at least one available day'),
})

// extracting the type
export type TDayAvailabilitySchema = z.infer<typeof dayAvailabilitySchema>

export const DayAvailabilityField = {
  DayAvailability: {
    id: 'dayAvailability',
    label: '',
    placeholder: '',
  },
} as const
