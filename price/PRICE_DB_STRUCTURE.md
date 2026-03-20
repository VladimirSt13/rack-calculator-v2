# Структура прайса в MongoDB

## 1. Price Document (Приклад запису в БД)

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "data": {
    "supports": {
      "215 кр": {
        "code": "215",
        "name": "Крайня опора 1-рядного стелажа, 215мм",
        "price": 600.00,
        "weight": 2.00,
        "category": "supports"
      },
      "215 пром": {
        "code": "215",
        "name": "Проміжна опора 1-рядного стелажа, 215мм",
        "price": 620.00,
        "weight": 2.05,
        "category": "supports"
      },
      "430 кр": {
        "code": "430",
        "name": "Крайня опора 2-рядного стелажа, 430мм",
        "price": 930.00,
        "weight": 3.27,
        "category": "supports"
      }
    },
    "spans": {
      "600": {
        "code": "600",
        "name": "Траверса, h/с-профіль, 600мм",
        "price": 500.00,
        "weight": 1.60,
        "category": "spans"
      },
      "1500": {
        "code": "1500",
        "name": "Траверса, h/с-профіль, 1500мм",
        "price": 980.00,
        "weight": 4.28,
        "category": "spans"
      }
    },
    "isolator": {
      "isolator": {
        "code": "isolator",
        "name": "Ізолятор",
        "price": 69.00,
        "weight": 0.10,
        "category": "isolator"
      }
    }
  },
  "category": "rack",
  "createdAt": ISODate("2026-03-01T10:00:00.000Z"),
  "updatedAt": ISODate("2026-03-15T14:30:00.000Z"),
  "deleted": false,
  "deletedAt": null
}
```

---

## 2. PriceComponent Document (Приклад запису в БД)

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "name": "Крайня опора 2-рядного стелажа, 430мм",
  "category": "supports",
  "price": 930,
  "unit": "шт",
  "metadata": {
    "code": "430",
    "type": "кр",
    "weight": 3.27,
    "width": 430,
    "rows": 2,
    "position": "крайня"
  },
  "createdAt": ISODate("2026-03-01T10:00:00.000Z"),
  "updatedAt": ISODate("2026-03-15T14:30:00.000Z"),
  "deleted": false,
  "deletedAt": null
}
```

---

## 3. Детальна структура полів

### Price.data

**Тип:** `Object (Mixed)`

**Структура:**
```javascript
{
  "<category_key>": {           // "supports", "spans", "isolator"
    "<item_key>": {             // "215 кр", "430 кр", "600"
      code: string,             // Код товару ("215", "430", "600")
      name: string,             // Повна назва
      price: number,            // Ціна без ПДВ (грн)
      weight: number|null,      // Вага (кг) або null
      category: string          // Категорія ("supports", "spans")
    }
  }
}
```

**Категорії в data:**
- `supports` — опори (C80, C290, C430, тощо)
- `spans` — балки/траверси (600, 750, 900, 1500)
- `isolator` — ізолятори
- `vertical_supports` — вертикальні опори
- `diagonal_brace` — розкоси
- `rack_components` — комплектуючі стелажів
- `battery_racks` — стелажі для АКБ

---

### PriceComponent.metadata

**Тип:** `Object (Mixed)`

**Приклад структури:**
```javascript
{
  // Для опор (supports)
  {
    code: string,        // "430"
    type: string,        // "кр" (крайня) або "пром" (проміжна)
    weight: number,      // 3.27 кг
    width: number,       // 430 мм
    rows: number,        // 2 (кількість рядів)
    position: string,    // "крайня" або "проміжна"
    stepped: boolean     // true для ступінчастих (C)
  }
  
  // Для балок (spans)
  {
    code: string,        // "1500"
    length: number,      // 1500 мм
    weight: number,      // 4.28 кг
    profile: string      // "h/с-профіль"
  }
  
  // Для ізоляторів
  {
    code: string,        // "isolator"
    material: string,    // матеріал ізолятора
    thickness: number    // товщина (мм)
  }
}
```

---

## 4. Приклади записів по категоріях

### Supports (Опори)

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "Крайня опора 2-рядного стелажа, 430мм",
  "category": "supports",
  "price": 930,
  "unit": "шт",
  "metadata": {
    "code": "430",
    "type": "кр",
    "weight": 3.27,
    "width": 430,
    "rows": 2,
    "position": "крайня",
    "stepped": false
  }
}
```

### Spans (Балки)

```json
{
  "_id": "507f1f77bcf86cd799439014",
  "name": "Траверса, h/с-профіль, 1500мм",
  "category": "spans",
  "price": 980,
  "unit": "шт",
  "metadata": {
    "code": "1500",
    "length": 1500,
    "weight": 4.28,
    "profile": "h/с-профіль"
  }
}
```

### Isolator (Ізолятори)

```json
{
  "_id": "507f1f77bcf86cd799439015",
  "name": "Ізолятор опори одноповерхового стелажа",
  "category": "isolator",
  "price": 69,
  "unit": "шт",
  "metadata": {
    "code": "isolator",
    "weight": 0.10,
    "material": "гума",
    "thickness": 5
  }
}
```

### Vertical Supports (Вертикальні опори)

```json
{
  "_id": "507f1f77bcf86cd799439016",
  "name": "Вертикальна опора, 1190мм",
  "category": "vertical_supports",
  "price": 1150,
  "unit": "шт",
  "metadata": {
    "code": "1190",
    "height": 1190,
    "weight": 3.40
  }
}
```

### Diagonal Brace (Розкоси)

```json
{
  "_id": "507f1f77bcf86cd799439017",
  "name": "Розкос багатоповерхового стелажа",
  "category": "diagonal_brace",
  "price": 380,
  "unit": "шт",
  "metadata": {
    "code": "diagonal_brace",
    "weight": 1.00,
    "type": "багатоповерховий"
  }
}
```

---

## 5. Індекси

### Price Collection

```javascript
// Індекси
db.prices.createIndex({ category: 1, updatedAt: -1 })
db.prices.createIndex({ deleted: 1, updatedAt: -1 })
```

### PriceComponent Collection

```javascript
// Комбінований індекс (унікальність)
db.pricecomponents.createIndex({ name: 1, category: 1, deleted: 1 })
```

---

## 6. Приклад запиту в MongoDB Compass

### Отримати активний прайс категорії "rack"

```javascript
db.prices.findOne({
  category: "rack",
  deleted: false
})
```

### Отримати всі компоненти категорії "supports"

```javascript
db.pricecomponents.find({
  category: "supports",
  deleted: false
}).sort({ price: 1 })
```

### Отримати компоненти з фільтрацією по ціні

```javascript
db.pricecomponents.find({
  category: "supports",
  price: { $gte: 500, $lte: 1000 },
  deleted: false
})
```

### Агрегація: середня ціна по категоріях

```javascript
db.pricecomponents.aggregate([
  { $match: { deleted: false } },
  {
    $group: {
      _id: "$category",
      avgPrice: { $avg: "$price" },
      count: { $sum: 1 }
    }
  }
])
```

---

## 7. Soft Delete в БД

### Видалений запис (Price)

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "data": { ... },
  "category": "rack",
  "deleted": true,
  "deletedAt": ISODate("2026-03-10T09:15:00.000Z"),
  "createdAt": ISODate("2026-03-01T10:00:00.000Z"),
  "updatedAt": ISODate("2026-03-10T09:15:00.000Z")
}
```

### Запит для отримання тільки активних

```javascript
db.prices.find({
  deleted: { $in: [false, null] }
})
```

### Запит для отримання видалених

```javascript
db.prices.find({
  deleted: true
})
```

---

## 8. TTL Indexes (автоматичне видалення)

**Примітка:** Price та PriceComponent не мають TTL indexes.

TTL indexes використовуються в інших моделях:
- `RefreshToken` — 7 днів
- `EmailVerification` — 24 години
- `PasswordReset` — 1 година

---

## 9. Зв'язки між моделями

```
User
├── price_types: string[]  → Price.category (фільтрація)
└── role: ObjectId         → Role (permissions)

RackSet
└── components[]           → PriceComponent (id, ціни)

Calculation
└── components[]           → PriceComponent (id, ціни)
```

---

## 10. Фільтрація за permissions

### User document

```json
{
  "_id": "507f1f77bcf86cd799439020",
  "email": "manager@accu-energo.com.ua",
  "roleName": "manager",
  "price_types": ["нульова"],
  "permissions": ["PRICES_READ", "RACK_SETS_CREATE"]
}
```

### Фільтрація на сервері

```javascript
// prices.service.ts
async getPrices(category?: string, userPermissions?: string[]) {
  const query = { deleted: false };
  if (category) query.category = category;
  
  const prices = await this.pricesRepository.find(query);
  
  // Фільтрація data за permissions
  if (userPermissions && !userPermissions.includes('загальна')) {
    prices.forEach(price => {
      Object.keys(price.data).forEach(cat => {
        Object.keys(price.data[cat]).forEach(item => {
          if (!userPermissions.includes('загальна')) {
            delete price.data[cat][item].price;
          }
        });
      });
    });
  }
  
  return prices;
}
```

---

## 11. Приклад повного запиту з даними

```javascript
// GET /api/prices?category=rack
{
  "_id": "507f1f77bcf86cd799439011",
  "data": {
    "supports": {
      "215 кр": {
        "code": "215",
        "name": "Крайня опора 1-рядного стелажа, 215мм",
        "price": 600,
        "weight": 2,
        "category": "supports"
      },
      "290 кр": {
        "code": "290",
        "name": "Крайня опора 1-рядного стелажа, 290мм",
        "price": 780,
        "weight": 2.6,
        "category": "supports"
      },
      "430 кр": {
        "code": "430",
        "name": "Крайня опора 2-рядного стелажа, 430мм",
        "price": 930,
        "weight": 3.27,
        "category": "supports"
      },
      "430 пром": {
        "code": "430",
        "name": "Проміжна опора 2-рядного стелажа, 430мм",
        "price": 980,
        "weight": 3.33,
        "category": "supports"
      },
      "580 кр": {
        "code": "580",
        "name": "Крайня опора 2-рядного стелажа, 580мм",
        "price": 1020,
        "weight": 3.9,
        "category": "supports"
      },
      "645 кр": {
        "code": "645",
        "name": "Крайня опора 2-рядного стелажа, 645мм",
        "price": 1240,
        "weight": 4.3,
        "category": "supports"
      }
    },
    "spans": {
      "600": {
        "code": "600",
        "name": "Траверса, h/с-профіль, 600мм",
        "price": 500,
        "weight": 1.6,
        "category": "spans"
      },
      "750": {
        "code": "750",
        "name": "Траверса, h/с-профіль, 750мм",
        "price": 630,
        "weight": 2.1,
        "category": "spans"
      },
      "900": {
        "code": "900",
        "name": "Траверса, h/с-профіль, 900мм",
        "price": 730,
        "weight": 2.56,
        "category": "spans"
      },
      "1000": {
        "code": "1000",
        "name": "Траверса, h/с-профіль, 1000мм",
        "price": 790,
        "weight": 2.83,
        "category": "spans"
      },
      "1200": {
        "code": "1200",
        "name": "Траверса, h/с-профіль, 1200мм",
        "price": 870,
        "weight": 3.4,
        "category": "spans"
      },
      "1500": {
        "code": "1500",
        "name": "Траверса, h/с-профіль, 1500мм",
        "price": 980,
        "weight": 4.28,
        "category": "spans"
      },
      "2000": {
        "code": "2000",
        "name": "Траверса, h/с-профіль, 2000мм",
        "price": 1930,
        "weight": 5.7,
        "category": "spans"
      }
    },
    "vertical_supports": {
      "632": {
        "code": "632",
        "name": "Вертикальна опора, 632мм",
        "price": 630,
        "weight": 1.8,
        "category": "vertical_supports"
      },
      "1190": {
        "code": "1190",
        "name": "Вертикальна опора, 1190мм",
        "price": 1150,
        "weight": 3.4,
        "category": "vertical_supports"
      },
      "1500": {
        "code": "1500",
        "name": "Траверса, h/с-профіль, 1500мм",
        "price": 1450,
        "weight": 4.3,
        "category": "vertical_supports"
      },
      "2000": {
        "code": "2000",
        "name": "Траверса, h/с-профіль, 2000мм",
        "price": 1930,
        "weight": 5.7,
        "category": "vertical_supports"
      }
    },
    "diagonal_brace": {
      "diagonal_brace": {
        "code": "diagonal_brace",
        "name": "Розкос багатоповерхового стелажа",
        "price": 380,
        "weight": 1,
        "category": "diagonal_brace"
      }
    },
    "isolator": {
      "isolator": {
        "code": "isolator",
        "name": "Ізолятор опори одноповерхового стелажа",
        "price": 69,
        "weight": 0.1,
        "category": "isolator"
      }
    }
  },
  "category": "rack",
  "createdAt": "2026-03-01T10:00:00.000Z",
  "updatedAt": "2026-03-15T14:30:00.000Z",
  "deleted": false,
  "deletedAt": null
}
```

---

**Файли:**
- Модель: `server/src/database/models/price.model.ts`
- Модель: `server/src/database/models/price-component.model.ts`
- Скрипт: `server/scripts/create-test-price.ts`
- Документація: `server/docs/PRICING.md`
