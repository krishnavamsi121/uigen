# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run setup        # First-time setup: install deps, generate Prisma client, run migrations
npm run dev          # Start dev server with Turbopack
npm run dev:daemon   # Start dev server in background, logs to logs.txt
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Run Vitest unit tests
npm run db:reset     # Reset database (destructive)
```

To run a single test file:
```bash
npx vitest run src/path/to/test.test.ts
```

The `NODE_OPTIONS='--require ./node-compat.cjs'` prefix is built into all scripts — do not omit it when running Next.js commands manually.

## Architecture

UIGen is an AI-powered React component generator with live preview. Users describe components in natural language; Claude generates them via tool calls; the result is previewed in an iframe.

### Request Flow

1. User sends message → `POST /api/chat` (`src/app/api/chat/route.ts`)
2. Route streams Claude responses using Vercel AI SDK with two tools: `str_replace_editor` and `file_manager` (defined in `src/lib/tools/`)
3. Tool calls write to an in-memory `VirtualFileSystem` (`src/lib/file-system.ts`) — no disk writes
4. The `FileSystemContext` (`src/lib/contexts/`) broadcasts file changes
5. `PreviewFrame` (`src/components/preview/`) picks up changes and re-renders in an iframe using Babel standalone for JSX transformation (`src/lib/transform/`)

### Three-Panel UI Layout

- **Left (35%)**: `ChatInterface` with message history and input
- **Right (65%)**: Tabbed view toggling between:
  - **Preview**: `PreviewFrame` — iframe rendering the generated component
  - **Code**: `FileTree` + Monaco `CodeEditor`

Entry points: `src/app/page.tsx` → `src/app/main-content.tsx` → individual panel components.

### AI Integration

- Model selection in `src/lib/provider.ts` — uses Claude if `ANTHROPIC_API_KEY` is set, otherwise falls back to `MockLanguageModel`
- System prompt in `src/lib/prompts/` with ephemeral cache control for prompt caching
- API route sets `maxDuration: 120` for long streaming responses

### Authentication & Persistence

- Optional: works anonymously (in-memory only) or with accounts (projects saved to SQLite via Prisma)
- JWT sessions via `jose` (`src/lib/auth.ts`); passwords hashed with `bcrypt`
- Server Actions in `src/actions/` handle project CRUD
- Prisma schema: `User` → `Project` (1:many, cascade delete); projects store `messages` and `data` as JSON columns
- DB file: `prisma/dev.db` (SQLite)

### Key Conventions

- Path alias `@/*` maps to `src/*`
- `server-only` package is imported in server-side utilities to prevent client bundle leakage
- shadcn/ui components live in `src/components/ui/`; style is `new-york` with neutral base color
- Tailwind CSS v4 (PostCSS plugin approach, not v3 config file)
