# User Story 001: Setup Turborepo + pnpm Monorepo

## 1. Title

Initialize Turborepo monorepo with pnpm workspaces and relocate existing food-diary application.

## 2. Goal

To restructure the project as a monorepo using Turborepo and pnpm workspaces, enabling shared packages and scalable architecture for future applications.

## 3. Description

As a developer, I need to convert the existing single-application project into a monorepo structure. This will allow us to create a shared UI component library and prepare for future applications. The existing food-diary application will be moved into the `apps/` directory, and we'll set up Turborepo for build orchestration and caching.

## 4. Technical Details

- **Monorepo Tool:** Turborepo for task orchestration and caching
- **Package Manager:** pnpm with workspaces
- **Structure:** 
  - `apps/food-diary/` - Existing Next.js application (relocated)
  - `packages/ui/` - Shared UI component library (to be created in next story)
- **Root Configuration:** `turbo.json`, `pnpm-workspace.yaml`, root `package.json`

## 5. Steps to Implement

1. **Install pnpm (if not already installed):**
   ```bash
   npm install -g pnpm
   ```

2. **Create Root `package.json`:**
   - Create `package.json` at project root
   - Set `"type": "module"` for ESM support
   - Add workspace configuration
   - Add Turborepo as dev dependency
   - Add scripts: `dev`, `build`, `lint`, `test`

3. **Create `pnpm-workspace.yaml`:**
   - Define workspace packages: `apps/*` and `packages/*`

4. **Create `turbo.json`:**
   - Configure Turborepo pipelines for `dev`, `build`, `lint`, `test`
   - Set up caching configuration
   - Configure dependencies between packages

5. **Relocate Existing Application:**
   - Move `food-diary/` directory to `apps/food-diary/`
   - Update any absolute imports if needed
   - Ensure `apps/food-diary/package.json` has correct name (`@repo/food-diary`)

6. **Update Root Scripts:**
   - `dev`: Run Turborepo dev command
   - `build`: Run Turborepo build command
   - `lint`: Run linting across all packages
   - `test`: Run tests across all packages

7. **Install Dependencies:**
   ```bash
   pnpm install
   ```

8. **Verify Setup:**
   - Run `pnpm dev` from root - should start food-diary app
   - Verify Turborepo is working with `pnpm build`
   - Check that workspace resolution works correctly

## 6. Acceptance Criteria

- [x] Root `package.json` exists with Turborepo dependency
- [x] `pnpm-workspace.yaml` defines `apps/*` and `packages/*` workspaces
- [x] `turbo.json` configured with pipelines for dev, build, lint, test
- [x] Existing `food-diary` application moved to `apps/food-diary/`
- [x] `apps/food-diary/package.json` updated with correct package name
- [x] `pnpm install` runs successfully from root
- [x] `pnpm dev` starts the food-diary application
- [x] Turborepo caching is working (check `.turbo` directory)

## 7. Notes

- This story sets up the foundation for the monorepo structure
- The shared UI package will be created in the next story
- Ensure all existing functionality still works after relocation
- Consider adding `.gitignore` entries for `.turbo` and `node_modules` if not already present
