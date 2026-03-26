/**
 * Value Object: Span
 * Представляє проліт стелажа (відстань між опорами)
 *
 * Примітка: Доступні типи прольотів визначаються в Price DB
 */
export class Span {
  constructor(
    public readonly type: string, // наприклад: '600', '750' (з Price DB)
    public readonly quantity: number // кількість прольотів цього типу
  ) {
    this.validate()
  }

  private validate(): void {
    if (!this.type || typeof this.type !== 'string') {
      throw new Error('Span type must be a non-empty string')
    }
    if (!Number.isInteger(this.quantity) || this.quantity < 1) {
      throw new Error('Span quantity must be a positive integer')
    }
  }

  /**
   * Создание Span из входных данных
   */
  static create(type: string, quantity: number): Span {
    return new Span(type, quantity)
  }
}
