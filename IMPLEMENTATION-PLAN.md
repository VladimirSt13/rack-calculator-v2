# 📋 План реалізації: Результати розрахунку стелажів

## 🎯 Етап 1: Підготовка — оновлення типів даних

**Файли:**

- `client/src/types/rack.ts`

**Завдання:**

- [ ] Додати `price` та `total` до `SupportItem`, `BeamItem`, `VerticalStandItem`, `BraceItem`, `IsolatorItem`
- [ ] Оновити `RackPricing` з `base`, `withoutIsolators`, `zero`
- [ ] Додати типи для `RackSetItem`, `RackSetState`
- [ ] Додати типи для `SaveSetFormData`

**Час:** 15 хв

---

## 🎯 Етап 2: ResultsSkeleton компонент

**Файли:**

- `client/src/components/rack/ResultsSkeleton.tsx` (новий)

**Завдання:**

- [ ] Створити компонент з 3 рядками Skeleton
- [ ] Додати заголовок Skeleton
- [ ] Додати Skeleton для рядків таблиці (×3)

**Час:** 20 хв

---

## 🎯 Етап 3: PreambleCard компонент

**Файли:**

- `client/src/components/rack/PreambleCard.tsx` (новий)
- `client/src/components/rack/PriceDisplay.tsx` (новий)

**Завдання:**

- [ ] Створити `PriceDisplay` компонент для форматування цін
- [ ] Створити `PreambleCard` з 4 метриками
- [ ] Grid-розкладка: 4 колонки desktop, 2 mobile
- [ ] Іконка `CheckCircle2`

**Час:** 30 хв

---

## 🎯 Етап 4: ComponentsTableCard з цінами

**Файли:**

- `client/src/components/rack/ComponentsTableCard.tsx` (новий)

**Завдання:**

- [ ] Таблиця з 4 колонками: Компонент, Кількість, Ціна, Вартість
- [ ] Мапінг компонентів з `result.components`
- [ ] Блок цін з виділенням базової ціни (bg-muted/50)
- [ ] Кнопка "Додати до комплекту"

**Час:** 45 хв

---

## 🎯 Етап 5: SetPanel — права панель

**Файли:**

- `client/src/components/rack/SetPanel.tsx` (новий)
- `client/src/components/rack/RackSetCard.tsx` (новий)
- `client/src/stores/rackSet.store.ts` (новий)

**Завдання:**

- [ ] Zustand store для управління комплектом
- [ ] Дії: `addRack`, `incrementQuantity`, `decrementQuantity`, `removeRack`, `clearSet`
- [ ] ScrollArea для списку стелажів
- [ ] Контроль кількості [−] [input] [+]
- [ ] Підсумкова вартість (2 типи цін)
- [ ] Кнопки "Зберегти комплект" та "Очистити"

**Час:** 1 год

---

## 🎯 Етап 6: SaveSetModal — модальне вікно

**Файли:**

- `client/src/components/rack/SaveSetModal.tsx` (новий)
- `client/src/utils/validation/rackSet.validation.ts` (новий)

**Завдання:**

- [ ] Dialog компонент з формою
- [ ] Поля: "Назва об'єкту" (Input), "Примітка" (Textarea)
- [ ] Zod валідація: `objectName.min(3)`, `note.optional()`
- [ ] Список стелажів з компонентами
- [ ] Підсумкова вартість
- [ ] Кнопки "Зберегти" / "Скасувати"
- [ ] Toast після збереження

**Час:** 1 год

---

## 🎯 Етап 7: Інтеграція з API

**Файли:**

- `client/src/services/rackSet.service.ts` (новий)
- `client/src/pages/RackCalculatorPage.tsx` (оновлення)

**Завдання:**

- [ ] API service: `createSet`, `getSet`, `updateSet`
- [ ] Інтеграція `SetPanel` в `RackCalculatorPage`
- [ ] Інтеграція `SaveSetModal` з form submission
- [ ] Додати `ResultsSkeleton` для стану завантаження
- [ ] Замінити поточні результати на нові компоненти

**Час:** 1 год

---

## 📊 Разом:

| Етап      | Завдання                       | Час              |
| --------- | ------------------------------ | ---------------- |
| 1         | Оновлення типів                | 15 хв            |
| 2         | ResultsSkeleton                | 20 хв            |
| 3         | PreambleCard + PriceDisplay    | 30 хв            |
| 4         | ComponentsTableCard            | 45 хв            |
| 5         | SetPanel + RackSetCard + store | 1 год            |
| 6         | SaveSetModal + validation      | 1 год            |
| 7         | Інтеграція з API               | 1 год            |
| **Разом** |                                | **~4 год 45 хв** |

---

## ✅ Статус виконання

- [x] Етап 1: Підготовка — оновлення типів даних
- [x] Етап 2: ResultsSkeleton компонент
- [x] Етап 3: PreambleCard компонент
- [x] Етап 4: ComponentsTableCard з цінами
- [x] Етап 5: SetPanel — права панель
- [x] Етап 6: SaveSetModal — модальне вікно
- [x] Етап 7: Інтеграція з API

**Все виконано!** ✅

TypeScript компіляція: ✅ Без помилок

---

## 📁 Створені файли

### Типи даних

- `client/src/types/rack.ts` (оновлено)

### Компоненти

- `client/src/components/rack/ResultsSkeleton.tsx`
- `client/src/components/rack/PriceDisplay.tsx`
- `client/src/components/rack/PreambleCard.tsx`
- `client/src/components/rack/ComponentsTableCard.tsx`
- `client/src/components/rack/RackSetCard.tsx`
- `client/src/components/rack/SetPanel.tsx`
- `client/src/components/rack/SaveSetModal.tsx`
- `client/src/components/ui/textarea.tsx`

### Store

- `client/src/stores/rackSet.store.ts`

### Валідація

- `client/src/utils/validation/rackSet.validation.ts`

### Сторінки

- `client/src/pages/RackCalculatorPage.tsx` (оновлено)
