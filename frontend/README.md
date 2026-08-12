# ScamShield AI — Signal Intelligence

Phase 1 frontend for a premium cybersecurity SaaS experience.

## Stack

- React + Vite
- React Router
- Axios
- Lucide React
- Modern CSS
- Mock data only

## Run

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Routes

- `/dashboard`
- `/analyze`
- `/history`
- `/insights`
- `/profile`
- `/login`
- `/signup`

The root route redirects to `/dashboard`.

## Mock API

`src/services/api.js` contains a mock `analyzeMessage()` service that simulates:

`POST /api/analysis/message`

No AI provider, database, JWT secret, or API key is used by this frontend.

## Design

The visual system is intentionally original: restrained dark surfaces, editorial typography, animated perimeter borders, security signal states, layered panels, and subtle blue/cyan/violet illumination.

## Notes

Screenshot upload is a Phase 1 UI placeholder. No file is sent anywhere.
Authentication pages are frontend-only navigation demos.

## Functional fixes included

- Fixed SettingsProvider wiring so profile/protection/notification settings work.
- Added persistent local settings with safe storage handling and reset support.
- Fixed global search behavior and added reliable `/` keyboard shortcut.
- Kept Ctrl/Cmd+K as best-effort because Chrome may reserve it for browser search.
- Added click-outside and Escape handling for search/notifications.
- Fixed profile navigation and notification settings behavior.
- Added login/signup validation and demo-safe autocomplete settings.
- Added targeted layout/overflow protections without redesigning the existing UI.
