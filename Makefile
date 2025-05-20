.PHONY: install-backend install-frontend install dev-backend dev-frontend dev

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
	$(MAKE) dev-backend && $(MAKE) dev-frontend
