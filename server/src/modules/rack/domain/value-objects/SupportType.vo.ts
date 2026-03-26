/**
 * Value Object: SupportType
 * Представляет тип опоры стеллажа
 * 
 * Виды опор:
 * - Прямые: задаются числом (например, '290', '430')
 * - Ступенчатые: число + C (например, '430C', 'C80')
 * 
 * Доступные типы определяются в Price DB
 */
export class SupportType {
  constructor(public readonly value: string) {
    this.validate();
  }

  private validate(): void {
    if (!this.value || typeof this.value !== 'string') {
      throw new Error('Support type must be a non-empty string');
    }
  }

  /**
   * Проверка на ступенчатый тип опоры (содержит 'C')
   */
  isStepped(): boolean {
    return this.value.toUpperCase().includes('C');
  }

  /**
   * Проверка на прямой тип опоры
   */
  isStraight(): boolean {
    return !this.isStepped();
  }

  /**
   * Извлечение базового номера (например, 'C80' -> '80', '430C' -> '430')
   */
  getNumber(): string {
    return this.value.replace(/[A-Za-z]/g, '');
  }

  /**
   * Создание SupportType из входных данных
   */
  static create(value: string): SupportType {
    return new SupportType(value);
  }
}
