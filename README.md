# QQQ Market Context Dashboard

A probability-weighted trading context dashboard for discretionary QQQ and Nasdaq futures (NQ) traders. Aggregates macro indicators, overnight market structure, and intraday signals to produce a daily market bias and structured trade qualification workflow.

## Tech Stack

- **Framework**: [SvelteKit](https://svelte.dev/docs/kit) + TypeScript
- **Database**: PostgreSQL via [Prisma](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [Docker](https://www.docker.com/) (for local PostgreSQL)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

### 3. Start the databases

Two PostgreSQL instances are provided via Docker Compose:

| Instance  | Port | Database               | Purpose                              |
| --------- | ---- | ---------------------- | ------------------------------------ |
| `db`      | 5432 | `market_analyzer`      | Prod-like -- never seeded            |
| `db-test` | 5433 | `market_analyzer_test` | Testing -- can be nuked and reseeded |

```bash
npm run docker:up
```

### 4. Run migrations

```bash
npm run db:migrate          # prod-like db on :5432
npm run db:test:migrate     # test db on :5433
```

### 5. Seed the test database (optional)

```bash
npm run db:test:seed
```

### 6. Start the dev server

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

To develop against the test database instead, set `DATABASE_URL` in your `.env` to the test connection string.

## Scripts

| Command                        | Description                                     |
| ------------------------------ | ----------------------------------------------- |
| `npm run dev`                  | Start development server                        |
| `npm run build`                | Build for production                            |
| `npm run preview`              | Preview production build                        |
| `npm run check`                | Type-check with svelte-check                    |
| `npm run lint`                 | Lint with ESLint                                |
| `npm run format`               | Format with Prettier                            |
| **Docker**                     |                                                 |
| `npm run docker:up`            | Start both Postgres containers                  |
| `npm run docker:down`          | Stop both containers                            |
| `npm run docker:nuke-test`     | Destroy and recreate the test DB (wipes volume) |
| **Database (prod-like :5432)** |                                                 |
| `npm run db:migrate`           | Run migrations                                  |
| `npm run db:seed`              | Seed with sample data                           |
| `npm run db:reset`             | Reset (drop + migrate + seed)                   |
| **Database (test :5433)**      |                                                 |
| `npm run db:test:migrate`      | Run migrations on test DB                       |
| `npm run db:test:seed`         | Seed test DB                                    |
| `npm run db:test:reset`        | Reset test DB                                   |

## Project Structure

```
src/
├── lib/
│   ├── components/      # Shared Svelte components
│   ├── server/
│   │   ├── db/          # Data-access layer (Prisma helpers)
│   │   └── services/    # Business logic services
│   └── index.ts
├── routes/              # SvelteKit file-based routes
├── app.css              # Tailwind CSS entry point
├── app.d.ts
└── app.html
prisma/
├── schema.prisma        # Prisma database schema
└── migrations/          # Database migrations
```
