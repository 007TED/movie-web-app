# Movie Web App (React + Vite + Tailwind + TMDB + Appwrite)

Search movies from TMDB with a debounced search, show results instantly, and track “trending” queries using Appwrite. Trending items are derived from search metrics stored in Appwrite and ordered by popularity.

Features
- Fast movie search (TMDB)
- Debounced input to limit API calls
- Responsive list/grid UI
- “Trending” section powered by Appwrite metrics
- Hover pop effect for posters (Tailwind)
- Error and loading states

Tech Stack
- React 19, Vite 7
- Tailwind CSS 4
- Appwrite JS SDK
- react-use (debounce)
- ESLint 9

Prerequisites
- Node.js 18+ and npm
- TMDB account with a Read Access Token (v4)
- Appwrite project (Cloud or self-hosted) with a Database and Collection/Table for metrics
- CORS enabled in Appwrite for your dev and production origins

Getting Started

1) Clone and install
```shell script
git clone <your-repo-url>
cd <your-project-folder>
npm install
```


2) Configure environment variables
Create a file named .env.local in the project root:
```shell script
# TMDB v4 Read Access Token (Bearer). Keep this secret.
VITE_TMDB_API_KEY=YOUR_TMDB_BEARER_TOKEN

# Appwrite configuration
VITE_APPWRITE_PROJECT_ID=YOUR_APPWRITE_PROJECT_ID
VITE_APPWRITE_PROJECT_NAME=YOUR_APPWRITE_PROJECT_NAME
VITE_APPWRITE_ENDPOINT=https://YOUR-APPWRITE-ENDPOINT/v1
VITE_APPWRITE_DATABASE_ID=YOUR_APPWRITE_DATABASE_ID
VITE_APPWRITE_TABLE_ID=YOUR_APPWRITE_COLLECTION_OR_TABLE_ID
```

Notes:
- Do not commit .env.local to git.
- For TMDB, use the Read Access Token (v4), not an API key query param. It should be used as a Bearer token.
- Use your Appwrite endpoint (e.g., https://cloud.appwrite.io/v1 or your region endpoint).

3) Appwrite setup
- Create or open a Project.
- Databases:
  - Create a Database (note its ID).
  - Create a Collection/Table for metrics (note its ID).
  - Attributes (suggested):
    - searchTerm: string, required
    - count: integer, required, default 1
    - movie_id: integer (or string), optional
    - poster_url: string, optional
  - Index (recommended): create an index on count to support sorting. If available, ensure you can sort by count descending.
  - Permissions:
    - For quick local testing, grant create/read/update to role: any on the metrics collection.
    - For production, lock this down and consider using Appwrite Functions or a backend to mediate writes.
- Project Settings → CORS:
  - Add http://localhost:5173 (default Vite dev URL) and your production domain.

4) Run the app
```shell script
npm run dev
```

Open the printed URL (usually http://localhost:5173).

Build and preview
```shell script
npm run build
npm run preview
```


Lint
```shell script
npm run lint
```


How it works
- Search: The app queries TMDB’s /search/movie or uses /discover for the default list. Input is debounced to reduce API calls.
- Metrics: When a search returns results, the app writes/updates a metrics document in Appwrite for that search term, incrementing count and keeping a poster reference.
- Trending: A query fetches the top items ordered by count to show as “Trending Movies.”

UI/UX details
- Responsive grid using Tailwind classes
- Poster hover effect (scale, lift, shadow)
- Accessible alt text and focus styles recommended

Security and best practices
- Keep all secrets in .env.local and out of version control.
- Client-side writes to Appwrite require permissive collection permissions; harden this for production (e.g., with authenticated sessions or a server-side proxy).
- Rate limits: TMDB has usage limits—avoid spamming by relying on debounce and caching where appropriate.

Troubleshooting
- “Promise<void>” warning in useEffect: If you call an async function inside useEffect, either use void fetch() to intentionally discard the promise, wrap in an IIFE with await, or use .catch(...) to handle it.
- Trending shows empty:
  - Ensure documents are being created/updated in the metrics collection.
  - Verify listDocuments is called with correct databaseId and collection/tableId.
  - Make sure you can order by count (index/permissions).
- CORS errors:
  - Add your dev/production origins in Appwrite CORS settings and allow required headers (including Authorization).

Scripts (typical Vite)
- npm run dev: Start dev server
- npm run build: Production build
- npm run preview: Preview production build
- npm run lint: Lint with ESLint

License
- Add your preferred license (e.g., MIT) to a LICENSE file.

Contributing
- Issues and PRs are welcome. Please lint before submitting:
```shell script
npm run lint
```


Credits
- Data provided by TMDB.
- Backend as a Service by Appwrite.

Need help?
- Open an issue with your error message, steps to reproduce, and environment details (OS, Node version, browser).
