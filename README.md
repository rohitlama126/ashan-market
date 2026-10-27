# Ashan Market

A one-stop shop for Nepali groceries and goods for Nepali people living in the USA: an iOS app (Expo) and a web app (Next.js) that share one TypeScript codebase.

- Research: [docs/research.md](docs/research.md)
- Architecture, data model, API: [docs/architecture.md](docs/architecture.md)

## Repository layout

```
apps/web        Next.js 16 (App Router, Tailwind v4): storefront, later /admin
apps/mobile     Expo SDK 58 + Expo Router (iOS)
packages/tokens Design tokens → CSS variables / Tailwind theme / RN theme (WCAG AA tested)
packages/i18n   English + Nepali catalogs, i18next setup, money/weight formatting
packages/schemas zod schemas shared by client and server
packages/core   Pure domain rules (free-shipping progress, fulfillment eligibility)
packages/config Shared tsconfig and ESLint
supabase/       Supabase CLI project (migrations, seed, tests)
```

## Prerequisites

- **Node 24.22.1+** and **pnpm 12** (`corepack enable pnpm`). On this machine Node lives in `~/.local/node`; add it to your shell:
  ```bash
  echo 'export PATH="$HOME/.local/node/bin:$PATH"' >> ~/.zprofile
  ```
- **Docker-compatible runtime** (OrbStack or Docker Desktop) for the local Supabase stack.
- **Xcode** (for the iOS simulator).

## Setup

```bash
pnpm install
cp .env.example apps/web/.env.local
cp .env.example apps/mobile/.env.local
pnpm db:start        # starts local Supabase in Docker; copy the printed anon key into both .env.local files
```

## Everyday commands

| Command                                  | What it does                                                           |
| ---------------------------------------- | ---------------------------------------------------------------------- |
| `pnpm dev:web`                           | Web app at http://localhost:3000 (redirects to `/en` or `/ne`)         |
| `pnpm dev:mobile`                        | Expo dev server; press `i` for the iOS simulator                       |
| `pnpm check`                             | Lint, typecheck, test and build everything (run before each commit)    |
| `pnpm test`                              | All unit tests (Vitest in packages and web, Jest in mobile)            |
| `pnpm tokens`                            | Regenerate `packages/tokens/generated/tokens.css` after editing tokens |
| `pnpm db:start` / `db:stop` / `db:reset` | Local Supabase lifecycle                                               |

## Privacy of this repository

The repo has no git remote. Telemetry is off for Turborepo, Next.js and the Supabase CLI on this machine, and `.env.example` sets `NEXT_TELEMETRY_DISABLED` and `EXPO_NO_TELEMETRY`. Secrets go only in `.env.local` files, which git ignores.

## Accounts

See "Accounts you'll need" in [docs/architecture.md](docs/architecture.md#10-accounts-youll-need-and-when). No keys are committed or invented. Paste your own into `.env.local`.
