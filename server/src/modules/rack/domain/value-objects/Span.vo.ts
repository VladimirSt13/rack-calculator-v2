/**
 * Value Object: Span
 * Представляет пролёт стеллажа (расстояние между опорами)
 * 
 * Примечание: Доступные типы пролётов определяются в Price DB
 */
export class Span {
  constructor(
    public readonly type: string,      // например: '600', '750' (из Price DB)
    public readonly quantity: number   // количество пролётов этого типа
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.type || typeof this.type !== 'string') {
      throw new Error('Span type must be a non-empty string');
    }
    if (!Number.isInteger(this.quantity) || this.quantity < 1) {
      throw new Error('Span quantity must be a positive integer');
    }
  }

  /**
   * Создание Span из входных данных
   */
  static create(type: string, quantity: number): Span {
    return new Span(type, quantity);
  }
}
