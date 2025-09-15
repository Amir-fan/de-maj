(function(){
  const isLocal = (location.hostname==='localhost'||location.hostname==='127.0.0.1');
  const API_BASE = isLocal ? 'http://localhost:5050' : '';
  const TOKEN = '';
  const authHeaders = { 'Content-Type': 'application/json' };

  function createIconButton(label){
    const b = document.createElement('button');
    b.className = 'de-edit-btn';
    b.type = 'button';
    b.textContent = label;
    return b;
  }

  function style(){
    const css = `
    .de-edit-active [data-edit] { outline: 1px dashed rgba(156,192,201,0.8); position: relative; }
    .de-edit-active [data-edit] .de-edit-toolbar { position: absolute; top: 6px; right: 6px; display:flex; gap:6px; z-index: 99999; }
    .de-edit-btn { background: rgba(0,0,0,0.75); color:#fff; border:1px solid rgba(255,255,255,0.25); border-radius: 8px; padding: 4px 8px; font-size: 12px; cursor: pointer; }
    .de-edit-input { position: absolute; inset: 0; width:100%; height:100%; background: rgba(0,0,0,0.6); color:#fff; border:0; padding:12px; font: inherit; display:none; z-index: 99998; }
    .de-edit-upload { display:none; }
    .de-floating { position: fixed; right: 12px; bottom: 12px; display: flex; gap: 8px; z-index: 100000; }
    `;
    const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
  }

  // Lightweight client-side overrides so changes are visible even without backend
  function readOverrides(){ try { return JSON.parse(localStorage.getItem('demaj_overrides')||'{}'); } catch { return {}; } }
  function writeOverrides(o){ try { localStorage.setItem('demaj_overrides', JSON.stringify(o)); } catch {}
  }
  function saveOverride(ns, id, field, value){
    const o = readOverrides();
    if (!o[ns]) o[ns] = {};
    if (!o[ns][id]) o[ns][id] = {};
    o[ns][id][field] = value;
    writeOverrides(o);
  }
  function applyOverrides(root=document){
    const o = readOverrides();
    root.querySelectorAll('[data-edit]')?.forEach(block=>{
      const target = block.getAttribute('data-target')||'';
      if(!target) return;
      const parts = target.split(':');
      const ns = parts[0], id = parts[1], field = parts[2];
      const val = o?.[ns]?.[id]?.[field];
      if (val==null) return;
      const type = block.getAttribute('data-edit');
      if (type==='text') {
        block.innerHTML = String(val).replace(/\n/g,'<br>');
      } else if (type==='image') {
        const img = block.querySelector('img');
        if (img && typeof val === 'string') img.src = val;
        // Gallery array support when block points to gallery and has index
        const gIdx = block.getAttribute('data-gallery-index');
        if (gIdx!==null && Array.isArray(val)) {
          const idx = parseInt(gIdx,10);
          if (!isNaN(idx) && typeof val[idx] === 'string' && img) img.src = val[idx];
        }
      }
    });
  }

  async function apiGet(url){ const r = await fetch(API_BASE+url,{cache:'no-store'}); return r.ok? r.json(): null; }
  async function apiPut(url, body){ const r = await fetch(API_BASE+url,{ method:'PUT', headers: authHeaders, body: JSON.stringify(body)}); if(!r.ok) throw new Error('save failed'); return r.json(); }
  async function apiPost(url, body){ const r = await fetch(API_BASE+url,{ method:'POST', headers: authHeaders, body: JSON.stringify(body)}); if(!r.ok) throw new Error('create failed'); return r.json(); }
  async function apiDel(url){ const r = await fetch(API_BASE+url,{ method:'DELETE', headers: TOKEN? {'x-admin-token':TOKEN}: {} }); if(!r.ok) throw new Error('delete failed'); return r.json(); }

  async function uploadFile(file){ const fd = new FormData(); fd.append('file', file); const r = await fetch(API_BASE+'/api/upload', { method:'POST', body: fd }); if(!r.ok) throw new Error('upload failed'); return r.json(); }

  function enhanceEditable(root=document){
    root.querySelectorAll('[data-edit]')?.forEach(block=>{
      if(block.querySelector(':scope > .de-edit-toolbar')) return;
      const tb = document.createElement('div'); tb.className = 'de-edit-toolbar';
      const type = block.getAttribute('data-edit');
      if(type==='text'){
        const edit = createIconButton('✎');
        edit.onclick = ()=> inlineTextEdit(block);
        tb.appendChild(edit);
      }
      if(type==='image'){
        const cam = createIconButton('📷');
        cam.onclick = ()=> inlineImageReplace(block);
        tb.appendChild(cam);
      }
      block.appendChild(tb);
    });

    if (location.pathname.endsWith('/projects/') || /\/projects\/?$/.test(location.pathname)){
      installProjectsControls();
    }
    if (location.pathname.endsWith('/catalogue.html')){
      installAlbumControls();
    }
    if (/\/projects\/.+\.html$/.test(location.pathname)){
      installProjectDetailControls();
    }
    // Apply local overrides so user sees changes even without backend
    applyOverrides(root);
  }

  async function inlineTextEdit(block){
    const original = block.textContent;
    let input = block.querySelector(':scope > .de-edit-input');
    if(!input){ input = document.createElement('textarea'); input.className = 'de-edit-input'; block.appendChild(input); }
    input.value = original.trim(); input.style.display='block'; input.focus();
    input.onblur = async ()=>{
      input.style.display='none';
      const text = input.value.trim();
      if(text===original.trim()) return;
      block.innerHTML = text.replace(/\n/g,'<br>');
      const target = block.getAttribute('data-target')||'';
      try {
        await persistChange(target, text);
        const [ns,id,field] = target.split(':'); saveOverride(ns,id,field,text);
        toast('Saved');
      } catch {
        const [ns,id,field] = target.split(':'); saveOverride(ns,id,field,text);
        toast('Save failed');
      }
    };
  }

  async function inlineImageReplace(block){
    let picker = block.querySelector(':scope > .de-edit-upload');
    if(!picker){ picker = document.createElement('input'); picker.type='file'; picker.accept='image/*'; picker.className='de-edit-upload'; block.appendChild(picker); }
    picker.click();
    picker.onchange = async ()=>{
      const file = picker.files && picker.files[0]; if(!file) return;
      try{
        const res = await uploadFile(file);
        const url = (res.path||'').replace('/public/','public/');
        const img = block.querySelector('img'); if(img){ img.src = url; }
        const target = block.getAttribute('data-target')||'';
        const galleryIndex = block.getAttribute('data-gallery-index');
        if (target.startsWith('project:') && galleryIndex !== null){
          const parts = target.split(':');
          const pid = parts[1];
          const idx = parseInt(galleryIndex||'-1',10);
          if (!isNaN(idx) && idx >= 0){
            const items = await apiGet('/api/projects') || [];
            const proj = items.find(p => p.id===pid || p.slug===pid);
            if (proj){
              const gal = Array.isArray(proj.gallery) ? proj.gallery.slice() : [];
              gal[idx] = url;
              try { await apiPut('/api/projects/'+(proj.id||pid), { gallery: gal }); }
              catch {}
              saveOverride('project', (proj.id||pid), 'gallery', gal);
            }
          }
        } else {
          try { await persistChange(target, url); }
          finally {
            const [ns,id,field] = target.split(':'); saveOverride(ns,id,field,url);
          }
        }
        toast('Image updated');
      }catch{ toast('Upload failed'); }
    };
  }

  async function persistChange(target, value){
    const parts = (target||'').split(':');
    const ns = parts[0];
    if(ns==='contact'){
      const current = await apiGet('/api/contact') || {};
      current[parts[1]] = value;
      return apiPut('/api/contact', current);
    }
    if(ns==='team'){
      const id = parts[1]; const field = parts[2];
      return apiPut('/api/team/'+id, { [field]: value });
    }
    if(ns==='project'){
      const id = parts[1]; const field = parts[2];
      // Allow slug as id: resolve to real id
      const items = await apiGet('/api/projects') || [];
      const proj = items.find(p=>String(p.id)===id || String(p.slug)===id);
      const pid = proj ? proj.id : id;
      return apiPut('/api/projects/'+pid, { [field]: value });
    }
    if(ns==='site'){
      return Promise.resolve();
    }
  }

  async function installProjectsControls(){
    if(document.querySelector('.de-floating')) return;
    const bar = document.createElement('div'); bar.className='de-floating';
    const add = createIconButton('+ Project'); add.onclick = async ()=>{
      const title = prompt('Project title'); if(!title) return;
      try { const created = await apiPost('/api/projects', { title, slug: title.toLowerCase().replace(/[^a-z0-9]+/g,'-'), year: new Date().getFullYear().toString(), categoryId: '04', cover: '', description: '' }); toast('Created '+(created.slug||created.id)); location.reload(); } catch{ toast('Login to create'); }
    };
    const del = createIconButton('Delete Project'); del.onclick = async ()=>{
      const id = prompt('Enter project id or slug to delete'); if(!id) return;
      try { await apiDel('/api/projects/'+id); toast('Deleted'); location.reload(); } catch{ toast('Login to delete'); }
    };
    bar.appendChild(add); bar.appendChild(del); document.body.appendChild(bar);
  }

  async function installAlbumControls(){
    if(document.querySelector('.de-floating.album')) return;
    const bar = document.createElement('div'); bar.className='de-floating album';
    const add = createIconButton('+ Album'); add.onclick = async ()=>{
      const title = prompt('Album title'); if(!title) return;
      try { await apiPost('/api/albums', { title, description: '', cover: '', images: [] }); toast('Album created'); location.reload(); } catch{ toast('Login to create'); }
    };
    const del = createIconButton('Delete Album'); del.onclick = async ()=>{
      const id = prompt('Enter album id to delete'); if(!id) return;
      try { await apiDel('/api/albums/'+id); toast('Album deleted'); location.reload(); } catch{ toast('Login to delete'); }
    };
    bar.appendChild(add); bar.appendChild(del); document.body.appendChild(bar);
  }

  async function installProjectDetailControls(){
    if(document.querySelector('.de-floating.pdetail')) return;
    const bar = document.createElement('div'); bar.className='de-floating pdetail';
    const addImg = createIconButton('+ Image'); addImg.onclick = async ()=>{
      const slug = (location.pathname.split('/').pop()||'').replace('.html','');
      const picker = document.createElement('input'); picker.type='file'; picker.accept='image/*'; picker.onchange = async ()=>{
        const f = picker.files && picker.files[0]; if(!f) return;
        try{ const up = await uploadFile(f); const url = (up.path||'').replace('/public/','public/'); const items = await apiGet('/api/projects')||[]; const proj = items.find(p=>p.id===slug||p.slug===slug); if(!proj) return; const gal = Array.isArray(proj.gallery)? proj.gallery.slice(): []; gal.push(url); await apiPut('/api/projects/'+(proj.id||slug), { gallery: gal }); toast('Image added'); location.reload(); }catch{ toast('Login to add'); }
      }; picker.click();
    };
    const rmImg = createIconButton('Remove Image'); rmImg.onclick = async ()=>{
      const idxStr = prompt('Index to remove (0-based)'); const idx = parseInt(idxStr||'-1',10); if(isNaN(idx)||idx<0) return;
      const slug = (location.pathname.split('/').pop()||'').replace('.html','');
      try{ const items = await apiGet('/api/projects')||[]; const proj = items.find(p=>p.id===slug||p.slug===slug); if(!proj) return; const gal = Array.isArray(proj.gallery)? proj.gallery.slice(): []; if(idx>=gal.length) return toast('Invalid index'); gal.splice(idx,1); await apiPut('/api/projects/'+(proj.id||slug), { gallery: gal }); toast('Image removed'); location.reload(); }catch{ toast('Login to remove'); }
    };
    bar.appendChild(addImg); bar.appendChild(rmImg); document.body.appendChild(bar);
  }

  function toast(msg){
    try { window.top?.postMessage({ type:'toast', msg }, '*'); } catch{}
    const t = document.createElement('div'); t.style.cssText='position:fixed;left:50%;top:12px;transform:translateX(-50%);background:rgba(0,0,0,.8);color:#fff;padding:8px 12px;border-radius:8px;z-index:100001;font-size:13px'; t.textContent=msg; document.body.appendChild(t); setTimeout(()=>t.remove(),2000);
  }

  function mount(){ document.documentElement.classList.add('de-edit-active'); style(); enhanceEditable(); }
  function unmount(){ document.documentElement.classList.remove('de-edit-active'); document.querySelectorAll('.de-edit-toolbar,.de-edit-input,.de-edit-upload,.de-floating').forEach(el=>el.remove()); }
  window.__DEMAJ_TOGGLE_EDIT = ()=>{
    if(document.documentElement.classList.contains('de-edit-active')){ unmount(); } else { mount(); }
  };

  if(location.hash.includes('edit=1')){ mount(); }
})();
