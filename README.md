# Top Shelf

Top Shelf is a web app for building and organizing game tier lists with a smooth drag-and-drop interface and automatic game data fetching.

## Features

- Drag-and-drop tier list builder
- Add games individually or from a list (bulk input)
- Automatic game data (title + image) via RAWG API
- Persistent storage (local JSON database)
- Clean, responsive UI (Next.js + React)

## Getting Started

1. Install dependencies:

`pnpm install`

2. Set up environment:

Create a `.env.local` file and add:

`RAWG_API_KEY=your_api_key_here`

Get your API key from:
https://rawg.io/apidocs

3. Run the app:

`pnpm dev`

4. Open in browser:

http://localhost:3000


## How it works
- Game data is fetched from the RAWG API
- Data is stored locally in data/db.json
- API routes handle all read/write operations

## Tech Stack
- Next.js (App Router)
- React
- TypeScript
- lowdb (JSON database)
- RAWG API


## Demo

[top-shelf-demo.webm](https://github.com/user-attachments/assets/3e56256b-e517-4b1a-a982-3c26065ee392)


## Notes

This project is designed as a demo piece.
It uses a local JSON database, so data is shared across users if deployed.




## License

MIT


