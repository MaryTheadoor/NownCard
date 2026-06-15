# NownCard Agent Guidelines

This document provides essential, non-obvious guidance for OpenCode agents working on the NownCard project.

## Project Overview
- **Type:** React (Vite) web application with TypeScript and Tailwind CSS.
- **Backend Interaction:** Utilizes Firebase.
- **Offline First:** Configured as a Progressive Web App (PWA) with Workbox for offline capabilities.

## Developer Commands

| Command            | Description                                   |
| :----------------- | :-------------------------------------------- |
| `npm run dev`      | Starts the development server (Vite, port 3000). |
| `npm run build`    | Builds the application for production.        |
| `npm run preview`  | Serves the production build locally.          |
| `npm run lint`     | Runs ESLint for code linting.                 |
| `npm run type-check`| Performs TypeScript type checking.            |
| `npm run test`     | Runs all unit tests (Vitest).                 |
| `npm run test:watch`| Runs unit tests in watch mode.                |
| `npm run test:unit`| Runs unit tests specifically in the `src` directory. |
| `npm run test:e2e` | Executes Playwright end-to-end tests.         |
| `npm run test:a11y`| Executes Playwright accessibility tests (`a11y` project). |

## Starting the Dev Server

**IMPORTANT:** The bash tool has a default 2-minute timeout and will kill persistent processes like `npm run dev`. To start the server without it being killed, use PowerShell's `Start-Process`:

```powershell
Start-Process -NoNewWindow powershell -ArgumentList "-Command cd 'C:\Users\AmosA\NownCard'; npx vite --port 3000"
```

Then verify it's running with `netstat -ano | Select-String "3000"`.

## Architecture & Conventions

- **Entry Point:** `src/main.tsx` initializes the React application.
- **Path Aliases:** Use `@/` to resolve paths relative to the `src/` directory (e.g., `@/components/Button`).
- **Module Structure:** Follows a feature-sliced design, organized into:
    - `src/app/`: Core application setup, routing, and providers.
    - `src/features/`: Contains distinct, self-contained features.
    - `src/pages/`: Page-level components that compose features and shared UI.
    - `src/shared/`: Reusable components, utilities, hooks, types, and API clients.
    - `src/widgets/`: Larger UI compositions that are reusable across pages (e.g., layouts, modals).
- **PWA Caching:**
    - Offline fallback page: `public/offline.html`.
    - Firebase Storage images (`^https://firebasestorage\\.googleapis\\.com/.*`) are cached with `StaleWhileRevalidate`.
    - Card-related API routes (`/\/card\/.*/`) are cached with `NetworkFirst`.

## Design System (ported from v2)

### Color Palette
| Token | Light | Dark | Usage |
|---|---|---|---|
| `--space` | `#f8f9fa` | `#0A0D14` | Page background |
| `--tile` | `#ffffff` | `#131824` | Cards, panels |
| `--tile-raised` | `#e8ecf1` | `#1E2536` | Button backgrounds |
| `--ink` | `#0f172a` | `#F9FAFB` | Primary text |
| `--ink-muted` | `#64748b` | `#9CA3AF` | Secondary text |
| `--ink-faint` | `#94a3b8` | `#525b70` | Tertiary/hint text |
| `--accent-blue` | `#3A86FF` | `#3A86FF` | Interactive accent |
| `--brand-yellow` | `#FFBE0B` | `#FFBE0B` | CTA / brand color |
| `--danger` | `#FF006E` | `#FF006E` | Errors, destructive actions |
| `--line` | `#e2e8f0` | `#374151` | Borders |

### Button System
8 tactile 3D button variants with `border-bottom-width: 4px`, press animation (`translateY(3px)`), and inner highlight shadows:
- `default` — raised tile (gray)
- `accent` — yellow CTA (`#FFBE0B`)
- `blue` — primary action (`#3A86FF`)
- `purple` — secondary action (`#a855f7`)
- `destructive` — danger (`#FF006E`)
- `outline` / `secondary` — glass button styling
- `ghost` — pill-shaped subtle
- `link` — simple underline

### Server Startup Fix
When starting `npm run dev` via bash tool, the persistent Vite process gets killed by the 2-minute timeout. Use `Start-Process -NoNewWindow` to launch the server as a background process that survives the bash timeout.

## Important Toolchain Notes

- **Vite:** Used as the build tool and development server.
- **TypeScript:** Strict mode is enabled. Ensure type safety.
- **Tailwind CSS:** Primary styling framework.
- **Vitest:** Unit testing framework. Tests typically reside near the code they test or in `src/test/`.
- **Playwright:** Used for comprehensive E2E and accessibility testing.

## Testing Guidance

- Unit tests (`vitest`) are located within the `src` directory, often alongside the components or modules they test.
- E2E and A11y tests (`playwright`) are separate and should be run with their respective `npm run test:*` commands.
