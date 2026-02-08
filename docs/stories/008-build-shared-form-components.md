# User Story 008: Build Shared Form Components

## 1. Title

Create shared form components (Select, TagGroup, Switch, DatePicker) in the UI package using React Aria.

## 2. Goal

To build reusable form components in the `@repo/ui` package that will be used in the diary entry form. These components should be accessible, styled with Tailwind, and follow the project's component structure rules.

## 3. Description

As a developer, I need to create form components in the shared UI package that will be used throughout the application. These components should use React Aria primitives for accessibility and be styled consistently with Tailwind CSS 4 design tokens. Components include Select (dropdown), TagGroup (multi-select chips), Switch (toggle), and DatePicker.

## 4. Technical Details

- **Package:** `@repo/ui`
- **Location:** `packages/ui/src/components/`
- **React Aria Packages:**
  - `@react-aria/select` for Select component
  - `@react-aria/checkbox` for Switch
  - `@react-aria/datepicker` for DatePicker
  - `@react-aria/tag` and `@react-aria/selection` for TagGroup
- **Component Structure:** Each component follows the pattern with `ComponentName.tsx`, `index.ts`, tests, and stories

## 5. Steps to Implement

1. **Install React Aria Dependencies:**
   - In `packages/ui/`, install:
     ```bash
     pnpm add @react-aria/select @react-aria/checkbox @react-aria/datepicker @react-aria/tag @react-aria/selection @react-stately/select @react-stately/checkbox @react-stately/datepicker @react-stately/collections
     ```

2. **Create Select Component:**
   - Create `packages/ui/src/components/Select/Select.tsx`
   - Use `useSelect` hook from `@react-aria/select`
   - Use `useSelectState` from `@react-stately/select`
   - Implement dropdown with button trigger and popover menu
   - Style with Tailwind using design tokens
   - Support label, placeholder, error states
   - Create `Select/index.ts` with types extending `React.ComponentProps<"select">`

3. **Create TagGroup Component (Multi-select Chips):**
   - Create `packages/ui/src/components/TagGroup/TagGroup.tsx`
   - Use `useTagGroup` and `useTag` hooks from `@react-aria/tag`
   - Use `useListState` from `@react-stately/collections` for selection state
   - Implement chips that can be selected/deselected
   - Style selected/unselected states with Tailwind
   - Support keyboard navigation
   - Create `TagGroup/index.ts` with types

4. **Create Switch Component:**
   - Create `packages/ui/src/components/Switch/Switch.tsx`
   - Use `useSwitch` hook from `@react-aria/checkbox`
   - Use `useToggleState` from `@react-stately/checkbox`
   - Implement toggle switch UI with Tailwind styling
   - Support label, checked/unchecked states
   - Create `Switch/index.ts` with types extending `React.ComponentProps<"input">`

5. **Create DatePicker Component:**
   - Create `packages/ui/src/components/DatePicker/DatePicker.tsx`
   - Use `useDatePicker` hook from `@react-aria/datepicker`
   - Use `useDatePickerState` from `@react-stately/datepicker`
   - Implement date input with calendar popover
   - Style with Tailwind
   - Support label, error states, date formatting
   - Create `DatePicker/index.ts` with types

6. **Update Package Exports:**
   - Update `packages/ui/src/index.ts` to export all new components:
     ```typescript
     export { Select } from "./components/Select";
     export type { SelectProps } from "./components/Select";
     // ... repeat for TagGroup, Switch, DatePicker
     ```

7. **Add Component Tests (Placeholder):**
   - Create test files for each component:
     - `Select.test.tsx`
     - `TagGroup.test.tsx`
     - `Switch.test.tsx`
     - `DatePicker.test.tsx`
   - Add basic structure (detailed tests in later stories)

8. **Add Storybook Stories (Optional):**
   - Create story files for each component if Storybook is set up
   - Document component props and usage examples

9. **Test Components in Food Diary App:**
   - In `apps/food-diary`, import components from `@repo/ui`
   - Create a test page or update entry form to use new components
   - Verify components render correctly
   - Test accessibility (keyboard navigation, screen reader)

10. **Update Design Tokens (if needed):**
    - Ensure design tokens in `packages/ui/src/globals.css` support all component states
    - Add colors for selected/unselected states, focus states, etc.

## 6. Acceptance Criteria

- All React Aria dependencies installed in `packages/ui`
- `Select` component created with React Aria `useSelect` hook
- `TagGroup` component created with React Aria `useTagGroup` hook
- `Switch` component created with React Aria `useSwitch` hook
- `DatePicker` component created with React Aria `useDatePicker` hook
- All components styled with Tailwind using design tokens
- All components follow project structure (types in `index.ts`, extend `React.ComponentProps`)
- All components support labels and error states
- All components are accessible (keyboard navigation, ARIA attributes)
- Components exported from `packages/ui/src/index.ts`
- Components can be imported and used in `apps/food-diary`
- Basic test files created for each component

## 7. Notes

- React Aria provides accessibility out of the box - ensure we're using it correctly
- Components should be Server Components by default (add `"use client"` only if needed for interactivity)
- TagGroup will be used for emotions and behaviors (multi-select chips)
- Select will be used for location, company, and entry type
- Switch will be used for skipped meal toggle
- DatePicker will be used for date selection
- Consider adding loading and disabled states to components
- Design tokens should support all component variants and states
