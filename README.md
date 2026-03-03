# ArcadeLearn

This is the ArcadeLearn codebase.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Build check

Run `npm run build` to verify production build locally.

## Free deployment (0 €)

This project can run fully free with:
- Frontend hosting: Cloudflare Pages (free)
- Backend/Auth/DB: Supabase free tier
- Domain: use free `*.pages.dev` URL (no paid domain required)

### 1) Push project to GitHub

```bash
git init
git add .
git commit -m "Initial deploy"
git branch -M main
git remote add origin https://github.com/<your-user>/<your-repo>.git
git push -u origin main
```

### 2) Deploy on Cloudflare Pages

1. Cloudflare Dashboard -> Workers & Pages -> Create -> Pages -> Connect to Git
2. Select this GitHub repository
3. Use these build settings:
	- Framework preset: `Vite`
	- Build command: `npm run build`
	- Build output directory: `dist`
4. Deploy

After deploy, you get a free public URL like `https://<project>.pages.dev`.

### 3) SPA routing (already configured)

This repo includes `public/_redirects` with:

```txt
/* /index.html 200
```

This ensures refresh/direct links like `/signin` or `/mistakes` work on Pages.

### 4) Configure Supabase for production URL

In Supabase Dashboard:

1. Go to Authentication -> URL Configuration
2. Set Site URL to your Pages URL, e.g.:
	- `https://<project>.pages.dev`
3. Add Redirect URLs (at minimum):
	- `https://<project>.pages.dev`
	- `https://<project>.pages.dev/signin`
	- `https://<project>.pages.dev/register`

### 5) Verify online app

Test on your public Pages URL:
- Home loads
- Sign up / sign in works
- Profile opens
- Learn page opens
- Refresh on deep routes works (`/signin`, `/mistakes`, etc.)

### Important note

Code/config preparation is done in this repo, but Cloudflare/Supabase account actions (connect repo, click deploy, set URLs) must be done in your accounts.
