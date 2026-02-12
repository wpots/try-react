# UI Design System

## Overview

This document describes the UI design system for the TryReact application, including design tokens, component variants, and usage guidelines.

## Design Tokens

The design system uses CSS variables defined in `packages/ui/src/styles/tokens/` and `packages/ui/src/styles/globals.css`. Key token categories include:

- **Colors**: Primary, secondary, success, danger, and neutral colors using the `--color-ds-*` API
- **Spacing**: Scale tokens like `--spacing-ds-xxs` through `--spacing-ds-5xl`
- **Radius**: Radius tokens like `--radius-ds-sm` through `--radius-ds-2xl`
- **Typography**: Font sizes, line heights, and letter spacing
- **Shadows**: Elevation shadows like `--shadow-ds-md` through `--shadow-ds-xl`

## Component Variants

Components use a variant system that maps semantic meanings to visual styles using the design tokens.

### Button Variants

Buttons support multiple variants using the design tokens:

- **Primary**: Uses `--color-ds-primary` and `--color-ds-on-primary`
- **Secondary**: Uses `--color-ds-surface-muted` and `--color-ds-on-surface-muted`
- **Danger**: Uses `--color-ds-danger` and `--color-ds-on-danger`
- **Outline**: Uses `--color-ds-border` and `--color-ds-on-surface-muted`
- **Ghost**: Uses `--color-ds-text` with background variants

Example usage:

```tsx
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="danger">Delete</Button>
```

## Component Implementation Guidelines

1. All components should use the design token API for styling
2. Components should support semantic variants (primary, secondary, danger, etc.)
3. Components should be properly typed with TypeScript
4. Components should be exported from index files for easy import
5. Storybook stories should showcase all variants

## Implementation Status

- [ ] Create comprehensive design system documentation
- [ ] Implement variant system for all components
- [ ] Update Storybook to showcase variants
- [ ] Ensure proper typing and exports
