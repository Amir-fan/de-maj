// DE-MAJ Architecture - Home Page Script

import { $, $$, addEvent, addClass, removeClass, ready, debounce, hasClass } from './lib/dom.js';
import { initLightboxes } from './lib/lightbox.js';
import { imageLoader } from './lib/image-loader.js';
class HomePage {
  constructor() {
    this.projects = [];
    this.loadProjectsData();
    this.init();
  }
  
  async loadProjectsData() {
    try {
      console.log('Starting to load projects data...');
      const isLocal = (location.hostname === 'localhost' || location.hostname === '127.0.0.1');
      const apiUrl = isLocal ? 'http://localhost:5050/api/projects' : '/api/projects';

      // Try API first with a short timeout
      let response;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 800);
      try {
        response = await fetch(apiUrl, { cache: 'no-store', signal: controller.signal });
      } catch (e) {
        console.warn('API not reachable or timed out, using static projects.json');
      } finally {
        clearTimeout(timeout);
      }

      if (!response || !response.ok) {
        response = await fetch('scripts/data/projects.json', { cache: 'no-store' });
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.projects = await response.json();
      console.log('Projects data loaded successfully:', this.projects);
      console.log('Number of projects:', this.projects.length);
      // Reload featured projects after data is loaded
      this.loadFeaturedProjects();
    } catch (error) {
      console.error('Error loading projects data:', error);
      this.projects = [];
      // Still try to load featured projects even if data loading failed
      this.loadFeaturedProjects();
    }
  }
  
  init() {
    ready(() => {
      this.setupHeader();
      this.setupScrollEffects();
      this.setupMobileMenu();
      // Don't call loadFeaturedProjects here - it will be called after data loads
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
  
  loadFeaturedProjects() {
    const container = $('#featured-projects');
    console.log('loadFeaturedProjects called, container:', container);
    console.log('Projects data:', this.projects);
    console.log('Projects length:', this.projects ? this.projects.length : 0);
    
    if (!container) {
      console.warn('Featured projects container not found');
      return;
    }
    
    // Check if projects data is available
    if (!this.projects || this.projects.length === 0) {
      console.warn('No projects data available, showing loading message');
      container.innerHTML = '';
      return;
    }
    
    try {
      // Get first 5 projects
      const featuredProjects = this.projects.slice(0, 5);
      console.log('Featured projects:', featuredProjects);
        
        if (featuredProjects.length === 0) {
          container.innerHTML = '<div class="no-projects">No projects available</div>';
          return;
        }
        
      // Create clean project cards
      let projectsHTML = '';
      
      featuredProjects.forEach((project, index) => {
        // Get category name
        const category = this.getCategoryName(project.categoryId);
        
        projectsHTML += `
          <div class="project-card" data-project-id="${project.id}">
            <div class="project-card__image-container">
              <img src="${project.cover}" alt="${project.title}" class="project-card__image" loading="lazy" onerror="this.src='images/hero sectio bg.jpg'">
              <div class="project-card__overlay project-card__overlay--bar">
                <div class="project-card__content" style="display:grid;gap:8px;grid-template-columns:1fr auto;align-items:center;">
                  <div>
                    <h3 class="project-card__title" style="margin:0 0 4px;" data-edit="text" data-target="project:${project.id}:title">${project.title}</h3>
                    <p class="project-card__description" style="margin:0;" data-edit="text" data-target="project:${project.id}:description">${project.description || project.short || ''}</p>
                  </div>
                </div>
                <div class="project-card__actions">
                  <button class="project-card__btn project-card__view-btn" data-project-id="${project.id}">
                    <span data-translate="projects.viewDetails">View Details</span>
                  </button>
                  <button class="project-card__btn project-card__gallery-btn" data-project-id="${project.id}" data-gallery='${JSON.stringify(project.gallery || [])}'>
                    <span data-translate="projects.gallery">Gallery</span>
                  </button>
                </div>
              </div>
            </div>
          </div>`;
      });
      
      console.log('Generated HTML:', projectsHTML);
      container.innerHTML = projectsHTML;
      console.log('HTML inserted, container children:', container.children.length);
      console.log('Container innerHTML length:', container.innerHTML.length);
      
      // Add the projects-loaded class to trigger animations
      addClass(container, 'projects-loaded');
      
      // Add event listeners
      const cards = container.querySelectorAll('.project-card');
      cards.forEach(card => {
        // Add click handler for the entire card
        addEvent(card, 'click', (e) => {
          if (e.target.closest('.project-card__btn')) return;
          
          const projectId = card.dataset.projectId;
          window.location.href = `projects/${projectId}.html`;
        });
        
        // Add click handler for the gallery button
        const galleryBtn = card.querySelector('.project-card__gallery-btn');
        if (galleryBtn) {
          addEvent(galleryBtn, 'click', (e) => {
            e.stopPropagation();
            const projectId = galleryBtn.dataset.projectId;
            const galleryData = JSON.parse(galleryBtn.dataset.gallery || '[]');
            console.log('Gallery button clicked for project:', projectId, 'with images:', galleryData);
            this.openProjectGallery(projectId, galleryData);
          });
        }
        
        // Add click handler for the view button
        const viewBtn = card.querySelector('.project-card__view-btn');
        if (viewBtn) {
          addEvent(viewBtn, 'click', (e) => {
            e.stopPropagation();
            const projectId = viewBtn.dataset.projectId;
            window.location.href = `projects/${projectId}.html`;
          });
        }
        
        // Observe image for lazy loading
        const img = card.querySelector('.project-card__image');
        if (img) {
          // Show immediately without waiting for intersection
          img.decoding = 'async';
          img.loading = 'eager';
          img.style.opacity = '1';
        }
      });
        
      } catch (error) {
        console.error('Error loading projects:', error);
        container.innerHTML = '<div class="error-message">Error loading projects. Please try again.</div>';
      }
  }
  
  setupGalleryNavigation() {
    const gallery = $('#featured-projects');
    const prevBtn = $('#gallery-prev');
    const nextBtn = $('#gallery-next');
    const indicatorsContainer = $('#gallery-indicators');
    
    console.log('Gallery elements:', { gallery, prevBtn, nextBtn, indicatorsContainer });
    
    if (!gallery || !prevBtn || !nextBtn || !indicatorsContainer) {
      console.warn('Missing gallery elements:', { gallery: !!gallery, prevBtn: !!prevBtn, nextBtn: !!nextBtn, indicatorsContainer: !!indicatorsContainer });
      return;
    }
    
    const cards = gallery.querySelectorAll('.modern-project-card');
    console.log('Found cards:', cards.length);
    if (cards.length === 0) {
      console.warn('No project cards found in gallery');
      return;
    }
    
    let currentIndex = 0;
    const cardsPerView = window.innerWidth > 1200 ? 3 : window.innerWidth > 768 ? 2 : 1;
    const totalSlides = Math.ceil(cards.length / cardsPerView);
    
    // Create indicators
    indicatorsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const indicator = document.createElement('div');
      indicator.className = `gallery-indicator ${i === 0 ? 'active' : ''}`;
      indicator.dataset.slide = i;
      indicatorsContainer.appendChild(indicator);
    }
    
    const indicators = indicatorsContainer.querySelectorAll('.gallery-indicator');
    
    // Update gallery position
    const updateGallery = () => {
      const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(gallery).gap);
      const translateX = -currentIndex * cardWidth * cardsPerView;
      gallery.style.transform = `translateX(${translateX}px)`;
      
      // Update indicators
      indicators.forEach((indicator, index) => {
        if (index === currentIndex) {
          addClass(indicator, 'active');
        } else {
          removeClass(indicator, 'active');
        }
      });
      
      // Update navigation buttons
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= totalSlides - 1;
    };
    
    // Navigation event listeners
    addEvent(prevBtn, 'click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateGallery();
      }
    });
    
    addEvent(nextBtn, 'click', () => {
      if (currentIndex < totalSlides - 1) {
        currentIndex++;
        updateGallery();
      }
    });
    
    // Indicator click handlers
    indicators.forEach((indicator, index) => {
      addEvent(indicator, 'click', () => {
        currentIndex = index;
        updateGallery();
      });
    });
    
    // Handle window resize
    let resizeTimeout;
    addEvent(window, 'resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newCardsPerView = window.innerWidth > 1200 ? 3 : window.innerWidth > 768 ? 2 : 1;
        if (newCardsPerView !== cardsPerView) {
          currentIndex = 0;
          updateGallery();
        }
      }, 250);
    }, { passive: true });
    
    // Initialize
    updateGallery();
  }
  
  openProjectGallery(projectId, galleryImages) {
    console.log('openProjectGallery called with:', { projectId, galleryImages });
    if (!galleryImages || galleryImages.length === 0) {
      console.warn('No gallery images available for project:', projectId);
      return;
    }
    
    // Create gallery lightbox using the same system as project detail pages
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox lightbox--open';
    lightbox.innerHTML = `
      <div class="lightbox__content">
        <img src="${galleryImages[0]}" alt="Project Gallery" class="lightbox__image">
        <button class="lightbox__close">&times;</button>
        <button class="lightbox__nav lightbox__nav--prev">&larr;</button>
        <button class="lightbox__nav lightbox__nav--next">&rarr;</button>
        <div class="lightbox__counter">1 / ${galleryImages.length}</div>
      </div>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Add lightbox functionality
    let currentIndex = 0;
    const updateImage = () => {
      const img = lightbox.querySelector('.lightbox__image');
      const counter = lightbox.querySelector('.lightbox__counter');
      img.src = `${galleryImages[currentIndex]}`;
      counter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
    };
    
    const closeLightbox = () => {
      document.body.removeChild(lightbox);
      document.body.style.overflow = '';
    };
    
    const showNext = () => {
      currentIndex = (currentIndex + 1) % galleryImages.length;
      updateImage();
    };
    
    const showPrev = () => {
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
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
  
  setupProjectsNavigation() {
    const prevBtn = $('#prev-projects');
    const nextBtn = $('#next-projects');
    const indicatorsContainer = $('#project-indicators');
    const cards = $$('.modern-project-card');
    
    if (!prevBtn || !nextBtn || !indicatorsContainer || cards.length === 0) {
      return;
    }
    
    let currentIndex = 0;
    const totalCards = cards.length;
    const cardsPerView = window.innerWidth > 1200 ? 5 : window.innerWidth > 768 ? 3 : window.innerWidth > 480 ? 2 : 1;
    
    // Create indicators
    indicatorsContainer.innerHTML = '';
    for (let i = 0; i < Math.ceil(totalCards / cardsPerView); i++) {
      const indicator = document.createElement('div');
      indicator.className = `indicator ${i === 0 ? 'active' : ''}`;
      indicator.dataset.index = i;
      indicatorsContainer.appendChild(indicator);
    }
    
    const indicators = $$('.indicator');
    
    // Update visible cards
    const updateVisibleCards = () => {
      cards.forEach((card, index) => {
        const isVisible = index >= currentIndex * cardsPerView && index < (currentIndex + 1) * cardsPerView;
        if (isVisible) {
          card.style.display = 'block';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
          card.style.transform = 'translateY(30px) scale(0.95)';
        }
      });
      
      // Update indicators
      indicators.forEach((indicator, index) => {
        if (index === currentIndex) {
          addClass(indicator, 'active');
        } else {
          removeClass(indicator, 'active');
        }
      });
      
      // Update navigation buttons
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= Math.ceil(totalCards / cardsPerView) - 1;
    };
    
    // Navigation event listeners
    addEvent(prevBtn, 'click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateVisibleCards();
      }
    });
    
    addEvent(nextBtn, 'click', () => {
      const maxIndex = Math.ceil(totalCards / cardsPerView) - 1;
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateVisibleCards();
      }
    });
    
    // Indicator click handlers
    indicators.forEach((indicator, index) => {
      addEvent(indicator, 'click', () => {
        currentIndex = index;
        updateVisibleCards();
      });
    });
    
    // Handle window resize
    let resizeTimeout;
    addEvent(window, 'resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newCardsPerView = window.innerWidth > 1200 ? 5 : window.innerWidth > 768 ? 3 : window.innerWidth > 480 ? 2 : 1;
        if (newCardsPerView !== cardsPerView) {
          currentIndex = 0;
          updateVisibleCards();
        }
      }, 250);
    }, { passive: true });
    
    // Initialize
    updateVisibleCards();
  }
  
  setupScrollEffects() {
    // Parallax effect for hero (respects prefers-reduced-motion)
    const hero = $('.hero');
    if (!hero) return;
    
    const handleParallax = debounce(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
      }
    }, 10);
    
    addEvent(window, 'scroll', handleParallax);
    
    // Mobile-specific scroll optimizations
    if ('ontouchstart' in window) {
      // Disable scroll chaining on mobile
      document.body.style.overscrollBehavior = 'contain';
      
      // Add momentum scrolling for iOS
      const scrollableElements = $$('.gallery, .filter-chips, .header__mobile-nav');
      scrollableElements.forEach(element => {
        element.style.webkitOverflowScrolling = 'touch';
      });
      
      // Optimize touch scrolling performance
      const touchElements = $$('.project-card, .btn, .gallery__item');
      touchElements.forEach(element => {
        element.style.touchAction = 'manipulation';
      });
    }
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
  
  setupMobileMenu() {
    const mobileToggle = $('#mobile-toggle');
    const mobileNav = $('#mobile-nav');
    
    if (!mobileToggle || !mobileNav) return;
    
    // Enhanced mobile menu toggle with better touch handling
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
}

// Initialize home page
const homePage = new HomePage();

// Initialize lightboxes
initLightboxes();
