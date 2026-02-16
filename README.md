# Bingo Master 75

A professional Bingo 75 (1–75) caller and scoreboard app built with React and Vite.

## Live Demo

**Live demo:** `https://YOUR_USERNAME.github.io/Bingo-Master/` (replace `YOUR_USERNAME` with your GitHub username after deployment).

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. (Optional) Create `.env.local` and set your Gemini API key if needed:
   ```
   GEMINI_API_KEY=your_key_here
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
5. Preview production build:
   ```bash
   npm run preview
   ```

## Deploy to GitHub Pages

The repo is set up to deploy to GitHub Pages via GitHub Actions.

- **Trigger:** Push to `main` or run the "Deploy to GitHub Pages" workflow manually.
- **Settings:** In the repo go to **Settings → Pages** and set **Source** to **GitHub Actions**.
- **URL:** `https://<username>.github.io/Bingo-Master/`

## Tech Stack

- React 19, TypeScript, Vite 6
- Tailwind CSS (CDN)
