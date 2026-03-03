// @ts-nocheck
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from 'npm:@supabase/supabase-js@2';

const app = new Hono();

const hash = async (plainText: string) => {
  const bytes = new TextEncoder().encode(plainText);
  const digest = await crypto.subtle.digest('SHA-256', bytes);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

const getTok = (context: any) =>
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

const auth = async (context: any) => {
  const token = getTok(context);
  if (!token) {
    return null;
  }

  return await valSess(token);
};

const admAuth = async (context: any) => {
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
      console.log('[STORAGE] Skipping bucket initialization - missing credentials');
      return;
    }
    
    const storageClient = createClient(supabaseUrl, serviceRoleKey);
    const bucketName = 'make-15e718fc-island-images';
    
    // Skontrolujeme ci bucket existuje
    const { data: buckets } = await storageClient.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log('[STORAGE] Creating bucket:', bucketName);
      const { error } = await storageClient.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 5242880 // 5MB limit
      });
      
      if (error) {
        console.error('[STORAGE] Failed to create bucket:', error.message);
      } else {
        console.log('[STORAGE] Bucket created successfully');
      }
    } else {
      console.log('[STORAGE] Bucket already exists');
    }
  } catch (error) {
    console.error('[STORAGE] Error during storage initialization:', error);
  }
};

// Spustime inicializaciu storage (non-blocking)
initStorage().catch((error) => console.error('[STORAGE] Init failed:', error));

app.use('*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowHeaders: ['Content-Type', 'Authorization', 'apikey', 'X-Session-Token'], credentials: true }));
app.use('*', logger());
app.onError((err, c) => {
  console.error('[ERROR]', err?.message || 'Unknown error', err?.stack);
  return c.json({ error: err?.message || 'Internal server error' }, 500);
});
app.options('*', (c) => c.text('', 204));

app.get('/make-server-15e718fc/health', (c) => c.json({ status: 'ok' }));

app.post('/make-server-15e718fc/auth/signup', async (c) => {
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

app.post('/make-server-15e718fc/auth/signin', async (c) => {
  const { email, password } = await c.req.json();
  const ud = await kv.get(`user:${email}`);
  if (!ud) return c.json({ error: 'Invalid credentials' }, 401);
  const u = JSON.parse(ud);
  if (await hash(password) !== u.passwordHash) return c.json({ error: 'Invalid credentials' }, 401);
  const tok = crypto.randomUUID();
  await kv.set(`session:${tok}`, JSON.stringify({ userId: u.userId, email: u.email, createdAt: new Date().toISOString() }));
  return c.json({ accessToken: tok, user: { id: u.userId, email: u.email } });
});

app.get('/make-server-15e718fc/auth/session', async (c) => {
  const s = await auth(c);
  return s ? c.json({ session: { user: { id: s.userId, email: s.email } } }) : c.json({ session: null }, 401);
});

app.post('/make-server-15e718fc/auth/signout', async (c) => {
  const t = getTok(c);
  if (t) await kv.del(`session:${t}`);
  return c.json({ success: true });
});

app.get('/make-server-15e718fc/profile', async (c) => {
  const s = await auth(c);
  if (!s) return c.json({ error: 'Unauthorized' }, 401);
  const pd = await kv.get(`profile:${s.userId}`);
  return c.json({ profile: pd ? JSON.parse(pd) : { name: s.email.split('@')[0], email: s.email, profilePicture: '' } });
});

app.put('/make-server-15e718fc/profile', async (c) => {
  const s = await auth(c);
  if (!s) return c.json({ error: 'Unauthorized' }, 401);
  const pd = await c.req.json();
  await kv.set(`profile:${s.userId}`, JSON.stringify(pd));
  return c.json({ profile: pd });
});

app.post('/make-server-15e718fc/profile/change-email-direct', async (c) => {
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

app.post('/make-server-15e718fc/profile/change-password-direct', async (c) => {
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

app.get('/make-server-15e718fc/progress', async (c) => {
  const s = await auth(c);
  if (!s) return c.json({ error: 'Unauthorized' }, 401);
  const pd = await kv.get(`progress:${s.userId}`);
  if (!pd) return c.json({ progress: { level: 0, totalXP: 0, sectionXP: { beginner: 0, intermediate: 0, professional: 0 } } });
  const p = JSON.parse(pd);
  if (!p.sectionXP) p.sectionXP = { beginner: 0, intermediate: 0, professional: 0 };
  return c.json({ progress: p });
});

app.put('/make-server-15e718fc/progress', async (c) => {
  const s = await auth(c);
  if (!s) return c.json({ error: 'Unauthorized' }, 401);
  const pd = await c.req.json();
  await kv.set(`progress:${s.userId}`, JSON.stringify(pd));
  return c.json({ progress: pd });
});

app.get('/make-server-15e718fc/islands', async (c) => {
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

app.put('/make-server-15e718fc/islands', async (c) => {
  const s = await auth(c);
  if (!s) return c.json({ error: 'Unauthorized' }, 401);
  const id = await c.req.json();
  await kv.set(`islands:${s.userId}`, JSON.stringify(id));
  return c.json({ islands: id });
});

app.get('/make-server-15e718fc/exercise-data', async (c) => {
  const s = await auth(c);
  if (!s) return c.json({ error: 'Unauthorized' }, 401);
  const ed = await kv.get(`exercise-data:${s.userId}`);
  return c.json({ exerciseData: ed ? JSON.parse(ed) : {} });
});

app.put('/make-server-15e718fc/exercise-data', async (c) => {
  const s = await auth(c);
  if (!s) return c.json({ error: 'Unauthorized' }, 401);
  const ed = await c.req.json();
  await kv.set(`exercise-data:${s.userId}`, JSON.stringify(ed));
  return c.json({ exerciseData: ed });
});

app.get('/make-server-15e718fc/streak', async (c) => {
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

app.post('/make-server-15e718fc/streak', async (c) => {
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

app.get('/make-server-15e718fc/mistakes', async (c) => {
  const s = await auth(c);
  if (!s) return c.json({ error: 'Unauthorized' }, 401);
  const md = await kv.get(`mistakes:${s.userId}`);
  let m = md ? JSON.parse(md) : {};
  if (Array.isArray(m)) { m = {}; await kv.set(`mistakes:${s.userId}`, JSON.stringify(m)); }
  return c.json({ mistakes: m });
});

app.post('/make-server-15e718fc/mistakes', async (c) => {
  const s = await auth(c);
  if (!s) return c.json({ error: 'Unauthorized' }, 401);
  const { mistakes } = await c.req.json();
  await kv.set(`mistakes:${s.userId}`, JSON.stringify(mistakes || {}));
  return c.json({ mistakes: mistakes || {} });
});

app.delete('/make-server-15e718fc/mistakes', async (c) => {
  const s = await auth(c);
  if (!s) return c.json({ error: 'Unauthorized' }, 401);
  await kv.set(`mistakes:${s.userId}`, JSON.stringify({}));
  return c.json({ success: true });
});

app.get('/make-server-15e718fc/admin/check', async (c) => {
  const s = await auth(c);
  return c.json({ isAdmin: s ? await isAdm(s.userId) : false });
});

app.get('/make-server-15e718fc/admin/users', async (c) => {
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
      } catch (e) {
        console.error('Error processing user:', e);
      }
    }
    
    return c.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return c.json({ error: 'Failed to fetch users', details: error.message }, 500);
  }
});

app.post('/make-server-15e718fc/admin/set-admin', async (c) => {
  const { err } = await admAuth(c);
  if (err) return err;
  const { userId, isAdmin: adm } = await c.req.json();
  await kv.set(`admin:${userId}`, adm ? 'true' : 'false');
  return c.json({ success: true });
});

app.delete('/make-server-15e718fc/admin/delete-user', async (c) => {
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

app.post('/make-server-15e718fc/admin/reset-user-data', async (c) => {
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

app.get('/make-server-15e718fc/island-image/:level/:theme', async (c) => {
  const lvl = c.req.param('level'), thm = c.req.param('theme');
  const img = await kv.get(`island-image:${lvl}-${thm}`);
  if (!img) return c.json({ hasCustomImage: false, imageUrl: null });
  const { imageUrl, uploadedAt, uploadedBy } = JSON.parse(img);
  return c.json({ hasCustomImage: true, imageUrl, uploadedAt, uploadedBy });
});

app.post('/make-server-15e718fc/admin/island-image', async (c) => {
  const { err, s } = await admAuth(c);
  if (err) return err;
  const fd = await c.req.formData();
  const lvl = fd.get('level'), thm = fd.get('theme'), imgf = fd.get('image');
  if (!lvl || !thm || !imgf) return c.json({ error: 'Missing fields' }, 400);
  const su = Deno.env.get('SUPABASE_URL'), sk = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!su || !sk) return c.json({ error: 'Config error' }, 500);
  const sb = createClient(su, sk);
  const bn = 'make-15e718fc-island-images', ik = `${lvl}-${thm}`, fn = `${ik}-${Date.now()}.${imgf.name.split('.').pop()}`;
  const ab = await imgf.arrayBuffer();
  const { error: upe } = await sb.storage.from(bn).upload(fn, new Uint8Array(ab), { contentType: imgf.type, upsert: false });
  if (upe) return c.json({ error: upe.message }, 500);
  const { data: ud, error: ure } = await sb.storage.from(bn).createSignedUrl(fn, 31536000);
  if (ure) return c.json({ error: ure.message }, 500);
  await kv.set(`island-image:${ik}`, JSON.stringify({ imageUrl: ud.signedUrl, fileName: fn, uploadedAt: new Date().toISOString(), uploadedBy: s!.email }));
  return c.json({ success: true, imageUrl: ud.signedUrl });
});

app.delete('/make-server-15e718fc/admin/island-image/:level/:theme', async (c) => {
  const { err } = await admAuth(c);
  if (err) return err;
  const lvl = c.req.param('level'), thm = c.req.param('theme'), ik = `${lvl}-${thm}`;
  const img = await kv.get(`island-image:${ik}`);
  if (!img) return c.json({ error: 'Not found' }, 404);
  const { fileName } = JSON.parse(img);
  const su = Deno.env.get('SUPABASE_URL'), sk = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (su && sk) { const sb = createClient(su, sk); await sb.storage.from('make-15e718fc-island-images').remove([fileName]); }
  await kv.del(`island-image:${ik}`);
  return c.json({ success: true });
});

app.post('/make-server-15e718fc/admin/content-image', async (c) => {
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
  const bn = 'make-15e718fc-island-images', ck = `${lvl}-${thm}-${idx}`, fn = `content-${ck}-${Date.now()}.${imgf.name.split('.').pop()}`;
  const ab = await imgf.arrayBuffer();
  const { error: upe } = await sb.storage.from(bn).upload(fn, new Uint8Array(ab), { contentType: imgf.type, upsert: false });
  if (upe) return c.json({ error: upe.message }, 500);
  const { data: ud, error: ure } = await sb.storage.from(bn).createSignedUrl(fn, 31536000);
  if (ure) return c.json({ error: ure.message }, 500);
  await kv.set(`content-image:${ck}`, JSON.stringify({ imageUrl: ud.signedUrl, fileName: fn, uploadedAt: new Date().toISOString(), uploadedBy: s!.email }));
  return c.json({ success: true, imageUrl: ud.signedUrl });
});

app.get('/make-server-15e718fc/admin/content-image/:level/:theme/:imageIndex', async (c) => {
  try {
    const lvl = c.req.param('level'), thm = c.req.param('theme'), idx = c.req.param('imageIndex');
    const img = await kv.get(`content-image:${lvl}-${thm}-${idx}`);
    if (!img) return c.json({ hasCustomImage: false, imageUrl: null }, 200);
    const pd = JSON.parse(img);
    return c.json({ hasCustomImage: true, imageUrl: pd.imageUrl }, 200);
  } catch { return c.json({ hasCustomImage: false, imageUrl: null }, 200); }
});

app.delete('/make-server-15e718fc/admin/content-image/:level/:theme/:imageIndex', async (c) => {
  const { err } = await admAuth(c);
  if (err) return err;
  const lvl = c.req.param('level'), thm = c.req.param('theme'), idx = c.req.param('imageIndex'), ck = `${lvl}-${thm}-${idx}`;
  const img = await kv.get(`content-image:${ck}`);
  if (!img) return c.json({ error: 'Not found' }, 404);
  const { fileName } = JSON.parse(img);
  const su = Deno.env.get('SUPABASE_URL'), sk = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (su && sk) { const sb = createClient(su, sk); await sb.storage.from('make-15e718fc-island-images').remove([fileName]); }
  await kv.del(`content-image:${ck}`);
  return c.json({ success: true });
});

app.post('/make-server-15e718fc/admin/keyword-image', async (c) => {
  const { err, s } = await admAuth(c);
  if (err) return err;
  const fd = await c.req.formData();
  const lvl = fd.get('level'), thm = fd.get('theme'), idx = fd.get('keywordIndex'), imgf = fd.get('image');
  if (!lvl || !thm || !idx || !imgf) return c.json({ error: 'Missing fields' }, 400);
  const su = Deno.env.get('SUPABASE_URL'), sk = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!su || !sk) return c.json({ error: 'Config error' }, 500);
  const sb = createClient(su, sk);
  const bn = 'make-15e718fc-island-images', kk = `keyword-${lvl}-${thm}-${idx}`, fn = `keyword-${kk}-${Date.now()}.${imgf.name.split('.').pop()}`;
  const ab = await imgf.arrayBuffer();
  const { error: upe } = await sb.storage.from(bn).upload(fn, new Uint8Array(ab), { contentType: imgf.type, upsert: false });
  if (upe) return c.json({ error: upe.message }, 500);
  const { data: ud, error: ure } = await sb.storage.from(bn).createSignedUrl(fn, 31536000);
  if (ure) return c.json({ error: ure.message }, 500);
  await kv.set(`keyword-image:${kk}`, JSON.stringify({ imageUrl: ud.signedUrl, fileName: fn, uploadedAt: new Date().toISOString(), uploadedBy: s!.email }));
  return c.json({ success: true, imageUrl: ud.signedUrl });
});

app.get('/make-server-15e718fc/admin/keyword-image/:level/:theme/:keywordIndex', async (c) => {
  try {
    const lvl = c.req.param('level'), thm = c.req.param('theme'), idx = c.req.param('keywordIndex');
    const img = await kv.get(`keyword-image:keyword-${lvl}-${thm}-${idx}`);
    if (!img) return c.json({ hasCustomImage: false, imageUrl: null }, 200);
    const pd = JSON.parse(img);
    return c.json({ hasCustomImage: true, imageUrl: pd.imageUrl }, 200);
  } catch { return c.json({ hasCustomImage: false, imageUrl: null }, 200); }
});

app.delete('/make-server-15e718fc/admin/keyword-image/:level/:theme/:keywordIndex', async (c) => {
  const { err } = await admAuth(c);
  if (err) return err;
  const lvl = c.req.param('level'), thm = c.req.param('theme'), idx = c.req.param('keywordIndex'), kk = `keyword-${lvl}-${thm}-${idx}`;
  const img = await kv.get(`keyword-image:${kk}`);
  if (!img) return c.json({ error: 'Not found' }, 404);
  const { fileName } = JSON.parse(img);
  const su = Deno.env.get('SUPABASE_URL'), sk = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (su && sk) { const sb = createClient(su, sk); await sb.storage.from('make-15e718fc-island-images').remove([fileName]); }
  await kv.del(`keyword-image:${kk}`);
  return c.json({ success: true });
});

app.get('/make-server-15e718fc/admin/keyword-diagnostics', async (c) => {
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

app.notFound((c) => c.json({ error: 'Not found', path: new URL(c.req.url).pathname }, 404));

Deno.serve({
  handler: async (req: Request) => {
    try {
      return await app.fetch(req);
    } catch (error) {
      console.error('[SERVER ERROR]', error);
      return new Response(
        JSON.stringify({ error: 'Server error', message: error.message }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
  },
  onError: (error) => {
    console.error('[DENO SERVE ERROR]', error);
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});