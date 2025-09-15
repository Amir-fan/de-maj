// DE-MAJ Architecture - DOM Utilities

/**
 * Query selector with optional context
 * @param {string} selector - CSS selector
 * @param {Element} context - Context element (default: document)
 * @returns {Element|null}
 */
export const $ = (selector, context = document) => {
  return context.querySelector(selector);
};

/**
 * Query selector all with optional context
 * @param {string} selector - CSS selector
 * @param {Element} context - Context element (default: document)
 * @returns {NodeList}
 */
export const $$ = (selector, context = document) => {
  return context.querySelectorAll(selector);
};

/**
 * Create element with optional attributes and content
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {string|Element|Array} content - Element content
 * @returns {Element}
 */
export const createElement = (tag, attributes = {}, content = '') => {
  const element = document.createElement(tag);
  
  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'innerHTML') {
      element.innerHTML = value;
    } else if (key.startsWith('data-')) {
      element.setAttribute(key, value);
    } else {
      element[key] = value;
    }
  });
  
  // Set content
  if (typeof content === 'string') {
    element.textContent = content;
  } else if (content instanceof Element) {
    element.appendChild(content);
  } else if (Array.isArray(content)) {
    content.forEach(item => {
      if (typeof item === 'string') {
        element.appendChild(document.createTextNode(item));
      } else if (item instanceof Element) {
        element.appendChild(item);
      }
    });
  }
  
  return element;
};

/**
 * Add event listener with automatic cleanup
 * @param {Element} element - Target element
 * @param {string} event - Event type
 * @param {Function} handler - Event handler
 * @param {Object} options - Event options
 * @returns {Function} Cleanup function
 */
export const addEvent = (element, event, handler, options = {}) => {
  element.addEventListener(event, handler, options);
  
  return () => {
    element.removeEventListener(event, handler, options);
  };
};

/**
 * Add multiple event listeners
 * @param {Element} element - Target element
 * @param {Object} events - Event handlers object
 * @returns {Function} Cleanup function
 */
export const addEvents = (element, events) => {
  const cleanupFunctions = Object.entries(events).map(([event, handler]) => {
    return addEvent(element, event, handler);
  });
  
  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };
};

/**
 * Toggle class on element
 * @param {Element} element - Target element
 * @param {string} className - Class name
 * @param {boolean} force - Force add/remove
 * @returns {boolean} Whether class is present after toggle
 */
export const toggleClass = (element, className, force) => {
  return element.classList.toggle(className, force);
};

/**
 * Add class to element
 * @param {Element} element - Target element
 * @param {string} className - Class name
 */
export const addClass = (element, className) => {
  element.classList.add(className);
};

/**
 * Remove class from element
 * @param {Element} element - Target element
 * @param {string} className - Class name
 */
export const removeClass = (element, className) => {
  element.classList.remove(className);
};

/**
 * Check if element has class
 * @param {Element} element - Target element
 * @param {string} className - Class name
 * @returns {boolean}
 */
export const hasClass = (element, className) => {
  return element.classList.contains(className);
};

/**
 * Get or set element attribute
 * @param {Element} element - Target element
 * @param {string} name - Attribute name
 * @param {string} value - Attribute value (optional)
 * @returns {string|undefined}
 */
export const attr = (element, name, value) => {
  if (value !== undefined) {
    element.setAttribute(name, value);
  } else {
    return element.getAttribute(name);
  }
};

/**
 * Get or set element data attribute
 * @param {Element} element - Target element
 * @param {string} name - Data attribute name (without 'data-')
 * @param {string} value - Data attribute value (optional)
 * @returns {string|undefined}
 */
export const data = (element, name, value) => {
  const dataName = `data-${name}`;
  return attr(element, dataName, value);
};

/**
 * Show element
 * @param {Element} element - Target element
 */
export const show = (element) => {
  element.style.display = '';
  removeClass(element, 'hidden');
};

/**
 * Hide element
 * @param {Element} element - Target element
 */
export const hide = (element) => {
  element.style.display = 'none';
  addClass(element, 'hidden');
};

/**
 * Toggle element visibility
 * @param {Element} element - Target element
 * @param {boolean} force - Force show/hide
 * @returns {boolean} Whether element is visible after toggle
 */
export const toggleVisibility = (element, force) => {
  const isHidden = hasClass(element, 'hidden') || element.style.display === 'none';
  const shouldShow = force !== undefined ? force : isHidden;
  
  if (shouldShow) {
    show(element);
  } else {
    hide(element);
  }
  
  return shouldShow;
};

/**
 * Wait for DOM to be ready
 * @param {Function} callback - Callback function
 */
export const ready = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(this, args);
  };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Get element's position relative to viewport
 * @param {Element} element - Target element
 * @returns {Object} Position object
 */
export const getPosition = (element) => {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    right: rect.right + window.scrollX,
    bottom: rect.bottom + window.scrollY,
    width: rect.width,
    height: rect.height
  };
};

/**
 * Check if element is in viewport
 * @param {Element} element - Target element
 * @param {number} threshold - Visibility threshold (0-1)
 * @returns {boolean}
 */
export const isInViewport = (element, threshold = 0) => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  const verticalInView = (rect.top <= windowHeight * (1 - threshold)) && 
                        ((rect.top + rect.height) >= windowHeight * threshold);
  const horizontalInView = (rect.left <= windowWidth) && 
                          ((rect.left + rect.width) >= 0);
  
  return verticalInView && horizontalInView;
};

/**
 * Smooth scroll to element
 * @param {Element|string} target - Target element or selector
 * @param {Object} options - Scroll options
 */
export const scrollTo = (target, options = {}) => {
  const element = typeof target === 'string' ? $(target) : target;
  if (!element) return;
  
  const defaultOptions = {
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest'
  };
  
  element.scrollIntoView({ ...defaultOptions, ...options });
};

/**
 * Create intersection observer
 * @param {Function} callback - Intersection callback
 * @param {Object} options - Observer options
 * @returns {IntersectionObserver}
 */
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};
