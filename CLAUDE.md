# Transrust Development Guidelines

## Build & Validation Commands
- Build: `npm run build` (TypeScript + Vite build)
- Dev mode: `npm run dev` (Vite dev server)
- Tauri: `npm run tauri dev` (run desktop app)
- Typecheck: `npm run typecheck` (TS without emitting)
- Lint: `npm run lint` (ESLint), `npm run lint:fix` (auto-fix)
- Format: `npm run format` (Prettier), `npm run style:fix` (CSS)
- Rust lint: `npm run lint:rust` (Clippy)
- Rust format: `npm run format:rust` (rustfmt)

## Test Commands
- Run all tests: `npm run test` (frontend), `npm run test:rust` (Rust)
- Run single test: `npx vitest run src/components/translation/__tests__/TranslationForm.test.tsx`
- Watch mode: `npm run test:watch` (live reloading)

## Code Style
- TypeScript: Semi-colons, single quotes, 100 char line limit
- CSS: Standard stylelint rules, BEM-like naming
- Rust: 100 char width, 4 spaces, 2021 edition
- Import order: React, libraries, local modules
- Error handling: Use Result/Option in Rust, catch-and-report in TS
- Redux Toolkit for state management
- Clean Architecture pattern in Rust code