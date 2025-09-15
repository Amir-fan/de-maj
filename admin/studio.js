(function(){
  const qs  = (s, r=document) => r.querySelector(s);
  const qsa = (s, r=document) => Array.from(r.querySelectorAll(s));
  const on  = (el, ev, fn) => el && el.addEventListener(ev, fn);
  const isLocal = (location.hostname === 'localhost' || location.hostname === '127.0.0.1');
  const API_BASE = isLocal ? 'http://localhost:5050' : '';
  const TOKEN_KEY = 'demaj_admin_token';
  const getToken = () => localStorage.getItem(TOKEN_KEY) || '';
  const setToken = (v) => localStorage.setItem(TOKEN_KEY, v || '');
  const auth = () => ({ 'x-admin-token': getToken() });
  const get  = async (url) => (await fetch(API_BASE+url, { cache:'no-store' })).json();
  const post = async (url, body) => (await fetch(API_BASE+url,{ method:'POST', headers:{ 'Content-Type':'application/json', ...auth() }, body: JSON.stringify(body) })).json();
  const put  = async (url, body) => (await fetch(API_BASE+url,{ method:'PUT',  headers:{ 'Content-Type':'application/json', ...auth() }, body: JSON.stringify(body) })).json();
  const del  = async (url) => (await fetch(API_BASE+url,{ method:'DELETE', headers:{ ...auth() } })).json();
  const upload = async (file) => { const fd=new FormData(); fd.append('file', file); const r = await fetch(API_BASE+'/api/upload',{ method:'POST', headers:{ ...auth() }, body: fd }); if(!r.ok) throw new Error('upload failed'); return r.json(); };

  // Auth
  on(qs('#su-login'),'click', async ()=>{
    try {
      const r = await fetch((API_BASE||'')+'/api/login', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ username: qs('#su-user').value||'admin', password: qs('#su-pass').value||'admin123' }) });
      if(!r.ok) throw new Error('bad');
      const { token } = await r.json(); setToken(token); alert('Logged in');
      await Promise.all([loadProjects(), loadAlbums(), loadResumes()]);
      reloadPreview();
    } catch { alert('Invalid credentials'); }
  });
  on(qs('#su-logout'),'click', ()=>{ setToken(''); alert('Logged out'); });

  // Tabs
  qsa('.studio__nav-link').forEach(btn=> on(btn,'click', ()=>{
    const id = btn.getAttribute('data-tab');
    qsa('.studio__nav-link').forEach(b=> b.classList.remove('studio__nav-link--active'));
    btn.classList.add('studio__nav-link--active');
    qsa('.studio__panel').forEach(p=> p.style.display = (p.id===id? 'block':'none'));
  }));

  // Preview controls
  const iframe = qs('#preview');
  // Prefer backend host if reachable; otherwise keep same-origin
  (async function pickPreview(){
    if (!iframe || !isLocal) return;
    try {
      const controller = new AbortController();
      const t = setTimeout(()=>controller.abort(), 600);
      const r = await fetch('http://localhost:5050/api/projects', { cache:'no-store', signal: controller.signal });
      clearTimeout(t);
      if (r && r.ok) iframe.src = 'http://localhost:5050/index.html';
    } catch {}
  })();
  function goto(url){ iframe.src = url; }
  function reloadPreview(){ iframe.contentWindow?.location.reload(); }
  on(qs('#pv-reload'),'click', reloadPreview);
  on(qs('#pv-edit'),'click', ()=>{
    qs('#pv-edit').classList.toggle('active');
    try {
      if (typeof iframe.contentWindow.__DEMAJ_TOGGLE_EDIT === 'function') {
        iframe.contentWindow.__DEMAJ_TOGGLE_EDIT();
      } else {
        // Inject overlay script into the iframe, then toggle
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        const already = doc.querySelector('script[data-overlay]');
        if (!already) {
          const s = doc.createElement('script');
          s.src = '/admin/overlay.js';
          s.setAttribute('data-overlay','1');
          s.onload = () => { try { iframe.contentWindow.__DEMAJ_TOGGLE_EDIT?.(); } catch {} };
          doc.body.appendChild(s);
        } else {
          setTimeout(()=>{ try { iframe.contentWindow.__DEMAJ_TOGGLE_EDIT?.(); } catch {} }, 100);
        }
      }
    } catch {}
  });

  // Save button: inline edits already save on blur; this just confirms and refreshes
  on(qs('#pv-save'),'click', ()=>{
    alert('Saved');
    try { reloadPreview(); } catch {}
  });

  // Projects
  async function loadProjects(){ let items=[]; try{ items=await get('/api/projects'); }catch{} renderProjects(items); }
  function renderProjects(items){ const list = qs('#sp-list'); list.innerHTML=''; items.forEach(p=>{ const row=document.createElement('div'); row.className='row'; row.innerHTML = `<span>${p.slug||p.id}</span><span class="muted">${p.title||''}</span>`; const e=document.createElement('button'); e.className='btn btn--outline'; e.textContent='Edit'; e.onclick=()=>fillProject(p); const d=document.createElement('button'); d.className='btn'; d.textContent='Delete'; d.onclick=async()=>{ if(confirm('Delete project?')){ try{ await del('/api/projects/'+(p.id||p.slug)); await loadProjects(); reloadPreview(); }catch{ alert('Need login to delete'); } } }; row.appendChild(e); row.appendChild(d); list.appendChild(row); }); }
  function fillProject(p={}){ qs('#sp-id').value=p.id||''; qs('#sp-title').value=p.title||''; qs('#sp-slug').value=p.slug||''; qs('#sp-year').value=p.year||''; qs('#sp-category').value=p.categoryId||p.category||''; qs('#sp-cover').value=p.cover||''; qs('#sp-description').value=p.description||p.short||''; qs('#sp-body').value=p.body||''; qs('#sp-gallery').value=JSON.stringify(p.gallery||[]); }
  on(qs('#sp-upload'),'click', async ()=>{ const f=qs('#sp-file').files[0]; if(!f) return; try{ const res=await upload(f); qs('#sp-cover').value=(res.path||'').replace('/public/','public/'); }catch{ alert('Upload failed'); } });
  on(qs('#sp-save'),'click', async ()=>{ const payload={ title:qs('#sp-title').value, slug:qs('#sp-slug').value, year:qs('#sp-year').value, categoryId:qs('#sp-category').value, cover:qs('#sp-cover').value, description:qs('#sp-description').value, body:qs('#sp-body').value, gallery: safeArray(qs('#sp-gallery').value) }; const id=qs('#sp-id').value; try{ if(id) await put('/api/projects/'+id,payload); else { const created=await post('/api/projects',payload); qs('#sp-id').value=created.id; } await loadProjects(); reloadPreview(); alert('Saved'); }catch{ alert('Login required to save'); } });
  on(qs('#sp-clear'),'click', ()=> fillProject({}) );

  // Albums
  async function loadAlbums(){ let items=[]; try{ items=await get('/api/albums'); }catch{} renderAlbums(items); }
  function renderAlbums(items){ const list = qs('#sa-list'); list.innerHTML=''; items.forEach(a=>{ const row=document.createElement('div'); row.className='row'; row.innerHTML = `<span>${a.id}</span><span class="muted">${a.title||''}</span>`; const e=document.createElement('button'); e.className='btn btn--outline'; e.textContent='Edit'; e.onclick=()=>fillAlbum(a); const d=document.createElement('button'); d.className='btn'; d.textContent='Delete'; d.onclick=async()=>{ if(confirm('Delete album?')){ try{ await del('/api/albums/'+a.id); await loadAlbums(); reloadPreview(); }catch{ alert('Need login to delete'); } } }; row.appendChild(e); row.appendChild(d); list.appendChild(row); }); }
  function fillAlbum(a={}){ qs('#sa-id').value=a.id||''; qs('#sa-title').value=a.title||''; qs('#sa-cover').value=a.cover||''; qs('#sa-description').value=a.description||''; qs('#sa-images').value=JSON.stringify(a.images||[]); }
  on(qs('#sa-upload'),'click', async ()=>{ const files=Array.from(qs('#sa-file').files||[]); if(files.length===0) return; const paths=[]; for(const f of files){ try{ const res=await upload(f); paths.push((res.path||'').replace('/public/','public/')); }catch{} } const cur=safeArray(qs('#sa-images').value); qs('#sa-images').value=JSON.stringify(cur.concat(paths)); if(!qs('#sa-cover').value && paths[0]) qs('#sa-cover').value=paths[0]; });
  on(qs('#sa-save'),'click', async ()=>{ const payload={ title:qs('#sa-title').value, cover:qs('#sa-cover').value, description:qs('#sa-description').value, images: safeArray(qs('#sa-images').value) }; const id=qs('#sa-id').value; try{ if(id) await put('/api/albums/'+id,payload); else { const created=await post('/api/albums',payload); qs('#sa-id').value=created.id; } await loadAlbums(); reloadPreview(); alert('Saved'); }catch{ alert('Login required to save'); } });
  on(qs('#sa-clear'),'click', ()=> fillAlbum({}) );

  // Resumes
  async function loadResumes(){ let items=[]; try{ items=await get('/api/resumes'); }catch{} renderResumes(items); }
  function renderResumes(items){ const list=qs('#sr-list'); list.innerHTML=''; items.forEach(r=>{ const row=document.createElement('div'); row.className='row'; row.innerHTML=`<span>${r.id}</span><span class="muted">${r.title||''}</span>`; const e=document.createElement('button'); e.className='btn btn--outline'; e.textContent='Edit'; e.onclick=()=>fillResume(r); const d=document.createElement('button'); d.className='btn'; d.textContent='Delete'; d.onclick=async()=>{ if(confirm('Delete resume?')){ try{ await del('/api/resumes/'+r.id); await loadResumes(); reloadPreview(); }catch{ alert('Need login to delete'); } } }; row.appendChild(e); row.appendChild(d); list.appendChild(row); }); }
  function fillResume(r={}){ qs('#sr-id').value=r.id||''; qs('#sr-title').value=r.title||''; qs('#sr-file').value=r.file||''; }
  on(qs('#sr-upload'),'click', async ()=>{ const f=qs('#sr-file-input').files[0]; if(!f) return; try{ const res=await upload(f); qs('#sr-file').value=(res.path||'').replace('/public/','public/'); }catch{ alert('Upload failed'); } });
  on(qs('#sr-save'),'click', async ()=>{ const payload={ title:qs('#sr-title').value, file:qs('#sr-file').value }; const id=qs('#sr-id').value; try{ if(id) await put('/api/resumes/'+id,payload); else { const created=await post('/api/resumes',payload); qs('#sr-id').value=created.id; } await loadResumes(); reloadPreview(); alert('Saved'); }catch{ alert('Login required to save'); } });
  on(qs('#sr-clear'),'click', ()=> fillResume({}) );

  function safeArray(v){ try{ const x=JSON.parse(v||'[]'); return Array.isArray(x)?x:[]; }catch{return [];} }

  // Initial lists
  Promise.all([loadProjects(), loadAlbums(), loadResumes(), loadTeam(), loadContact()]);

  // Team
  async function loadTeam(){ let items=[]; try{ items=await get('/api/team'); }catch{} renderTeam(items); }
  function renderTeam(items){ const list = qs('#st-list'); if(!list) return; list.innerHTML=''; items.forEach(m=>{ const row=document.createElement('div'); row.className='row'; row.innerHTML = `<span>${m.name||m.id}</span><span class="muted">${m.role||''}</span>`; const e=document.createElement('button'); e.className='btn btn--outline'; e.textContent='Edit'; e.onclick=()=>fillMember(m); const d=document.createElement('button'); d.className='btn'; d.textContent='Delete'; d.onclick=async()=>{ if(confirm('Delete member?')){ try{ await del('/api/team/'+m.id); await loadTeam(); reloadPreview(); }catch{ alert('Need login'); } } }; row.appendChild(e); row.appendChild(d); list.appendChild(row); }); }
  function fillMember(m={}){ qs('#st-id').value=m.id||''; qs('#st-name').value=m.name||''; qs('#st-role').value=m.role||''; qs('#st-photo').value=m.photo||''; qs('#st-bio').value=m.bio||''; qs('#st-cv').value=JSON.stringify(m.cv||[]); }
  on(qs('#st-upload'),'click', async ()=>{ const f=qs('#st-file').files[0]; if(!f) return; try{ const res=await upload(f); qs('#st-photo').value=(res.path||'').replace('/public/','public/'); }catch{ alert('Upload failed'); } });
  on(qs('#st-save'),'click', async ()=>{ const payload={ name:qs('#st-name').value, role:qs('#st-role').value, photo:qs('#st-photo').value, bio:qs('#st-bio').value, cv: safeArray(qs('#st-cv').value) }; const id=qs('#st-id').value; try{ if(id) await put('/api/team/'+id,payload); else { const created=await post('/api/team',payload); qs('#st-id').value=created.id; } await loadTeam(); reloadPreview(); alert('Saved'); }catch{ alert('Login required to save'); } });
  on(qs('#st-clear'),'click', ()=> fillMember({}) );

  // Contact
  async function loadContact(){ try{ const cfg = await get('/api/contact'); fillContact(cfg); }catch{}}
  function fillContact(c={}){ const e=(id,v='')=>{ const el=qs(id); if(el) el.value=v; }; e('#sc-email',c.email||''); e('#sc-phone',c.phone||''); e('#sc-whatsapp',c.whatsapp||''); e('#sc-linkedin',c.linkedin||''); e('#sc-hours',c.hours||''); }
  on(qs('#sc-save'),'click', async ()=>{ try{ const cfg={ email:qs('#sc-email').value, phone:qs('#sc-phone').value, whatsapp:qs('#sc-whatsapp').value, linkedin:qs('#sc-linkedin').value, hours:qs('#sc-hours').value }; await put('/api/contact', cfg); reloadPreview(); alert('Saved'); }catch{ alert('Login required'); } });
})();


