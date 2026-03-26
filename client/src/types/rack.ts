/**
 * Типи для модуля Rack Calculator
 */

export interface SpanInput {
  type: string // тип прольоту (наприклад, '600', '750')
  quantity: number // кількість прольотів цього типу
}

/**
 * Конфігурація стелажа (вхідні параметри)
 */
export interface RackConfiguration {
  levels: number // кількість ярусів (1-3)
  rows: number // кількість рядів (1-4)
  beamsPerRow: number // балок на ряд
  supportType: string // тип опор (наприклад, 'C80', '430', '430C')
  verticalStandType?: string // тип верт. стійок (для 2+ поверхів)
  spans: SpanInput[] // прольоти
}

/**
 * Компоненти стелажа (результат розрахунку)
 */
export interface SupportItem {
  type: 'edge' | 'intermediate'
  quantity: number
  price: number // ціна за одиницю
  total: number // загальна вартість (quantity × price)
}

export interface BeamItem {
  type: string // напр. '600', '750'
  length: number // довжина в мм
  quantity: number
  price: number // ціна за одиницю
  total: number // загальна вартість
}

export interface VerticalStandItem {
  type: string // напр. '1190', '632'
  quantity: number
  price: number // ціна за одиницю
  total: number // загальна вартість
}

export interface BraceItem {
  quantity: number
  price: number // ціна за одиницю
  total: number // загальна вартість
}

export interface IsolatorItem {
  quantity: number
  price: number // ціна за одиницю
  total: number // загальна вартість
}

export interface RackComponents {
  supports: SupportItem[]
  beams: BeamItem[]
  verticalStands?: VerticalStandItem
  braces?: BraceItem
  isolators?: IsolatorItem
}

/**
 * Ціноутворення
 */
export interface RackPricing {
  base: number // базова ціна (сума всіх компонентів)
  withoutIsolators: number // ціна без ізоляторів
  zero: number // нульова ціна (base × 1.44)
}

/**
 * Результат розрахунку стелажа
 */
export interface RackResult {
  name: string
  description: string
  configuration: RackConfiguration
  components: RackComponents
  totalLength: number
  pricing: RackPricing
  rackSetId?: string
  revisionId?: string
}

/**
 * Стелаж з БД
 */
export interface RackSet {
  id: string
  name: string
  description: string
  configuration: RackConfiguration
  components: RackComponents
  totalLength: number
  pricing?: RackPricing
  createdAt: string
  updatedAt: string
}

/**
 * Фільтри для списку стелажів
 */
export interface RackFilters {
  search?: string
  levels?: number
  rows?: number
  dateFrom?: string
  dateTo?: string
}

/**
 * Ревізія стелажа
 */
export interface RackRevision {
  id: string
  version: number
  data: object
  createdAt: string
}

/**
 * Елемент комплекту стелажів
 */
export interface RackSetItem {
  rackId: string
  name: string
  quantity: number
  result: RackResult
  configuration: RackConfiguration
}

/**
 * Стан комплекту стелажів
 */
export interface RackSetState {
  items: RackSetItem[]
  totalZero: number
  totalWithoutIsolators: number
}

/**
 * Форма збереження комплекту
 */
export interface SaveSetFormData {
  objectName: string // назва об'єкту (обов'язкове)
  note?: string // примітка (опціонально)
}
