# User Story 001: Setup React 19 Project

## 1. Title

Setup a new React 19 project with Vite and install necessary dependencies.

## 2. Goal

To initialize a React 19 project with a modern build tool (Vite) and install essential dependencies for frontend development, including React and React DOM.

## 3. Description

As a junior developer, I need to set up a new React 19 project environment so that I can start building the Food Diary application. This involves using Vite to scaffold the project and installing React and React DOM as core dependencies.

## 4. Technical Details

- **Tooling:** Vite will be used as the build tool for fast development and project scaffolding.
- **React 19:** Ensure React 19 is used, taking advantage of new features like Server Actions.
- **Dependencies:**
  - `react`: Core React library.
  - `react-dom`: Library to work with the DOM in React.

## 5. Steps to Implement

1. **Open Terminal:** Open your terminal in the project directory (`/Users/wietekepots/Try-React`).
2. **Scaffold Vite React Project:** Run the following command to create a new React project using Vite:
   ```bash
   npm create vite@latest food-diary -- --template react-ts
   ```
   - Follow the prompts from Vite to set up the project. Choose TypeScript for the project template.
   - Navigate into the newly created project directory:
     ```bash
     cd food-diary
     ```
3. **Install Dependencies:** Install the core React dependencies and any other initial dependencies. For now, just ensure `react` and `react-dom` are installed. Vite should handle these automatically, but it's good to verify. You can check `package.json` after project creation. If needed, run:
   ```bash
   npm install
   ```
4. **Verify Setup:** Start the development server to ensure the basic React app runs correctly:
   ```bash
   npm run dev
   ```
   - Open the provided development URL in your browser (usually `http://localhost:5173`). You should see the default Vite + React welcome page.

## 6. Acceptance Criteria

- A new React 19 project is successfully created using Vite with TypeScript template.
- `react` and `react-dom` are listed in `package.json` dependencies.
- The development server starts without errors, and the default React welcome page is visible in the browser.

## 7. Notes

- This setup is the foundation for the entire project. Ensure it is correctly configured before proceeding with further user stories.
- Using TypeScript will provide static typing benefits for the project.
