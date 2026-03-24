/**
 * Типы для модуля Rack Calculator
 */

export interface SpanInput {
  type: string;      // тип пролёта (например, '600', '750')
  quantity: number;  // количество пролётов этого типа
}

/**
 * Конфигурация стеллажа (входные параметры)
 */
export interface RackConfiguration {
  levels: number;           // количество ярусов (1-3)
  rows: number;             // количество рядов (1-4)
  beamsPerRow: number;      // балок на ряд
  supportType: string;      // тип опор (например, 'C80', '430', '430C')
  verticalStandType?: string; // тип верт. стоек (для 2+ этажей)
  spans: SpanInput[];       // пролёты
}

/**
 * Компоненты стеллажа (результат расчёта)
 */
export interface RackComponents {
  supports: {
    type: 'edge' | 'intermediate';
    quantity: number;
  }[];
  beams: {
    type: string;
    quantity: number;
  }[];
  verticalStands?: {
    type: string;
    quantity: number;
  };
  braces?: {
    quantity: number;
  };
  isolators?: {
    quantity: number;
  };
}

/**
 * Ценообразование
 */
export interface RackPricing {
  base: number;           // базовая цена
  withoutIsolators: number; // цена без изоляторов
  zero: number;           // нулевая цена (retail)
}

/**
 * Результат расчёта стеллажа
 */
export interface RackResult {
  name: string;
  description: string;
  configuration: RackConfiguration;
  components: RackComponents;
  totalLength: number;
  pricing: RackPricing;
  rackSetId?: string;
}

/**
 * Стеллаж из БД
 */
export interface RackSet {
  id: string;
  name: string;
  description: string;
  configuration: RackConfiguration;
  components: RackComponents;
  totalLength: number;
  pricing?: RackPricing;
  createdAt: string;
  updatedAt: string;
}

/**
 * Фильтры для списка стеллажей
 */
export interface RackFilters {
  search?: string;
  levels?: number;
  rows?: number;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Ревизия стеллажа
 */
export interface RackRevision {
  id: string;
  version: number;
  data: object;
  createdAt: string;
}
