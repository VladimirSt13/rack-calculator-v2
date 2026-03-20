server/
└─ src/
   ├─ modules/
   │  ├─ rack/
   │  │  ├─ domain/
   │  │  │  ├─ entities/
   │  │  │  │  └─ rack.entity.ts
   │  │  │  ├─ value-objects/
   │  │  │  │  └─ size.vo.ts
   │  │  │  └─ calculateRack.ts
   │  │  ├─ application/
   │  │  │  └─ calculateRack.use-case.ts
   │  │  ├─ infrastructure/
   │  │  │  └─ rack.repository.ts
   │  │  └─ interfaces/
   │  │     └─ rack.controller.ts
   │  │
   │  ├─ battery/
   │  │  ├─ domain/
   │  │  ├─ application/
   │  │  ├─ infrastructure/
   │  │  └─ interfaces/
   │  │
   │  ├─ auth/
   │  ├─ users/
   │  └─ common/        # shared utilities, exceptions, types (но без свалки)
   │
   ├─ config/           # конфиги DB, JWT, env
   ├─ db/               # подключение к MongoDB / Prisma
   ├─ server.ts         # точка входа приложения
   └─ routes.ts         # маршруты API (подключение контроллеров)