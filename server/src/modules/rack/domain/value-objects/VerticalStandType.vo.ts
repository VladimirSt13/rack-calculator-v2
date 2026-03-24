/**
 * Value Object: VerticalStandType
 * Представляет тип вертикальной стойки (для многооярусных стеллажей)
 * 
 * Доступные типы определяются в Price DB (например, '632', '1190', '1500')
 */
export class VerticalStandType {
  constructor(public readonly value: string) {
    this.validate();
  }

  private validate(): void {
    if (!this.value || typeof this.value !== 'string') {
      throw new Error('Vertical stand type must be a non-empty string');
    }
  }

  /**
   * Создание VerticalStandType из входных данных
   */
  static create(value: string): VerticalStandType {
    return new VerticalStandType(value);
  }
}
