.PHONY: install-backend install-frontend install dev-backend dev-frontend dev db-generate db-migrate db-push db-studio docker-build docker-run workers-deploy workers-dev

install-backend:
	cd backend && bun install

install-frontend:
	cd frontend && bun install

install: install-backend install-frontend

dev-backend:
	cd backend && bun dev --watch

dev-frontend:
	cd frontend && bun dev -- --host

dev:
	$(MAKE) dev-backend & $(MAKE) dev-frontend

db-generate:
	cd backend && bun run db:generate

db-migrate:
	cd backend && bun run db:migrate

db-push:
	cd backend && bun run db:push

db-studio:
	cd backend && bun run db:studio

# Docker
docker-build:
	docker build -t clace-backend -f backend/Dockerfile backend/

docker-run:
	docker run -p 3000:3000 --env-file backend/.env clace-backend

# Cloudflare Workers
workers-deploy:
	cd backend && bunx wrangler deploy

workers-dev:
	cd backend && bunx wrangler dev
