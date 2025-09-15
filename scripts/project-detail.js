// DE-MAJ Architecture - Project Detail Page Script

import { $, $$, addEvent, addClass, removeClass, ready, debounce, hasClass } from './lib/dom.js';
import { initLightboxes } from './lib/lightbox.js';
// Load projects data dynamically
let projectsData = [];
import { categories } from './data/categories.js';

class ProjectDetailPage {
  constructor() {
    this.projects = [];
    this.categories = categories;
    this.currentProject = null;
    this.currentIndex = 0;
    // Initialize immediately - loadProjectsData will be called in loadProject if needed
    this.init();
  }
  
  async loadProjectsData() {
    try {
      let response;
      const isLocal = (location.hostname === 'localhost' || location.hostname === '127.0.0.1');
      const apiUrl = isLocal ? 'http://localhost:5050/api/projects' : '/api/projects';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 800);
      try {
        response = await fetch(apiUrl, { cache: 'no-store', signal: controller.signal });
      } catch (e) {
        console.warn('API not reachable or timed out, using static JSON');
      } finally {
        clearTimeout(timeout);
      }

      if (!response || !response.ok) {
        // Try relative path first (if script is under /projects/)
        try { response = await fetch('./data/projects.json', { cache: 'no-store' }); } catch {}
      }
      if (!response || !response.ok) {
        response = await fetch('../scripts/data/projects.json', { cache: 'no-store' });
      }

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      projectsData = await response.json();
      this.projects = projectsData;
      console.log('Projects data loaded:', this.projects.length, 'projects');
    } catch (error) {
      console.error('Error loading projects data:', error);
      this.projects = [];
    }
  }
  
  async init() {
    ready(async () => {
      this.setupHeader();
      await this.loadProject();
      this.setupNavigation();
      this.setupMobileMenu();
    });
  }
  
  setupHeader() {
    const header = $('#header');
    const mobileToggle = $('#mobile-toggle');
    const mobileNav = $('#mobile-nav');
    
    // Header scroll effect with better performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
      if (window.scrollY > 100) {
        addClass(header, 'header--solid');
      } else {
        removeClass(header, 'header--solid');
      }
          ticking = false;
        });
        ticking = true;
      }
    };
    
    addEvent(window, 'scroll', handleScroll, { passive: true });
    
    // Mobile menu toggle
    addEvent(mobileToggle, 'click', () => {
      const isOpen = hasClass(mobileToggle, 'header__mobile-toggle--open');
      
      if (isOpen) {
        removeClass(mobileToggle, 'header__mobile-toggle--open');
        removeClass(mobileNav, 'header__mobile-nav--open');
      } else {
        addClass(mobileToggle, 'header__mobile-toggle--open');
        addClass(mobileNav, 'header__mobile-nav--open');
      }
    });
    
    // Close mobile menu when clicking outside
    addEvent(document, 'click', (e) => {
      if (!mobileNav.contains(e.target) && !mobileToggle.contains(e.target)) {
        removeClass(mobileToggle, 'header__mobile-toggle--open');
        removeClass(mobileNav, 'header__mobile-nav--open');
      }
    });
  }
  
  async loadProject() {
    // Ensure projects data is loaded
    if (this.projects.length === 0) {
      await this.loadProjectsData();
    }
    
    // Get project slug from URL
    const pathParts = window.location.pathname.split('/');
    const projectSlug = pathParts[pathParts.length - 1].replace('.html', '');
    
    console.log('Current URL:', window.location.href);
    console.log('Path parts:', pathParts);
    console.log('Looking for project with slug:', projectSlug);
    console.log('Available projects:', this.projects.map(p => ({ id: p.id, slug: p.slug })));
    console.log('Projects data loaded:', this.projects.length > 0);
    
    // Find project by slug or id
    this.currentProject = this.projects.find(project => 
      project.slug === projectSlug || project.id === projectSlug
    );
    
    if (!this.currentProject) {
      console.error('Project not found for slug:', projectSlug);
      this.showError('Project not found');
      return;
    }
    
    console.log('Found project:', this.currentProject.title);
    console.log('Project cover image:', this.currentProject.cover);
    console.log('Project gallery images:', this.currentProject.gallery);
    
    this.currentIndex = this.projects.findIndex(project => project.id === this.currentProject.id);
    
    this.updateProjectInfo();
    this.loadSections();
    this.loadGallery();
  }
  
  updateProjectInfo() {
    const project = this.currentProject;
    const category = this.categories.find(cat => cat.id === project.categoryId);
    
    // Update page title and meta
    document.title = `${project.title} - DE-MAJ Architecture`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content = project.description || project.short || '';
    }
    
    // Update hero section
    const heroImage = $('#project-hero-image');
    const projectTitle = $('#project-title');
    const projectMeta = $('#project-meta');
    const projectYear = $('#project-year');
    const projectLocation = $('#project-location');
    const projectCategory = $('#project-category');
    
    if (heroImage) {
      heroImage.src = `../${project.cover}`;
      console.log('Setting hero image to:', `../${project.cover}`);
      
      // Add error handling for hero image
      heroImage.addEventListener('error', () => {
        console.error('Failed to load hero image:', `../${project.cover}`);
        heroImage.src = '../images/hero sectio bg.jpg'; // Fallback image
      });
      
      heroImage.addEventListener('load', () => {
        console.log('Hero image loaded successfully');
      });
    }
    if (projectTitle) projectTitle.textContent = project.title;
    if (projectYear) projectYear.textContent = project.year;
    if (projectLocation) projectLocation.textContent = '';
    if (projectCategory) projectCategory.textContent = category ? category.title : '';
    if (projectMeta) {
      projectMeta.innerHTML = `${project.year} • ${category ? category.title : ''}`;
    }
    
    // Update breadcrumb
    const breadcrumbProject = $('#breadcrumb-project');
    if (breadcrumbProject) breadcrumbProject.textContent = project.title;
    
    // Update project description
    const projectDescription = $('#project-description');
    if (projectDescription) {
      projectDescription.innerHTML = project.body || project.description || '';
    }
    
    // Update sidebar info
    const projectApproach = $('#project-approach');
    const projectYearInfo = $('#project-year-info');
    const projectLocationInfo = $('#project-location-info');
    const projectNameInfo = $('#project-name-info');
    
    if (projectApproach) projectApproach.textContent = project.approach;
    if (projectYearInfo) projectYearInfo.textContent = project.year;
    if (projectLocationInfo) projectLocationInfo.textContent = '';
    if (projectNameInfo) projectNameInfo.textContent = project.title;
  }
  
  loadSections() {
    const sectionsList = $('#sections-list');
    if (!sectionsList) return;
    
    sectionsList.innerHTML = this.categories.map(category => {
      const isActive = category.id === this.currentProject.categoryId;
      return `
        <li class="project-sidebar__item">
          <a href="/projects/?category=${category.id}" 
             class="project-sidebar__link ${isActive ? 'project-sidebar__link--active' : ''}">
            ${category.id} ${category.title}
          </a>
        </li>
      `;
    }).join('');
  }
  
  loadGallery() {
    const gallery = $('#project-gallery');
    if (!gallery || !this.currentProject.gallery) return;
    
    // Clear existing gallery content
    gallery.innerHTML = '';
    
    // Create gallery items from project data
    this.currentProject.gallery.forEach((image, index) => {
      const galleryItem = document.createElement('div');
      galleryItem.className = 'gallery__item';
      galleryItem.dataset.index = index;
      
      galleryItem.innerHTML = `
        <div data-edit="image" data-target="project:${this.currentProject.id}:gallery" data-gallery-index="${index}">
          <img src="../${image}" alt="${this.currentProject.title} - Image ${index + 1}" class="gallery__image" loading="lazy">
        </div>
        <div class="gallery__overlay">
          <span class="gallery__icon">🔍</span>
        </div>
      `;
      
      // Add error handling for gallery images
      const galleryImg = galleryItem.querySelector('.gallery__image');
      
      // Set initial loading state
      galleryImg.style.opacity = '0';
      galleryImg.style.transition = 'opacity 0.3s ease';
      
      galleryImg.addEventListener('error', () => {
        console.error('Failed to load gallery image:', `../${image}`);
        galleryImg.src = '../images/hero sectio bg.jpg'; // Fallback image
        galleryImg.style.opacity = '1';
      });
      
      galleryImg.addEventListener('load', () => {
        console.log('Gallery image loaded:', `../${image}`);
        galleryImg.style.opacity = '1';
      });
      
      // Add click handler
      addEvent(galleryItem, 'click', () => {
        this.openLightbox(index);
      });
      
      gallery.appendChild(galleryItem);
    });
    
    // Setup gallery navigation
    this.setupGalleryNavigation();
  }
  
  setupGalleryNavigation() {
    const gallery = $('#project-gallery');
    const prevBtn = $('#gallery-prev');
    const nextBtn = $('#gallery-next');
    
    if (!gallery || !prevBtn || !nextBtn) return;
    
    let currentIndex = 0;
    const itemsPerView = 2;
    const totalItems = this.currentProject.gallery.length;
    const maxIndex = Math.max(0, totalItems - itemsPerView);
    
    const updateGallery = () => {
      const firstItem = gallery.children[0];
      if (!firstItem) return;
      const computed = getComputedStyle(gallery);
      const gap = parseInt(computed.gap) || 24; // fallback 24px
      const itemWidth = firstItem.getBoundingClientRect().width;
      const translateX = -(currentIndex * (itemWidth + gap));
      gallery.style.transform = `translateX(${translateX}px)`;
      
      // Update button states
      prevBtn.disabled = currentIndex <= 0;
      nextBtn.disabled = currentIndex >= maxIndex;
    };
    
    // Initial state
    updateGallery();
    
    // Previous button
    addEvent(prevBtn, 'click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateGallery();
      }
    });
    
    // Next button
    addEvent(nextBtn, 'click', () => {
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateGallery();
      }
    });
    
    // Update on resize (debounced)
    let resizeTimer;
    addEvent(window, 'resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateGallery, 150);
    });
    
    // Keyboard navigation
    const handleKeydown = (e) => {
      if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
        e.preventDefault();
        if (currentIndex > 0) {
          currentIndex--;
          updateGallery();
        }
      } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
        e.preventDefault();
        if (currentIndex < maxIndex) {
          currentIndex++;
          updateGallery();
        }
      }
    };
    
    // Add keyboard listener when gallery is focused
    addEvent(gallery, 'focus', () => {
      document.addEventListener('keydown', handleKeydown);
    });
    
    addEvent(gallery, 'blur', () => {
      document.removeEventListener('keydown', handleKeydown);
    });
    
    // Make gallery focusable
    gallery.setAttribute('tabindex', '0');
  }
  
  openLightbox(startIndex = 0) {
    if (!this.currentProject || !this.currentProject.gallery) return;
    
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox lightbox--open';
    lightbox.innerHTML = `
      <div class="lightbox__content">
        <img src="../${this.currentProject.gallery[startIndex]}" alt="${this.currentProject.title}" class="lightbox__image">
        <button class="lightbox__close">&times;</button>
        <button class="lightbox__nav lightbox__nav--prev">&larr;</button>
        <button class="lightbox__nav lightbox__nav--next">&rarr;</button>
        <div class="lightbox__counter">${startIndex + 1} / ${this.currentProject.gallery.length}</div>
      </div>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Add lightbox functionality
    let currentIndex = startIndex;
    const updateImage = () => {
      const img = lightbox.querySelector('.lightbox__image');
      const counter = lightbox.querySelector('.lightbox__counter');
      img.src = `../${this.currentProject.gallery[currentIndex]}`;
      counter.textContent = `${currentIndex + 1} / ${this.currentProject.gallery.length}`;
    };
    
    const closeLightbox = () => {
      document.body.removeChild(lightbox);
      document.body.style.overflow = '';
    };
    
    const showNext = () => {
      currentIndex = (currentIndex + 1) % this.currentProject.gallery.length;
      updateImage();
    };
    
    const showPrev = () => {
      currentIndex = (currentIndex - 1 + this.currentProject.gallery.length) % this.currentProject.gallery.length;
      updateImage();
    };
    
    // Event listeners
    lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox__nav--next').addEventListener('click', showNext);
    lightbox.querySelector('.lightbox__nav--prev').addEventListener('click', showPrev);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    
    // Keyboard navigation
    const handleKeydown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };
    
    document.addEventListener('keydown', handleKeydown);
    lightbox.addEventListener('remove', () => {
      document.removeEventListener('keydown', handleKeydown);
    });
  }
  
  setupNavigation() {
    const prevLink = $('#prev-project');
    const nextLink = $('#next-project');
    
    if (prevLink) {
      if (this.currentIndex > 0) {
        const prevProject = this.projects[this.currentIndex - 1];
        prevLink.href = `/projects/${prevProject.slug}.html`;
        removeClass(prevLink, 'project-nav__link--disabled');
      } else {
        addClass(prevLink, 'project-nav__link--disabled');
      }
    }
    
    if (nextLink) {
      if (this.currentIndex < this.projects.length - 1) {
        const nextProject = this.projects[this.currentIndex + 1];
        nextLink.href = `/projects/${nextProject.slug}.html`;
        removeClass(nextLink, 'project-nav__link--disabled');
      } else {
        addClass(nextLink, 'project-nav__link--disabled');
      }
    }
  }
  
  showError(message) {
    const main = $('main');
    if (main) {
      main.innerHTML = `
        <section class="section">
          <div class="container">
            <div class="text-center">
              <h1>Project Not Found</h1>
              <p>${message}</p>
              <a href="/projects/" class="btn btn--primary">Back to Projects</a>
            </div>
          </div>
        </section>
      `;
    }
  }
  
  setupMobileMenu() {
    // Mobile menu functionality is handled in setupHeader
    // This method can be extended for additional mobile-specific functionality
  }
}

// Initialize project detail page
const projectDetailPage = new ProjectDetailPage();

// Initialize lightboxes
initLightboxes();
