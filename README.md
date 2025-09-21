# Dog Breed Viewer

A single-page React app for browsing dog breeds and viewing three random images per breed. Built with TypeScript, Zustand, Tailwind CSS, and Vite.

## Live Demo

https://dog-breed-viewer.vercel.app/

## Demo

![App demo](./app-demo.gif)

## Features

- Fetch and display all breeds on load
- Search/filter with 200ms debounce
- Select a breed to view 3 random images
- Loading indicators for breeds and images
- User-friendly errors with retry actions
- Images update on selection change

Bonus:
- Local cache for breed list (5 minutes)
- Retry with exponential backoff (rate limits and transient errors)
- Unit test (useDebounce with Vitest)
- Optional authentication via DummyJSON (login and profile)

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- Zustand
- Vitest + Testing Library

## Getting Started

Prerequisites: Node.js 18+

Install and run locally:

```bash
npm install
npm run dev
```

Build and preview production:

```bash
npm run build
npm run preview
```

## Scripts

```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build
npm test              # Run tests (watch)
npm run test:run      # Run tests once
npm run test:coverage # Coverage report
npm run lint          # Lint code
```

## Project Structure

```
src/
  components/  # UI components
  hooks/       # Custom hooks
  services/    # API clients (Dog CEO, DummyJSON)
  store/       # Zustand stores
  types/       # TypeScript types
  utils/       # HTTP and helpers
  test/        # Vitest setup
```

## APIs Used

- Breeds list: https://dog.ceo/api/breeds/list/all
- Random images (3): https://dog.ceo/api/breed/{breed}/images/random/3

Optional auth (DummyJSON):
- Login: https://dummyjson.com/auth/login
- Current user: https://dummyjson.com/auth/me

Notes: Tokens are stored in localStorage. Requests do not include credentials.

## License

MIT
