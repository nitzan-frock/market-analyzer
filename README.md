# QQQ Market Context Dashboard

A probability-weighted trading context dashboard for discretionary QQQ and Nasdaq futures (NQ) traders. Aggregates macro indicators, overnight market structure, and intraday signals to produce a daily market bias and structured trade qualification workflow.

## Tech Stack

- **Framework**: [SvelteKit](https://svelte.dev/docs/kit) + TypeScript
- **Database**: PostgreSQL via [Prisma](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [PostgreSQL](https://www.postgresql.org/) >= 15

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example environment file and adjust the database connection string if needed:

```bash
cp .env.example .env
```

The default `DATABASE_URL` points to a local PostgreSQL instance:

```
postgresql://postgres:postgres@localhost:5432/market_analyzer?schema=public
```

### 3. Set up the database

Create the database and run migrations:

```bash
createdb market_analyzer
npx prisma migrate dev
```

### 4. Start the dev server

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

## Scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start development server     |
| `npm run build`   | Build for production         |
| `npm run preview` | Preview production build     |
| `npm run check`   | Type-check with svelte-check |
| `npm run lint`    | Lint with ESLint             |
| `npm run format`  | Format with Prettier         |

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
