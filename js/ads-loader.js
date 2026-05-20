/* ============================================
   SMART ADSENSE LOADER
   Ad container show kare jab ad load thay
   ============================================ */

(function() {
    'use strict';

    // Wait for window fully loaded (not just DOM)
    window.addEventListener('load', function() {
        // Delay 1 second to give AdSense time to inject
        setTimeout(initSmartAds, 1000);
    });

    function initSmartAds() {
        const adContainers = document.querySelectorAll('.ad-container');

        adContainers.forEach((container) => {
            const adElement = container.querySelector('.adsbygoogle');
            if (!adElement) return;

            checkAdStatus(container, adElement);
        });
    }

    function checkAdStatus(container, adElement) {
        let attempts = 0;
        const maxAttempts = 30; // 15 seconds total
        const checkInterval = 500;

        const interval = setInterval(() => {
            attempts++;

            const adStatus = adElement.getAttribute('data-ad-status');
            const adHeight = adElement.offsetHeight;
            const hasIframe = adElement.querySelector('iframe');

            // Ad loaded successfully
            if (adStatus === 'filled' || (hasIframe && adHeight > 50)) {
                container.classList.add('ad-loaded');
                clearInterval(interval);
                return;
            }

            // Ad failed to load (unfilled)
            if (adStatus === 'unfilled') {
                container.style.display = 'none';
                clearInterval(interval);
                return;
            }

            // Max attempts reached
            if (attempts >= maxAttempts) {
                if (!hasIframe || adHeight < 50) {
                    container.style.display = 'none';
                }
                clearInterval(interval);
            }
        }, checkInterval);
    }
})();