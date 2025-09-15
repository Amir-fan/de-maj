// DE-MAJ Architecture - Lightbox Component

import { $, $$, createElement, addEvent, addClass, removeClass, show, hide } from './dom.js';

class Lightbox {
  constructor() {
    this.isOpen = false;
    this.currentIndex = 0;
    this.images = [];
    this.lightbox = null;
    this.cleanup = null;
    
    this.init();
  }
  
  init() {
    this.createLightbox();
    this.bindEvents();
  }
  
  createLightbox() {
    this.lightbox = createElement('div', {
      className: 'lightbox',
      innerHTML: `
        <div class="lightbox__content">
          <img class="lightbox__image" alt="">
          <button class="lightbox__close" aria-label="Close lightbox">&times;</button>
          <button class="lightbox__nav lightbox__nav--prev" aria-label="Previous image">&larr;</button>
          <button class="lightbox__nav lightbox__nav--next" aria-label="Next image">&rarr;</button>
          <div class="lightbox__counter"></div>
        </div>
      `
    });
    
    document.body.appendChild(this.lightbox);
  }
  
  bindEvents() {
    const closeBtn = $('.lightbox__close', this.lightbox);
    const prevBtn = $('.lightbox__nav--prev', this.lightbox);
    const nextBtn = $('.lightbox__nav--next', this.lightbox);
    
    this.cleanup = addEvents(this.lightbox, {
      click: (e) => {
        if (e.target === this.lightbox) {
          this.close();
        }
      },
      keydown: (e) => {
        if (e.key === 'Escape') {
          this.close();
        } else if (e.key === 'ArrowLeft') {
          this.previous();
        } else if (e.key === 'ArrowRight') {
          this.next();
        }
      }
    });
    
    addEvent(closeBtn, 'click', () => this.close());
    addEvent(prevBtn, 'click', () => this.previous());
    addEvent(nextBtn, 'click', () => this.next());
  }
  
  open(images, startIndex = 0) {
    if (!images || images.length === 0) return;
    
    this.images = images;
    this.currentIndex = startIndex;
    this.isOpen = true;
    
    this.updateImage();
    this.updateCounter();
    this.updateNavigation();
    
    addClass(this.lightbox, 'lightbox--open');
    addClass(document.body, 'lightbox-open');
    
    // Focus management
    this.lightbox.focus();
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }
  
  close() {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    removeClass(this.lightbox, 'lightbox--open');
    removeClass(document.body, 'lightbox-open');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Clear images
    this.images = [];
    this.currentIndex = 0;
  }
  
  next() {
    if (this.images.length <= 1) return;
    
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateImage();
    this.updateCounter();
  }
  
  previous() {
    if (this.images.length <= 1) return;
    
    this.currentIndex = this.currentIndex === 0 
      ? this.images.length - 1 
      : this.currentIndex - 1;
    this.updateImage();
    this.updateCounter();
  }
  
  updateImage() {
    const img = $('.lightbox__image', this.lightbox);
    const currentImage = this.images[this.currentIndex];
    
    if (img && currentImage) {
      // Preload image for smooth transition
      const preloadImg = new Image();
      preloadImg.onload = () => {
        img.src = currentImage;
        img.alt = `Gallery image ${this.currentIndex + 1}`;
      };
      preloadImg.src = currentImage;
    }
  }
  
  updateCounter() {
    const counter = $('.lightbox__counter', this.lightbox);
    if (counter) {
      counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
    }
  }
  
  updateNavigation() {
    const prevBtn = $('.lightbox__nav--prev', this.lightbox);
    const nextBtn = $('.lightbox__nav--next', this.lightbox);
    
    if (this.images.length <= 1) {
      hide(prevBtn);
      hide(nextBtn);
    } else {
      show(prevBtn);
      show(nextBtn);
    }
  }
  
  destroy() {
    if (this.cleanup) {
      this.cleanup();
    }
    
    if (this.lightbox && this.lightbox.parentNode) {
      this.lightbox.parentNode.removeChild(this.lightbox);
    }
  }
}

// Initialize gallery lightboxes
export const initGalleryLightboxes = () => {
  const galleries = $$('.gallery');
  
  galleries.forEach(gallery => {
    const items = $$('.gallery__item', gallery);
    const images = items.map(item => {
      const img = $('img', item);
      return img ? img.src : null;
    }).filter(Boolean);
    
    if (images.length === 0) return;
    
    const lightbox = new Lightbox();
    
    items.forEach((item, index) => {
      addEvent(item, 'click', () => {
        lightbox.open(images, index);
      });
    });
  });
};

// Initialize single image lightboxes
export const initImageLightboxes = () => {
  const images = $$('img[data-lightbox]');
  
  images.forEach(img => {
    addEvent(img, 'click', () => {
      const lightbox = new Lightbox();
      const src = img.src;
      lightbox.open([src], 0);
    });
  });
};

// Initialize all lightboxes
export const initLightboxes = () => {
  initGalleryLightboxes();
  initImageLightboxes();
};

export default Lightbox;
