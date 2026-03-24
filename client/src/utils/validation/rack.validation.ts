import { z } from 'zod';

/**
 * Схема валидации для расчёта стеллажа
 */
export const rackCalculationSchema = z.object({
  levels: z
    .number()
    .int()
    .min(1, 'Минимум 1 уровень')
    .max(3, 'Максимум 3 уровня'),
  
  rows: z
    .number()
    .int()
    .min(1, 'Минимум 1 ряд')
    .max(4, 'Максимум 4 ряда'),
  
  beamsPerRow: z
    .number()
    .int()
    .min(1, 'Минимум 1 балка на ряд'),
  
  supportType: z
    .string()
    .nonempty('Выберите тип опоры'),
  
  verticalStandType: z
    .string()
    .optional(),
  
  spans: z
    .array(
      z.object({
        type: z.string().nonempty('Тип пролёта обязателен'),
        quantity: z
          .number()
          .int()
          .min(1, 'Минимум 1 пролёт'),
      })
    )
    .min(1, 'Добавьте хотя бы один пролёт'),
});

export type RackCalculationFormData = z.infer<typeof rackCalculationSchema>;

/**
 * Схема для добавления пролёта
 */
export const spanSchema = z.object({
  type: z.string().nonempty('Тип пролёта обязателен'),
  quantity: z.number().int().min(1, 'Минимум 1 пролёт'),
});

export type SpanFormData = z.infer<typeof spanSchema>;
