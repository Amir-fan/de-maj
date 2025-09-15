import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const webRoot = path.resolve(projectRoot, '..');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Config
const DATA_DIR = path.join(webRoot, 'scripts', 'data');
const PUBLIC_DIR = path.join(webRoot, 'public');
const SCRIPTS_DIR = path.join(webRoot, 'scripts');
const ADMIN_DIR = path.join(webRoot, 'admin');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
const PROJECTS_JSON = path.join(DATA_DIR, 'projects.json');
const ALBUMS_JSON = path.join(DATA_DIR, 'albums.json');
const RESUMES_JSON = path.join(DATA_DIR, 'resumes.json');
const TEAM_JSON = path.join(DATA_DIR, 'team.json');
const CONTACT_JSON = path.join(DATA_DIR, 'contact.json');

await fs.ensureDir(DATA_DIR);
await fs.ensureDir(PUBLIC_DIR);
await fs.ensureDir(UPLOADS_DIR);
// Ensure seed files exist
await Promise.all([
  fs.pathExists(TEAM_JSON).then(exists => exists || fs.writeFile(TEAM_JSON, '[]', 'utf8')),
  fs.pathExists(CONTACT_JSON).then(exists => exists || fs.writeFile(CONTACT_JSON, JSON.stringify({
    email: 'mushtaqshahad59@gmail.com',
    phone: '+90 553 706 28 64',
    whatsapp: 'https://wa.me/905537062864',
    linkedin: 'https://linkedin.com/in/shahad-al-majeed',
    hours: 'Monday - Friday: 9:00 AM - 6:00 PM'
  }, null, 2), 'utf8'))
]);

// Admin auth disabled: allow all edits without login
const requireAdmin = (req, res, next) => {
  next();
};

// Simple login with username/password to obtain admin token
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = process.env.ADMIN_TOKEN || 'changeme-dev-token';
    return res.json({ token });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

// Storage for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${nanoid(6)}${ext}`);
  }
});
const upload = multer({ storage });

// Helpers
const readJson = async (file, fallback = []) => {
  try {
    const exists = await fs.pathExists(file);
    if (!exists) return fallback;
    const raw = await fs.readFile(file, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return fallback;
  }
};
const writeJson = async (file, data) => {
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
};

// Projects API
app.get('/api/projects', async (req, res) => {
  const items = await readJson(PROJECTS_JSON, []);
  res.json(items);
});

app.post('/api/projects', requireAdmin, async (req, res) => {
  const items = await readJson(PROJECTS_JSON, []);
  const id = nanoid(8);
  const now = new Date().toISOString();
  const item = { id, createdAt: now, updatedAt: now, ...req.body };
  items.push(item);
  await writeJson(PROJECTS_JSON, items);
  res.status(201).json(item);
});

app.put('/api/projects/:id', requireAdmin, async (req, res) => {
  const items = await readJson(PROJECTS_JSON, []);
  const idx = items.findIndex(p => p.id === req.params.id || p.slug === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  items[idx] = { ...items[idx], ...req.body, updatedAt: new Date().toISOString() };
  await writeJson(PROJECTS_JSON, items);
  res.json(items[idx]);
});

app.delete('/api/projects/:id', requireAdmin, async (req, res) => {
  const items = await readJson(PROJECTS_JSON, []);
  const next = items.filter(p => (p.id !== req.params.id && p.slug !== req.params.id));
  await writeJson(PROJECTS_JSON, next);
  res.json({ ok: true });
});

// Image upload
app.post('/api/upload', requireAdmin, upload.single('file'), async (req, res) => {
  const rel = path.posix.join('uploads', path.basename(req.file.path));
  res.json({ path: `/public/${rel}`, url: `/public/${rel}` });
});

// Albums (Catalogue replacement as admin-managed folders)
app.get('/api/albums', async (req, res) => {
  const items = await readJson(ALBUMS_JSON, []);
  res.json(items);
});

app.post('/api/albums', requireAdmin, async (req, res) => {
  const items = await readJson(ALBUMS_JSON, []);
  const id = nanoid(8);
  const now = new Date().toISOString();
  const album = { id, createdAt: now, updatedAt: now, title: '', description: '', cover: '', images: [], ...req.body };
  items.push(album);
  await writeJson(ALBUMS_JSON, items);
  res.status(201).json(album);
});

app.put('/api/albums/:id', requireAdmin, async (req, res) => {
  const items = await readJson(ALBUMS_JSON, []);
  const idx = items.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  items[idx] = { ...items[idx], ...req.body, updatedAt: new Date().toISOString() };
  await writeJson(ALBUMS_JSON, items);
  res.json(items[idx]);
});

app.delete('/api/albums/:id', requireAdmin, async (req, res) => {
  const items = await readJson(ALBUMS_JSON, []);
  const next = items.filter(a => a.id !== req.params.id);
  await writeJson(ALBUMS_JSON, next);
  res.json({ ok: true });
});

// Resumes API
app.get('/api/resumes', async (req, res) => {
  const items = await readJson(RESUMES_JSON, []);
  res.json(items);
});

app.post('/api/resumes', requireAdmin, async (req, res) => {
  const items = await readJson(RESUMES_JSON, []);
  const id = nanoid(8);
  const now = new Date().toISOString();
  const resume = { id, createdAt: now, updatedAt: now, title: '', file: '', ...req.body };
  items.push(resume);
  await writeJson(RESUMES_JSON, items);
  res.status(201).json(resume);
});

app.put('/api/resumes/:id', requireAdmin, async (req, res) => {
  const items = await readJson(RESUMES_JSON, []);
  const idx = items.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  items[idx] = { ...items[idx], ...req.body, updatedAt: new Date().toISOString() };
  await writeJson(RESUMES_JSON, items);
  res.json(items[idx]);
});

app.delete('/api/resumes/:id', requireAdmin, async (req, res) => {
  const items = await readJson(RESUMES_JSON, []);
  const next = items.filter(r => r.id !== req.params.id);
  await writeJson(RESUMES_JSON, next);
  res.json({ ok: true });
});

// Team API (Our Team page)
app.get('/api/team', async (req, res) => {
  const items = await readJson(TEAM_JSON, []);
  res.json(items);
});

app.post('/api/team', requireAdmin, async (req, res) => {
  const items = await readJson(TEAM_JSON, []);
  const id = nanoid(8);
  const now = new Date().toISOString();
  const member = { id, createdAt: now, updatedAt: now, name: '', role: '', photo: '', bio: '', cv: [], ...req.body };
  items.push(member);
  await writeJson(TEAM_JSON, items);
  res.status(201).json(member);
});

app.put('/api/team/:id', requireAdmin, async (req, res) => {
  const items = await readJson(TEAM_JSON, []);
  const idx = items.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  items[idx] = { ...items[idx], ...req.body, updatedAt: new Date().toISOString() };
  await writeJson(TEAM_JSON, items);
  res.json(items[idx]);
});

app.delete('/api/team/:id', requireAdmin, async (req, res) => {
  const items = await readJson(TEAM_JSON, []);
  const next = items.filter(t => t.id !== req.params.id);
  await writeJson(TEAM_JSON, next);
  res.json({ ok: true });
});

// Contact settings API
app.get('/api/contact', async (req, res) => {
  const cfg = await readJson(CONTACT_JSON, {});
  res.json(cfg);
});

app.put('/api/contact', requireAdmin, async (req, res) => {
  const cfg = { ...await readJson(CONTACT_JSON, {}), ...req.body, updatedAt: new Date().toISOString() };
  await writeJson(CONTACT_JSON, cfg);
  res.json(cfg);
});

// Serve public assets for previewing
app.use('/public', express.static(PUBLIC_DIR));
app.use('/scripts', express.static(SCRIPTS_DIR));
// Serve admin UI from same origin so API base can be blank in production
app.use('/admin', express.static(ADMIN_DIR));
// Serve the site itself for same-origin live preview in the studio
app.use('/', express.static(webRoot));

// Start
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Admin API running on http://localhost:${PORT}`);
});


