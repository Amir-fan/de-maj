// DE-MAJ Architecture - Contact Page Script

import { $, $$, addEvent, addClass, removeClass, ready, debounce, hasClass } from './lib/dom.js';

class ContactPage {
  constructor() {
    this.init();
  }
  
  init() {
    ready(() => {
      this.setupHeader();
      this.setupContactForm();
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
  
  setupContactForm() {
    const form = $('#contact-form');
    if (!form) return;
    
    addEvent(form, 'submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit(form);
    });
    
    // Real-time validation
    const inputs = $$('input, textarea', form);
    inputs.forEach(input => {
      addEvent(input, 'blur', () => {
        this.validateField(input);
      });
      
      addEvent(input, 'input', debounce(() => {
        this.clearFieldError(input);
      }, 300));
    });
  }
  
  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.required && !value) {
      isValid = false;
      errorMessage = `${this.getFieldLabel(fieldName)} is required`;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }
    
    // Phone validation
    if (fieldName === 'phone' && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }
    
    if (!isValid) {
      this.showFieldError(field, errorMessage);
    } else {
      this.clearFieldError(field);
    }
    
    return isValid;
  }
  
  getFieldLabel(fieldName) {
    const labels = {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      subject: 'Subject',
      message: 'Message'
    };
    return labels[fieldName] || fieldName;
  }
  
  showFieldError(field, message) {
    this.clearFieldError(field);
    
    addClass(field, 'error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorElement);
  }
  
  clearFieldError(field) {
    removeClass(field, 'error');
    
    const existingError = $('.field-error', field.parentNode);
    if (existingError) {
      existingError.remove();
    }
  }
  
  handleFormSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Validate all fields
    const inputs = $$('input, textarea', form);
    let isFormValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });
    
    if (!isFormValid) {
      this.showToast('Please correct the errors and try again', 'error');
      return;
    }
    
    // Show loading state
    const submitBtn = $('button[type="submit"]', form);
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (in a real implementation, you'd send to a server)
    setTimeout(() => {
      this.sendEmail(data);
      
      // Reset form
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1000);
  }
  
  sendEmail(data) {
    // Create mailto link with form data
    const subject = data.subject || 'Contact from DE-MAJ Architecture Website';
    const body = `
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}

Message:
${data.message}
    `.trim();
    
    const mailtoLink = `mailto:mushtaqshahad59@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    this.showToast('Thank you for your message! Your email client should open with a pre-filled message.', 'success');
  }
  
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <div class="toast__content">
        <span class="toast__icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
        <span class="toast__message">${message}</span>
        <button class="toast__close">&times;</button>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
      addClass(toast, 'toast--show');
    }, 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      this.hideToast(toast);
    }, 5000);
    
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

// Initialize contact page
const contactPage = new ContactPage();
