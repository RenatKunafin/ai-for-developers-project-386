.PHONY: dev-redis dev-backend dev-frontend dev redis-cli prod

# Запуск Redis

dev-redis:
	@echo "Starting Redis..."
	docker-compose up -d redis

# Запуск бэкенда (NestJS)

dev-backend:
	cd backend && npm run start:dev

# Запуск фронтенда (Vite)

dev-frontend:
	cd frontend && npm run dev

# Запуск всех сервисов (Redis + бэкенд + фронтенд вручную в разных терминалах)

dev:
	@echo "Run the following commands in separate terminals:"
	@echo "  make dev-redis"
	@echo "  make dev-backend"
	@echo "  make dev-frontend"

# Redis CLI

redis-cli:
	@docker-compose exec redis redis-cli

# Production-like (Redis + Backend)

prod:
	docker-compose -f docker-compose.prod.yml up --build
