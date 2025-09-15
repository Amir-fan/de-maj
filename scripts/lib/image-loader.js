// DE-MAJ Architecture - Simple Image Loader

export class ImageLoader {
  constructor() {
    this.observer = null;
    this.init();
  }
  
  init() {
    // Create intersection observer for lazy loading
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    );
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        this.loadImage(img);
        this.observer.unobserve(img);
      }
    });
  }
  
  loadImage(img) {
    // Add loading class
    img.classList.add('loading');
    
    const newImg = new Image();
    newImg.onload = () => {
      img.classList.remove('loading');
      img.classList.add('loaded');
    };
    newImg.onerror = () => {
      img.classList.remove('loading');
      img.classList.add('error');
    };
    newImg.src = img.src;
  }
  
  observe(img) {
    this.observer.observe(img);
  }
  
  observeAll(selector = 'img[loading="lazy"]') {
    const images = document.querySelectorAll(selector);
    images.forEach(img => this.observe(img));
  }
}

// Global image loader instance
export const imageLoader = new ImageLoader();

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  imageLoader.observeAll();
});
