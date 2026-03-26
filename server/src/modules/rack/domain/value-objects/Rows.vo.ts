/**
 * Value Object: Rows
 * Представляет рядность стеллажа (количество параллельных рядов)
 */
export class Rows {
  constructor(public readonly value: number) {
    this.validate();
  }

  private validate(): void {
    if (!Number.isInteger(this.value)) {
      throw new Error('Rows value must be an integer');
    }
    if (this.value < 1 || this.value > 4) {
      throw new Error('Rows must be between 1 and 4');
    }
  }

  /**
   * Проверка на однорядный стеллаж
   */
  isSingleRow(): boolean {
    return this.value === 1;
  }

  /**
   * Проверка на дворядный стеллаж
   */
  isDoubleRow(): boolean {
    return this.value === 2;
  }

  /**
   * Создание Rows из входных данных
   */
  static create(value: number): Rows {
    return new Rows(value);
  }
}
