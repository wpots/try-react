# User Story 002: Setup Shared UI Package

## 1. Title

Create shared UI component library using React Aria primitives and Tailwind CSS 4.

## 2. Goal

To create a reusable UI component library (`@repo/ui`) built with React Aria for accessibility and Tailwind CSS 4 for styling. This package will be used across all applications in the monorepo.

## 3. Description

As a developer, I need to create a shared UI package that provides accessible, styled components built with React Aria primitives. The package will follow the project's component structure rules, use Tailwind CSS 4 with design tokens, and export components that can be imported by applications in the monorepo.

## 4. Technical Details

- **Package Name:** `@repo/ui`
- **Location:** `packages/ui/`
- **Dependencies:** 
  - `react` and `react-dom` (peer dependencies)
  - `@react-aria/*` packages for component primitives
  - `tailwindcss` v4
  - `classnames` utility
- **Component Structure:** Each component follows the pattern:
  ```
  ComponentName/
  ├── ComponentName.tsx
  ├── ComponentName.test.tsx
  ├── ComponentName.stories.tsx
  └── index.ts
  ```
- **Initial Components:** Button, TextField (more components added in later stories)

## 5. Steps to Implement

1. **Create Package Directory:**
   - Create `packages/ui/` directory
   - Create `packages/ui/src/` and `packages/ui/src/components/` directories

2. **Create `packages/ui/package.json`:**
   - Set package name to `@repo/ui`
   - Add peer dependencies: `react`, `react-dom`
   - Add dependencies: `@react-aria/button`, `@react-aria/textfield`, `@react-aria/label`, `tailwindcss`, `classnames`
   - Add dev dependencies: `@types/react`, `@types/react-dom`, `typescript`
   - Configure exports: `"./src/components/*"` and `"./src/index.ts"`

3. **Create `packages/ui/tsconfig.json`:**
   - Extend root tsconfig or create base config
   - Set `"composite": true` for project references
   - Configure paths for imports

4. **Setup Tailwind CSS 4:**
   - Create `packages/ui/src/globals.css` with `@theme` directive
   - Define design tokens (colors, spacing, typography) as CSS variables
   - Import Tailwind directives: `@tailwind base`, `@tailwind components`, `@tailwind utilities`

5. **Create First Component: Button**
   - Create `packages/ui/src/components/Button/` directory
   - Create `Button.tsx` using `useButton` hook from `@react-aria/button`
   - Style with Tailwind classes using design tokens
   - Create `index.ts` with types extending `React.ComponentProps<"button">`
   - Export Button component and types

6. **Create Second Component: TextField**
   - Create `packages/ui/src/components/TextField/` directory
   - Create `TextField.tsx` using `useTextField` and `useLabel` hooks from React Aria
   - Include label, input, and error message support
   - Style with Tailwind classes
   - Create `index.ts` with types extending `React.ComponentProps<"input">`
   - Export TextField component and types

7. **Create Package Entry Point:**
   - Create `packages/ui/src/index.ts`
   - Export all components: `export { Button } from "./components/Button"`
   - Export all types: `export type { ButtonProps } from "./components/Button"`

8. **Add Component Tests (Placeholder):**
   - Create `Button.test.tsx` and `TextField.test.tsx` with basic structure
   - Tests will be implemented in detail later

9. **Update Root Dependencies:**
   - Ensure React types are available at root level
   - Run `pnpm install` from root to install new package dependencies

10. **Test Package Import:**
    - In `apps/food-diary`, import Button from `@repo/ui`
    - Verify import works correctly
    - Test that components render (can be done in next story)

## 6. Acceptance Criteria

- [x] `packages/ui/` directory structure created
- [x] `packages/ui/package.json` configured with correct name and dependencies
- [x] `packages/ui/tsconfig.json` configured for TypeScript compilation
- [x] Tailwind CSS 4 configured with `@theme` design tokens in `globals.css`
- [x] `Button` component created using React Aria `useButton` hook
- [x] `TextField` component created using React Aria `useTextField` and `useLabel` hooks
- [x] Both components follow project structure rules (types in `index.ts`, extend `React.ComponentProps`)
- [x] Components styled with Tailwind using design tokens (no hardcoded colors/spacing)
- [x] `packages/ui/src/index.ts` exports all components and types
- [x] Package can be imported in `apps/food-diary` as `@repo/ui`
- [x] `pnpm install` runs successfully

## 7. Notes

- This story creates the foundation for the shared UI library
- More components (Select, TagGroup, Switch, DatePicker) will be added in story 008
- Design tokens should be defined early - they'll be used across all components
- Components should be Server Components by default (no `"use client"` unless needed for interactivity)
- React Aria provides accessibility out of the box - ensure we're leveraging that
