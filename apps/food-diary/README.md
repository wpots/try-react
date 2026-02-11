# Food Diary App (`@repo/food-diary`)

Next.js App Router application for the Food Diary product in this monorepo.

## Prerequisites

- Node.js
- pnpm 10

## Setup

1. Install dependencies from the monorepo root:

```bash
pnpm install
```

2. Copy environment template:

```bash
cp apps/food-diary/.env.local.example apps/food-diary/.env.local
```

3. Fill in Firebase values in `apps/food-diary/.env.local`.

4. Start the app:

```bash
pnpm --filter @repo/food-diary dev
```

Open `http://localhost:3000`.

## Commands

From monorepo root:

```bash
pnpm --filter @repo/food-diary dev
pnpm --filter @repo/food-diary build
pnpm --filter @repo/food-diary lint
pnpm --filter @repo/food-diary test
```

Or run all workspaces:

```bash
pnpm dev
pnpm build
pnpm lint
pnpm test
```

## Related Docs

- `projectbrief.md`
- `architecture.md`
- `apps/food-diary/.env.local.example`
