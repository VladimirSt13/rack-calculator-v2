# 📚 Документація Rack Calculator V2

> **Останнє оновлення:** 27 березня 2026 р.  
> **Статус:** Sprint 5.5 (Admin Price Editor) — ✅ ЗАВЕРШЕНО  
> **Tests:** ✅ 32 unit-тести (100% pass)

---

## 🗂️ Навігація по документах

### Основна документація

| Документ                     | Опис                                              | Статус       |
| ---------------------------- | ------------------------------------------------- | ------------ |
| **[README.md](./README.md)** | Загальний опис проєкту, швидкий старт, технології | ✅ Актуально |
| **[INDEX.md](./INDEX.md)**   | Навігація по всіх документах                      | ✅ Актуально |
| **[STATUS.md](./STATUS.md)** | Статус розробки, готовність спринтів, метрики     | ✅ Актуально |
| **[PLAN.md](./PLAN.md)**     | План розробки, дорожня карта спринтів             | ✅ Актуально |
| **[notes.md](./notes.md)**   | Технічні ноти, нова структура Price               | ✅ Актуально |
| **[price.md](./price.md)**   | 🔥 НОВА: архітектура Price модуля, стратегії, API | ✅ Актуально |

### Планування

| Документ                                           | Опис                              | Статус       |
| -------------------------------------------------- | --------------------------------- | ------------ |
| **[PLAN-PRICE-EDITOR.md](./PLAN-PRICE-EDITOR.md)** | Детальний план Admin Price Editor | ✅ Завершено |

### Технічна документація

| Документ                                                                                   | Опис                                   | Статус       |
| ------------------------------------------------------------------------------------------ | -------------------------------------- | ------------ |
| **[server/src/modules/price/ARCHITECTURE.md](./server/src/modules/price/ARCHITECTURE.md)** | 🔥 НОВА: Strategy Pattern документація | ✅ Актуально |
| **[server/src/modules/price/TESTS.md](./server/src/modules/price/TESTS.md)**               | 🔥 НОВА: unit-тести для Price модуля   | ✅ Актуально |

### Бізнес-логіка

| Документ                                                         | Опис                                | Статус       |
| ---------------------------------------------------------------- | ----------------------------------- | ------------ |
| **[RACK_ALGORITHM_BUSINESS.md](./RACK_ALGORITHM_BUSINESS.md)**   | Бізнес-алгоритм розрахунку стелажів | ✅ Актуально |
| **[rack-form-description.md](./rack-form-description.md)**       | Опис форми калькулятора стелажів    | ✅ Актуально |
| **[rack-results-description.md](./rack-results-description.md)** | Опис результатів розрахунку         | ✅ Актуально |

### База даних

| Документ                                                         | Опис                             | Статус       |
| ---------------------------------------------------------------- | -------------------------------- | ------------ |
| **[price/PRICE_DB_STRUCTURE.md](./price/PRICE_DB_STRUCTURE.md)** | Структура прайсів (стара + нова) | ✅ Актуально |

---

## 📋 Короткий зміст

### 1. [README.md](./README.md) — Загальна інформація

- Опис проєкту
- Швидкий старт
- Структура проєкту
- Технологічний стек
- Реалізовані модулі
- API endpoints
- **НОВЕ:** Strategy Pattern, Unit Tests

### 2. [STATUS.md](./STATUS.md) — Статус проєкту

- Загальний стан (Backend 80%, Frontend 65%, Tests 20%, Docs 100%)
- Спринти (0-5.5 завершено)
- Виконані завдання
- Технічні борги
- Наступні кроки

### 3. [PLAN.md](./PLAN.md) — План розробки

- Стратегія розробки
- Дизайн-система
- Дорожня карта спринтів
- Прогрес проєкту
- **НОВЕ:** Sprint 5.5 деталі (Strategy Pattern, 32 тести)

### 4. [price.md](./price.md) — 🔥 НОВА: Price Module Architecture

- **Структура даних:** Price, PriceItem, PriceVariant
- **Стратегії обробки:** IPriceStrategy, RackPriceStrategy, BatteryPriceStrategy
- **PriceProcessorService:** обробка з стратегіями
- **API Endpoints:** повний список
- **Приклади використання:** backend, frontend

### 5. [server/src/modules/price/ARCHITECTURE.md](./server/src/modules/price/ARCHITECTURE.md) — 🔥 НОВА: Strategy Pattern

- **IPriceStrategy** інтерфейс
- **RackPriceStrategy** реалізація
- **PriceProcessorService** сервіс
- **Діаграма класів**
- **Приклади додавання нових стратегій**

### 6. [server/src/modules/price/TESTS.md](./server/src/modules/price/TESTS.md) — 🔥 НОВА: Unit Tests

- **32 тести** (100% pass)
- **RackPriceStrategy:** 18 тестів
- **PriceProcessorService:** 14 тестів
- **Coverage:** 85%+
- **Приклади тестів**

### 7. [notes.md](./notes.md) — Технічні ноти

- Нова структура Price (items масив)
- API endpoints для Price Editor
- Сортування елементів
- Формат Excel для імпорту
- Use Cases

### 8. [PLAN-PRICE-EDITOR.md](./PLAN-PRICE-EDITOR.md) — Admin Price Editor

- Мета і функціонал
- Backend імплементація (DTO, Use-Cases, Controller)
- Frontend компоненти (PriceTableEditor, PriceImportModal)
- Формат імпорту/експорту

### 9. [RACK_ALGORITHM_BUSINESS.md](./RACK_ALGORITHM_BUSINESS.md) — Алгоритм стелажів

- Вхідні параметри
- Логіка розрахунку компонентів
- Формули розрахунку вартості
- Приклади розрахунків

### 10. [rack-form-description.md](./rack-form-description.md) — Форма стелажів

- Розташування елементів
- Поля вводу
- Динамічні прольоти
- Кнопки дій

### 11. [rack-results-description.md](./rack-results-description.md) — Результати

- Структура результатів
- Компоненти (Preamble, ComponentsTable, Pricing)
- Стани (Idle, Loading, Ready, Error)

### 12. [price/PRICE_DB_STRUCTURE.md](./price/PRICE_DB_STRUCTURE.md) — Прайси

- **Нова структура** з `items` масивом
- **Стара структура** з `data` об'єктом
- Приклади записів
- Індекси

---

## 🎯 Статус спринтів

| Спринт         | Назва                  | Статус      |
| -------------- | ---------------------- | ----------- |
| Sprint 0       | Підготовка проєкту     | ✅ 100%     |
| Sprint 1       | User Management & Auth | ✅ 100%     |
| Sprint 2       | Frontend Auth Pages    | ✅ 100%     |
| Sprint 3       | Roles & RBAC           | ✅ 100%     |
| Sprint 3.5     | Frontend Foundation    | ✅ 100%     |
| Sprint 4       | Audit / Logging        | ✅ 100%     |
| Sprint 4.5     | Audit Frontend         | ✅ 100%     |
| Sprint 4.7     | Email Verification     | ✅ 100%     |
| Sprint 5       | Rack Module            | ✅ 100%     |
| **Sprint 5.5** | **Admin Price Editor** | ✅ **100%** |
| Sprint 6       | Battery Module         | ⏳ 0%       |
| Sprint 7       | Export / Revisions     | ⏳ 0%       |
| Sprint 8       | Deployment             | ⏳ 0%       |

---

## 📈 Прогрес проєкту

```
Backend:  ███████████████████████░ 80%
Frontend: ███████████████████░░░░░ 65%
Tests:    ██████░░░░░░░░░░░░░░░░░░ 20%
Docs:     ████████████████████████ 100%
```

---

## 🔗 Корисні посилання

- **Репозиторій:** https://github.com/VladimirSt13/rack-calculator-v2
- **GitHub Issues:** https://github.com/VladimirSt13/rack-calculator-v2/issues

---

## 📞 Контакти

- **Автор:** VladimirSt13
- **License:** MIT
