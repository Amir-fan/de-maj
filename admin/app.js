// DE-MAJ Admin - Live Preview Editor

(function(){
  const qs  = (s, r=document) => r.querySelector(s);
  const qsa = (s, r=document) => Array.from(r.querySelectorAll(s));
  const on  = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);

  // API base detection (same-origin in prod, localhost in dev)
  const isLocal = (location.hostname === 'localhost' || location.hostname === '127.0.0.1');
  const API_BASE = isLocal ? 'http://localhost:5050' : '';

  // Auth token storage
  const TOKEN_KEY = 'demaj_admin_token';
  const getToken = () => localStorage.getItem(TOKEN_KEY) || '';
  const setToken = (v) => localStorage.setItem(TOKEN_KEY, v || '');

  // Simple helpers
  const authHeaders = () => ({ 'x-admin-token': getToken() });
  const get = async (url) => (await fetch(API_BASE+url, { cache:'no-store' })).json();
  const post = async (url, body) => (await fetch(API_BASE+url, { method:'POST', headers:{ 'Content-Type':'application/json', ...authHeaders() }, body: JSON.stringify(body) })).json();
  const put  = async (url, body) => (await fetch(API_BASE+url, { method:'PUT',  headers:{ 'Content-Type':'application/json', ...authHeaders() }, body: JSON.stringify(body) })).json();
  const del  = async (url) => (await fetch(API_BASE+url, { method:'DELETE', headers:{ ...authHeaders() } })).json();
  const upload = async (file) => {
    const fd = new FormData(); fd.append('file', file);
    const r = await fetch(API_BASE+'/api/upload',{ method:'POST', headers:{ ...authHeaders() }, body: fd });
    if(!r.ok) throw new Error('upload failed');
    return r.json();
  };

  // Fallback loaders (read-only) if API fails
  const fallbackProjects = async () => (await fetch('../scripts/data/projects.json', { cache:'no-store' })).json();
  const fallbackAlbums   = async () => (await fetch('../scripts/data/albums.json',   { cache:'no-store' })).json();
  const fallbackResumes  = async () => (await fetch('../scripts/data/resumes.json',  { cache:'no-store' })).json();

  // Login
  function bindAuthBar(){
    const username = qs('#username');
    const password = qs('#password');
    const loginBtn = qs('#login');
    const logoutBtn= qs('#logout');
    const apiUrlEl = qs('#api-url');
    if (apiUrlEl) apiUrlEl.textContent = API_BASE || '(same-origin)';

    on(loginBtn, 'click', async () => {
      try {
        const r = await fetch((API_BASE||'')+'/api/login', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ username: username.value, password: password.value }) });
        if(!r.ok) throw new Error('Login failed');
        const { token } = await r.json();
        setToken(token);
        await Promise.all([loadProjects(), loadAlbums(), loadResumes()]);
        alert('Logged in');
      } catch(e){ alert('Invalid credentials'); }
    });
    on(logoutBtn, 'click', () => { setToken(''); alert('Logged out'); });
  }

  // PROJECTS
  async function loadProjects(){
    let items = [];
    try { items = await get('/api/projects'); } catch { try { items = await fallbackProjects(); } catch { items = []; } }
    renderProjectsList(items);
  }

  function projectFromForm(){
    return {
      id: qs('#p-id').value || undefined,
      title: qs('#p-title').value,
      slug: qs('#p-slug').value,
      year: qs('#p-year').value,
      categoryId: qs('#p-category').value,
      cover: qs('#p-cover').value,
      description: qs('#p-description').value,
      body: qs('#p-body').value,
      gallery: safeParseArray(qs('#p-gallery').value)
    };
  }

  function fillProjectForm(p={}){
    qs('#p-id').value = p.id||'';
    qs('#p-title').value = p.title||'';
    qs('#p-slug').value = p.slug||'';
    qs('#p-year').value = p.year||'';
    qs('#p-category').value = p.categoryId||p.category||'';
    qs('#p-cover').value = p.cover||'';
    qs('#p-description').value = p.description||p.short||'';
    qs('#p-body').value = p.body||'';
    qs('#p-gallery').value = JSON.stringify(p.gallery||[]);
    renderProjectPreview(projectFromForm());
  }

  function renderProjectsList(items){
    const list = qs('#projects-list');
    if (!list) return;
    list.innerHTML = '';
    items.forEach(p => {
      const row = document.createElement('div');
      row.className = 'row';
      row.innerHTML = `<span class="monospace">${p.slug||p.id}</span> <span class="muted">${p.title||''}</span>`;
      const edit = document.createElement('button'); edit.className='btn btn--outline'; edit.textContent='Edit';
      edit.onclick = () => fillProjectForm(p);
      const delBtn = document.createElement('button'); delBtn.className='btn'; delBtn.textContent='Delete';
      delBtn.onclick = async () => { if(confirm('Delete project?')){ try{ await del('/api/projects/'+(p.id||p.slug)); await loadProjects(); }catch{ alert('API not available'); } } };
      row.appendChild(edit); row.appendChild(delBtn); list.appendChild(row);
    });
  }

  function renderProjectPreview(p){
    const preview = qs('#project-preview');
    if (!preview) return;
    const categoryName = getCategoryName(p.categoryId);
    preview.innerHTML = `
      <div class="project-card" style="max-width:640px;">
        <div class="project-card__image-container">
          <img src="${p.cover||''}" alt="${p.title||''}" class="project-card__image" onerror="this.src='../images/hero sectio bg.jpg'">
          <div class="project-card__overlay project-card__overlay--bar">
            <div class="project-card__content" style="display:grid;gap:8px;grid-template-columns:1fr auto;align-items:center;">
              <div>
                <h3 class="project-card__title" style="margin:0 0 4px;">${p.title||''}</h3>
                <p class="project-card__description" style="margin:0;">${p.description||''}</p>
              </div>
            </div>
            <div class="project-card__actions">
              <span class="btn btn--outline">${p.year||''}</span>
              <span class="btn btn--outline">${categoryName}</span>
            </div>
          </div>
        </div>
      </div>`;
  }

  function getCategoryName(id){
    const map = { '01':'Master Planning','02':'Social','03':'Hotel & Leisure','04':'Residential','05':'Commercial','06':'Transporting' };
    return map[id] || 'Category';
  }

  function bindProjectForm(){
    const inputs = ['#p-title','#p-slug','#p-year','#p-category','#p-cover','#p-description','#p-body','#p-gallery'].map(s=>qs(s));
    inputs.forEach(i=> on(i,'input', ()=> renderProjectPreview(projectFromForm())) );
    const saveBtn = qs('#p-save');
    const clearBtn= qs('#p-clear');
    const uploadBtn= qs('#p-upload');

    on(uploadBtn,'click', async ()=>{
      const f = qs('#p-file').files[0]; if(!f) return;
      try { const res = await upload(f); qs('#p-cover').value = (res.path||'').replace('/public/','public/'); renderProjectPreview(projectFromForm()); } catch { alert('Upload failed'); }
    });

    on(saveBtn,'click', async ()=>{
      const data = projectFromForm();
      try {
        if (data.id) await put('/api/projects/'+data.id, data); else { const created = await post('/api/projects', data); qs('#p-id').value = created.id; }
        await loadProjects();
        alert('Saved');
      } catch { alert('API not available'); }
    });

    on(clearBtn,'click', ()=> fillProjectForm({}) );
  }

  // ALBUMS (Catalogue)
  async function loadAlbums(){
    let items = [];
    try { items = await get('/api/albums'); } catch { try { items = await fallbackAlbums(); } catch { items = []; } }
    renderAlbumsList(items);
  }
  function albumFromForm(){
    return {
      id: qs('#a-id').value || undefined,
      title: qs('#a-title').value,
      description: qs('#a-description').value,
      cover: qs('#a-cover').value,
      images: safeParseArray(qs('#a-images').value)
    };
  }
  function fillAlbumForm(a={}){
    qs('#a-id').value = a.id||'';
    qs('#a-title').value = a.title||'';
    qs('#a-description').value = a.description||'';
    qs('#a-cover').value = a.cover||'';
    qs('#a-images').value = JSON.stringify(a.images||[]);
    renderAlbumPreview(albumFromForm());
  }
  function renderAlbumsList(items){
    const list = qs('#albums-list'); if(!list) return; list.innerHTML='';
    items.forEach(a=>{
      const row = document.createElement('div'); row.className='row';
      row.innerHTML = `<span class="monospace">${a.id}</span> <span class="muted">${a.title||''}</span>`;
      const edit = document.createElement('button'); edit.className='btn btn--outline'; edit.textContent='Edit'; edit.onclick=()=>fillAlbumForm(a);
      const delBtn = document.createElement('button'); delBtn.className='btn'; delBtn.textContent='Delete'; delBtn.onclick=async()=>{ if(confirm('Delete album?')){ try{ await del('/api/albums/'+a.id); await loadAlbums(); }catch{ alert('API not available'); } } };
      row.appendChild(edit); row.appendChild(delBtn); list.appendChild(row);
    });
  }
  function renderAlbumPreview(a){
    const preview = qs('#album-preview'); if(!preview) return;
    const images = (a.images||[]).map(src=>`<img src="${src}" alt="${a.title}" style="width:96px;height:64px;object-fit:cover;border-radius:6px">`).join('');
    preview.innerHTML = `
      <div class="card" style="max-width:640px;">
        <img class="card__image" src="${a.cover||''}" onerror="this.src='../images/hero sectio bg.jpg'">
        <div class="card__content">
          <h3 class="card__title">${a.title||''}</h3>
          <p class="card__description">${a.description||''}</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap">${images}</div>
        </div>
      </div>`;
  }
  function bindAlbumForm(){
    const inputs = ['#a-title','#a-description','#a-cover','#a-images'].map(s=>qs(s));
    inputs.forEach(i=> on(i,'input', ()=> renderAlbumPreview(albumFromForm())) );
    on(qs('#a-upload'),'click', async ()=>{
      const files = Array.from(qs('#a-file').files||[]); if(files.length===0) return;
      const paths = [];
      for (const f of files){ try{ const res=await upload(f); paths.push((res.path||'').replace('/public/','public/')); }catch{} }
      const cur = safeParseArray(qs('#a-images').value);
      qs('#a-images').value = JSON.stringify(cur.concat(paths));
      if(!qs('#a-cover').value && paths[0]) qs('#a-cover').value = paths[0];
      renderAlbumPreview(albumFromForm());
    });
    on(qs('#a-save'),'click', async ()=>{
      const data = albumFromForm();
      try { if(data.id) await put('/api/albums/'+data.id, data); else { const created = await post('/api/albums', data); qs('#a-id').value = created.id; } await loadAlbums(); alert('Saved'); } catch { alert('API not available'); }
    });
    on(qs('#a-clear'),'click', ()=> fillAlbumForm({}) );
  }

  // RESUMES
  async function loadResumes(){
    let items = [];
    try { items = await get('/api/resumes'); } catch { try { items = await fallbackResumes(); } catch { items = []; } }
    renderResumesList(items);
  }
  function resumeFromForm(){
    return { id: qs('#r-id').value || undefined, title: qs('#r-title').value, file: qs('#r-file').value };
  }
  function fillResumeForm(r={}){
    qs('#r-id').value = r.id||'';
    qs('#r-title').value = r.title||'';
    qs('#r-file').value = r.file||'';
    renderResumePreview(resumeFromForm());
  }
  function renderResumesList(items){
    const list = qs('#resumes-list'); if(!list) return; list.innerHTML='';
    items.forEach(r=>{
      const row = document.createElement('div'); row.className='row';
      row.innerHTML = `<span class="monospace">${r.id}</span> <span class="muted">${r.title||''}</span>`;
      const edit=document.createElement('button'); edit.className='btn btn--outline'; edit.textContent='Edit'; edit.onclick=()=>fillResumeForm(r);
      const delBtn=document.createElement('button'); delBtn.className='btn'; delBtn.textContent='Delete'; delBtn.onclick=async()=>{ if(confirm('Delete resume?')){ try{ await del('/api/resumes/'+r.id); await loadResumes(); }catch{ alert('API not available'); } } };
      row.appendChild(edit); row.appendChild(delBtn); list.appendChild(row);
    });
  }
  function renderResumePreview(r){
    const preview = qs('#resume-preview'); if(!preview) return;
    const link = r.file ? `<a class="btn btn--primary" href="${r.file}" target="_blank">Download</a>` : '';
    preview.innerHTML = `
      <div class="card" style="max-width:640px;">
        <div class="card__content">
          <h3 class="card__title">${r.title||'Resume / Profile'}</h3>
          <p class="card__description">Upload a PDF or document; link appears below.</p>
          ${link}
        </div>
      </div>`;
  }
  function bindResumeForm(){
    on(qs('#r-upload'),'click', async ()=>{
      const f = qs('#r-file-input').files[0]; if(!f) return;
      try { const res = await upload(f); qs('#r-file').value = (res.path||'').replace('/public/','public/'); renderResumePreview(resumeFromForm()); } catch { alert('Upload failed'); }
    });
    on(qs('#r-save'),'click', async ()=>{
      const data = resumeFromForm();
      try { if(data.id) await put('/api/resumes/'+data.id, data); else { const created = await post('/api/resumes', data); qs('#r-id').value = created.id; } await loadResumes(); alert('Saved'); } catch { alert('API not available'); }
    });
    on(qs('#r-clear'),'click', ()=> fillResumeForm({}) );
  }

  function safeParseArray(v){ try{ const x = JSON.parse(v||'[]'); return Array.isArray(x)?x:[]; }catch{ return []; } }

  function bindTabs(){
    qsa('[data-tab]').forEach(btn=> on(btn,'click', ()=>{
      const id = btn.getAttribute('data-tab');
      qsa('.admin-tab').forEach(s=> s.style.display = (s.id===id? 'block':'none'));
      qsa('[data-tab]').forEach(b=> b.classList.remove('admin__nav-link--active'));
      btn.classList.add('admin__nav-link--active');
    }));
  }

  // Boot
  function init(){
    bindAuthBar();
    bindTabs();
    bindProjectForm();
    bindAlbumForm();
    bindResumeForm();
    Promise.all([loadProjects(), loadAlbums(), loadResumes()]);
  }

  document.addEventListener('DOMContentLoaded', init);
})();



