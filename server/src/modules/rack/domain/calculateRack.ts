/**
 * Domain-функція розрахунку стелажів
 *
 * Алгоритм заснований на RACK_ALGORITHM_BUSINESS.md
 *
 * @param input - Вхідні параметри стелажа
 * @returns Результат розрахунку з компонентами та назвою
 */

export interface SpanInput {
  type: string // тип прольоту (наприклад, '600', '750')
  quantity: number // кількість прольотів цього типу
}

export interface RackInput {
  levels: number // поверховість (1-3)
  rows: number // рядність (1-4)
  beamsPerRow: number // балок на ряд
  supportType: string // тип опор (наприклад, 'C80', '430', '430C')
  verticalStandType?: string // тип верт. стійок (для 2+ поверхів)
  spans: SpanInput[] // прольоти
}

export interface SupportComponent {
  type: 'edge' | 'intermediate'
  quantity: number
  price?: number // ціна за одиницю
  total?: number // загальна вартість
}

export interface BeamComponent {
  type: string
  quantity: number
  price?: number // ціна за одиницю
  total?: number // загальна вартість
}

export interface VerticalStandComponent {
  type: string
  quantity: number
  price?: number // ціна за одиницю
  total?: number // загальна вартість
}

export interface BracesComponent {
  quantity: number
  price?: number // ціна за одиницю
  total?: number // загальна вартість
}

export interface IsolatorComponent {
  quantity: number
  price?: number // ціна за одиницю
  total?: number // загальна вартість
}

export interface RackComponents {
  supports: SupportComponent[]
  beams: BeamComponent[]
  verticalStands?: VerticalStandComponent
  braces?: BracesComponent
  isolators?: IsolatorComponent
}

export interface RackResult {
  name: string
  description: string
  components: RackComponents
  totalLength: number
}

/**
 * Розрахунок компонентів стелажа
 */
export function calculateRack(input: RackInput): RackResult {
  // Валідація вхідних даних
  validateInput(input)

  // 1. Розрахунок загальної довжини
  const totalLength = input.spans.reduce(
    (sum, span) => sum + span.quantity * parseInt(span.type, 10),
    0
  )

  // 2. Розрахунок опор
  const supports = calculateSupports(input.levels, input.spans)

  // 3. Розрахунок балок
  const beams = calculateBeams(input.spans, input.rows, input.beamsPerRow, input.levels)

  // 4. Розрахунок додаткових компонентів (залежить від поверховості)
  let verticalStands: VerticalStandComponent | undefined
  let braces: BracesComponent | undefined
  let isolators: IsolatorComponent | undefined

  if (input.levels >= 2) {
    // Багатоярусний стелаж
    verticalStands = calculateVerticalStands(input.spans, input.verticalStandType)
    braces = calculateBraces(input.spans)
  } else {
    // Одноярусний стелаж
    isolators = calculateIsolators(input.spans)
  }

  // 5. Генерація назви
  const { name, description } = generateRackName(input, totalLength)

  return {
    name,
    description,
    components: {
      supports,
      beams,
      verticalStands,
      braces,
      isolators,
    },
    totalLength,
  }
}

/**
 * Валідація вхідних даних
 */
function validateInput(input: RackInput): void {
  if (!Number.isInteger(input.levels) || input.levels < 1 || input.levels > 10) {
    throw new Error('Levels must be an integer between 1 and 10')
  }
  if (!Number.isInteger(input.rows) || input.rows < 1 || input.rows > 4) {
    throw new Error('Rows must be an integer between 1 and 4')
  }
  if (!Number.isInteger(input.beamsPerRow) || input.beamsPerRow < 2 || input.beamsPerRow > 4) {
    throw new Error('Beams per row must be between 2 and 4')
  }
  if (!input.supportType || typeof input.supportType !== 'string') {
    throw new Error('Support type must be a non-empty string')
  }
  if (!Array.isArray(input.spans) || input.spans.length === 0) {
    throw new Error('Spans must be a non-empty array')
  }

  // Перевірка прольотів
  for (const span of input.spans) {
    if (!span.type || typeof span.type !== 'string') {
      throw new Error('Span type must be a string')
    }
    if (!Number.isInteger(span.quantity) || span.quantity < 1) {
      throw new Error('Span quantity must be a positive integer')
    }
    // Перевірка формату типу (має починатися з числа)
    if (!/^\d+[A-Za-z]*$/.test(span.type)) {
      throw new Error(
        `Invalid span type format: ${span.type}. Expected format: '600', '750mm', etc.`
      )
    }
  }

  // Перевірка verticalStandType для багатоярусних
  if (input.levels >= 2 && !input.verticalStandType) {
    throw new Error('Vertical stand type is required for multi-level racks (2+ levels)')
  }
}

/**
 * Розрахунок опор (крайні та проміжні)
 * Формула:
 * - Крайні: 2 × рівні
 * - Проміжні: (загальна кількість прольотів - 1) × рівні
 */
function calculateSupports(levels: number, spans: SpanInput[]): SupportComponent[] {
  const totalSpans = spans.reduce((sum, span) => sum + span.quantity, 0)

  const edgeSupports = 2 * levels
  const intermediateSupports = Math.max(0, totalSpans - 1) * levels

  const supports: SupportComponent[] = []

  if (edgeSupports > 0) {
    supports.push({ type: 'edge', quantity: edgeSupports })
  }

  if (intermediateSupports > 0) {
    supports.push({ type: 'intermediate', quantity: intermediateSupports })
  }

  return supports
}

/**
 * Розрахунок балок
 * Формула: кількість × ряди × балок/ряд × рівні
 */
function calculateBeams(
  spans: SpanInput[],
  rows: number,
  beamsPerRow: number,
  levels: number
): BeamComponent[] {
  return spans.map((span) => ({
    type: span.type,
    quantity: span.quantity * rows * beamsPerRow * levels,
  }))
}

/**
 * Розрахунок вертикальних стійок (для 2+ поверхів)
 * Формула: (кількість прольотів + 1) × 2
 */
function calculateVerticalStands(
  spans: SpanInput[],
  verticalStandType?: string
): VerticalStandComponent {
  const totalSpans = spans.reduce((sum, span) => sum + span.quantity, 0)
  const quantity = (totalSpans + 1) * 2

  return {
    type: verticalStandType || 'unknown',
    quantity,
  }
}

/**
 * Розрахунок розпірок/розкосів (для 2+ поверхів)
 * Формула:
 * - Якщо прольотів = 1: 2 розкоси (мінімум)
 * - Якщо прольотів > 1: (прольоти - 1) × 2 + 2
 */
function calculateBraces(spans: SpanInput[]): BracesComponent {
  const totalSpans = spans.reduce((sum, span) => sum + span.quantity, 0)

  let quantity: number
  if (totalSpans === 1) {
    quantity = 2 // мінімум
  } else {
    quantity = (totalSpans - 1) * 2 + 2
  }

  return { quantity }
}

/**
 * Розрахунок ізоляторів (для 1 поверху)
 * Формула: кількість опор × 2
 */
function calculateIsolators(spans: SpanInput[]): IsolatorComponent {
  const totalSpans = spans.reduce((sum, span) => sum + span.quantity, 0)

  // Кількість опор для одноярусного стелажа
  const edgeSupports = 2
  const intermediateSupports = Math.max(0, totalSpans - 1)
  const totalSupports = edgeSupports + intermediateSupports

  const quantity = totalSupports * 2

  return { quantity }
}

/**
 * Генерація назви стелажа
 *
 * Формат: Стелаж [опис] L{рівні}A{ряди}{C?}-{довжина}/{опори}
 *
 * Приклади:
 * - Стелаж одноповерховий однорядний L1A1C-1950/80
 * - Стелаж двоповерховий дворядний L2A2-1800/430
 */
function generateRackName(
  input: RackInput,
  totalLength: number
): { name: string; description: string } {
  // Описова частина
  const levelDescription = getLevelDescription(input.levels)
  const rowDescription = getRowDescription(input.rows)
  const steppedSuffix = isSteppedSupport(input.supportType) ? ' ступінчатий' : ''

  const description = `Стелаж ${levelDescription} ${rowDescription}${steppedSuffix}`.trim()

  // Скорочення (маркування)
  const levelsAbbr = `L${input.levels}`
  const rowsAbbr = `A${input.rows}`
  const steppedAbbr = isSteppedSupport(input.supportType) ? 'C' : ''
  const lengthAbbr = totalLength
  const supportNumber = input.supportType.replace(/[A-Za-z]/g, '')

  const shortName = `${levelsAbbr}${rowsAbbr}${steppedAbbr}-${lengthAbbr}/${supportNumber}`
  const fullName = `${description} ${shortName}`

  return {
    name: fullName,
    description,
  }
}

/**
 * Опис рівня (український)
 */
function getLevelDescription(levels: number): string {
  switch (levels) {
    case 1:
      return 'одноповерховий'
    case 2:
      return 'двоповерховий'
    case 3:
      return 'трьохповерховий'
    default:
      return `${levels}-поверховий`
  }
}

/**
 * Опис рядності (український)
 */
function getRowDescription(rows: number): string {
  switch (rows) {
    case 1:
      return 'однорядний'
    case 2:
      return 'дворядний'
    case 3:
      return 'трьохрядний'
    case 4:
      return 'чотирьохрядний'
    default:
      return `${rows}-рядний`
  }
}

/**
 * Перевірка на ступінчастий тип опори
 */
function isSteppedSupport(supportType: string): boolean {
  return supportType.toUpperCase().includes('C')
}
