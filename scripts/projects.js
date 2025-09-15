// DE-MAJ Architecture - Projects Page Script

import { $, $$, addEvent, addClass, removeClass, ready, debounce, hasClass } from './lib/dom.js';
import { initLightboxes } from './lib/lightbox.js';
import { imageLoader } from './lib/image-loader.js';
// Load projects data asynchronously
let projectsData = [];
import { categories } from './data/categories.js';

class ProjectsPage {
  constructor() {
    this.projects = projectsData;
    this.categories = categories;
    this.currentFilter = 'all';
    this.init();
  }
  
  async init() {
    ready(async () => {
      await this.loadProjectsData();
      this.setupHeader();
      this.loadProjects();
      this.setupMobileMenu();
    });
  }
  
  async loadProjectsData() {
    try {
      console.log('Attempting to load projects data via API with static fallback');
      const isLocal = (location.hostname === 'localhost' || location.hostname === '127.0.0.1');
      const apiUrl = isLocal ? 'http://localhost:5050/api/projects' : '/api/projects';
      let response;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 800);
      try {
        response = await fetch(apiUrl, { cache: 'no-store', signal: controller.signal });
      } catch (e) {
        console.warn('API not reachable or timed out, falling back to static');
      } finally {
        clearTimeout(timeout);
      }
      if (!response || !response.ok) {
        response = await fetch('../scripts/data/projects.json', { cache: 'no-store' });
      }
      console.log('Response status:', response && response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      projectsData = await response.json();
      this.projects = projectsData;
      console.log('Projects data loaded successfully:', projectsData.length, 'projects');
      console.log('First project:', projectsData[0]);
    } catch (error) {
      console.error('Error loading projects data:', error);
      projectsData = [];
      this.projects = [];
    }
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
    
    // Enhanced mobile menu toggle
    addEvent(mobileToggle, 'click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isOpen = hasClass(mobileNav, 'header__mobile-nav--open');
      
      if (isOpen) {
        removeClass(mobileNav, 'header__mobile-nav--open');
        removeClass(mobileToggle, 'header__mobile-toggle--open');
        document.body.style.overflow = '';
        mobileToggle.blur();
      } else {
        addClass(mobileNav, 'header__mobile-nav--open');
        addClass(mobileToggle, 'header__mobile-toggle--open');
        document.body.style.overflow = 'hidden';
        // Focus on first menu item for accessibility
        const firstLink = mobileNav.querySelector('a');
        if (firstLink) {
          setTimeout(() => firstLink.focus(), 100);
        }
      }
    });
    
    // Close mobile menu when clicking on links
    const mobileLinks = $$('.header__mobile-nav a');
    mobileLinks.forEach(link => {
      addEvent(link, 'click', () => {
        removeClass(mobileNav, 'header__mobile-nav--open');
        removeClass(mobileToggle, 'header__mobile-toggle--open');
        document.body.style.overflow = '';
      });
    });
    
    // Close mobile menu when clicking the X button
    const mobileClose = $('#mobile-close');
    if (mobileClose) {
      addEvent(mobileClose, 'click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        removeClass(mobileNav, 'header__mobile-nav--open');
        removeClass(mobileToggle, 'header__mobile-toggle--open');
        document.body.style.overflow = '';
      });
    }
    
    // Close mobile menu when clicking outside
    addEvent(document, 'click', (e) => {
      if (!mobileNav.contains(e.target) && !mobileToggle.contains(e.target)) {
        removeClass(mobileNav, 'header__mobile-nav--open');
        removeClass(mobileToggle, 'header__mobile-toggle--open');
        document.body.style.overflow = '';
      }
    });
    
    // Close mobile menu on escape key
    addEvent(document, 'keydown', (e) => {
      if (e.key === 'Escape' && hasClass(mobileNav, 'header__mobile-nav--open')) {
        removeClass(mobileNav, 'header__mobile-nav--open');
        removeClass(mobileToggle, 'header__mobile-toggle--open');
        document.body.style.overflow = '';
        mobileToggle.focus();
      }
    });
    
    // Handle orientation change
    addEvent(window, 'orientationchange', () => {
      setTimeout(() => {
        if (hasClass(mobileNav, 'header__mobile-nav--open')) {
          removeClass(mobileNav, 'header__mobile-nav--open');
          removeClass(mobileToggle, 'header__mobile-toggle--open');
          document.body.style.overflow = '';
        }
      }, 100);
    });
    
    // Handle window resize
    addEvent(window, 'resize', debounce(() => {
      if (window.innerWidth > 768 && hasClass(mobileNav, 'header__mobile-nav--open')) {
        removeClass(mobileNav, 'header__mobile-nav--open');
        removeClass(mobileToggle, 'header__mobile-toggle--open');
        document.body.style.overflow = '';
      }
    }, 250));
  }
  
  loadProjects() {
    const container = $('#projects-grid');
    const noProjects = $('#no-projects');
    
    console.log('loadProjects called');
    console.log('Container found:', container);
    console.log('No projects element found:', noProjects);
    console.log('Projects data:', this.projects);
    
    if (!container) {
      console.warn('Projects grid container not found');
      return;
    }
    
    // Check if projects data is available
    if (!this.projects || this.projects.length === 0) {
      console.warn('No projects data available');
      container.style.display = 'none';
      if (noProjects) noProjects.style.display = 'flex';
      return;
    }
    
    console.log('Loading projects:', this.projects.length, 'projects');
    
    container.style.display = 'grid';
    if (noProjects) noProjects.style.display = 'none';
    
    // Clear existing content
    container.innerHTML = '';
    
    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    this.projects.forEach((project, index) => {
      const card = document.createElement('div');
      card.className = 'project-card-enhanced';
      card.dataset.projectId = project.id;
      
      // Remove stagger animation for instant render
      card.style.animation = 'none';
      
      // Get category name
      const category = this.getCategoryName(project.categoryId);
      
      card.innerHTML = `
        <div class="project-card-enhanced__image-container" data-edit="image" data-target="project:${project.id}:cover">
          <img src="../${project.cover}" alt="${project.title}" class="project-card-enhanced__image" loading="lazy">
          <div class="project-card-enhanced__overlay">
            <div class="project-card-enhanced__category">${category}</div>
            <div class="project-card-enhanced__actions">
              <button class="project-card-enhanced__view-btn" data-project-id="${project.id}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span data-translate="projects.viewDetails">View Details</span>
              </button>
              <button class="project-card-enhanced__gallery-btn" data-project-id="${project.id}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="2"/>
                  <path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span data-translate="projects.gallery">Gallery</span>
              </button>
            </div>
          </div>
        </div>
        <div class="project-card-enhanced__content">
          <div class="project-card-enhanced__header">
            <h3 class="project-card-enhanced__title" data-edit="text" data-target="project:${project.id}:title">${project.title}</h3>
            <div class="project-card-enhanced__status">${project.status}</div>
          </div>
          <p class="project-card-enhanced__meta" data-edit="text" data-target="project:${project.id}:year">${project.year}</p>
          <p class="project-card-enhanced__description" data-edit="text" data-target="project:${project.id}:description">${project.description || project.short || ''}</p>
          <div class="project-card-enhanced__footer">
            <div class="project-card-enhanced__gallery-count">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="2"/>
                <path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>${project.gallery ? project.gallery.length : 0} <span data-translate="projects.images">Images</span></span>
            </div>
            <div class="project-card-enhanced__arrow">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
          </div>
        </div>
      </div>
      `;
    
    // Add click handlers
      const viewBtn = card.querySelector('.project-card-enhanced__view-btn');
      const galleryBtn = card.querySelector('.project-card-enhanced__gallery-btn');
      
      addEvent(viewBtn, 'click', (e) => {
        e.stopPropagation();
        const projectId = viewBtn.dataset.projectId;
        window.location.href = `${projectId}.html`;
      });
      
      addEvent(galleryBtn, 'click', (e) => {
        e.stopPropagation();
        this.openProjectGallery(project);
      });
      
      addEvent(card, 'click', () => {
        const projectId = card.dataset.projectId;
        window.location.href = `${projectId}.html`;
      });
      
      // Add image loading and error handling
      const img = card.querySelector('.project-card-enhanced__image');
      if (img) {
        // Show immediately; smooth-in handled by browser decoding
        img.decoding = 'async';
        img.style.opacity = '1';
        
        img.addEventListener('error', () => {
          console.warn(`Failed to load image: ${project.cover}`);
          img.src = '../images/hero sectio bg.jpg'; // Fallback image
        });
        
        img.style.transition = 'none';
        
        // Observe image for lazy loading
        imageLoader.observe(img);
      }
      
      fragment.appendChild(card);
    });
    
    container.appendChild(fragment);
    
    // Add the projects-loaded class to trigger animations
    addClass(container, 'projects-loaded');
    
    console.log('Projects HTML inserted, container children:', container.children.length);
    console.log('Container innerHTML length:', container.innerHTML.length);
  }
  
  getCategoryName(categoryId) {
    const categories = {
      '01': 'Master Planning',
      '02': 'Social',
      '03': 'Hotel & Leisure',
      '04': 'Residential',
      '05': 'Commercial',
      '06': 'Transporting'
    };
    return categories[categoryId] || 'Architecture';
  }
  
  openProjectGallery(project) {
    // Create lightbox for project gallery
    if (project.gallery && project.gallery.length > 0) {
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox lightbox--open';
      lightbox.innerHTML = `
        <div class="lightbox__content">
          <img src="../${project.gallery[0]}" alt="${project.title}" class="lightbox__image">
          <button class="lightbox__close">&times;</button>
          <button class="lightbox__nav lightbox__nav--prev">&larr;</button>
          <button class="lightbox__nav lightbox__nav--next">&rarr;</button>
          <div class="lightbox__counter">1 / ${project.gallery.length}</div>
        </div>
      `;
      
      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';
      
      // Add lightbox functionality
      let currentIndex = 0;
      const updateImage = () => {
        const img = lightbox.querySelector('.lightbox__image');
        const counter = lightbox.querySelector('.lightbox__counter');
        img.src = `../${project.gallery[currentIndex]}`;
        counter.textContent = `${currentIndex + 1} / ${project.gallery.length}`;
      };
      
      const closeLightbox = () => {
        document.body.removeChild(lightbox);
        document.body.style.overflow = '';
      };
      
      const showNext = () => {
        currentIndex = (currentIndex + 1) % project.gallery.length;
        updateImage();
      };
      
      const showPrev = () => {
        currentIndex = (currentIndex - 1 + project.gallery.length) % project.gallery.length;
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
  }
  
  
  setupMobileMenu() {
    // Mobile menu functionality is handled in setupHeader
    // This method can be extended for additional mobile-specific functionality
  }
}

// Initialize projects page
const projectsPage = new ProjectsPage();

// Initialize lightboxes
initLightboxes();
