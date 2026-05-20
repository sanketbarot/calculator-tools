/* ============================================
   COMMON.JS - PERFORMANCE OPTIMIZED
   ============================================ */

'use strict';

// ===== UTILITIES =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Throttle function for performance
function throttle(fn, wait) {
    let timeout = null;
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= wait) {
            lastCall = now;
            fn.apply(this, args);
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                lastCall = Date.now();
                fn.apply(this, args);
            }, wait - (now - lastCall));
        }
    };
}

// Debounce function
function debounce(fn, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), wait);
    };
}

// ===== DOM READY =====
function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(() => {
    initNavbar();
    initMobileMenu();
    initBackToTop();
    initFaq();
    initSmoothScroll();
    initKeyboardShortcuts();
    initAnimations();
    initLazyLoad();
    initServiceWorker();
});

// ===== NAVBAR (Throttled scroll) =====
function initNavbar() {
    const navbar = $('#navbar');
    if (!navbar) return;

    const handleScroll = throttle(() => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const toggle = $('#mobileToggle');
    const menu = $('#mobileMenu');
    if (!toggle || !menu) return;

    let isOpen = false;

    toggle.addEventListener('click', () => {
        isOpen = !isOpen;
        menu.classList.toggle('open');
        toggle.innerHTML = isOpen 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            isOpen = false;
            toggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (isOpen && !menu.contains(e.target) && !toggle.contains(e.target)) {
            menu.classList.remove('open');
            isOpen = false;
            toggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        }
    });
}

// ===== BACK TO TOP (Throttled) =====
function initBackToTop() {
    const btn = $('#backToTop');
    if (!btn) return;

    const handleScroll = throttle(() => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== FAQ TOGGLE =====
function initFaq() {
    window.toggleFaq = function(btn) {
        const item = btn.parentElement;
        const isActive = item.classList.contains('active');

        $$('.faq-item').forEach(faq => faq.classList.remove('active'));

        if (!isActive) {
            item.classList.add('active');
        }
    };
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length <= 1) return;
            
            const target = $(href);
            if (target) {
                e.preventDefault();
                const offset = 70;
                const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: position, behavior: 'smooth' });
            }
        });
    });
}

// ===== KEYBOARD SHORTCUTS =====
function initKeyboardShortcuts() {
    const searchInput = $('#searchInput');
    if (!searchInput) return;

    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
        if (e.key === 'Escape') {
            searchInput.blur();
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        }
    });
}

// ===== INTERSECTION OBSERVER (Animations) =====
function initAnimations() {
    if (!('IntersectionObserver' in window)) return;

    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, options);

    $$('.section, .features-section, .faq-section, .cta-section, .tool-container, .info-section, .related-tools').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// ===== LAZY LOAD IMAGES =====
function initLazyLoad() {
    if (!('IntersectionObserver' in window)) return;

    const lazyImages = $$('img[data-src]');
    if (lazyImages.length === 0) return;

    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imgObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imgObserver.observe(img));
}

// ===== SERVICE WORKER (Optional - for PWA) =====
function initServiceWorker() {
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
        // Optional: Register service worker for offline support
        // navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
}

// ===== INDIAN NUMBER FORMATTER (Reusable) =====
window.formatIndian = function(num, withSymbol = true) {
    if (withSymbol) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(num);
    }
    return new Intl.NumberFormat('en-IN').format(Math.round(num));
};

// ===== TOAST (Global function) =====
window.showToast = function(message, duration = 2500) {
    const toast = $('#toast');
    if (!toast) return;
    const msg = $('#toastMessage');
    if (msg) msg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
};

// ===== COPY TO CLIPBOARD (Reusable) =====
window.copyToClipboard = async function(text, successMsg = 'Copied!') {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
        showToast(successMsg);
        return true;
    } catch (err) {
        showToast('Copy failed!');
        return false;
    }
};

// ===== SHARE (Reusable) =====
window.shareContent = async function(title, text, url = window.location.href) {
    if (navigator.share) {
        try {
            await navigator.share({ title, text, url });
        } catch (err) {
            // User cancelled or error
        }
    } else {
        await copyToClipboard(`${text}\n\n${url}`, 'Link copied!');
    }
};

// ===== PRINT =====
window.printPage = function() {
    window.print();
};

// ===== DEBOUNCED INPUT HELPER =====
window.onDebouncedInput = function(element, callback, wait = 300) {
    element.addEventListener('input', debounce(callback, wait));
};

// ===== PERFORMANCE: Preload critical pages on hover =====
function initLinkPrefetch() {
    if (!('IntersectionObserver' in window)) return;
    
    let prefetched = new Set();
    
    document.addEventListener('mouseover', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;
        
        const href = link.href;
        if (prefetched.has(href)) return;
        if (!href.includes(window.location.host)) return;
        if (href === window.location.href) return;
        
        prefetched.add(href);
        
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = href;
        document.head.appendChild(prefetchLink);
    }, { passive: true });
}

initLinkPrefetch();

// ===== CONSOLE BRANDING =====
console.log(
    '%c🧮 AI ToolCor Calculators %c https://calculator.aitoolcor.com',
    'background: linear-gradient(135deg, #7c3aed, #0ea5e9); color: white; padding: 8px 16px; border-radius: 4px 0 0 4px; font-size: 14px; font-weight: bold;',
    'background: #1e293b; color: #a78bfa; padding: 8px 16px; border-radius: 0 4px 4px 0; font-size: 14px;'
);