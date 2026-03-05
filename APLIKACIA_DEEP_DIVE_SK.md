# ArcadeLearn – Kompletný technický popis (SK)

Tento dokument je písaný ako študijný materiál k maturitnej obhajobe. Cieľ je, aby si vedel vysvetliť **ako aplikácia funguje end-to-end**: od UI cez logiku cvičení až po backend a ukladanie dát.

## 1) Čo je aplikácia

ArcadeLearn je vzdelávacia aplikácia so systémom ostrovov (beginner/intermediate/professional), kde používateľ:
- prechádza témy,
- rieši cvičenia,
- získava XP,
- odomyká ďalšie ostrovy,
- sleduje streak,
- ukladá chyby (mistakes) na neskoršie opakovanie.

Aplikácia má aj admin časť (správa používateľov, obrázkov a reset dát).

---

## 2) Tech stack a architektúra

### Frontend
- React + TypeScript + Vite
- Router: `react-router`
- Štýly: CSS/Tailwind utility triedy
- Hlavný vstup: [src/main.tsx](src/main.tsx)
- Hlavný shell: [src/app/App.tsx](src/app/App.tsx)

### Backend (Supabase Edge Function)
- Hono server v Deno runtime
- Endpointy: [supabase/functions/server/index.tsx](supabase/functions/server/index.tsx)
- KV vrstva: [supabase/functions/server/kv_store.tsx](supabase/functions/server/kv_store.tsx)
- Frontend API klient: [src/app/utils/api.ts](src/app/utils/api.ts)
- Konfigurácia projektu a anon key: [supabase/info.tsx](supabase/info.tsx)

---

## 3) Frontend – hlavný flow aplikácie

## 3.1 Boot
1. V [src/main.tsx](src/main.tsx) sa mountne `App`.
2. V [src/app/App.tsx](src/app/App.tsx) sa nastaví router pre:
   - `/signin`
   - `/register`
   - všetko ostatné cez `AppContent`.

## 3.2 Session check po štarte
V `AppContent`:
- načíta sa `accessToken` z `localStorage`,
- ak token nie je, ide sa na signin,
- ak je token, volá sa `authAPI.getSession(token)`.

Ak session platí:
- nastaví sa `isLoggedIn`,
- načítajú sa user dáta cez `loadUserData(...)` helper,
- načítajú sa mistakes,
- overí sa admin status.

## 3.3 Lazy loading + prefetch
`HomePage`, `LearnPage`, `ProfilePopup`, `MistakesPage`, `SignInPage`, `RegisterPage`, `AdminPanel` sú lazy-loadované. Po prihlásení sa v idle time prefetchnú najpoužívanejšie stránky.

---

## 4) Dátové modely (kľúčové)

### `UserProgress`
V [src/app/utils/progressionUtils.ts](src/app/utils/progressionUtils.ts):
- `totalXP`
- `level`
- `sectionXP` (beginner/intermediate/professional)

### Island status
V [src/app/App.tsx](src/app/App.tsx):
- `locked`
- `unlocked`
- `completed-perfect`
- `completed-mistakes`

### Exercise dáta
`islandExerciseData` ukladá počet správnych odpovedí pre konkrétny ostrov (`level-theme`).

### Mistakes
V [src/app/utils/mistakesUtils.ts](src/app/utils/mistakesUtils.ts):
- chyby sú zoskupené podľa témy,
- každá chyba obsahuje otázku, user odpoveď, správnu odpoveď, timestamp.

---

## 5) XP, levelovanie a odomykanie

V [src/app/utils/progressionUtils.ts](src/app/utils/progressionUtils.ts):
- `xpCorrect = 5` (5 XP za správnu odpoveď),
- `xpPerLevel = 100`,
- final test unlock hranica je `300 XP` v sekcii (`finalTestXp = 300`).

### Dôležité pravidlo
XP sa v [src/app/App.tsx](src/app/App.tsx) pripisuje len pri **prvom dokončení ostrova** (`isFirstCompletion`).

### Odomykanie ostrovov
Po dokončení ostrova:
- ostrov dostane status perfect/mistakes,
- odomkne sa ďalší ostrov v poradí,
- po ostrove 12 sa odomkne final test (téma 0), ak:
  - sú dokončené všetky ostrovy 1–12,
  - section XP >= 300.

---

## 6) LearnPage – mechanika cvičení

Hlavný súbor: [src/app/components/islandpages/LearnPage.tsx](src/app/components/islandpages/LearnPage.tsx)

### Kľúčové stavy
- `currentSlideIndex`
- `exerciseStates`
- `exerciseResults`
- `showResultsPage`
- `reviewModeActive`

### Content slide
Pre bežné témy (nie final test) je prvý slide „content“:
- má 30s timer (okrem admina),
- potom je možné ísť ďalej.

### Exercise render
Typ cvičenia sa dispatchuje cez helper:
- [src/app/utils/exerciseRendererUtils.tsx](src/app/utils/exerciseRendererUtils.tsx)
- typy: true/false, choose-correct, sort, single-choice, multiple-choice.

### Výsledky a oprava chýb
Po dokončení:
- vypočíta sa počet správnych odpovedí,
- vytvoria sa mistakes,
- uloží sa progress callback,
- používateľ môže ísť do review módu iba cez nesprávne otázky.

---

## 7) Mistakes systém

Súbor: [src/app/utils/mistakesUtils.ts](src/app/utils/mistakesUtils.ts)

### Ukladanie
- lokálne: `localStorage` (`mistakes_<email>`),
- backend sync (ak je token a nie demo token): `mistakesAPI.addMistake(...)`.

### Načítanie
- pokus o backend,
- validácia dát,
- fallback na localStorage.

### Dôležité
- chyby sú nahrádzané per téma (`replaceThemeMistakes`),
- existuje „history“ flag, či používateľ niekedy mal chyby.

---

## 8) API klient (frontend)

Súbor: [src/app/utils/api.ts](src/app/utils/api.ts)

### Hlavné vlastnosti
- `BASE_URL` je Supabase Edge Function URL,
- všetky requesty idú cez `doFetchWithRetry` (retry + timeout),
- centralizované headers (`apikey`, `Authorization`, `X-Session-Token`),
- centralizovaný error objekt (`status`, `data`).

### API skupiny
- `authAPI`: signup/signin/session/signout
- `profileAPI`: profil + zmena emailu/hesla
- `progressAPI`: progress/islands/exercise-data/streak
- `mistakesAPI`: get/add mistakes
- `adminAPI`: check admin, users CRUD-like operácie, image upload/delete/get

---

## 9) Backend endpointy (Supabase function)

Súbor: [supabase/functions/server/index.tsx](supabase/functions/server/index.tsx)

### Health
- `GET /arcade-server/health`

### Auth
- `POST /auth/signup`
- `POST /auth/signin`
- `GET /auth/session`
- `POST /auth/signout`

### Profil
- `GET /profile`
- `PUT /profile`
- `POST /profile/change-email-direct`
- `POST /profile/change-password-direct`

### Progress
- `GET /progress`, `PUT /progress`
- `GET /islands`, `PUT /islands`
- `GET /exercise-data`, `PUT /exercise-data`
- `GET /streak`, `POST /streak`

### Mistakes
- `GET /mistakes`
- `POST /mistakes`
- `DELETE /mistakes`

### Admin
- `GET /admin/check`
- `GET /admin/users`
- `POST /admin/set-admin`
- `DELETE /admin/delete-user`
- `POST /admin/reset-user-data`

### Obrázky
- public čítanie island image: `GET /island-image/:level/:theme`
- admin island image: `POST/DELETE /admin/island-image...`
- admin content image: `POST/GET/DELETE /admin/content-image...`
- admin keyword image: `POST/GET/DELETE /admin/keyword-image...`
- diagnostics: `GET /admin/keyword-diagnostics`

---

## 10) KV storage – čo sa ukladá na backende

Backend používa key-value záznamy. Typické kľúče:
- `user:<email>`
- `session:<token>`
- `profile:<userId>`
- `progress:<userId>`
- `islands:<userId>`
- `exercise-data:<userId>`
- `streak:<userId>`
- `mistakes:<userId>`
- `admin:<userId>`
- image metadáta (`island-image:*`, `content-image:*`, `keyword-image:*`)

KV helper je v [supabase/functions/server/kv_store.tsx](supabase/functions/server/kv_store.tsx).

---

## 11) Admin vs bežný používateľ

### Bežný user
- vidí iba odomknuté ostrovy,
- postupuje lineárne podľa completion + XP,
- final test sa odomkne až po splnení podmienok.

### Admin
- má odomknuté všetko,
- má prístup do `/admin`,
- môže spravovať userov a obrázky.

---

## 12) Kľúčové obrazovky

- Home: ostrovy + progress + vstup do learning flow
- LearnPage: content + cvičenia + výsledky + review mistakes
- MistakesPage: zoznam chýb na opakovanie
- ProfilePopup: edit mena/emailu/hesla/fotky + tip + logout
- SignIn/Register: auth vstup
- AdminPanel: admin operácie

---

## 13) Bezpečnosť a praktické poznámky

- Frontend používa anon key + session token hlavičku.
- Backend robí autorizáciu podľa session tokenu (`X-Session-Token`) a admin check.
- V supabase server súboroch sú `@ts-nocheck` direktívy kvôli Deno/JSR importom vo VS Code TypeScript prostredí (Node-focused workspace).

---

## 14) Ako aplikáciu lokálne spustiť

1. `npm i`
2. `npm run dev`
3. kontrola: `npm run typecheck`
4. produkčný build: `npm run build`

---

## 15) Obhajoba – čo určite vedieť vysvetliť

1. Prečo je XP 5 za správnu odpoveď a kde sa to ráta.
2. Ako sa odomykajú ostrovy a final test.
3. Ako funguje review mode chýb.
4. Prečo sú oddelené frontend API helpery a backend endpointy.
5. Rozdiel medzi localStorage mistakes a backend sync.
6. Prečo admin vidí všetko odomknuté.
7. Ako funguje lazy loading a prefetch.

---

## 16) Dôležitý záver

Aplikácia je navrhnutá ako kombinácia:
- UI/UX flow pre učenie,
- game-like progression systému,
- backend persistence,
- admin rozšírení,
- a mechaniky opakovania chýb.

Ak vieš prejsť body 3–11 vlastnými slovami, máš plnú kontrolu nad logikou projektu.
