.PHONY: install-backend install-frontend install dev-backend dev-frontend dev

install-backend:
	cd backend && bun install

install-frontend:
	cd frontend && bun install

install: install-backend install-frontend

dev-backend:
	cd backend && bun run dev

dev-frontend:
	cd frontend && bun run dev

dev:
	$(MAKE) dev-backend &amp; $(MAKE) dev-frontend

