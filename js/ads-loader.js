/* ============================================
   SMART ADSENSE LOADER
   Ad container hide kare jo ad load na thay
   ============================================ */

(function() {
    'use strict';

    // Wait for DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        initSmartAds();
    });

    function initSmartAds() {
        // Get all ad containers
        const adContainers = document.querySelectorAll('.ad-container');

        adContainers.forEach((container) => {
            const adElement = container.querySelector('.adsbygoogle');
            if (!adElement) return;

            // Check ad status periodically
            checkAdStatus(container, adElement);
        });
    }

    function checkAdStatus(container, adElement) {
        let attempts = 0;
        const maxAttempts = 20; // Max 10 seconds (500ms × 20)
        const checkInterval = 500;

        const interval = setInterval(() => {
            attempts++;

            const adStatus = adElement.getAttribute('data-ad-status');
            const adHeight = adElement.offsetHeight;
            const hasIframe = adElement.querySelector('iframe');

            // Ad loaded successfully
            if (adStatus === 'filled' || (hasIframe && adHeight > 30)) {
                container.classList.add('ad-loaded');
                container.classList.remove('ad-loading');
                clearInterval(interval);
                return;
            }

            // Ad failed to load (unfilled)
            if (adStatus === 'unfilled') {
                container.style.display = 'none';
                clearInterval(interval);
                return;
            }

            // Max attempts reached - hide
            if (attempts >= maxAttempts) {
                if (!hasIframe || adHeight < 30) {
                    container.style.display = 'none';
                }
                clearInterval(interval);
            }
        }, checkInterval);
    }

    // Re-check on window resize
    window.addEventListener('resize', debounce(() => {
        const adContainers = document.querySelectorAll('.ad-container:not(.ad-loaded)');
        adContainers.forEach((container) => {
            const adElement = container.querySelector('.adsbygoogle');
            if (adElement) checkAdStatus(container, adElement);
        });
    }, 300));

    // Debounce helper
    function debounce(func, wait) {
        let timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(func, wait);
        };
    }
})();