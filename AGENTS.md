# Repository Guidelines

## Project Structure & Module Organization
The project uses Next.js 16 with the App Router. Route handlers, UI components, and page-level logic live in `app/` (`page.tsx` is the landing view, `layout.tsx` wires shared chrome, and `globals.css` hosts Tailwind 4 layer styles). Static assets, fonts, and icons belong in `public/` alongside the shipped `favicon.ico`. Build configuration stays at the repo root: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, and `postcss.config.mjs`. Keep feature-specific modules grouped by route segment (e.g., `app/(marketing)/hero/`), and colocate helper hooks or data loaders with their consumers to simplify tree-shaking.

## Build, Test, and Development Commands
- `pnpm install`: syncs dependencies using the checked-in `pnpm-lock.yaml`.
- `pnpm dev`: runs `next dev` with hot reload at `http://localhost:3000`.
- `pnpm build`: creates an optimized production bundle via `next build`.
- `pnpm start`: serves the output of `pnpm build`.
- `pnpm lint`: lints all TS/TSX files with `eslint-config-next` defaults.

## Coding Style & Naming Conventions
Write TypeScript-first React 19 components using functional paradigms and hooks. Favor 2-space indentation, trailing commas, and double quotes unless JSX requires otherwise. Export components in PascalCase (`HeroSection`), hooks as camelCase (`useFeatureFlag`), and Next route segments with kebab-case directories (`new-feature/`). Tailwind classes should stay in lexical order (layout → spacing → typography) to reduce churn. Run `pnpm lint --fix` before committing; add inline `eslint-disable` comments only when you can justify them in the PR description.

## Testing Guidelines
Automated tests are not yet scaffolded, but new work should include them. Prefer component specs with React Testing Library plus Jest in a top-level `tests/` directory that mirrors `app/` (e.g., `tests/app/page.test.tsx`). Use descriptive test names (`renders latest issue banner`) and aim for meaningful coverage on data loaders and interactive components. If a feature lacks automated coverage, document the manual QA steps in the PR.

## Commit & Pull Request Guidelines
Recent history uses short imperative messages (see `git log --oneline`); keep commits focused ("add issue card grid" vs. "update stuff"). Reference issue IDs when possible. Every PR should describe the change, list testing performed (`pnpm lint`, `pnpm dev` smoke checks), and include screenshots or clips for UI updates. Tag reviewers early, request design/Product sign-off when UX shifts, and ensure deployments include any required `.env.local` additions in the description.
