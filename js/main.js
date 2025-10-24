/**
 * Silberling Cafe Website - Main JavaScript
 * Handles navigation, hero slider, smooth scrolling, and form submission
 */

// ===================================
// Utility Functions
// ===================================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const debounce = (func, wait = 100) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// ===================================
// Navigation
// ===================================

class Navigation {
    constructor() {
        this.navbar = $('#navbar');
        this.navToggle = $('#navToggle');
        this.navMenu = $('#navMenu');
        this.navLinks = $$('.nav-link');

        this.init();
    }

    init() {
        // Mobile menu toggle
        this.navToggle?.addEventListener('click', () => this.toggleMenu());

        // Close menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
                this.setActiveLink(link);
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!this.navMenu?.contains(e.target) && !this.navToggle?.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Navbar scroll effect
        window.addEventListener('scroll', debounce(() => this.handleScroll(), 50));

        // Set active link on scroll
        window.addEventListener('scroll', debounce(() => this.updateActiveLink(), 100));

        // Set initial active link
        this.updateActiveLink();
    }

    toggleMenu() {
        this.navMenu?.classList.toggle('active');
        this.navToggle?.classList.toggle('active');
        document.body.style.overflow = this.navMenu?.classList.contains('active') ? 'hidden' : '';
    }

    closeMenu() {
        this.navMenu?.classList.remove('active');
        this.navToggle?.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleScroll() {
        if (window.scrollY > 100) {
            this.navbar?.classList.add('scrolled');
        } else {
            this.navbar?.classList.remove('scrolled');
        }
    }

    setActiveLink(link) {
        this.navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    }

    updateActiveLink() {
        const sections = $$('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const link = $(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                this.navLinks.forEach(l => l.classList.remove('active'));
                link?.classList.add('active');
            }
        });
    }
}

// ===================================
// Hero Slider
// ===================================

class HeroSlider {
    constructor() {
        this.slides = $$('.hero-slide');
        this.currentSlide = 0;
        this.interval = null;

        if (this.slides.length > 1) {
            this.init();
        }
    }

    init() {
        this.startAutoplay();

        // Pause on hover
        const hero = $('.hero');
        hero?.addEventListener('mouseenter', () => this.stopAutoplay());
        hero?.addEventListener('mouseleave', () => this.startAutoplay());
    }

    nextSlide() {
        this.slides[this.currentSlide]?.classList.remove('active');
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.slides[this.currentSlide]?.classList.add('active');
    }

    startAutoplay() {
        this.interval = setInterval(() => this.nextSlide(), 5000);
    }

    stopAutoplay() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

// ===================================
// Smooth Scrolling
// ===================================

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = $(href);

                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===================================
// Contact Form
// ===================================

class ContactForm {
    constructor() {
        this.form = $('#contactForm');
        this.message = $('#formMessage');

        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Validate
        if (!this.validate(data)) {
            this.showMessage('Bitte füllen Sie alle erforderlichen Felder aus.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Wird gesendet...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual backend call)
        setTimeout(() => {
            this.showMessage('Vielen Dank für Ihre Nachricht! Wir werden uns bald bei Ihnen melden.', 'success');
            this.form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);

        // For actual implementation, use:
        // try {
        //     const response = await fetch('/api/contact', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify(data)
        //     });
        //
        //     if (response.ok) {
        //         this.showMessage('Message sent successfully!', 'success');
        //         this.form.reset();
        //     } else {
        //         throw new Error('Failed to send message');
        //     }
        // } catch (error) {
        //     this.showMessage('Error sending message. Please try again.', 'error');
        // }
    }

    validate(data) {
        return data.name && data.email && data.message && this.isValidEmail(data.email);
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showMessage(text, type) {
        this.message.textContent = text;
        this.message.className = `form-message ${type}`;
        this.message.style.display = 'block';

        setTimeout(() => {
            this.message.style.display = 'none';
        }, 5000);
    }
}

// ===================================
// Lazy Loading Images
// ===================================

class LazyLoad {
    constructor() {
        this.images = $$('img[loading="lazy"]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        observer.unobserve(img);
                    }
                });
            });

            this.images.forEach(img => imageObserver.observe(img));
        }
    }
}

// ===================================
// Scroll Reveal Animation
// ===================================

class ScrollReveal {
    constructor() {
        this.elements = $$('.feature-card, .menu-category, .review-card, .gallery-item');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            });

            this.elements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                revealObserver.observe(el);
            });
        }
    }
}

// ===================================
// Back to Top Button
// ===================================

class BackToTop {
    constructor() {
        this.createButton();
        this.init();
    }

    createButton() {
        const button = document.createElement('button');
        button.id = 'backToTop';
        button.innerHTML = '↑';
        button.setAttribute('aria-label', 'Back to top');
        button.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary-color);
            color: white;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: var(--shadow-md);
        `;
        document.body.appendChild(button);
        this.button = button;
    }

    init() {
        window.addEventListener('scroll', debounce(() => {
            if (window.pageYOffset > 300) {
                this.button.style.opacity = '1';
                this.button.style.visibility = 'visible';
            } else {
                this.button.style.opacity = '0';
                this.button.style.visibility = 'hidden';
            }
        }, 100));

        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        this.button.addEventListener('mouseenter', () => {
            this.button.style.transform = 'scale(1.1)';
        });

        this.button.addEventListener('mouseleave', () => {
            this.button.style.transform = 'scale(1)';
        });
    }
}

// ===================================
// Initialize All Components
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new Navigation();
    new HeroSlider();
    new SmoothScroll();
    new ContactForm();
    new LazyLoad();
    new ScrollReveal();
    new BackToTop();

    console.log('🎉 Silberling website loaded successfully!');
});

// ===================================
// Performance Monitoring
// ===================================

if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
                console.log('LCP:', entry.startTime);
            }
        }
    });

    try {
        perfObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
        // Observer not supported
    }
}

// ===================================
// Service Worker Registration (Optional)
// ===================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}
