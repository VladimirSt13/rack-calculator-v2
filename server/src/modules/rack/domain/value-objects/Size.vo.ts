/**
 * Value Object: Size
 * Представляє розміри стелажа (кількість рівнів та загальну довжину)
 */
export class Size {
  constructor(
    public readonly levels: number, // кількість ярусів (1-3)
    public readonly totalLength: number // загальна довжина в мм
  ) {
    this.validate()
  }

  private validate(): void {
    if (!Number.isInteger(this.levels)) {
      throw new Error('Levels must be an integer')
    }
    if (this.levels < 1 || this.levels > 3) {
      throw new Error('Levels must be between 1 and 3')
    }
    if (!Number.isFinite(this.totalLength) || this.totalLength <= 0) {
      throw new Error('Total length must be a positive number')
    }
  }

  /**
   * Проверка на одноповерховый стеллаж
   */
  isSingleLevel(): boolean {
    return this.levels === 1
  }

  /**
   * Проверка на многооповерховый стеллаж
   */
  isMultiLevel(): boolean {
    return this.levels >= 2
  }

  /**
   * Создание Size из входных данных
   */
  static create(levels: number, totalLength: number): Size {
    return new Size(levels, totalLength)
  }
}
