/* ============================================
   AI TOOLCOR CALCULATORS — COMMON JS
   common.js · v3.0 · Performance Optimised
   ============================================ */

'use strict';

/* ── Micro utilities ── */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);

function throttle(fn, wait) {
    let last = 0, raf = null;
    return function (...args) {
        const now = Date.now();
        if (now - last >= wait) {
            last = now;
            fn.apply(this, args);
        } else if (!raf) {
            raf = setTimeout(() => {
                last = Date.now();
                raf = null;
                fn.apply(this, args);
            }, wait - (now - last));
        }
    };
}

function debounce(fn, wait) {
    let t;
    return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
    };
}

function ready(fn) {
    document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);
}

/* ── Boot ── */
ready(() => {
    initNavbar();
    initMobileMenu();
    initBackToTop();
    initFaq();
    initSmoothScroll();
    initKeyboardShortcuts();
    initAnimations();
    initLazyLoad();
    initLinkPrefetch();
    initFooterYear();
    logBranding();
});

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
    const navbar = $('#navbar');
    if (!navbar) return;

    const onScroll = throttle(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, 80);

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
    const toggle = $('#mobileToggle');
    const menu   = $('#mobileMenu');
    if (!toggle || !menu) return;

    let open = false;

    function openMenu() {
        open = true;
        menu.classList.add('open');
        menu.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        open = false;
        menu.classList.remove('open');
        menu.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => open ? closeMenu() : openMenu());

    $$('a', menu).forEach(a => a.addEventListener('click', closeMenu));

    document.addEventListener('click', e => {
        if (open && !menu.contains(e.target) && !toggle.contains(e.target)) closeMenu();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && open) closeMenu();
    });
}

/* ============================================
   BACK TO TOP
   ============================================ */
function initBackToTop() {
    const btn = $('#backToTop');
    if (!btn) return;

    const onScroll = throttle(() => {
        btn.classList.toggle('visible', window.scrollY > 320);
    }, 80);

    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============================================
   FAQ TOGGLE
   ============================================ */
function initFaq() {
    window.toggleFaq = function (btn) {
        const item     = btn.closest('.faq-item');
        const isActive = item.classList.contains('active');

        $$('.faq-item.active').forEach(el => {
            el.classList.remove('active');
            el.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
            item.classList.add('active');
            btn.setAttribute('aria-expanded', 'true');
        }
    };

    // Allow keyboard activation
    $$('.faq-question').forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
        btn.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.toggleFaq(btn);
            }
        });
    });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = $(href);
            if (!target) return;
            e.preventDefault();
            const offset = parseInt(
                getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
            ) || 68;
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.pageYOffset - offset - 16,
                behavior: 'smooth'
            });
        });
    });
}

/* ============================================
   KEYBOARD SHORTCUTS
   ============================================ */
function initKeyboardShortcuts() {
    const searchInput = $('#searchInput');

    document.addEventListener('keydown', e => {
        if (
            e.key === '/' &&
            document.activeElement !== searchInput &&
            document.activeElement?.tagName !== 'INPUT' &&
            document.activeElement?.tagName !== 'TEXTAREA'
        ) {
            e.preventDefault();
            searchInput?.focus();
            searchInput?.select();
        }

        if (e.key === 'Escape' && searchInput && document.activeElement === searchInput) {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            searchInput.blur();
        }
    });
}

/* ============================================
   SCROLL ANIMATIONS (IntersectionObserver)
   ============================================ */
function initAnimations() {
    if (!('IntersectionObserver' in window)) {
        $$('.animate-up').forEach(el => el.classList.add('in-view'));
        return;
    }

    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    $$('.animate-up').forEach(el => io.observe(el));
}

/* ============================================
   LAZY LOAD IMAGES
   ============================================ */
function initLazyLoad() {
    if (!('IntersectionObserver' in window)) return;

    const imgs = $$('img[data-src]');
    if (!imgs.length) return;

    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                io.unobserve(img);
            }
        });
    });

    imgs.forEach(img => io.observe(img));
}

/* ============================================
   LINK PREFETCH ON HOVER
   ============================================ */
function initLinkPrefetch() {
    const prefetched = new Set();

    document.addEventListener('mouseover', e => {
        const link = e.target.closest('a[href]');
        if (!link) return;
        const href = link.href;
        if (
            prefetched.has(href) ||
            !href.startsWith(window.location.origin) ||
            href === window.location.href
        ) return;

        prefetched.add(href);
        const rel = document.createElement('link');
        rel.rel  = 'prefetch';
        rel.href = href;
        document.head.appendChild(rel);
    }, { passive: true });
}

/* ============================================
   FOOTER YEAR (dynamic)
   ============================================ */
function initFooterYear() {
    const el = $('#footerYear');
    if (el) el.textContent = new Date().getFullYear();
}

/* ============================================
   CONSOLE BRANDING
   ============================================ */
function logBranding() {
    console.log(
        '%c🧮 AI ToolCor Calculators %c https://calculator.aitoolcor.com',
        'background:linear-gradient(135deg,#7c3aed,#0ea5e9);color:#fff;padding:8px 16px;border-radius:4px 0 0 4px;font-size:13px;font-weight:700;',
        'background:#1e293b;color:#a78bfa;padding:8px 16px;border-radius:0 4px 4px 0;font-size:13px;'
    );
}

/* ============================================
   GLOBAL HELPERS (used by all calc pages)
   ============================================ */

/** Format number in Indian locale, optionally with ₹ symbol */
window.formatIndian = function (num, withSymbol = true) {
    const n = Math.round(num);
    if (withSymbol) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(n);
    }
    return new Intl.NumberFormat('en-IN').format(n);
};

/** Show toast notification */
window.showToast = function (message, duration = 2500) {
    let toast = $('#toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        toast.innerHTML = '<i class="fas fa-check-circle"></i><span id="toastMessage"></span>';
        document.body.appendChild(toast);
    }
    const msg = $('#toastMessage');
    if (msg) msg.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
};

/** Copy text to clipboard */
window.copyToClipboard = async function (text, successMsg = 'Copied!') {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        }
        window.showToast(successMsg);
        return true;
    } catch {
        window.showToast('Copy failed!');
        return false;
    }
};

/** Native share or clipboard fallback */
window.shareContent = async function (title, text, url = window.location.href) {
    if (navigator.share) {
        try { await navigator.share({ title, text, url }); } catch { /* user cancelled */ }
    } else {
        await window.copyToClipboard(`${text}\n\n${url}`, 'Link copied! Share it anywhere.');
    }
};

/** Debounced input helper */
window.onDebouncedInput = function (element, callback, wait = 300) {
    element.addEventListener('input', debounce(callback, wait));
};

/** Print page */
window.printPage = function () { window.print(); };