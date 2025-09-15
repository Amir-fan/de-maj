// DE-MAJ Architecture - Resume Page Script

import { $, $$, addEvent, addClass, removeClass, ready, debounce, hasClass } from './lib/dom.js';

class ResumePage {
  constructor() {
    this.init();
  }
  
  init() {
    ready(() => {
      this.setupHeader();
      this.setupDownloadButton();
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
  
  setupDownloadButton() {
    const downloadBtn = $('#download-resume');
    if (!downloadBtn) return;
    
    addEvent(downloadBtn, 'click', (e) => {
      e.preventDefault();
      this.downloadResume();
    });
  }
  
  downloadResume() {
    // Create a simple PDF content (in a real implementation, you'd generate a proper PDF)
    const resumeContent = `
      DE-MAJ Architecture
      Shahad Al-Majeed
      Principal Architect & Founder
      
      Professional Summary
      Experienced architect with a passion for creating meaningful spaces that inspire, endure, and connect communities. Specialized in sustainable design, context-sensitive architecture, and innovative solutions for residential, commercial, and hospitality projects.
      
      Core Competencies
      • Sustainable Architecture & Green Building Design
      • Residential & Commercial Project Management
      • 3D Visualization & BIM Technologies
      • Client Relations & Project Coordination
      • Regulatory Compliance & Permitting
      • Construction Documentation & Specifications
      
      Key Projects
      • Airport Hotel, Riyadh - Modern hospitality design
      • B-K Villa, Jeddah - Contemporary residential design
      • Cruise Port Terminal, Dammam - Large-scale infrastructure
      • Cultural Center, Riyadh - Cultural facility design
      • M-N Hotel, Riyadh - Luxury hospitality design
      
      Contact Information
      Email: mushtaqshahad59@gmail.com
      Phone: +90 553 706 28 64
      LinkedIn: shahad-al-majeed
    `;
    
    // Create and download text file (placeholder for PDF)
    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Shahad-Al-Majeed-Resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    this.showToast('Resume download started', 'success');
  }
  
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <div class="toast__content">
        <span class="toast__icon">${type === 'success' ? '✓' : 'ℹ'}</span>
        <span class="toast__message">${message}</span>
        <button class="toast__close">&times;</button>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
      addClass(toast, 'toast--show');
    }, 100);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      this.hideToast(toast);
    }, 3000);
    
    // Close button
    const closeBtn = $('.toast__close', toast);
    addEvent(closeBtn, 'click', () => {
      this.hideToast(toast);
    });
  }
  
  hideToast(toast) {
    removeClass(toast, 'toast--show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }
  
  setupMobileMenu() {
    // Mobile menu functionality is handled in setupHeader
    // This method can be extended for additional mobile-specific functionality
  }
}

// Initialize resume page
const resumePage = new ResumePage();
