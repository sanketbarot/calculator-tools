/* ============================================
   COMMON JAVASCRIPT
   Navbar, Footer, FAQ, Back-to-top
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initMobileMenu();
    initBackToTop();
    initFaq();
    initSmoothScroll();
    initKeyboardShortcuts();
});

/* ===== NAVBAR SCROLL EFFECT ===== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ===== MOBILE MENU ===== */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!mobileToggle || !mobileMenu) return;

    let menuOpen = false;

    mobileToggle.addEventListener('click', () => {
        menuOpen = !menuOpen;
        mobileMenu.classList.toggle('open');
        mobileToggle.innerHTML = menuOpen 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            menuOpen = false;
            mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

/* ===== BACK TO TOP ===== */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ===== FAQ TOGGLE (Global Function) ===== */
function initFaq() {
    window.toggleFaq = function(btn) {
        const item = btn.parentElement;
        const isActive = item.classList.contains('active');

        document.querySelectorAll('.faq-item').forEach(faq => {
            faq.classList.remove('active');
        });

        if (!isActive) {
            item.classList.add('active');
        }
    };
}

/* ===== SMOOTH SCROLL ===== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length <= 1) return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: position, behavior: 'smooth' });
            }
        });
    });
}

/* ===== KEYBOARD SHORTCUTS ===== */
function initKeyboardShortcuts() {
    const searchInput = document.getElementById('searchInput');
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

/* ===== INTERSECTION OBSERVER (Animations) ===== */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

window.addEventListener('load', () => {
    document.querySelectorAll('.section, .features-section, .faq-section, .cta-section, .tool-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animationObserver.observe(el);
    });
});

/* ===== CONSOLE BRANDING ===== */
console.log(
    '%c🧮 AI ToolCor Calculators %c https://calculator.aitoolcor.com',
    'background: linear-gradient(135deg, #7c3aed, #0ea5e9); color: white; padding: 8px 16px; border-radius: 4px 0 0 4px; font-size: 14px; font-weight: bold;',
    'background: #1e293b; color: #a78bfa; padding: 8px 16px; border-radius: 0 4px 4px 0; font-size: 14px;'
);