# Top Shelf

Top Shelf is a web app for building and organizing game tier lists with a smooth drag-and-drop interface and automatic game data fetching.

## Features

- Drag-and-drop tier list builder
- Add games individually or from a list (bulk input)
- Automatic game data (title + image) via RAWG API
- User accounts with username/password or Google OAuth
- Per-user persistent storage (PostgreSQL)
- Works without an account — changes are local only
- Clean, responsive UI (Next.js + React)

## Live Demo

https://top-shelf-nu.vercel.app/

## Getting Started

1. Install dependencies:

```
pnpm install
```

2. Start the local database:

```
pnpm db:start
```

3. Set up environment — create a `.env` file:

```
DATABASE_URL=postgresql://topshelf:topshelf@localhost:5432/topshelf
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
RAWG_API_KEY=your_rawg_api_key
```

RAWG API key: https://rawg.io/apidocs  
Google OAuth credentials: https://console.cloud.google.com

4. Apply database migrations:

```
pnpm db:migrate
```

5. Run the app:

```
pnpm dev
```

6. Open in browser:

http://localhost:3000

## How it works

- Game data is fetched from the RAWG API
- Authenticated users have their tier lists saved to PostgreSQL
- Unauthenticated users can still build tier lists, but data lives in local state only
- API calls go through tRPC; auth is handled by NextAuth with PrismaAdapter

## Tech Stack

- Next.js (App Router)
- React / TypeScript
- tRPC
- NextAuth.js (credentials + Google OAuth)
- Prisma + PostgreSQL
- RAWG API
- Tailwind CSS + shadcn/ui
- dnd-kit (drag and drop)

## License

MIT
