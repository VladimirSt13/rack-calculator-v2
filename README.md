# Rack Calculator V2

Калькулятор розрахунку стелажного обладнання та його вартості.

## 📖 Опис

Проєкт призначений для розрахунку компонентів та вартості стелажного обладнання на основі конфігурації:

- **Поверховість** (кількість ярусів)
- **Рядність** (кількість рядів)
- **Балок на ряд**
- **Тип опор**
- **Тип вертикальних стійок**
- **Прольоти**

### Основні можливості

- ✅ Розрахунок компонентів стелажа за бізнес-алгоритмом
- ✅ Автоматичний розрахунок вартості (3 типи цін)
- ✅ Збереження комплектів стелажів
- ✅ Управління версіями (ревізіями)
- ✅ Система ролей та прав доступу (RBAC)
- ✅ Логування дій користувачів (Audit)
- ✅ Email verification та скидання пароля

---

## 🚀 Швидкий старт

### Встановлення

```bash
# Клонувати репозиторій
git clone https://github.com/VladimirSt13/rack-calculator-v2.git

# Перейти в директорію проєкту
cd rack-calculator-v2

# Встановити залежності
npm install

# Налаштувати змінні оточення (server/.env)
cp server/.env.example server/.env
```

### Запуск

```bash
# Запуск обох додатків одночасно (frontend + backend)
npm run dev

# Або окремо:
npm run dev:server   # Backend
npm run dev:client   # Frontend
```

### База даних

```bash
# Генерація Prisma клієнта
npm run db:generate

# Застосування міграцій
npm run db:push

# Відкрити Prisma Studio
npm run db:studio
```

---

## 📁 Структура проєкту

```
rack-calculator-v2/
├── client/                 # Frontend (React 19 + TypeScript + Vite)
│   ├── src/
│   │   ├── components/    # UI компоненти
│   │   ├── pages/         # Сторінки
│   │   ├── services/      # API client, services
│   │   ├── stores/        # Zustand stores
│   │   ├── types/         # TypeScript типи
│   │   └── utils/         # Утиліти, validation
│   └── package.json
│
├── server/                 # Backend (Node.js + Express + Prisma)
│   ├── src/
│   │   ├── modules/       # Модулі (auth, users, rack, audit...)
│   │   ├── config/        # Конфігурація
│   │   ├── db/            # DB підключення
│   │   └── routes.ts      # Маршрути
│   ├── prisma/
│   │   └── schema.prisma  # Prisma схема
│   └── package.json
│
├── price/                  # База цін
│   ├── PRICE_DB_STRUCTURE.md
│   ├── price.txt
│   └── price.xlsx
│
└── документація
    ├── README.md
    ├── PLAN.md
    ├── STATUS.md
    ├── RACK_ALGORITHM_BUSINESS.md
    ├── rack-form-description.md
    └── rack-results-description.md
```

---

## 🛠️ Технологічний стек

### Backend

| Технологія           | Призначення           |
| -------------------- | --------------------- |
| Node.js + TypeScript | Платформа + типізація |
| Express 5.x          | Web-фреймворк         |
| Prisma 5.x (MongoDB) | ORM + база даних      |
| Zod                  | Валідація даних       |
| JWT (jsonwebtoken)   | Токени автентифікації |
| Nodemailer           | Email сервіс          |
| Vitest/Jest          | Тестування            |

### Frontend

| Технологія      | Призначення        |
| --------------- | ------------------ |
| React 19        | UI-бібліотека      |
| TypeScript      | Типізація          |
| Vite            | Збірник            |
| TanStack Query  | Робота з сервером  |
| Zustand         | State management   |
| React Hook Form | Управління формами |
| Zod             | Валідація форм     |
| Axios           | HTTP-клієнт        |
| React Router    | Маршрутизація      |
| Tailwind CSS v4 | Стилізація         |
| shadcn/ui       | UI компоненти      |

---

## 📋 Реалізовані модулі

### Backend

| Модуль      | Опис                          | Статус |
| ----------- | ----------------------------- | ------ |
| **auth**    | Автентифікація (JWT, Refresh) | ✅     |
| **users**   | Користувачі (CRUD, Profile)   | ✅     |
| **roles**   | Ролі та RBAC система          | ✅     |
| **perms**   | Дозволи (Resource-Action)     | ✅     |
| **audit**   | Логування дій користувачів    | ✅     |
| **email**   | Email сервіс (Nodemailer)     | ✅     |
| **price**   | Модуль цін (Price DB)         | ✅     |
| **rack**    | Розрахунок стелажів           | ✅     |
| **battery** | Підбір батарей                | ⏳     |

### Frontend

| Компонент           | Опис                     | Статус |
| ------------------- | ------------------------ | ------ |
| **Auth Pages**      | Login, Register, Profile | ✅     |
| **Dashboard**       | Головна сторінка         | ✅     |
| **Audit Page**      | Перегляд логів (ADMIN)   | ✅     |
| **Rack Calculator** | Калькулятор стелажів     | ✅     |
| **Battery Page**    | Підбір батарей           | ⏳     |

---

## 🔌 API Endpoints

### Auth

- `POST /api/auth/register` — реєстрація
- `POST /api/auth/login` — вхід
- `POST /api/auth/logout` — вихід
- `POST /api/auth/refresh` — оновлення токена
- `POST /api/auth/reset-password/request` — запит скидання пароля
- `POST /api/auth/reset-password/confirm` — підтвердження скидання
- `POST /api/auth/resend-verification` — повторна відправка verification
- `GET /api/auth/me` — поточний користувач

### Rack

- `POST /api/rack/calculate` — розрахунок стелажа
- `GET /api/rack/my` — мої розрахунки
- `GET /api/rack/:id` — деталі розрахунку

### Audit (ADMIN)

- `GET /api/audit` — всі логи
- `GET /api/audit/my` — логи користувача
- `GET /api/audit/:id` — лог по ID

### Roles & Permissions (ADMIN)

- `GET/POST /api/roles` — ролі
- `GET/PUT/DELETE /api/roles/:id` — управління роллю
- `GET/POST /api/permissions` — дозволи

### Prices

- `GET /api/prices` — список прайсів
- `GET /api/prices/:category` — прайс по категорії
- `POST /api/prices` — створити (admin)
- `PUT /api/prices/:id` — оновити (admin)

---

## 📚 Документація

- **[STATUS.md](./STATUS.md)** — статус проєкту, готовність спринтів
- **[PLAN.md](./PLAN.md)** — план розробки, дорожня карта
- **[RACK_ALGORITHM_BUSINESS.md](./RACK_ALGORITHM_BUSINESS.md)** — бізнес-алгоритм розрахунку стелажів
- **[rack-form-description.md](./rack-form-description.md)** — опис форми калькулятора
- **[rack-results-description.md](./rack-results-description.md)** — опис результатів
- **[price/PRICE_DB_STRUCTURE.md](./price/PRICE_DB_STRUCTURE.md)** — структура бази цін

---

## 🧪 Тестування

```bash
# Запуск тестів
npm test

# Backend тести
npm run test --workspace=server

# Frontend тести
npm run test --workspace=client
```

---

## 📈 Прогрес проєкту

```
Backend:  ██████████████████████░░ 70%
Frontend: ████████████████░░░░░░░░ 50%
Tests:    █░░░░░░░░░░░░░░░░░░░░░░░  5%
Docs:     ████████████████████████ 100%
```

---

## 📅 Наступні плани

1. **Sprint 6: Battery Module** — підбір батарей для стелажів
2. **Тестування** — unit та integration тести
3. **Sprint 7: Export/Revisions** — експорт в Excel, версіонування
4. **Sprint 8: Deployment** — Docker, CI/CD, production

---

## 👥 Автори

- [Vladimir St](https://github.com/VladimirSt13)

---

## 📄 Ліцензія

MIT
