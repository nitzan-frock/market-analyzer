# Trading Context Dashboard

A probability-weighted trading context dashboard for discretionary traders. Aggregates macro indicators, overnight market structure, and intraday signals to produce a daily market bias and structured trade qualification workflow.

## Tech Stack

- **Framework**: [SvelteKit](https://svelte.dev/docs/kit) + TypeScript
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL) via [Prisma](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- A [Supabase](https://supabase.com/) project (free tier works)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create a new project
2. Navigate to **Project Settings > Database** to find your connection strings
3. Copy the **Connection string (URI)** values for both the pooled (port 6543) and direct (port 5432) connections

### 3. Configure environment

```bash
cp .env.example .env
```

Fill in your `.env` with the Supabase connection strings:

- `DATABASE_URL` -- pooled connection (port 6543, with `?pgbouncer=true`) for the app
- `DIRECT_URL` -- direct connection (port 5432) for Prisma migrations

### 4. Run migrations

```bash
npm run db:migrate
```

### 5. Seed the database (optional)

```bash
npm run db:seed
```

### 6. Start the dev server

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

## Scripts

| Command              | Description                   |
| -------------------- | ----------------------------- |
| `npm run dev`        | Start development server      |
| `npm run build`      | Build for production          |
| `npm run preview`    | Preview production build      |
| `npm run check`      | Type-check with svelte-check  |
| `npm run lint`       | Lint with ESLint              |
| `npm run format`     | Format with Prettier          |
| **Database**         |                               |
| `npm run db:migrate` | Run Prisma migrations         |
| `npm run db:seed`    | Seed with sample data         |
| `npm run db:reset`   | Reset (drop + migrate + seed) |

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
