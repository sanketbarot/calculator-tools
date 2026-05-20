/* ============================================
   AI TOOLCOR — SMART ADSENSE LOADER
   ads-loader.js · v3.0
   MutationObserver-based — no fixed delays
   ============================================ */

(function () {
    'use strict';

    function initSmartAds() {
        document.querySelectorAll('.ad-container').forEach(container => {
            const ins = container.querySelector('.adsbygoogle');
            if (!ins) return;
            watchAd(container, ins);
        });
    }

    function watchAd(container, ins) {
        /* Check immediately in case AdSense already resolved */
        if (applyStatus(container, ins)) return;

        /* MutationObserver: react the moment data-ad-status changes */
        const mo = new MutationObserver(() => {
            if (applyStatus(container, ins)) mo.disconnect();
        });

        mo.observe(ins, { attributes: true, attributeFilter: ['data-ad-status'] });

        /* Hard timeout — 12 s — hide container if still nothing */
        const timeout = setTimeout(() => {
            mo.disconnect();
            const hasContent = ins.querySelector('iframe') && ins.offsetHeight > 30;
            if (!hasContent) container.style.display = 'none';
        }, 12000);

        /* Clean up timeout if observer resolves first */
        ins._adTimeout = timeout;
    }

    /**
     * Reads data-ad-status and updates the container class.
     * Returns true when a terminal state is reached (filled or unfilled).
     */
    function applyStatus(container, ins) {
        const status  = ins.getAttribute('data-ad-status');
        const hasFrame = !!ins.querySelector('iframe') && ins.offsetHeight > 30;

        if (status === 'filled' || hasFrame) {
            container.classList.remove('ad-loading');
            container.classList.add('ad-loaded');
            container.removeAttribute('aria-hidden');
            clearTimeout(ins._adTimeout);
            return true;
        }

        if (status === 'unfilled') {
            container.style.display = 'none';
            clearTimeout(ins._adTimeout);
            return true;
        }

        return false;
    }

    /* Run after window load so AdSense scripts have had time to execute */
    if (document.readyState === 'complete') {
        initSmartAds();
    } else {
        window.addEventListener('load', initSmartAds, { once: true });
    }
})();