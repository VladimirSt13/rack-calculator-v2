# Price Module Architecture Notes

> **Версія:** 2.1 (Strategy Pattern)  
> **Останнє оновлення:** 27 березня 2026 р.

---

## Архітектура з стратегіями

Для підтримки різних типів прайсів (стелажі, батареї, тощо) використовується **патерн Strategy**.

### Компоненти

```
server/src/modules/price/
├── domain/
│   ├── entities/
│   │   ├── price.entity.ts
│   │   └── types.ts
│   └── strategies/
│       ├── price-strategy.interface.ts    # IPriceStrategy
│       ├── rack-price.strategy.ts         # RackPriceStrategy ✅
│       └── battery-price.strategy.ts      # BatteryPriceStrategy ⏳
├── application/
│   ├── services/
│   │   └── price-processor.service.ts     # PriceProcessorService ✅
│   └── use-cases/
│       └── bulk-update-prices.use-case.ts
└── interfaces/
    └── prices.controller.ts
```

### IPriceStrategy Interface

```typescript
interface IPriceStrategy {
  category: string
  validateItem(item: PriceItem): boolean
  getPrice(item: PriceItem, variantId?: string): number
  toExportFormat(item: PriceItem): Record<string, any>[]
  fromImportFormat(data: Record<string, any>): PriceItem
  sortItems(items: PriceItem[]): PriceItem[]
}
```

### Реалізовані стратегії

#### RackPriceStrategy ✅

- **category:** `'rack'`
- **validTypes:** `support`, `span`, `vertical_support`, `diagonal_brace`, `isolator`
- **variants:** support має edge/intermediate
- **sorting:** за типом → за розміром

#### BatteryPriceStrategy ⏳ (майбутній)

- **category:** `'battery'`
- **validTypes:** `battery_cell`, `battery_pack`, `connector`, `cable`
- **metadata:** voltage, capacity, chemistry
- **sorting:** за напругою

### PriceProcessorService

Сервіс для обробки прайсів з різними стратегіями:

```typescript
const priceProcessor = new PriceProcessorService()
priceProcessor.registerStrategy(new RackPriceStrategy())

// Експорт
const buffer = priceProcessor.exportToExcel('rack', items)

// Імпорт
const result = priceProcessor.importFromExcel('rack', rows)

// Валідація
const isValid = priceProcessor.validateItems('rack', items)

// Сортування
const sorted = priceProcessor.sortItems('rack', items)
```

### Використання в контролері

```typescript
export const createPricesRouter = () => {
  const priceProcessor = new PriceProcessorService()
  priceProcessor.registerStrategy(new RackPriceStrategy())
  
  // GET /api/prices/:id/export
  router.get('/:id/export', async (req, res) => {
    const price = await priceRepository.findById(req.params.id)
    const buffer = priceProcessor.exportToExcel(price.category, price.items)
    // ...
  })
  
  // POST /api/prices/:id/import
  router.post('/:id/import', upload.single('file'), async (req, res) => {
    const price = await priceRepository.findById(req.params.id)
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
    
    const result = priceProcessor.importFromExcel(price.category, rows)
    
    if (!priceProcessor.validateItems(price.category, result.items)) {
      return res.status(400).json({ success: false, error: 'Invalid data' })
    }
    
    price.items = result.items
    await priceRepository.update(price)
    
    res.json({ success: true, data: result })
  })
}
```

### Діаграма класів

```
┌─────────────────────────────────────────────────────────┐
│                 PriceProcessorService                   │
├─────────────────────────────────────────────────────────┤
│ - strategies: Map<string, IPriceStrategy>              │
├─────────────────────────────────────────────────────────┤
│ + registerStrategy(strategy)                           │
│ + getStrategy(category): IPriceStrategy                │
│ + exportToExcel(category, items): Buffer               │
│ + importFromExcel(category, rows): {items, imported,   │
│                                      updated}          │
│ + validateItems(category, items): boolean              │
│ + sortItems(category, items): PriceItem[]              │
└─────────────────────────────────────────────────────────┘
                         ▲
                         │
         ┌───────────────┼───────────────┐
         │               │               │
┌────────┴────────┐ ┌────┴──────┐ ┌─────┴──────┐
│ RackPrice       │ │ Battery   │ │ Custom     │
│ Strategy        │ │ Price     │ │ Price      │
│ (✅)            │ │ (⏳)      │ │ (⏳)       │
└─────────────────┘ └───────────┘ └────────────┘
```

### Приклад: Додавання нової стратегії

```typescript
// 1. Створити нову стратегію
export class BatteryPriceStrategy implements IPriceStrategy {
  category = 'battery'
  
  validateItem(item: PriceItem): boolean {
    return ['battery_cell', 'battery_pack'].includes(item.type)
  }
  
  // ... інші методи
}

// 2. Зареєструвати в контролері
priceProcessor.registerStrategy(new BatteryPriceStrategy())

// 3. Готово! Імпорт/експорт/валідація працюють автоматично
```

---

## Посилання

- [price.md](../price.md) — повна документація модуля
- [notes.md](../notes.md) — загальні ноти
