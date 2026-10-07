# X Clone UI

A Twitter/X clone built with Next.js 15 (App Router), React 19 and Tailwind CSS. Posts, comments and user profiles are served by [FreeAPI](https://www.freeapi.app/); image and video uploads go through [ImageKit](https://imagekit.io/).

## Stack

- [Next.js 15](https://nextjs.org/) — App Router, Server Components, Server Actions
- [React 19](https://react.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- FreeAPI (`api.freeapi.app`) — mock backend for feed, users, comments
- ImageKit — media uploads and transformations

## Getting Started

1. Install dependencies (choose one):

```bash
npm install
# or
pnpm install
```

2. Copy the env template and fill in the values:

```bash
cp .env.example .env
```

| Variable | Where | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_PUBLIC_KEY` | client | ImageKit public key |
| `NEXT_PUBLIC_URL_ENDPOINT` | client | ImageKit URL endpoint (absolute URL, e.g. `https://ik.imagekit.io/your-id`) |
| `PRIVATE_KEY` | server | ImageKit private key — used by server actions for uploads |
| `FREEAPI_BASE_URL` | server | FreeAPI base URL (defaults to `https://api.freeapi.app/api/v1`) |

3. Start the development server:

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Home feed
│   ├── @modal/compose/post/      # Compose modal (parallel route)
│   └── [username]/
│       ├── page.tsx              # User profile
│       └── status/[postId]/      # Post detail + replies
├── components/                   # UI (LeftBar, Feed, Post, Share, ...)
├── lib/
│   ├── freeapi.ts                # FreeAPI client
│   └── fakeApi.ts                # Data assembly + caching for the feed
├── actions.tsx                   # Server actions (post creation, ImageKit upload)
└── utils.ts                      # ImageKit signing helpers
```

## Notes

- All data is mocked by FreeAPI — no real authentication. The logged-in user is simulated.
- Media uploads are handled server-side in `src/actions.tsx`; the client only sends the file reference.
