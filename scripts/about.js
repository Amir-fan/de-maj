// DE-MAJ Architecture - About Page Script

import { $, $$, addEvent, addClass, removeClass, ready, debounce, hasClass } from './lib/dom.js';

class AboutPage {
  constructor() {
    this.init();
  }
  
  init() {
    ready(() => {
      this.setupHeader();
      this.setupScrollEffects();
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
  
  setupScrollEffects() {
    // Smooth scroll for anchor links
    const anchorLinks = $$('a[href^="#"]');
    anchorLinks.forEach(link => {
      addEvent(link, 'click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = $(`#${targetId}`);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
  
  setupMobileMenu() {
    // Mobile menu functionality is handled in setupHeader
    // This method can be extended for additional mobile-specific functionality
  }
}

// Initialize about page
const aboutPage = new AboutPage();
