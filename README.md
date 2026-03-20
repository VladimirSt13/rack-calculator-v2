# Rack Calculator V2

Калькулятор расчёта стеллажного оборудования и их стоимости.

## Описание

Проект предназначен для расчёта компонентов и стоимости стелажного оборудования на основе конфигурации:
- Поверховість (количество ярусов)
- Рядність (количество рядов)
- Балок на ряд
- Тип опор
- Тип вертикальных стоек
- Пролёты

## Документация

- [RACK_ALGORITHM_BUSINESS.md](./RACK_ALGORITHM_BUSINESS.md) — бизнес-описание алгоритма расчёта
- [plan-server.md](./plan-server.md) — план серверной части
- [plan-client.md](./plan-client.md) — план клиентской части
- [backend-sturcure.md](./backend-sturcure.md) — структура бэкенда
- [summory.md](./summory.md) — сводная информация
- [price/PRICE_DB_STRUCTURE.md](./price/PRICE_DB_STRUCTURE.md) — структура базы цен

## Структура проекта

```
rack-calculator-v2/
├── price/                 # Прайс-лист и база цен
│   ├── PRICE_DB_STRUCTURE.md
│   ├── price.txt
│   └── price.xlsx
├── backend-sturcure.md
├── plan-client.md
├── plan-server.md
├── RACK_ALGORITHM_BUSINESS.md
└── summory.md
```

## Установка

```bash
# Клонировать репозиторий
git clone <URL_REPOSITORY>

# Перейти в директорию проекта
cd rack-calculator-v2
```

## Лицензия

MIT
