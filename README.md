# Food Diary Monorepo

This repository contains the Food Diary web application and shared UI packages.
It uses a Turborepo + pnpm workspace setup.

## What is in this repo

- `apps/food-diary`: Next.js app (React 19 + TypeScript + next-intl)
- `apps/storybook`: Storybook app for UI development
- `packages/ui`: Shared UI component package (`@repo/ui`)
- `docs/`: Supporting project documentation

## Tech Stack

- React 19
- Next.js 16 (App Router)
- TypeScript (strict)
- Tailwind CSS 4
- Turborepo
- pnpm workspaces
- Firebase (Auth + Firestore)

## Prerequisites

- Node.js
- pnpm 10 (`packageManager` is pinned to `pnpm@10.0.0`)

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment variables for the app:

```bash
cp apps/food-diary/.env.local.example apps/food-diary/.env.local
```

3. Fill in Firebase values in `apps/food-diary/.env.local`.

4. Start all workspace dev processes:

```bash
pnpm dev
```

The Food Diary app runs on `http://localhost:3000`.
Storybook runs on `http://localhost:6006` when started.

## Useful Commands

From the repo root:

```bash
pnpm dev                 # turbo dev across workspaces
pnpm build               # turbo build
pnpm lint                # turbo lint
pnpm test                # turbo test
pnpm dev:storybook       # run Storybook dev only
pnpm build:storybook     # build Storybook only
```

Run only the Food Diary app:

```bash
pnpm --filter @repo/food-diary dev
```

## Workspace Structure

```text
try-react/
├── apps/
│   ├── food-diary/
│   └── storybook/
├── packages/
│   └── ui/
├── docs/
├── turbo.json
└── pnpm-workspace.yaml
```

## Notes

- The main product requirements are documented in `projectbrief.md`.
- Architectural notes are in `architecture.md`.
- Story status and roadmap alignment are in `docs/stories/README.md`.
