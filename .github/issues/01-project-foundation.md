# Ticket 1: Project Foundation and Infrastructure Setup

## Summary

Initialize the SvelteKit project with TypeScript, Prisma, PostgreSQL, and core tooling.

## Goal

Establish a runnable project skeleton with all dependencies wired up so subsequent tickets can build features immediately.

## Technical Requirements

- SvelteKit project initialized with TypeScript
- Prisma installed and configured with PostgreSQL provider
- Tailwind CSS integrated for styling
- Environment variable configuration (`.env` for DB connection string)
- Basic project directory structure (`lib/`, `routes/`, `components/`, `server/`)
- ESLint + Prettier configured
- README with setup instructions

## Acceptance Criteria

- [ ] `npm run dev` starts the app successfully
- [ ] Prisma can connect to a local PostgreSQL instance
- [ ] A bare landing page renders at `/`

## Dependencies

None (first ticket).

## Labels

`setup`, `infrastructure`
