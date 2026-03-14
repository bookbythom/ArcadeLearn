# Mapa Odstavcov Na Kod (1 hlavna cast na kapitolu)

Format: cely odstavec + 1 najdolezitejsi kod.

## 2.5 Tvorba backendu

Backend je implementovaný ako Supabase Edge Function v prostredí Deno s frameworkom Hono. Funkcia obsahuje viacero endpointov pre autentifikáciu, profil, progres, ostrovčeky, streak, mistakes, administráciu a správu obrázkov.

```ts
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();
const API_PREFIX = '/arcade-server';
const apiRoute = (path: string) => `${API_PREFIX}${path}`;

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'apikey', 'X-Session-Token'],
  credentials: true
}));
app.use('*', logger());

app.post(apiRoute('/auth/signin'), async (c) => { /* ... */ });
app.get(apiRoute('/profile'), async (c) => { /* ... */ });
app.get(apiRoute('/progress'), async (c) => { /* ... */ });
app.get(apiRoute('/mistakes'), async (c) => { /* ... */ });
app.get(apiRoute('/admin/check'), async (c) => { /* ... */ });
```

## 2.5.1 Backendove mechaniky

Autentifikácia a autorizácia sú realizované vlastnou session mechanikou. Po prihlásení backend vytvorí session token, ktorý klient posiela v hlavičke X-Session-Token. Chránené endpointy overujú platnosť relácie a pri administrátorských operáciách aj rolu používateľa.

```ts
const getTok = (context: Context) =>
  context.req.header('X-Session-Token') ||
  context.req.header('Authorization')?.split(' ')[1];

const valSess = async (token: string) => {
  const sessionData = await kv.get(`session:${token}`);
  return sessionData ? JSON.parse(sessionData) : null;
};

const auth = async (context: Context) => {
  const token = getTok(context);
  if (!token) return null;
  return await valSess(token);
};

const admAuth = async (context: Context) => {
  const session = await auth(context);
  if (!session) return { err: context.json({ error: 'Unauthorized' }, 401), s: null };
  if (!(await isAdm(session.userId))) return { err: context.json({ error: 'Forbidden' }, 403), s: null };
  return { err: null, s: session };
};
```

## 2.5.2 Navrh databazy

Pre potreby aplikácie sme zvolili model kľúč-hodnota. Dáta sú uložené v jednej tabuľke a organizačne rozdelené pomocou prefixov v kľúčoch.

```ts
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const TABLE_NAME = "kv_store";

type KVRow = {
  key: string;
  value: unknown;
};

export const set = async (key: string, value: unknown): Promise<void> => {
  const { error } = await client().from(TABLE_NAME).upsert({ key, value });
  if (error) throw new Error(error.message);
};

export const getByPrefix = async (prefix: string): Promise<string[]> => {
  const { data, error } = await client().from(TABLE_NAME).select("key, value").like("key", `${prefix}%`);
  if (error) throw new Error(error.message);
  return (data as KVRow[] | null)
    ?.map((entry) => (typeof entry.value === "string" ? entry.value : ""))
    .filter((entry) => entry.length > 0) ?? [];
};
```

## 2.5.3 Ukladanie suborov (Supabase Storage)

Obrázky sa ukladajú do Supabase Storage bucketu arcadelearn-island-images. Pri nahrávaní backend vytvorí jedinečný názov súboru, uloží súbor do bucketu, vygeneruje signed URL a do KV vrstvy uloží metadáta.

```ts
const STORAGE_BUCKET_NAME = Deno.env.get('STORAGE_BUCKET_NAME') || 'arcadelearn-island-images';

app.post(apiRoute('/admin/content-image'), async (c) => {
  const { err, s } = await admAuth(c);
  if (err) return err;

  const fd = await c.req.formData();
  const lvl = fd.get('level'), thm = fd.get('theme'), idx = fd.get('imageIndex'), imgf = fd.get('image');
  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  const ck = `${lvl}-${thm}-${idx}`;
  const fn = `content-${ck}-${Date.now()}.${imgf.name.split('.').pop()}`;

  await sb.storage.from(STORAGE_BUCKET_NAME).upload(fn, new Uint8Array(await imgf.arrayBuffer()), {
    contentType: imgf.type,
    upsert: false
  });

  const { data: ud } = await sb.storage.from(STORAGE_BUCKET_NAME).createSignedUrl(fn, 31536000);

  await kv.set(`content-image:${ck}`, JSON.stringify({
    imageUrl: ud.signedUrl,
    fileName: fn,
    bucketName: STORAGE_BUCKET_NAME,
    uploadedAt: new Date().toISOString(),
    uploadedBy: s!.email
  }));
});
```

## 2.6 Prepojenie backendu s frontendom

Prepojenie backendu s frontendom je realizované cez jednotnú API vrstvu. Po úspešnom prihlásení sa session token uloží na klientovi a pri autorizovaných volaniach sa prenáša v hlavičke X-Session-Token.

```ts
import { projectId, publicAnonKey } from 'supabase/info';

const FUNCTION_NAME = (import.meta as { env?: { VITE_FUNCTION_NAME?: string } }).env?.VITE_FUNCTION_NAME || 'arcade-server';
const BASE_URL = 'https://' + projectId + '.supabase.co/functions/v1/' + FUNCTION_NAME;

const makeHeaders = (accessToken?: string) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'apikey': publicAnonKey,
    'Authorization': 'Bearer ' + publicAnonKey,
  };
  if (accessToken) {
    headers['X-Session-Token'] = accessToken;
  }
  return headers;
};

localStorage.setItem("accessToken", response.accessToken);
```

## 2.7 Nasadenie na web

Nasadenie aplikácie je rozdelené na dve časti: frontend a backend. Frontend sa zostavuje pomocou nástroja Vite príkazom npm run build a backend beží ako Supabase Edge Function.

```ts
// package.json
"scripts": {
  "dev": "vite",
  "typecheck": "tsc --noEmit",
  "build": "vite build",
  "preview": "vite preview"
}

// api.ts
const FUNCTION_NAME = (import.meta as { env?: { VITE_FUNCTION_NAME?: string } }).env?.VITE_FUNCTION_NAME || 'arcade-server';
const BASE_URL = 'https://' + projectId + '.supabase.co/functions/v1/' + FUNCTION_NAME;

// kv_store.tsx
const getRequiredEnv = (key: string): string => {
  const value = Deno.env.get(key);
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};
```
