# Price Module Architecture

> **Версія:** 2.0 (Sprint 5.5)  
> **Останнє оновлення:** 27 березня 2026 р.

---

## 📋 Зміст

1. [Огляд](#огляд)
2. [Структура даних](#структура-даних)
3. [Стратегії обробки](#стратегії-обробки)
4. [API Endpoints](#api-endpoints)
5. [Приклади використання](#приклади-використання)

---

## Огляд

Модуль цін призначений для управління прайс-листами різних типів:

- **rack** — стелажне обладнання
- **battery** — акумуляторні батареї (майбутній)
- **custom** — кастомні прайси

### Ключові можливості

- ✅ Універсальна структура `Price` з масивом `items`
- ✅ Патерн **Strategy** для обробки різних типів прайсів
- ✅ Імпорт/Експорт в Excel з валідацією
- ✅ Масове оновлення цін
- ✅ Сортування елементів
- ✅ Варіанти для елементів (напр. edge/intermediate)

---

## Структура даних

### Price Entity

```typescript
interface Price {
  id: string;
  name: string;
  description?: string;
  category: string; // 'rack', 'battery', 'custom'
  items: PriceItem[];
  isActive: boolean;
  validFrom?: DateTime;
  validUntil?: DateTime;
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

### PriceItem Entity

```typescript
interface PriceItem {
  id: string;
  type: string; // 'support', 'span', 'battery_cell', тощо
  size?: string;
  code?: string;
  name?: string;
  price?: number;
  weight?: number;
  metadata?: Record<string, any>; // додаткові дані
  variants?: PriceVariant[];
}
```

### PriceVariant Entity

```typescript
interface PriceVariant {
  id: string;
  variant: string; // 'edge', 'intermediate', тощо
  price: number;
  weight?: number;
  metadata?: Record<string, any>;
}
```

### Приклад: Rack Price

```json
{
  "id": "price_123",
  "name": "Прайс стелажів 2024",
  "category": "rack",
  "items": [
    {
      "id": "support_215",
      "type": "support",
      "size": "215",
      "variants": [
        {
          "id": "support_215_edge",
          "variant": "edge",
          "price": 600,
          "weight": 2.0
        },
        {
          "id": "support_215_intermediate",
          "variant": "intermediate",
          "price": 620,
          "weight": 2.05
        }
      ]
    },
    {
      "id": "span_600",
      "type": "span",
      "size": "600",
      "price": 500,
      "weight": 1.6
    }
  ],
  "isActive": true
}
```

### Приклад: Battery Price (майбутній)

```json
{
  "id": "price_456",
  "name": "Прайс АКБ 2024",
  "category": "battery",
  "items": [
    {
      "id": "battery_cell_12v",
      "type": "battery_cell",
      "metadata": {
        "voltage": 12,
        "capacity": 100,
        "chemistry": "LiFePO4"
      },
      "price": 5000,
      "weight": 10.5
    }
  ],
  "isActive": true
}
```

---

## Стратегії обробки

### IPriceStrategy Interface

```typescript
interface IPriceStrategy {
  /**
   * Категорія прайсу
   */
  category: string;

  /**
   * Валідація елемента прайсу
   */
  validateItem(item: PriceItem): boolean;

  /**
   * Отримання ціни для елемента
   */
  getPrice(item: PriceItem, variantId?: string): number;

  /**
   * Конвертація для експорту в Excel
   */
  toExportFormat(item: PriceItem): Record<string, any>[];

  /**
   * Конвертація з імпорту з Excel
   */
  fromImportFormat(data: Record<string, any>): PriceItem;

  /**
   * Сортування елементів
   */
  sortItems(items: PriceItem[]): PriceItem[];
}
```

### RackPriceStrategy

**Файл:** `server/src/modules/price/domain/strategies/rack-price.strategy.ts`

```typescript
export class RackPriceStrategy implements IPriceStrategy {
  category = 'rack';

  private validTypes = ['support', 'span', 'vertical_support', 'diagonal_brace', 'isolator'];

  validateItem(item: PriceItem): boolean {
    return this.validTypes.includes(item.type);
  }

  getPrice(item: PriceItem, variantId?: string): number {
    if (item.type === 'support' && variantId && item.variants) {
      const variant = item.variants.find((v) => v.id === variantId);
      return variant?.price || 0;
    }
    return item.price || 0;
  }

  toExportFormat(item: PriceItem): Record<string, any>[] {
    if (item.type === 'support' && item.variants) {
      return item.variants.map((v) => ({
        Type: item.type,
        Size: item.size,
        Variant: v.variant === 'edge' ? 'Крайня' : 'Проміжна',
        Price: v.price,
        Weight: v.weight || '',
      }));
    }

    return [
      {
        Type: item.type,
        Size: item.size || '',
        Variant: '',
        Price: item.price || 0,
        Weight: item.weight || '',
      },
    ];
  }

  fromImportFormat(data: Record<string, any>): PriceItem {
    const type = data.Type as string;
    const size = data.Size?.toString() || '';
    const variant = data.Variant?.toString() || '';
    const price = parseFloat(data.Price) || 0;
    const weight = data.Weight ? parseFloat(data.Weight) : undefined;

    const item: PriceItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      size,
      price: variant ? undefined : price,
      weight: variant ? undefined : weight,
    };

    if (variant) {
      item.variants = [
        {
          id: `variant_${Date.now()}`,
          variant: variant.toLowerCase().includes('крайн') ? 'edge' : 'intermediate',
          price,
          weight,
        },
      ];
    }

    return item;
  }

  sortItems(items: PriceItem[]): PriceItem[] {
    const typeOrder: Record<string, number> = {
      support: 1,
      span: 2,
      vertical_support: 3,
      diagonal_brace: 4,
      isolator: 5,
    };

    return items.sort((a, b) => {
      const typeDiff = (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99);
      if (typeDiff !== 0) return typeDiff;

      const aNum = parseFloat(a.size || '0');
      const bNum = parseFloat(b.size || '0');

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }

      return (a.size || '').localeCompare(b.size || '');
    });
  }
}
```

### BatteryPriceStrategy (майбутній)

```typescript
export class BatteryPriceStrategy implements IPriceStrategy {
  category = 'battery';

  private validTypes = ['battery_cell', 'battery_pack', 'connector', 'cable'];

  validateItem(item: PriceItem): boolean {
    return this.validTypes.includes(item.type);
  }

  getPrice(item: PriceItem, variantId?: string): number {
    return item.price || 0;
  }

  toExportFormat(item: PriceItem): Record<string, any>[] {
    return [
      {
        Type: item.type,
        Voltage: item.metadata?.voltage || '',
        Capacity: item.metadata?.capacity || '',
        Chemistry: item.metadata?.chemistry || '',
        Price: item.price || 0,
        Weight: item.weight || '',
      },
    ];
  }

  fromImportFormat(data: Record<string, any>): PriceItem {
    return {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: data.Type as string,
      metadata: {
        voltage: parseFloat(data.Voltage) || 0,
        capacity: parseFloat(data.Capacity) || 0,
        chemistry: data.Chemistry || '',
      },
      price: parseFloat(data.Price) || 0,
      weight: data.Weight ? parseFloat(data.Weight) : undefined,
    };
  }

  sortItems(items: PriceItem[]): PriceItem[] {
    return items.sort((a, b) => {
      const voltageA = a.metadata?.voltage || 0;
      const voltageB = b.metadata?.voltage || 0;
      return voltageA - voltageB;
    });
  }
}
```

### PriceProcessorService

**Файл:** `server/src/modules/price/application/services/price-processor.service.ts`

```typescript
export class PriceProcessorService {
  private strategies: Map<string, IPriceStrategy> = new Map();

  /**
   * Реєстрація стратегії
   */
  registerStrategy(strategy: IPriceStrategy) {
    this.strategies.set(strategy.category, strategy);
  }

  /**
   * Отримання стратегії для категорії
   */
  getStrategy(category: string): IPriceStrategy {
    const strategy = this.strategies.get(category);
    if (!strategy) {
      throw new Error(`No strategy found for category: ${category}`);
    }
    return strategy;
  }

  /**
   * Валідація елементів прайсу
   */
  validateItems(category: string, items: PriceItem[]): boolean {
    const strategy = this.getStrategy(category);
    return items.every((item) => strategy.validateItem(item));
  }

  /**
   * Сортування елементів
   */
  sortItems(category: string, items: PriceItem[]): PriceItem[] {
    const strategy = this.getStrategy(category);
    return strategy.sortItems(items);
  }

  /**
   * Отримання ціни для елемента
   */
  getPrice(category: string, item: PriceItem, variantId?: string): number {
    const strategy = this.getStrategy(category);
    return strategy.getPrice(item, variantId);
  }

  /**
   * Експорт в Excel
   */
  exportToExcel(category: string, items: PriceItem[]): Buffer {
    const strategy = this.getStrategy(category);
    const rows = items.flatMap((item) => strategy.toExportFormat(item));

    // Додати заголовок
    const header = this.getExcelHeader(category);
    rows.unshift(header);

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook: XLSX.WorkBook = {
      SheetNames: ['Прайс'],
      Sheets: { Прайс: worksheet },
    };

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  }

  /**
   * Імпорт з Excel
   */
  importFromExcel(category: string, rows: Record<string, any>[]): PriceItem[] {
    const strategy = this.getStrategy(category);

    // Пропустити заголовок
    const dataRows = rows.slice(1);

    // Згрупувати по Type+Size для елементів з варіантами
    const grouped = new Map<string, PriceItem>();

    for (const row of dataRows) {
      const item = strategy.fromImportFormat(row);

      // Перевірити чи існує вже такий елемент
      const key = `${item.type}_${item.size}`;
      const existing = grouped.get(key);

      if (existing && item.variants) {
        existing.variants = [...(existing.variants || []), ...item.variants];
      } else {
        grouped.set(key, item);
      }
    }

    return Array.from(grouped.values());
  }

  private getExcelHeader(category: string): Record<string, any> {
    if (category === 'rack') {
      return {
        Type: 'Тип',
        Size: 'Розмір',
        Variant: 'Варіант',
        Price: 'Ціна (₴)',
        Weight: 'Вага (кг)',
      };
    }

    if (category === 'battery') {
      return {
        Type: 'Тип',
        Voltage: 'Напруга (V)',
        Capacity: 'Ємність (Ah)',
        Chemistry: 'Хімія',
        Price: 'Ціна (₴)',
        Weight: 'Вага (кг)',
      };
    }

    return {
      Type: 'Тип',
      Price: 'Ціна',
    };
  }
}
```

---

## API Endpoints

### GET /api/prices

Отримати всі активні прайси

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "price_123",
      "name": "Прайс стелажів 2024",
      "category": "rack",
      "isActive": true,
      "updatedAt": "2024-03-27T00:00:00.000Z"
    }
  ]
}
```

### GET /api/prices/all

Отримати всі прайси (включаючи неактивні) — ADMIN only

### GET /api/prices/:id

Отримати прайс по ID з повними даними — ADMIN only

### PUT /api/prices/:id

Оновити прайс — ADMIN only

**Body:**

```json
{
  "name": "Нова назва",
  "description": "Опис",
  "items": [...],
  "isActive": true
}
```

### PUT /api/prices/bulk

Масове оновлення цін — ADMIN only

**Body:**

```json
{
  "priceId": "price_123",
  "items": [
    {
      "itemId": "support_215",
      "variantId": "support_215_edge",
      "price": 650
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "updated": 1,
    "skipped": 0
  }
}
```

### GET /api/prices/:id/export

Експорт прайсу в Excel — ADMIN only

**Response:** Binary file (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)

### POST /api/prices/:id/import

Імпорт прайсу з Excel — ADMIN only

**Request:** multipart/form-data

- `file`: Excel file (.xlsx)

**Response:**

```json
{
  "success": true,
  "data": {
    "imported": 10,
    "updated": 5
  }
}
```

### POST /api/prices/:id/activate

Активувати прайс — ADMIN only

### POST /api/prices/:id/deactivate

Деактивувати прайс — ADMIN only

### DELETE /api/prices/:id

Видалити прайс — ADMIN only

---

## Приклади використання

### Backend: Реєстрація стратегій

```typescript
// server/src/modules/price/interfaces/prices.controller.ts
import { PriceProcessorService } from '../application/services/price-processor.service';
import { RackPriceStrategy } from '../domain/strategies/rack-price.strategy';

export const createPricesRouter = () => {
  const router = Router();
  const priceProcessor = new PriceProcessorService();

  // Реєстрація стратегій
  priceProcessor.registerStrategy(new RackPriceStrategy());
  // priceProcessor.registerStrategy(new BatteryPriceStrategy())

  // Використання в ендпоінтах
  router.get('/:id/export', async (req, res) => {
    const { id } = req.params;
    const price = await priceRepository.findById(id);

    const buffer = priceProcessor.exportToExcel(price.category, price.items);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="price_${price.category}_${id}.xlsx"`);
    res.send(buffer);
  });
};
```

### Frontend: Імпорт прайсу

```typescript
// client/src/services/price-admin.service.ts
async importPrice(priceId: string, file: File): Promise<ImportResult> {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await api.post(`/prices/${priceId}/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return data.data
}

// Використання
const result = await priceAdminService.importPrice('price_123', excelFile)
console.log(`Імпортовано: ${result.imported} нових, ${result.updated} оновлено`)
```

### Frontend: Експорт прайсу

```typescript
async exportPrice(priceId: string): Promise<void> {
  const response = await fetch(`/api/prices/${priceId}/export`)
  const blob = await response.blob()

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `price_${priceId}.xlsx`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
```

---

## Діаграма класів

```
┌─────────────────────────────────────────────────────────┐
│                 PriceProcessorService                   │
├─────────────────────────────────────────────────────────┤
│ - strategies: Map<string, IPriceStrategy>              │
├─────────────────────────────────────────────────────────┤
│ + registerStrategy(strategy: IPriceStrategy): void     │
│ + getStrategy(category: string): IPriceStrategy        │
│ + validateItems(category, items): boolean              │
│ + sortItems(category, items): PriceItem[]              │
│ + exportToExcel(category, items): Buffer               │
│ + importFromExcel(category, rows): PriceItem[]         │
└─────────────────────────────────────────────────────────┘
                         ▲
                         │
         ┌───────────────┼───────────────┐
         │               │               │
┌────────┴────────┐ ┌────┴──────┐ ┌─────┴──────┐
│ RackPrice       │ │ Battery   │ │ Custom     │
│ Strategy        │ │ Price     │ │ Price      │
│                 │ │ Strategy  │ │ Strategy   │
└─────────────────┘ └───────────┘ └────────────┘
         ▲               ▲               ▲
         │               │               │
    ┌────┴────┐    ┌─────┴─────┐  ┌─────┴─────┐
    │validate │    │ validate  │  │ validate  │
    │getPrice │    │ getPrice  │  │ getPrice  │
    │export   │    │ export    │  │ export    │
    │import   │    │ import    │  │ import    │
    │sort     │    │ sort      │  │ sort      │
    └─────────┘    └───────────┘  └───────────┘
```

---

## Наступні кроки

1. ✅ Створити `IPriceStrategy` інтерфейс
2. ✅ Реалізувати `RackPriceStrategy`
3. ✅ Створити `PriceProcessorService`
4. ✅ Оновити контролер з реєстрацією стратегій
5. ⏳ Реалізувати `BatteryPriceStrategy` (Sprint 6)
6. ⏳ Додати unit-тести для стратегій
