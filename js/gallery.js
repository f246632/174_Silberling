/**
 * Gallery & Lightbox Functionality
 * Handles image gallery interactions and lightbox modal
 */

class Gallery {
    constructor() {
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.querySelector('.lightbox-image');
        this.closeBtn = document.querySelector('.lightbox-close');
        this.prevBtn = document.querySelector('.lightbox-prev');
        this.nextBtn = document.querySelector('.lightbox-next');

        this.currentIndex = 0;
        this.images = [];

        if (this.galleryItems.length > 0) {
            this.init();
        }
    }

    init() {
        // Collect all image sources
        this.galleryItems.forEach((item, index) => {
            const imgSrc = item.getAttribute('data-image') || item.querySelector('img')?.src;
            if (imgSrc) {
                this.images.push(imgSrc);
            }

            // Add click event to gallery items
            item.addEventListener('click', () => this.openLightbox(index));
        });

        // Lightbox controls
        this.closeBtn?.addEventListener('click', () => this.closeLightbox());
        this.prevBtn?.addEventListener('click', () => this.showPrevious());
        this.nextBtn?.addEventListener('click', () => this.showNext());

        // Close on background click
        this.lightbox?.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Touch/swipe support
        this.addTouchSupport();
    }

    openLightbox(index) {
        if (index >= 0 && index < this.images.length) {
            this.currentIndex = index;
            this.lightboxImage.src = this.images[index];
            this.lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Preload adjacent images
            this.preloadAdjacentImages();
        }
    }

    closeLightbox() {
        this.lightbox?.classList.remove('active');
        document.body.style.overflow = '';
    }

    showNext() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateLightboxImage();
    }

    showPrevious() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateLightboxImage();
    }

    updateLightboxImage() {
        // Add fade effect
        this.lightboxImage.style.opacity = '0';

        setTimeout(() => {
            this.lightboxImage.src = this.images[this.currentIndex];
            this.lightboxImage.style.opacity = '1';
            this.preloadAdjacentImages();
        }, 150);
    }

    preloadAdjacentImages() {
        // Preload next and previous images for smooth navigation
        const nextIndex = (this.currentIndex + 1) % this.images.length;
        const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;

        [nextIndex, prevIndex].forEach(index => {
            const img = new Image();
            img.src = this.images[index];
        });
    }

    handleKeyboard(e) {
        if (!this.lightbox?.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                this.closeLightbox();
                break;
            case 'ArrowRight':
                this.showNext();
                break;
            case 'ArrowLeft':
                this.showPrevious();
                break;
        }
    }

    addTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.lightbox?.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.lightbox?.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - show next
                this.showNext();
            } else {
                // Swipe right - show previous
                this.showPrevious();
            }
        }
    }
}

// ===================================
// Image Optimization & Loading
// ===================================

class ImageOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Add progressive loading effect
        const images = document.querySelectorAll('img');

        images.forEach(img => {
            if (img.complete) {
                this.handleImageLoad(img);
            } else {
                img.addEventListener('load', () => this.handleImageLoad(img));
                img.addEventListener('error', () => this.handleImageError(img));
            }
        });
    }

    handleImageLoad(img) {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';

        requestAnimationFrame(() => {
            img.style.opacity = '1';
        });
    }

    handleImageError(img) {
        console.error('Failed to load image:', img.src);

        // Add fallback placeholder
        const parent = img.parentElement;
        if (parent) {
            parent.style.background = 'var(--bg-dark)';
            parent.style.display = 'flex';
            parent.style.alignItems = 'center';
            parent.style.justifyContent = 'center';

            const placeholder = document.createElement('div');
            placeholder.textContent = '📷';
            placeholder.style.fontSize = '3rem';
            placeholder.style.opacity = '0.3';

            img.style.display = 'none';
            parent.appendChild(placeholder);
        }
    }
}

// ===================================
// Gallery Filter (Optional Enhancement)
// ===================================

class GalleryFilter {
    constructor() {
        this.filters = document.querySelectorAll('.gallery-filter');
        this.items = document.querySelectorAll('.gallery-item');

        if (this.filters.length > 0) {
            this.init();
        }
    }

    init() {
        this.filters.forEach(filter => {
            filter.addEventListener('click', () => {
                const category = filter.getAttribute('data-filter');
                this.filterGallery(category);
                this.setActiveFilter(filter);
            });
        });
    }

    filterGallery(category) {
        this.items.forEach(item => {
            const itemCategory = item.getAttribute('data-category');

            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
                requestAnimationFrame(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                });
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    setActiveFilter(activeFilter) {
        this.filters.forEach(filter => filter.classList.remove('active'));
        activeFilter.classList.add('active');
    }
}

// ===================================
// Masonry Layout (Optional)
// ===================================

class MasonryLayout {
    constructor(container) {
        this.container = document.querySelector(container);

        if (this.container) {
            this.init();
        }
    }

    init() {
        // Simple CSS Grid masonry fallback
        this.container.style.display = 'grid';
        this.container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
        this.container.style.gridAutoRows = '10px';

        this.layout();

        // Re-layout on window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.layout(), 250);
        });

        // Re-layout when images load
        const images = this.container.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('load', () => this.layout());
        });
    }

    layout() {
        const items = this.container.querySelectorAll('.gallery-item');

        items.forEach(item => {
            const height = item.offsetHeight;
            const rowSpan = Math.ceil((height + 10) / 10);
            item.style.gridRowEnd = `span ${rowSpan}`;
        });
    }
}

// ===================================
// Initialize Gallery Components
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    new Gallery();
    new ImageOptimizer();
    // new GalleryFilter(); // Uncomment if you add filter buttons
    // new MasonryLayout('.gallery-grid'); // Uncomment for masonry layout

    console.log('📸 Gallery initialized');
});

// ===================================
// Export for testing (if using modules)
// ===================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Gallery, ImageOptimizer, GalleryFilter, MasonryLayout };
}
