import { z } from 'zod'

// Схема для одного елемента прайсу
export const priceItemSchema = z.object({
  id: z.string(),
  type: z.string(),
  size: z.string().optional(),
  price: z.number().optional(),
  weight: z.number().optional(),
  variants: z.array(z.object({
    id: z.string(),
    variant: z.string(),
    price: z.number(),
    weight: z.number().optional(),
  })).optional(),
})

// Схема для імпорту з Excel
export const importExcelItemSchema = z.object({
  Type: z.string(),
  Size: z.string().optional(),
  Variant: z.string().optional(),
  Price: z.coerce.number(),
  Weight: z.coerce.number().optional(),
})

export type PriceItemDto = z.infer<typeof priceItemSchema>
export type ImportExcelItem = z.infer<typeof importExcelItemSchema>
