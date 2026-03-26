import { z } from 'zod'

/**
 * Схема валідації форми збереження комплекту стелажів
 */
export const saveSetSchema = z.object({
  objectName: z
    .string()
    .min(3, 'Назва має містити щонайменше 3 символи')
    .max(100, 'Назва має містити не більше 100 символів'),
  note: z.string().optional(),
})

export type SaveSetFormData = z.infer<typeof saveSetSchema>
