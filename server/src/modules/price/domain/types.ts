/**
 * Типи для нової структури прайсу
 */

export type ItemType = 
  | 'support' 
  | 'span' 
  | 'vertical_support' 
  | 'diagonal_brace' 
  | 'isolator'
  | string;

export type VariantType = 
  | 'edge' 
  | 'intermediate' 
  | string;

/**
 * Варіант компонента (напр. крайня/проміжна опора)
 */
export interface PriceVariant {
  id: string;  // напр. "support_215_edge"
  variant: VariantType;
  price: number;
  weight?: number | null;
}

/**
 * Елемент прайсу (компонент)
 */
export interface PriceItem {
  id: string;  // напр. "support_215"
  type: ItemType;  // "support", "span", etc.
  size?: string;  // напр. "215", "600"
  code?: string;  // альтернативний код
  name?: string;  // назва компонента
  
  // Для support з variants
  variants?: PriceVariant[];
  
  // Для простих елементів (span, isolator) - ціна без варіантів
  price?: number;
  weight?: number | null;
}

/**
 * Прайс-лист
 */
export interface Price {
  id: string;
  name?: string;
  description?: string;
  category: string;  // "rack", "battery", etc.
  items: PriceItem[];
  isActive: boolean;
  validFrom?: Date;
  validUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO для створення/оновлення прайсу
 */
export interface CreatePriceDto {
  name?: string;
  description?: string;
  category: string;
  items: PriceItem[];
  isActive?: boolean;
}

export interface UpdatePriceDto {
  name?: string;
  description?: string;
  items?: PriceItem[];
  isActive?: boolean;
}

/**
 * DTO для масового оновлення цін
 */
export interface BulkUpdatePriceItem {
  itemId: string;  // id елемента (напр. "support_215")
  variantId?: string;  // id варіанта (напр. "support_215_edge")
  price: number;
}

export interface BulkUpdatePriceDto {
  items: BulkUpdatePriceItem[];
}

/**
 * Результат пошуку компонента
 */
export interface PriceItemLookup {
  item: PriceItem;
  variant?: PriceVariant;
}
