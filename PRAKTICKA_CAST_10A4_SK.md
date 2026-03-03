# Praktická časť – implementácia aplikácie ArcadeLearn (technický popis)

## 1. Úvod k praktickej časti

Táto kapitola popisuje samotnú implementáciu aplikácie ArcadeLearn. Na rozdiel od teoretickej časti je zameraná na konkrétne technické riešenia, štruktúru projektu, dátové toky, rozhodnutia počas vývoja, refaktoring a finálnu stabilizáciu systému. Cieľom je ukázať, ako bola aplikácia reálne postavená od vstupného bodu až po nasadený produkčný build.

---

## 2. Projektová štruktúra a rozdelenie zodpovednosti

Aplikácia je rozdelená na frontend a backend časť:

- frontend: React + TypeScript + Vite,
- backend: Supabase Edge Function (Hono + Deno runtime),
- perzistencia: key-value vrstva v Supabase.

Prakticky sa kód delí na:

1. **Aplikačný shell** – routing, session, globálne stavy ([src/app/App.tsx](src/app/App.tsx)).
2. **Prezentačné komponenty** – stránky, modály, cvičenia ([src/app/components](src/app/components)).
3. **Doménové utility** – progression, mistakes, renderer helpery ([src/app/utils](src/app/utils)).
4. **API klient** – centralizované volania backendu ([src/app/utils/api.ts](src/app/utils/api.ts)).
5. **Backend endpointy** – autentifikácia, progress, admin ([supabase/functions/server/index.tsx](supabase/functions/server/index.tsx)).

Toto rozdelenie bolo kľúčové, aby sa dalo meniť UI bez zásahu do API logiky a naopak.

---

## 3. Inicializácia aplikácie a render stromu

Vstupný bod je v [src/main.tsx](src/main.tsx). Aplikácia sa renderuje cez `ReactDOM.createRoot(...)`.

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import '@/styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Týmto sa spustí celý routing a autentifikačný flow v App komponente.

---

## 4. Routing a autentifikačný tok

Routing je definovaný priamo v [src/app/App.tsx](src/app/App.tsx):

- `/signin` → prihlasovanie,
- `/register` → registrácia,
- `/*` → hlavná aplikácia.

```tsx
<BrowserRouter>
  <Routes>
    <Route path="/signin" element={<SignInPageWrapper />} />
    <Route path="/register" element={<RegisterPageWrapper />} />
    <Route path="/*" element={<AppContent />} />
  </Routes>
</BrowserRouter>
```

### Session check po štarte
V `AppContent` sa vykoná kontrola tokenu:

```tsx
const token = localStorage.getItem('accessToken');
if (!token) {
  setIsLoadingAuth(false);
  navigate('/signin');
  return;
}
```

Ak token existuje, volá sa backend session endpoint cez `authAPI.getSession(token)`. Pri úspechu sa načítajú všetky user dáta, pri chybe sa token odstráni a používateľ sa vracia na signin.

---

## 5. Lazy loading a optimalizácia načítania

Kvôli výkonu sa stránky načítavajú lazy spôsobom:

```tsx
const HomePage = lazy(() => loadHomePage().then((module) => ({ default: module.HomePage })));
const LearnPage = lazy(() => loadLearnPage());
const ProfilePopup = lazy(() => loadProfilePopup());
```

Po prihlásení prebieha prefetch počas idle času (`requestIdleCallback` fallback na `setTimeout`). Praktický efekt bol kratší čas čakania pri otvorení LearnPage a profilu.

---

## 6. API vrstva – centralizované volania backendu

V [src/app/utils/api.ts](src/app/utils/api.ts) je jedna centralizovaná vrstva, kde sú vyriešené:

- base URL,
- headers,
- retry mechanika,
- jednotný error objekt.

### Base URL
```ts
const BASE_URL = 'https://' + projectId + '.supabase.co/functions/v1/make-server-15e718fc';
```

### Headers
```ts
const headers: HeadersInit = {
  'Content-Type': 'application/json',
  'apikey': publicAnonKey,
  'Authorization': 'Bearer ' + publicAnonKey,
};
```

### Retry a timeout
```ts
async function doFetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  // timeout 15s + retry attempts
}
```

Tým sa výrazne znížili transient chyby pri sieťových výpadkoch.

---

## 7. XP systém a progression logika

XP logika je v [src/app/utils/progressionUtils.ts](src/app/utils/progressionUtils.ts). Kľúčové konštanty:

```ts
const xpPerLevel = 100;
const xpCorrect = 5;
const finalTestXp = 300;
```

### Výpočet XP
```ts
export function calculateXPEarned(_totalExercises: number, correctAnswers: number): number {
  let earnedXP = 0;
  for (let i = 0; i < correctAnswers; i++) {
    earnedXP = earnedXP + xpCorrect;
  }
  return earnedXP;
}
```

### Dôležité pravidlo implementácie
V [src/app/App.tsx](src/app/App.tsx) sa XP prideľuje len pri prvom dokončení ostrova (`isFirstCompletion`). To bráni nekonečnému farmeniu XP opakovaním rovnakého ostrova.

---

## 8. LearnPage – implementácia učebného flowu

Súbor [src/app/components/islandpages/LearnPage.tsx](src/app/components/islandpages/LearnPage.tsx) riadi celý učebný cyklus.

### Stavové premenné
- aktuálny slide,
- timer,
- zoznam výsledkov,
- review mode,
- stav každého cvičenia.

### Inicializácia stavov cvičení
```tsx
const initialStates = initializeExerciseStates(themeData.exercises, isFinalTest);
setExerciseStates(initialStates);
```

### Časovač pre obsahový slide
Pri bežnej téme je prvý slide teória, kde používateľ čaká 30 sekúnd pred prechodom ďalej (admin má výnimku).

### Render cvičení
Cvičenia sa dispatchujú podľa typu cez helper [src/app/utils/exerciseRendererUtils.tsx](src/app/utils/exerciseRendererUtils.tsx):

```tsx
switch (exercise.type) {
  case 'multiple-choice':
    return <TextMultipleChoiceExercise ... />;
  case 'true-false':
    return <TrueFalseExercise ... />;
  case 'choose-correct':
    return <ChooseCorrectOptionExercise ... />;
  case 'sort':
    return <SortExercise ... />;
  case 'single-choice':
    return <SingleChoiceTextExercise ... />;
}
```

Tento prístup odstránil duplicitu a oddelil orchestrace logiku od jednotlivých exercise komponentov.

---

## 9. Výsledky, chyby a review mode

Po dokončení cvičení LearnPage:

1. vypočíta `correctCount`,
2. vytvorí mistakes z výsledkov,
3. uloží mistakes,
4. zavolá completion callback.

```tsx
const newMistakes = createMistakesFromResults(exerciseResults, exerciseStates, themeData, isFinalTest);
replaceThemeMistakes(...);
if (props.onComplete) {
  props.onComplete(correctCount, numberOfExercises);
}
```

### Review mode
Ak sú chyby, používateľ môže prejsť iba nesprávne otázky. Toto je implementované cez pole indexov `incorrectExerciseIndices`.

---

## 10. Mistakes systém – perzistencia a synchronizácia

Súbor [src/app/utils/mistakesUtils.ts](src/app/utils/mistakesUtils.ts).

### Lokálne uloženie
```ts
const storageKey = 'mistakes_' + userEmail;
localStorage.setItem(storageKey, JSON.stringify(mistakes));
```

### Backend sync
```ts
await mistakesAPI.addMistake(accessToken, mistakes);
```

### Fallback stratégia
Ak backend zlyhá alebo token nie je dostupný, aplikácia používa lokálne dáta. Tým sa zachovala funkčnosť aj mimo ideálnych podmienok.

---

## 11. Island renderer – refaktor bez zmeny vizuálu

V [src/app/components/islands/IslandRenderer.tsx](src/app/components/islands/IslandRenderer.tsx) bol pôvodne dlhý `if/else` strom pre mapovanie ostrovov. Refaktor bol urobený na mapovú štruktúru, bez zmeny vzhľadu jednotlivých ostrovov.

```tsx
const regularIslandsByLevel = {
  beginner: [BeginnerIsland1, ..., BeginnerIsland12],
  intermediate: [IntermediateIsland1, ..., IntermediateIsland12],
  professional: [ProfessionalIsland1, ..., ProfessionalIsland12],
};
```

Výhoda:
- kratší a čitateľnejší kód,
- menej chýb pri údržbe,
- žiadny zásah do vizuálu ostrovov.

---

## 12. Profile popup – implementácia edit flowu

Súbor [src/app/components/profile/ProfilePopup.tsx](src/app/components/profile/ProfilePopup.tsx).

Funkcie:
- edit mena,
- edit emailu,
- edit hesla,
- upload profilovej fotky,
- logout.

Príklad validácie + save flow:

```tsx
const validation = validateEmail(temporaryEmail.toLowerCase());
if (!validation.valid) {
  alert(validation.error);
  return;
}
await profileAPI.changeEmailDirect(accessToken, temporaryEmail.toLowerCase());
```

V rámci UI úprav boli edit prvky zjednotené na pencil ikony kvôli konzistencii.

---

## 13. Backend – implementácia endpointov

Hlavný server je [supabase/functions/server/index.tsx](supabase/functions/server/index.tsx). Je postavený na Hono.

### Príklad endpointu
```ts
app.post('/make-server-15e718fc/auth/signin', async (c) => {
  const { email, password } = await c.req.json();
  // validácia usera
  // vytvorenie session tokenu
  return c.json({ accessToken: tok, user: { id: u.userId, email: u.email } });
});
```

### Admin autorizácia
Admin endpointy používajú helper, ktorý overí session aj admin status.

### Storage inicializácia
Pri štarte sa kontroluje bucket na obrázky. Ak neexistuje, vytvorí sa automaticky.

---

## 14. KV vrstva backendu

Súbor [supabase/functions/server/kv_store.tsx](supabase/functions/server/kv_store.tsx) poskytuje jednoduché operácie:
- `set`, `get`, `del`,
- `mset`, `mget`, `mdel`,
- `getByPrefix`.

Táto vrstva abstrahuje databázový prístup a drží server endpointy čistejšie.

---

## 15. Administrátorská časť

Admin panel umožňuje:
- získať zoznam používateľov,
- meniť admin status,
- resetovať používateľské dáta,
- mazať účty,
- nahrávať/mazať obrázky pre ostrovy, obsah a keywordy.

Tým sa prakticky oddelila „bežná“ UX vrstva od správy systému.

---

## 16. Čistenie kódu a odstránenie nepotrebných súborov

Po implementácii jadra prebehol cleanup:

- odstránenie nepoužívaných asset súborov,
- odstránenie dev-only pomocných súborov,
- zjednotenie štýlu v kritických komponentoch,
- refaktor duplicít v routovaní ostrovov.

Výsledkom je menší a konzistentnejší repozitár.

---

## 17. Stabilizácia warningov a environment rozdielov

V `supabase/functions/server` sú použité Deno/JSR importy, ktoré VS Code TypeScript server v Node workspace hlási ako chyby. Aby editor nebol zahltený false-positive diagnostikou, boli použité cielené `@ts-nocheck` direktívy v Deno-only súboroch.

Tým sa zachovala:
- čistota problémového panelu,
- funkčnosť build procesu frontendu,
- runtime kompatibilita backendu.

---

## 18. Testovanie a verifikácia

Po každej väčšej zmene boli spúšťané:

- `npm run typecheck`
- `npm run build`

Okrem toho prebehli manuálne scenáre:

1. signup → signin → session,
2. prechod témou → výsledok → XP update,
3. odomykanie ďalšieho ostrova,
4. vznik a zobrazenie mistakes,
5. profile edit flow,
6. admin operácie.

Tento postup bol dôležitý, pretože aplikácia obsahuje viac stavových tokov, ktoré sa najlepšie overia kombináciou statickej aj manuálnej validácie.

---

## 19. Nasadenie a výsledný stav

Projekt je nasadený cez GitHub push flow. Po pushi na `main` je nová verzia dostupná online.

Praktický výsledok implementácie:
- aplikácia je funkčná end-to-end,
- používateľské dáta sa ukladajú,
- learning flow je stabilný,
- admin časť funguje,
- build a typová kontrola prechádzajú.

---

## 20. Záver praktickej časti

Praktická implementácia preukázala, že aplikáciu je možné navrhnúť a realizovať ako plnohodnotný systém, nie iba ako demo prototyp. Projekt pokrýva autentifikáciu, správu stavu, perzistenciu dát, evaluačnú logiku cvičení, gamifikáciu, administráciu a nasadenie.

Najdôležitejšie technické prínosy:
- oddelená architektúra frontend/backend,
- centralizovaná API vrstva,
- jasná progression logika,
- robustný learning flow,
- maintainovateľný kód po refaktoringu.

Táto praktická časť teda napĺňa cieľ maturitnej práce: vytvoriť funkčný, technicky konzistentný a obhájiteľný softvérový produkt s jasne popísanou implementáciou.
