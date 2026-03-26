# Rack Calculator V2

Калькулятор розрахунку стелажного обладнання та його вартості.

## Опис

Проєкт призначений для розрахунку компонентів та вартості стелажного обладнання на основі конфігурації:

- Поверховість (кількість ярусів)
- Рядність (кількість рядів)
- Балок на ряд
- Тип опор
- Тип вертикальних стійок
- Прольоти

## Документація

- [RACK_ALGORITHM_BUSINESS.md](./RACK_ALGORITHM_BUSINESS.md) — бізнес-опис алгоритму розрахунку
- [plan-server.md](./plan-server.md) — план серверної частини
- [plan-client.md](./plan-client.md) — план клієнтської частини
- [backend-sturcure.md](./backend-sturcure.md) — структура бекенду
- [summory.md](./summory.md) — зведена інформація
- [price/PRICE_DB_STRUCTURE.md](./price/PRICE_DB_STRUCTURE.md) — структура бази цін

## Структура проєкту

```
rack-calculator-v2/
├── price/                 # Прайс-лист і база цін
│   ├── PRICE_DB_STRUCTURE.md
│   ├── price.txt
│   └── price.xlsx
├── backend-sturcure.md
├── plan-client.md
├── plan-server.md
├── RACK_ALGORITHM_BUSINESS.md
└── summory.md
```

## Встановлення

```bash
# Клонувати репозиторій
git clone <URL_REPOSITORY>

# Перейти в директорію проєкту
cd rack-calculator-v2
```

## Ліцензія

MIT
