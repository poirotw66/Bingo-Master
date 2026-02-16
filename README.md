# Bingo Master

A professional Bingo caller and scoreboard app built with React and Vite. Draw numbers from a custom range (default 1–75), switch themes, and keep history in the browser.

## Features

- **Custom draw range** — Set min and max (1–200) in Settings. Default is 1–75 (classic Bingo 75).
- **Multiple themes** — Classic 3D, Neon Glow, Minimalist, New Year Festival, Ocean, Snow, Forest. Switch in Settings.
- **History in browser** — Current game and past sessions are saved to `localStorage`. Clearing site data will remove them.
- **Full History & search** — Open the history rail to see all drawn numbers; use the search box to find a specific number in the current run.

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
- Tailwind CSS (build-time)
- PWA (manifest + service worker for install & offline)
