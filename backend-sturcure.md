server/
└─ src/
├─ modules/
│ ├─ rack/
│ │ ├─ domain/
│ │ │ ├─ entities/
│ │ │ │ └─ rack.entity.ts
│ │ │ ├─ value-objects/
│ │ │ │ └─ size.vo.ts
│ │ │ └─ calculateRack.ts
│ │ ├─ application/
│ │ │ └─ calculateRack.use-case.ts
│ │ ├─ infrastructure/
│ │ │ └─ rack.repository.ts
│ │ └─ interfaces/
│ │ └─ rack.controller.ts
│ │
│ ├─ battery/
│ │ ├─ domain/
│ │ ├─ application/
│ │ ├─ infrastructure/
│ │ └─ interfaces/
│ │
│ ├─ auth/
│ ├─ users/
│ └─ common/ # shared utilities, exceptions, types (але без звалища)
│
├─ config/ # конфіги DB, JWT, env
├─ db/ # підключення до MongoDB / Prisma
├─ server.ts # точка входу додатку
└─ routes.ts # маршрути API (підключення контролерів)
