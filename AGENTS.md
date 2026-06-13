# AGENTS.md

## Контекст проекта

Это учебный проект **BookingApp** — система бронирования слотов для встреч. Проект
реализуется в виде монорепы (фронтенд + бэкенд + спецификация API в одном репозитории).

### Роли

- **Владелец календаря** — один заранее заданный профиль, без авторизации. Может создавать
  типы событий, просматривать бронирования.
- **Гость** — неавторизованный пользователь, без создания аккаунта. Может выбирать тип
  встречи, дату, время и бронировать слот.

### Бизнес-правила

- На одно и то же время нельзя создать две записи (даже разные типы событий)
- Доступное окно записи: 14 дней от текущей даты
- Гость может записаться только на свободный слот

## Стек технологий

### Фронтенд

- React 19 + TypeScript + Vite
- Mantine UI v9 (тёмная тема, фон `#1a1a1a`)
- TanStack Query (React Query)
- React Router DOM
- Axios (HTTP клиент)
- i18next (локализация)
- Playwright MCP (тестирование)
- Порт: `5173`

### Бэкенд

- NestJS (Node.js)
- Redis (ioredis) — хранение данных
- class-validator + class-transformer — валидация
- uuid — генерация ID
- Порт: `3000`

### Инфраструктура

- Docker + Docker Compose (только Redis для разработки)
- Redis 7 Alpine (порт `6379`)
- Makefile — команды разработки

### Спецификация API

- TypeSpec — описание API контракта
- OpenAPI 3.0 — генерация из TypeSpec

### Дизайн

- Figma: 16 экранов (Admin 3 десктоп + 3 мобильных, User 5 десктоп + 5 мобильных)
- Тёмная тема `#1a1a1a` с градиентами

## Структура проекта

```text
ai-for-developers-project-386/
├── .ai-doc/              # Документация для AI-агентов
│   ├── tasks/            # Планы задач
│   │   ├── task001/      # Инициализация фронтенда (выполнено)
│   │   ├── task002/      # Инфраструктура (Docker + Redis + NestJS)
│   │   ├── task003/      # Redis + Seed
│   │   ├── task004/      # Owner + EventType API
│   │   ├── task005/      # Slot API
│   │   ├── task006/      # Booking API
│   │   └── task007/      # Интеграция + CORS + Docker
│   ├── UC/               # Пользовательские сценарии
│   ├── figma.md          # Макеты Figma
│   ├── TESTS.md          # Тесткейсы
│   └── TEST-REPORT.md    # Отчёт о тестировании
├── frontend/             # React + Vite + Mantine
│   ├── src/
│   │   ├── api/          # API клиент (axios + mocks)
│   │   ├── pages/        # GuestPage, AdminPage
│   │   └── ...
│   └── package.json
├── backend/              # NestJS (в разработке)
│   ├── src/
│   │   ├── modules/      # Redis, Seed, Owner, EventType, Slot, Booking
│   │   ├── common/       # Interfaces, DTO, Filters
│   │   └── ...
│   └── package.json
├── typespec/             # API спецификация
│   ├── main.tsp
│   ├── owner.tsp
│   ├── guest.tsp
│   └── models.tsp
├── docker-compose.yml    # Redis для разработки
├── docker-compose.prod.yml # Redis + Backend для production
├── Makefile              # Команды разработки
└── package.json          # Корневой (workspaces)
```

## Redis структуры данных

| Сущность | Тип | Ключ | Поля |
| -------- | ----- | ------ | ------ |
| Owner | Hash | `owner:profile` | id, name, email |
| EventType | Hash | `event_type:{id}` | id, name, description, durationMinutes |
| EventType Index | Set | `event_types:ids` | список ID |
| Booking | Hash | `booking:{id}` | id, eventTypeId, eventTypeName, guestName, startTime, endTime, status |
| Booking Index | Set | `bookings:ids` | список ID |
| Booking Time | Sorted Set | `bookings:by_time` | score=unixTimestamp(startTime), member=booking:{id} |

## API Endpoints

### Public (Guest)

- `GET /event-types` — список типов
- `GET /event-types/:id` — тип по ID
- `GET /event-types/:id/slots` — слоты (query: from, to, date)
- `POST /bookings` — создать бронь (body: eventTypeId, guestName, startTime)

### Admin (Owner)

- `GET /admin/owner` — профиль владельца
- `GET /admin/event-types` — список типов
- `POST /admin/event-types` — создать тип (body: name, description, durationMinutes)
- `GET /admin/event-types/:id` — тип по ID
- `PUT /admin/event-types/:id` — обновить тип
- `DELETE /admin/event-types/:id` — удалить тип
- `GET /admin/bookings` — список броней (query: from, to, upcoming)

## Seed данные

### Owner

```text
id: owner-1
name: Renat Kunafin
email: renat@example.com
```

### EventType (3 штуки)

```text
1. id: quick-chat
   name: Быстрый звонок
   description: 15-минутный звонок...
   durationMinutes: 15

2. id: project-review
   name: Ревью проекта
   description: 30-минутная сессия...
   durationMinutes: 30

3. id: strategy-session
   name: Стратегическая сессия
   description: Часовое погружение...
   durationMinutes: 60
```

## Команды разработки

```bash
# Запуск Redis
make dev-redis
# или
docker-compose up redis

# Запуск бэкенда (в другом терминале)
make dev-backend
# или
cd backend && npm run start:dev

# Запуск фронтенда (в третьем терминале)
make dev-frontend
# или
cd frontend && npm run dev

# Одиночный запуск Redis
make redis-cli

# Production-like
make prod
# или
docker-compose -f docker-compose.prod.yml up --build
```

## Тестирование

- 25 тесткейсов (TESTS.md)
- Frontend: Playwright MCP (Chromium, headless)
- UI/UX: 100% проходимость (168 тестов)
- Интеграционные: требуют бэкенд (будут проверены после Task 007)

## Соглашения для AI-агентов

### Кодстайл

- TypeScript: строгая типизация
- NestJS: стандартная структура (modules, controllers, services)
- Redis: ioredis, обёртка в RedisService
- ID: human-readable для EventType (quick-chat), uuid для Booking
- DTO: class-validator для валидации
- Ошибки: стандартный NestJS HttpException (400, 404, 409, 500)

### Паттерны

- Модульная архитектура NestJS
- Global RedisModule
- SeedService — onModuleInit
- RedisService — абстракция над ioredis
- Pipeline/Multi для атомарных операций

### Git

- Не коммитить `.env` (только `.env.example`)
- Не коммитить `node_modules/`, `dist/`
- Каждый Task — отдельный PR (или отдельная сессия)
- Статус задач: `.ai-doc/tasks/task{N}/task{N}.md`

### Переменные окружения

```env
REDIS_URL=redis://localhost:6379
OWNER_NAME=Renat Kunafin
OWNER_EMAIL=renat@example.com
API_PORT=3000
VITE_API_URL=http://localhost:3000
```

## Текущий статус

- ✅ Фронтенд: реализован (React + Vite + Mantine, dark theme)
- ✅ TypeSpec: спецификация API готова
- ✅ Тесткейсы: 25 штук, UI/UX тесты пройдены
- ⏳ Бэкенд: в разработке (Task 002..007)
- ⏳ Интеграция: будет после Task 007

## Полезные ссылки

- TypeSpec: `typespec/main.tsp`, `typespec/owner.tsp`, `typespec/guest.tsp`, `typespec/models.tsp`
- UC: `.ai-doc/UC/UC_USER.md`, `.ai-doc/UC/UC_ADMIN.md`
- Figma: `.ai-doc/figma.md`
- Tests: `.ai-doc/TESTS.md`
