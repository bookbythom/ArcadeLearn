import { Hono } from "npm:hono";
import type { Context } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2';

const app = new Hono();
const LEGACY_API_PREFIX = Deno.env.get('LEGACY_API_PREFIX');
const API_PREFIX = '/arcade-server';
const LEGACY_STORAGE_BUCKET_NAME = Deno.env.get('LEGACY_STORAGE_BUCKET_NAME');
const STORAGE_BUCKET_NAME = Deno.env.get('STORAGE_BUCKET_NAME') || 'arcadelearn-island-images';
const apiRoute = (path: string) => `${API_PREFIX}${path}`;

type MetadataRecord = {
  fileName?: string;
  imageUrl?: string;
  bucketName?: string;
  [key: string]: unknown;
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'Unknown error';
};

const extractBucketFromSignedUrl = (url?: string) => {
  if (!url) return null;
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\/storage\/v1\/object\/sign\/([^/]+)\//);
    return match?.[1] || null;
  } catch {
    return null;
  }
};

const resolveBucketName = (metadata: { bucketName?: string; imageUrl?: string }) => {
  return metadata.bucketName || extractBucketFromSignedUrl(metadata.imageUrl) || STORAGE_BUCKET_NAME;
};

const listImageMetadataEntries = async () => {
  const prefixes = ['island-image:', 'content-image:', 'keyword-image:'];
  const entries: Array<{ key: string; metadata: MetadataRecord }> = [];

  for (const prefix of prefixes) {
    const rows = await kv.getEntriesByPrefix(prefix);
    for (const row of rows) {
      try {
        const metadata = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
        if (metadata?.fileName) {
          entries.push({ key: row.key, metadata });
        }
      } catch {
      }
    }
  }

  return entries;
};

const findMetadataByKey = async (key: string) => {
  const value = await kv.get(key);
  if (!value) return null;
  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch {
    return null;
  }
};

const migrateSingleImageMetadata = async (sb: SupabaseClient, key: string, metadata: MetadataRecord) => {
  const fileName = metadata?.fileName;
  if (!fileName) return { migrated: false, reason: 'missing-file-name' };

  const sourceBucket = resolveBucketName(metadata) || LEGACY_STORAGE_BUCKET_NAME;
  if (sourceBucket === STORAGE_BUCKET_NAME && metadata?.bucketName === STORAGE_BUCKET_NAME) {
    return { migrated: false, reason: 'already-migrated' };
  }

  const { data: fileBlob, error: downloadError } = await sb.storage.from(sourceBucket).download(fileName);
  if (downloadError || !fileBlob) {
    return { migrated: false, reason: `download-failed:${downloadError?.message || 'unknown'}` };
  }

  const contentType = fileBlob.type || undefined;
  const fileBuffer = new Uint8Array(await fileBlob.arrayBuffer());
  const { error: uploadError } = await sb.storage.from(STORAGE_BUCKET_NAME).upload(fileName, fileBuffer, { contentType, upsert: true });
  if (uploadError) {
    return { migrated: false, reason: `upload-failed:${uploadError.message}` };
  }

  const { data: signedUrlData, error: signedUrlError } = await sb.storage.from(STORAGE_BUCKET_NAME).createSignedUrl(fileName, 31536000);
  if (signedUrlError || !signedUrlData?.signedUrl) {
    return { migrated: false, reason: `signed-url-failed:${signedUrlError?.message || 'unknown'}` };
  }

  const nextMetadata = {
    ...metadata,
    bucketName: STORAGE_BUCKET_NAME,
    imageUrl: signedUrlData.signedUrl,
    migratedAt: new Date().toISOString(),
  };

  await kv.set(key, JSON.stringify(nextMetadata));
  return { migrated: true, reason: 'ok' };
};

const hash = async (plainText: string) => {
  const bytes = new TextEncoder().encode(plainText);
  const digest = await crypto.subtle.digest('SHA-256', bytes);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

const getTok = (context: Context) =>
  context.req.header('X-Session-Token') ||
  context.req.header('Authorization')?.split(' ')[1];

const valSess = async (token: string) => {
  try {
    const sessionData = await kv.get(`session:${token}`);
    return sessionData ? JSON.parse(sessionData) : null;
  } catch {
    return null;
  }
};

const isAdm = async (userId: string) => {
  try {
    return await kv.get(`admin:${userId}`) === 'true';
  } catch {
    return false;
  }
};

const day = (date: Date) => date.toISOString().split('T')[0];

const auth = async (context: Context) => {
  const token = getTok(context);
  if (!token) {
    return null;
  }

  return await valSess(token);
};

const admAuth = async (context: Context) => {
  const session = await auth(context);

  if (!session) {
    return { err: context.json({ error: 'Unauthorized' }, 401), s: null };
  }

  if (!(await isAdm(session.userId))) {
    return { err: context.json({ error: 'Forbidden' }, 403), s: null };
  }

  return { err: null, s: session };
};

// Inicializacia Supabase Storage bucket pri starte servera
const initStorage = async () => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRoleKey) {
      return;
    }
    
    const storageClient = createClient(supabaseUrl, serviceRoleKey);
    const bucketName = STORAGE_BUCKET_NAME;
    
    // Skontrolujeme ci bucket existuje
    const { data: buckets } = await storageClient.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      const { error } = await storageClient.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 5242880 // 5MB limit
      });

      if (error) {
        return;
      }
    }
  } catch {
  }
};

// Spustime inicializaciu storage (non-blocking)
initStorage().catch(() => undefined);

if (LEGACY_API_PREFIX) {
  app.use(`${LEGACY_API_PREFIX}/*`, async (c) => {
    const rewrittenUrl = new URL(c.req.url);
    rewrittenUrl.pathname = rewrittenUrl.pathname.replace(LEGACY_API_PREFIX, API_PREFIX);
    return await app.fetch(new Request(rewrittenUrl.toString(), c.req.raw));
  });
}

app.use('*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowHeaders: ['Content-Type', 'Authorization', 'apikey', 'X-Session-Token'], credentials: true }));
app.use('*', logger());
app.onError((err, c) => {
  return c.json({ error: err?.message || 'Internal server error' }, 500);
});
app.options('*', (c) => c.text('', 204));

app.get(apiRoute('/health'), (c) => c.json({ status: 'ok' }));

app.post(apiRoute('/auth/signup'), async (c) => {
  const { email, password, name } = await c.req.json();
  if (await kv.get(`user:${email}`)) return c.json({ error: 'Email exists' }, 400);
  const uid = crypto.randomUUID(), tok = crypto.randomUUID();
  await kv.set(`user:${email}`, JSON.stringify({ userId: uid, email, passwordHash: await hash(password), createdAt: new Date().toISOString() }));
  await kv.set(`session:${tok}`, JSON.stringify({ userId: uid, email, createdAt: new Date().toISOString() }));
  await kv.set(`profile:${uid}`, JSON.stringify({ name: name || email.split('@')[0], email, profilePicture: '' }));
  await kv.set(`progress:${uid}`, JSON.stringify({ level: 0, totalXP: 0, sectionXP: { beginner: 0, intermediate: 0, professional: 0 } }));
  await kv.set(`islands:${uid}`, JSON.stringify({ "beginner-1": "unlocked" }));
  await kv.set(`streak:${uid}`, JSON.stringify({ count: 0, lastIslandCompletedDate: null, activeToday: false }));
  return c.json({ accessToken: tok, user: { id: uid, email } });
});

app.post(apiRoute('/auth/signin'), async (c) => {
  const { email, password } = await c.req.json();
  const ud = await kv.get(`user:${email}`);
  if (!ud) return c.json({ error: 'Invalid credentials' }, 401);
  const u = JSON.parse(ud);
  if (await hash(password) !== u.passwordHash) return c.json({ error: 'Invalid credentials' }, 401);
  const tok = crypto.randomUUID();
  await kv.set(`session:${tok}`, JSON.stringify({ userId: u.userId, email: u.email, createdAt: new Date().toISOString() }));
  return c.json({ accessToken: tok, user: { id: u.userId, email: u.email } });
});

app.get(apiRoute('/auth/session'), async (c) => {
  const s = await auth(c);
  return s ? c.json({ session: { user: { id: s.userId, email: s.email } } }) : c.json({ session: null }, 401);
});

app.post(apiRoute('/auth/signout'), async (c) => {
  const t = getTok(c);
  if (t) await kv.del(`session:${t}`);
  return c.json({ success: true });
});

app.get(apiRoute('/profile'), async (c) => {
  const s = await auth(c);
  if (!s) return c.json({ error: 'Unauthorized' }, 401);
  const pd = await kv.get(`profile:${s.userId}`);
  return c.json({ profile: pd ? JSON.parse(pd) : { name: s.email.split('@')[0], email: s.email, profilePicture: '' } });
});

app.put(apiRoute('/profile'), async (c) => {
  const s = await auth(c);
  if (!s) return c.json({ error: 'Unauthorized' }, 401);
  const pd = await c.req.json();
  await kv.set(`profile:${s.userId}`, JSON.stringify(pd));
  return c.json({ profile: pd });
});

app.post(apiRoute('/profile/change-email-direct'), async (c) => {
  const s = await auth(c);
  if (!s) return c.json({ error: 'Unauthorized' }, 401);
  const { newEmail } = await c.req.json();
  if (!newEmail) return c.json({ error: 'Email required' }, 400);
  if (await kv.get(`user:${newEmail}`)) return c.json({ error: 'Email in use' }, 409);
  const ud = await kv.get(`user:${s.email}`);
  if (!ud) return c.json({ error: 'User not found' }, 404);
  const u = JSON.parse(ud);
  u.email = newEmail;
  await kv.del(`user:${s.email}`);
  await kv.set(`user:${newEmail}`, JSON.stringify(u));
  const pd = await kv.get(`profile:${s.userId}`);
  if (pd) { const p = JSON.parse(pd); p.email = newEmail; await kv.set(`profile:${s.userId}`, JSON.stringify(p)); }
  const tok = getTok(c), sd = await kv.get(`session:${tok}`);
  if (sd) { const si = JSON.parse(sd); si.email = newEmail; await kv.set(`session:${tok}`, JSON.stringify(si)); }
  return c.json({ success: true, newEmail });
});

app.post(apiRoute('/profile/change-password-direct'), async (c) => {
  const s = await auth(c);
  if (!s) return c.json({ error: 'Unauthorized' }, 401);
  const { currentPassword, newPassword } = await c.req.json();
  if (!currentPassword || !newPassword) return c.json({ error: 'Passwords required' }, 400);
  if (newPassword.length < 6) return c.json({ error: 'Password too short' }, 400);
  const ud = await kv.get(`user:${s.email}`);
  if (!ud) return c.json({ error: 'User not found' }, 404);
  const u = JSON.parse(ud);
  if (await hash(currentPassword) !== u.passwordHash) return c.json({ error: 'Wrong password' }, 401);
  u.passwordHash = await hash(newPassword);
  await kv.set(`user:${s.email}`, JSON.stringify(u));
  return c.json({ success: true });
});

app.get(apiRoute('/progress'), async (c) => {
  const s = await auth(c);
  if (!s) return c.json({ error: 'Unauthorized' }, 401);
  const pd = await kv.get(`progress:${s.userId}`);
  if (!pd) return c.json({ progress: { level: 0, totalXP: 0, sectionXP: { beginner: 0, intermediate: 0, professional: 0 } } });
  const p = JSON.parse(pd);
  if (!p.sectionXP) p.sectionXP = { beginner: 0, intermediate: 0, professional: 0 };
  return c.json({ progress: p });
});

app.put(apiRoute('/progress'), async (c) => {
  const s = await auth(c);
  if (!s) return c.json({ error: 'Unauthorized' }, 401);
  const pd = await c.req.json();
  await kv.set(`progress:${s.userId}`, JSON.stringify(pd));
  return c.json({ progress: pd });
});

app.get(apiRoute('/islands'), async (c) => {
  const s = await auth(c);
  if (!s) return c.json({ error: 'Unauthorized' }, 401);
  if (await isAdm(s.userId)) {
    const all: Record<string, string> = {};
    ['beginner', 'intermediate', 'professional'].forEach(l => { for (let i = 1; i <= 13; i++) all[`${l}-${i}`] = 'unlocked'; });
    return c.json({ islands: all });
  }
  const id = await kv.get(`islands:${s.userId}`);
  return c.json({ islands: id ? JSON.parse(id) : { "beginner-1": "unlocked" } });
});

app.put(apiRoute('/islands'), async (c) => {
  const s = await auth(c);
  if (!s) return c.json({ error: 'Unauthorized' }, 401);
  const id = await c.req.json();
  await kv.set(`islands:${s.userId}`, JSON.stringify(id));
  return c.json({ islands: id });
});

app.get(apiRoute('/exercise-data'), async (c) => {
  const s = await auth(c);
  if (!s) return c.json({ error: 'Unauthorized' }, 401);
  const ed = await kv.get(`exercise-data:${s.userId}`);
  return c.json({ exerciseData: ed ? JSON.parse(ed) : {} });
});

app.put(apiRoute('/exercise-data'), async (c) => {
  const s = await auth(c);
  if (!s) return c.json({ error: 'Unauthorized' }, 401);
  const ed = await c.req.json();
  await kv.set(`exercise-data:${s.userId}`, JSON.stringify(ed));
  return c.json({ exerciseData: ed });
});

app.get(apiRoute('/streak'), async (c) => {
  const s = await auth(c);
  if (!s) return c.json({ error: 'Unauthorized' }, 401);
  const sd = await kv.get(`streak:${s.userId}`), today = day(new Date());
  if (!sd) {
    await kv.set(`streak:${s.userId}`, JSON.stringify({ count: 0, lastIslandCompletedDate: null, activeToday: false }));
    return c.json({ streak: 0, activeToday: false });
  }
  const st = JSON.parse(sd);
  let cnt = st.count || 0;
  const active = st.lastIslandCompletedDate === today;
  if (st.lastIslandCompletedDate && st.lastIslandCompletedDate !== today) {
    const yesterday = day(new Date(Date.now() - 86400000));
    if (st.lastIslandCompletedDate !== yesterday) {
      cnt = 0;
      await kv.set(`streak:${s.userId}`, JSON.stringify({ count: 0, lastIslandCompletedDate: st.lastIslandCompletedDate, activeToday: false }));
    }
  }
  return c.json({ streak: cnt, activeToday: active });
});

app.post(apiRoute('/streak'), async (c) => {
  const s = await auth(c);
  if (!s) return c.json({ error: 'Unauthorized' }, 401);
  const sd = await kv.get(`streak:${s.userId}`), today = day(new Date());
  let st = sd ? JSON.parse(sd) : { count: 0, lastIslandCompletedDate: null, activeToday: false };
  if (st.lastIslandCompletedDate === today) return c.json({ streak: st.count, activeToday: true });
  let newCnt = 1;
  if (st.lastIslandCompletedDate) {
    const yesterday = day(new Date(Date.now() - 86400000));
    if (st.lastIslandCompletedDate === yesterday) newCnt = (st.count || 0) + 1;
  }
  await kv.set(`streak:${s.userId}`, JSON.stringify({ count: newCnt, lastIslandCompletedDate: today, activeToday: true }));
  return c.json({ streak: newCnt, activeToday: true });
});

app.get(apiRoute('/mistakes'), async (c) => {
  const s = await auth(c);
  if (!s) return c.json({ error: 'Unauthorized' }, 401);
  const md = await kv.get(`mistakes:${s.userId}`);
  let m = md ? JSON.parse(md) : {};
  if (Array.isArray(m)) { m = {}; await kv.set(`mistakes:${s.userId}`, JSON.stringify(m)); }
  return c.json({ mistakes: m });
});

app.post(apiRoute('/mistakes'), async (c) => {
  const s = await auth(c);
  if (!s) return c.json({ error: 'Unauthorized' }, 401);
  const { mistakes } = await c.req.json();
  await kv.set(`mistakes:${s.userId}`, JSON.stringify(mistakes || {}));
  return c.json({ mistakes: mistakes || {} });
});

app.delete(apiRoute('/mistakes'), async (c) => {
  const s = await auth(c);
  if (!s) return c.json({ error: 'Unauthorized' }, 401);
  await kv.set(`mistakes:${s.userId}`, JSON.stringify({}));
  return c.json({ success: true });
});

app.get(apiRoute('/admin/check'), async (c) => {
  const s = await auth(c);
  return c.json({ isAdmin: s ? await isAdm(s.userId) : false });
});

app.get(apiRoute('/admin/users'), async (c) => {
  const { err, s } = await admAuth(c);
  if (err) return err;
  
  try {
    const userKeys = await kv.getByPrefix('user:');
    const users = [];
    
    for (const ud of userKeys) {
      try {
        const u = JSON.parse(ud);
        const pd = await kv.get(`profile:${u.userId}`);
        const p = pd ? JSON.parse(pd) : { name: 'Unknown' };
        const prd = await kv.get(`progress:${u.userId}`);
        const pr = prd ? JSON.parse(prd) : { level: 0, totalXP: 0 };
        const sd = await kv.get(`streak:${u.userId}`);
        let st = 0;
        if (sd) { 
          try { 
            st = JSON.parse(sd).count || 0; 
          } catch { 
            st = parseInt(sd) || 0; 
          } 
        }
        users.push({ 
          userId: u.userId, 
          email: u.email, 
          name: p.name, 
          level: pr.level || 0, 
          totalXP: pr.totalXP || 0, 
          streak: st, 
          isAdmin: await isAdm(u.userId), 
          createdAt: u.createdAt 
        });
      } catch {
      }
    }
    
    return c.json({ users });
  } catch (error) {
    return c.json({ error: 'Failed to fetch users', details: getErrorMessage(error) }, 500);
  }
});

app.post(apiRoute('/admin/set-admin'), async (c) => {
  const { err } = await admAuth(c);
  if (err) return err;
  const { userId, isAdmin: adm } = await c.req.json();
  await kv.set(`admin:${userId}`, adm ? 'true' : 'false');
  return c.json({ success: true });
});

app.delete(apiRoute('/admin/delete-user'), async (c) => {
  const { err, s } = await admAuth(c);
  if (err) return err;
  const { userId } = await c.req.json();
  if (userId === s!.userId) return c.json({ error: 'Cannot delete self' }, 400);
  const userKeys = await kv.getByPrefix('user:');
  let userEmail = null;
  for (const ud of userKeys) { try { const u = JSON.parse(ud); if (u.userId === userId) { userEmail = u.email; break; } } catch {} }
  if (!userEmail) return c.json({ error: 'User not found' }, 404);
  await kv.del(`user:${userEmail}`);
  await kv.del(`profile:${userId}`);
  await kv.del(`progress:${userId}`);
  await kv.del(`islands:${userId}`);
  await kv.del(`streak:${userId}`);
  await kv.del(`admin:${userId}`);
  await kv.del(`mistakes:${userId}`);
  await kv.del(`exercise-data:${userId}`);
  return c.json({ success: true });
});

app.post(apiRoute('/admin/reset-user-data'), async (c) => {
  const { err } = await admAuth(c);
  if (err) return err;
  const { userId } = await c.req.json();
  await kv.set(`progress:${userId}`, JSON.stringify({ level: 0, totalXP: 0, sectionXP: { beginner: 0, intermediate: 0, professional: 0 } }));
  await kv.set(`islands:${userId}`, JSON.stringify({ 'beginner-1': 'unlocked' }));
  await kv.set(`streak:${userId}`, JSON.stringify({ count: 0, lastActiveDate: null, activeToday: false }));
  await kv.del(`mistakes:${userId}`);
  await kv.del(`exercise-data:${userId}`);
  return c.json({ success: true });
});

app.get(apiRoute('/island-image/:level/:theme'), async (c) => {
  const lvl = c.req.param('level'), thm = c.req.param('theme');
  const img = await kv.get(`island-image:${lvl}-${thm}`);
  if (!img) return c.json({ hasCustomImage: false, imageUrl: null });
  const { imageUrl, uploadedAt, uploadedBy } = JSON.parse(img);
  return c.json({ hasCustomImage: true, imageUrl, uploadedAt, uploadedBy });
});

app.post(apiRoute('/admin/island-image'), async (c) => {
  const { err, s } = await admAuth(c);
  if (err) return err;
  const fd = await c.req.formData();
  const lvl = fd.get('level'), thm = fd.get('theme'), imgf = fd.get('image');
  if (!lvl || !thm || !imgf) return c.json({ error: 'Missing fields' }, 400);
  const su = Deno.env.get('SUPABASE_URL'), sk = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!su || !sk) return c.json({ error: 'Config error' }, 500);
  const sb = createClient(su, sk);
  const bn = STORAGE_BUCKET_NAME, ik = `${lvl}-${thm}`, fn = `${ik}-${Date.now()}.${imgf.name.split('.').pop()}`;
  const ab = await imgf.arrayBuffer();
  const { error: upe } = await sb.storage.from(bn).upload(fn, new Uint8Array(ab), { contentType: imgf.type, upsert: false });
  if (upe) return c.json({ error: upe.message }, 500);
  const { data: ud, error: ure } = await sb.storage.from(bn).createSignedUrl(fn, 31536000);
  if (ure) return c.json({ error: ure.message }, 500);
  await kv.set(`island-image:${ik}`, JSON.stringify({ imageUrl: ud.signedUrl, fileName: fn, bucketName: bn, uploadedAt: new Date().toISOString(), uploadedBy: s!.email }));
  return c.json({ success: true, imageUrl: ud.signedUrl });
});

app.delete(apiRoute('/admin/island-image/:level/:theme'), async (c) => {
  const { err } = await admAuth(c);
  if (err) return err;
  const lvl = c.req.param('level'), thm = c.req.param('theme'), ik = `${lvl}-${thm}`;
  const img = await kv.get(`island-image:${ik}`);
  if (!img) return c.json({ error: 'Not found' }, 404);
  const metadata = JSON.parse(img);
  const { fileName } = metadata;
  const su = Deno.env.get('SUPABASE_URL'), sk = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (su && sk) {
    const sb = createClient(su, sk);
    await sb.storage.from(resolveBucketName(metadata)).remove([fileName]);
  }
  await kv.del(`island-image:${ik}`);
  return c.json({ success: true });
});

app.post(apiRoute('/admin/content-image'), async (c) => {
  const { err, s } = await admAuth(c);
  if (err) return err;
  const fd = await c.req.formData();
  const lvl = fd.get('level'), thm = fd.get('theme'), idx = fd.get('imageIndex'), imgf = fd.get('image');
  if (!lvl || !thm || !idx || !imgf) return c.json({ error: 'Missing fields' }, 400);
  const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
  if (!allowed.includes(imgf.type)) return c.json({ error: 'Unsupported format' }, 400);
  const su = Deno.env.get('SUPABASE_URL'), sk = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!su || !sk) return c.json({ error: 'Config error' }, 500);
  const sb = createClient(su, sk);
  const bn = STORAGE_BUCKET_NAME, ck = `${lvl}-${thm}-${idx}`, fn = `content-${ck}-${Date.now()}.${imgf.name.split('.').pop()}`;
  const ab = await imgf.arrayBuffer();
  const { error: upe } = await sb.storage.from(bn).upload(fn, new Uint8Array(ab), { contentType: imgf.type, upsert: false });
  if (upe) return c.json({ error: upe.message }, 500);
  const { data: ud, error: ure } = await sb.storage.from(bn).createSignedUrl(fn, 31536000);
  if (ure) return c.json({ error: ure.message }, 500);
  await kv.set(`content-image:${ck}`, JSON.stringify({ imageUrl: ud.signedUrl, fileName: fn, bucketName: bn, uploadedAt: new Date().toISOString(), uploadedBy: s!.email }));
  return c.json({ success: true, imageUrl: ud.signedUrl });
});

app.get(apiRoute('/admin/content-image/:level/:theme/:imageIndex'), async (c) => {
  try {
    const lvl = c.req.param('level'), thm = c.req.param('theme'), idx = c.req.param('imageIndex');
    const img = await kv.get(`content-image:${lvl}-${thm}-${idx}`);
    if (!img) return c.json({ hasCustomImage: false, imageUrl: null }, 200);
    const pd = JSON.parse(img);
    return c.json({ hasCustomImage: true, imageUrl: pd.imageUrl }, 200);
  } catch { return c.json({ hasCustomImage: false, imageUrl: null }, 200); }
});

app.delete(apiRoute('/admin/content-image/:level/:theme/:imageIndex'), async (c) => {
  const { err } = await admAuth(c);
  if (err) return err;
  const lvl = c.req.param('level'), thm = c.req.param('theme'), idx = c.req.param('imageIndex'), ck = `${lvl}-${thm}-${idx}`;
  const img = await kv.get(`content-image:${ck}`);
  if (!img) return c.json({ error: 'Not found' }, 404);
  const metadata = JSON.parse(img);
  const { fileName } = metadata;
  const su = Deno.env.get('SUPABASE_URL'), sk = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (su && sk) {
    const sb = createClient(su, sk);
    await sb.storage.from(resolveBucketName(metadata)).remove([fileName]);
  }
  await kv.del(`content-image:${ck}`);
  return c.json({ success: true });
});

app.post(apiRoute('/admin/keyword-image'), async (c) => {
  const { err, s } = await admAuth(c);
  if (err) return err;
  const fd = await c.req.formData();
  const lvl = fd.get('level'), thm = fd.get('theme'), idx = fd.get('keywordIndex'), imgf = fd.get('image');
  if (!lvl || !thm || !idx || !imgf) return c.json({ error: 'Missing fields' }, 400);
  const su = Deno.env.get('SUPABASE_URL'), sk = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!su || !sk) return c.json({ error: 'Config error' }, 500);
  const sb = createClient(su, sk);
  const bn = STORAGE_BUCKET_NAME, kk = `keyword-${lvl}-${thm}-${idx}`, fn = `keyword-${kk}-${Date.now()}.${imgf.name.split('.').pop()}`;
  const ab = await imgf.arrayBuffer();
  const { error: upe } = await sb.storage.from(bn).upload(fn, new Uint8Array(ab), { contentType: imgf.type, upsert: false });
  if (upe) return c.json({ error: upe.message }, 500);
  const { data: ud, error: ure } = await sb.storage.from(bn).createSignedUrl(fn, 31536000);
  if (ure) return c.json({ error: ure.message }, 500);
  await kv.set(`keyword-image:${kk}`, JSON.stringify({ imageUrl: ud.signedUrl, fileName: fn, bucketName: bn, uploadedAt: new Date().toISOString(), uploadedBy: s!.email }));
  return c.json({ success: true, imageUrl: ud.signedUrl });
});

app.get(apiRoute('/admin/keyword-image/:level/:theme/:keywordIndex'), async (c) => {
  try {
    const lvl = c.req.param('level'), thm = c.req.param('theme'), idx = c.req.param('keywordIndex');
    const img = await kv.get(`keyword-image:keyword-${lvl}-${thm}-${idx}`);
    if (!img) return c.json({ hasCustomImage: false, imageUrl: null }, 200);
    const pd = JSON.parse(img);
    return c.json({ hasCustomImage: true, imageUrl: pd.imageUrl }, 200);
  } catch { return c.json({ hasCustomImage: false, imageUrl: null }, 200); }
});

app.delete(apiRoute('/admin/keyword-image/:level/:theme/:keywordIndex'), async (c) => {
  const { err } = await admAuth(c);
  if (err) return err;
  const lvl = c.req.param('level'), thm = c.req.param('theme'), idx = c.req.param('keywordIndex'), kk = `keyword-${lvl}-${thm}-${idx}`;
  const img = await kv.get(`keyword-image:${kk}`);
  if (!img) return c.json({ error: 'Not found' }, 404);
  const metadata = JSON.parse(img);
  const { fileName } = metadata;
  const su = Deno.env.get('SUPABASE_URL'), sk = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (su && sk) {
    const sb = createClient(su, sk);
    await sb.storage.from(resolveBucketName(metadata)).remove([fileName]);
  }
  await kv.del(`keyword-image:${kk}`);
  return c.json({ success: true });
});

app.get(apiRoute('/admin/keyword-diagnostics'), async (c) => {
  const { err } = await admAuth(c);
  if (err) return err;
  const allKeys = await kv.getByPrefix('keyword-image:');
  const diag = allKeys.map((entry) => {
    try {
      const parsed = JSON.parse(entry);
      return { key: Object.keys(parsed)[0], data: parsed };
    } catch {
      return { key: 'parse-error', data: entry };
    }
  });
  return c.json({ totalKeys: allKeys.length, keys: diag });
});

app.post(apiRoute('/admin/migrate-storage-to-new-bucket'), async (c) => {
  const { err } = await admAuth(c);
  if (err) return err;

  let body: Record<string, unknown> = {};
  try {
    const parsedBody = await c.req.json();
    if (typeof parsedBody === 'object' && parsedBody !== null) {
      body = parsedBody as Record<string, unknown>;
    }
  } catch {
    body = {};
  }

  const offset = Math.max(0, Number(body?.offset || 0));
  const requestedLimit = Number(body?.limit || 5);
  const limit = Math.min(20, Math.max(1, requestedLimit));

  const su = Deno.env.get('SUPABASE_URL');
  const sk = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!su || !sk) return c.json({ error: 'Config error' }, 500);

  const sb = createClient(su, sk);
  const allEntries = await listImageMetadataEntries();
  const entries = allEntries.slice(offset, offset + limit);

  let migrated = 0;
  let skipped = 0;
  const failures: Array<{ key: string; reason: string }> = [];

  for (const entry of entries) {
    const currentMetadata = await findMetadataByKey(entry.key);
    if (!currentMetadata) {
      skipped += 1;
      failures.push({ key: entry.key, reason: 'metadata-missing' });
      continue;
    }

    const result = await migrateSingleImageMetadata(sb, entry.key, currentMetadata);
    if (result.migrated) {
      migrated += 1;
    } else if (result.reason === 'already-migrated') {
      skipped += 1;
    } else {
      failures.push({ key: entry.key, reason: result.reason });
    }
  }

  return c.json({
    success: failures.length === 0,
    sourceBucketDefault: LEGACY_STORAGE_BUCKET_NAME,
    targetBucket: STORAGE_BUCKET_NAME,
    total: allEntries.length,
    offset,
    limit,
    processed: entries.length,
    nextOffset: offset + entries.length,
    hasMore: offset + entries.length < allEntries.length,
    migrated,
    skipped,
    failed: failures.length,
    failures,
  });
});

app.notFound((c) => c.json({ error: 'Not found', path: new URL(c.req.url).pathname }, 404));

Deno.serve({
  handler: async (req: Request) => {
    try {
      return await app.fetch(req);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Server error', message: getErrorMessage(error) }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
  },
  onError: () => {
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});