// DE-MAJ Architecture - Catalogue (Albums Gallery)

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

function initMobileMenu() {
  const toggle = $('#mobile-toggle');
  const nav = $('#mobile-nav');
  const closeBtn = $('#mobile-close');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    nav.classList.toggle('header__mobile-nav--open');
    toggle.classList.toggle('header__mobile-toggle--open');
    document.body.style.overflow = nav.classList.contains('header__mobile-nav--open') ? 'hidden' : '';
  });
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nav.classList.remove('header__mobile-nav--open');
      toggle.classList.remove('header__mobile-toggle--open');
      document.body.style.overflow = '';
    });
  }
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('header__mobile-nav--open');
      toggle.classList.remove('header__mobile-toggle--open');
      document.body.style.overflow = '';
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('header__mobile-nav--open')) {
      nav.classList.remove('header__mobile-nav--open');
      toggle.classList.remove('header__mobile-toggle--open');
      document.body.style.overflow = '';
      toggle.focus();
    }
  });
}

async function fetchAlbums() {
  try {
    const api = (location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? 'http://localhost:5050' : '';
    const r = await fetch(api + '/api/albums', { cache: 'no-store' });
    if (!r.ok) throw new Error('api fail');
    return await r.json();
  } catch (e) {
    try {
      const r2 = await fetch('scripts/data/albums.json', { cache: 'no-store' });
      if (!r2.ok) throw new Error('fallback fail');
      return await r2.json();
    } catch {
      return [];
    }
  }
}

function renderAlbums(container, albums) {
  container.innerHTML = '';
  if (!albums.length) {
    container.innerHTML = '<div class="no-projects">No albums yet.</div>';
    return;
  }
  const grid = document.createElement('div');
  grid.className = 'projects-grid';
  albums.forEach(a => {
    const card = document.createElement('div');
    card.className = 'project-card-enhanced';
    card.innerHTML = `
      <div class="project-card-enhanced__image-container">
        <img class="project-card-enhanced__image" src="${a.cover || (a.images && a.images[0]) || ''}" alt="${a.title||''}">
        <div class="project-card-enhanced__overlay">
          <div class="project-card-enhanced__category">Album</div>
          <div class="project-card-enhanced__actions">
            <button class="project-card-enhanced__view-btn" data-album="${a.id}">Open</button>
          </div>
        </div>
      </div>
      <div class="project-card-enhanced__content">
        <div class="project-card-enhanced__header">
          <h3 class="project-card-enhanced__title">${a.title||'Untitled Album'}</h3>
        </div>
        <div class="project-card-enhanced__description">${a.description||''}</div>
      </div>
    `;
    grid.appendChild(card);
  });
  container.appendChild(grid);

  container.addEventListener('click', e => {
    const btn = e.target.closest('[data-album]');
    if (!btn) return;
    const id = btn.getAttribute('data-album');
    const album = albums.find(x=>String(x.id)===String(id));
    if (!album) return;
    openAlbumLightbox(album);
  });
}

function openAlbumLightbox(album){
  let overlay = document.querySelector('.project-gallery-lightbox');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'project-gallery-lightbox active';
    overlay.innerHTML = `
      <div class="gallery-lightbox__overlay"></div>
      <div class="gallery-lightbox__container">
        <button class="gallery-lightbox__close" aria-label="Close">×</button>
        <div class="gallery-lightbox__content">
          <div class="gallery-lightbox__image-container">
            <img class="gallery-lightbox__image" alt="" />
          </div>
          <div class="gallery-lightbox__info">
            <div class="gallery-lightbox__counter"><span class="cur">1</span><span class="gallery-lightbox__separator">/</span><span class="total">1</span></div>
            <div class="gallery-lightbox__thumbnails"></div>
          </div>
        </div>
        <div class="gallery-lightbox__navigation">
          <button class="gallery-lightbox__prev" aria-label="Previous">◀</button>
          <button class="gallery-lightbox__next" aria-label="Next">▶</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  }

  const img = overlay.querySelector('.gallery-lightbox__image');
  const curEl = overlay.querySelector('.cur');
  const totEl = overlay.querySelector('.total');
  const thumbs = overlay.querySelector('.gallery-lightbox__thumbnails');
  let idx = 0;
  const imgs = Array.isArray(album.images) ? album.images : [];
  const update = () => {
    img.src = imgs[idx] || '';
    curEl.textContent = String(idx+1);
    totEl.textContent = String(imgs.length || 0);
    thumbs.querySelectorAll('.gallery-thumbnail').forEach((t,i)=>t.classList.toggle('active', i===idx));
  };
  thumbs.innerHTML = '';
  imgs.forEach((src,i)=>{
    const b = document.createElement('button'); b.className = 'gallery-thumbnail';
    b.innerHTML = `<img src="${src}" alt="">`;
    b.onclick = () => { idx=i; update(); };
    thumbs.appendChild(b);
  });
  idx = 0; update();
  overlay.classList.add('active');
  overlay.querySelector('.gallery-lightbox__close').onclick = () => overlay.classList.remove('active');
  overlay.querySelector('.gallery-lightbox__prev').onclick = () => { if(idx>0){ idx--; update(); }};
  overlay.querySelector('.gallery-lightbox__next').onclick = () => { if(idx<imgs.length-1){ idx++; update(); }};
}

document.addEventListener('DOMContentLoaded', async () => {
  initMobileMenu();
  const container = document.getElementById('file-list');
  const albums = await fetchAlbums();
  renderAlbums(container, albums);
});
