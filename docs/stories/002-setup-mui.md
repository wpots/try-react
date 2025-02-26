# User Story 002: Setup Material UI (MUI)

## 1. Title

Integrate Material UI (MUI) into the React project and set up basic styling.

## 2. Goal

To incorporate Material UI (MUI) into the React application to utilize its pre-built components and styling capabilities, ensuring a consistent and modern UI.

## 3. Description

As a junior developer, I need to integrate Material UI (MUI) into the project so that I can use its components to build the user interface of the Food Diary application. This includes installing the necessary MUI packages and setting up basic theme configurations.

## 4. Technical Details

- **MUI Framework:** Material UI (MUI) will be used as the UI framework.
- **Dependencies:**
  - `@mui/material`: Core MUI components.
  - `@emotion/react`: Required for MUI's styling engine (Emotion).
  - `@emotion/styled`: Required for MUI's styling engine (Emotion).

## 5. Steps to Implement

1. **Open Terminal:** Open your terminal in the project directory (`/Users/wietekepots/Try-React/food-diary`).
2. **Install MUI Dependencies:** Run the following command to install the core MUI dependencies:
   ```bash
   npm install @mui/material @emotion/react @emotion/styled
   ```
3. **Import and Use a MUI Component:**
   - Open `src/App.tsx`.
   - Import a simple MUI component, like `Button`, at the beginning of the file:
     ```typescript
     import Button from "@mui/material/Button";
     ```
   - Replace the existing content in the `App` component's `return` statement with a simple MUI Button:
     ```jsx
     <>
       <Button variant="contained" color="primary">
         Hello MUI
       </Button>
     </>
     ```
4. **Verify MUI Setup:** Start the development server if it's not already running:
   ```bash
   npm run dev
   ```
   - Open the application in your browser. You should see a Material UI button with "Hello MUI" text, styled according to the default MUI theme.

## 6. Acceptance Criteria

- MUI core components (`@mui/material`, `@emotion/react`, `@emotion/styled`) are successfully installed.
- A Material UI `Button` component is imported and rendered in `App.tsx`.
- The MUI Button is visually styled according to the MUI default theme in the browser.

## 7. Notes

- This user story ensures that MUI is correctly set up and basic components can be used.
- Further customization of the MUI theme can be done in subsequent user stories if needed.
