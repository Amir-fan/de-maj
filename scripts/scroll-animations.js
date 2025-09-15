// DE-MAJ Architecture - Optimized Scroll Animations
export class ScrollAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        // Check if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        this.setupScrollAnimations();
        this.setupSmoothScrolling();
    }
    
    setupScrollAnimations() {
        // Create intersection observer for scroll animations with better performance
        const observerOptions = {
            threshold: [0.1, 0.5],
            rootMargin: '0px 0px -10% 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Use requestAnimationFrame for better performance
                    requestAnimationFrame(() => {
                        entry.target.classList.add('animate');
                    });
                    // Unobserve after animation to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe all elements with scroll animation classes
        const animatedElements = document.querySelectorAll(`
            .scroll-animate,
            .scroll-animate--left,
            .scroll-animate--right,
            .project-card
        `);
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    setupSmoothScrolling() {
        // Smooth scroll for anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = 80;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Smooth scroll to top functionality
        this.setupScrollToTop();
    }
    
    setupScrollToTop() {
        // Create scroll to top button
        const scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.innerHTML = '↑';
        scrollToTopBtn.className = 'scroll-to-top';
        scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
        scrollToTopBtn.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--accent);
            color: white;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            transform: translateY(20px);
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        `;
        
        document.body.appendChild(scrollToTopBtn);
        
        // Throttled scroll handler for better performance
        let ticking = false;
        const updateScrollButton = () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.opacity = '1';
                scrollToTopBtn.style.visibility = 'visible';
                scrollToTopBtn.style.transform = 'translateY(0)';
            } else {
                scrollToTopBtn.style.opacity = '0';
                scrollToTopBtn.style.visibility = 'hidden';
                scrollToTopBtn.style.transform = 'translateY(20px)';
            }
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollButton);
                ticking = true;
            }
        });
        
        // Scroll to top functionality
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.scrollAnimations = new ScrollAnimations();
});
