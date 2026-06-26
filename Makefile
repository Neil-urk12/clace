.PHONY: install-backend install-frontend install dev-backend dev-frontend dev db-generate db-migrate db-push db-studio

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
