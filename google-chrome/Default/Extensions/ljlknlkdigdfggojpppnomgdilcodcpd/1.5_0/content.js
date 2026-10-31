// YouTube Play Next Button Extension
// Content script that runs on YouTube pages

(function () {
    'use strict';

    // No state management needed - extension always works

    // No need for custom button variables since we're using YouTube's native button

    // SVG fingerprint for YouTube's "Next" button icon
    const NEXT_BUTTON_SVG_PATH = "M20 20C20.26 20 20.51 19.89 20.70 19.70C20.89 19.51 21 19.26 21 19V5C21 4.73 20.89 4.48 20.70 4.29C20.51 4.10 20.26 4 20 4C19.73 4 19.48 4.10 19.29 4.29C19.10 4.48 19 4.73 19 5V19C19 19.26 19.10 19.51 19.29 19.70C19.48 19.89 19.73 20 20 20ZM5.04 19.77L18 12L5.04 4.22C4.84 4.10 4.60 4.03 4.36 4.03C4.12 4.03 3.89 4.09 3.68 4.21C3.47 4.32 3.30 4.49 3.18 4.70C3.06 4.91 2.99 5.14 3 5.38V18.61C2.99 18.85 3.06 19.08 3.18 19.29C3.30 19.50 3.47 19.67 3.68 19.79C3.89 19.90 4.12 19.96 4.36 19.96C4.60 19.96 4.84 19.89 5.04 19.77Z";

    // Function to find a button by its SVG content (Icon Fingerprinting)
    function findButtonBySvgPath(pathData) {
        const paths = document.querySelectorAll(`path[d="${pathData}"]`);
        for (const path of paths) {
            // Find the closest parent button-like element
            const button = path.closest('button') || path.closest('.ytp-button');
            if (button) return button;
        }
        return null;
    }

    // Function to make YouTube's hidden next button visible
    function showNativeNextButton() {
        const nextButton = getNativeNextButton();

        if (nextButton) {
            // Use getComputedStyle for accurate visibility check
            const style = window.getComputedStyle(nextButton);
            const isHidden = style.display === 'none' ||
                style.visibility === 'hidden' ||
                nextButton.hasAttribute('hidden');

            if (isHidden) {
                nextButton.style.setProperty('display', 'inline-block', 'important');
                nextButton.style.setProperty('visibility', 'visible', 'important');
                return true;
            }
        }
        return false;
    }

    // Function to get YouTube's native next button using layered detection
    function getNativeNextButton() {
        // Priority 1: Direct Class Selection (Fastest)
        let btn = document.querySelector('.ytp-next-button');
        if (btn) {
            console.log('Found next button using class selection');
            return btn;
        }

        // Priority 2: SVG Fingerprinting (Most Robust)
        btn = findButtonBySvgPath(NEXT_BUTTON_SVG_PATH);
        if (btn) {
            console.log('Found next button using SVG fingerprinting');
            return btn;
        }

        // Priority 3: Accessibility Search
        const nextButtonSelectors = [
            ".ytp-button[title*='Next']",
            ".ytp-button[aria-label*='Next']",
            "button[aria-label*='Next video']",
            ".ytp-chrome-controls .ytp-button[title*='Next']"
        ];

        for (const selector of nextButtonSelectors) {
            btn = document.querySelector(selector);
            if (btn) {
                console.log('Found next button using accessibility search');
                return btn;
            }
        }

        return null;
    }

    // Function to inject script into the page context to access the movie_player API
    function triggerApiNext() {
        const script = document.createElement('script');
        script.textContent = `
            (function() {
                const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
                if (player && typeof player.nextVideo === 'function') {
                    player.nextVideo();
                    // We can't easily know if nextVideo() succeeded (it returns void), 
                    // but it usually works if the method exists.
                } else {
                    // If API fails, try one last DOM-based click
                    const btn = document.querySelector('.ytp-next-button');
                    if (btn) {
                        btn.click();
                    } else {
                        // If everything fails, tell the content script to show a notification
                        window.postMessage({ type: 'YOUTUBE_NEXT_ERROR', message: "No 'next video' available!" }, '*');
                    }
                }
            })();
        `;
        (document.head || document.documentElement).appendChild(script);
        script.remove();
    }

    // Function to show notifications
    function showNotification(message) {
        // Remove existing notification
        const existingNotification = document.getElementById("youtube-play-next-notification");
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement("div");
        notification.id = "youtube-play-next-notification";
        notification.textContent = message;

        Object.assign(notification.style, {
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "#333",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "6px",
            fontSize: "14px",
            zIndex: "10000",
            fontFamily: "Roboto, Arial, sans-serif",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)"
        });

        document.body.appendChild(notification);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // Function to inject custom CSS to hide rectangular backgrounds on player buttons
    function injectCustomStyles() {
        // Check if styles already injected
        if (document.getElementById('youtube-play-next-custom-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'youtube-play-next-custom-styles';
        style.textContent = `
            /* Hide rectangular/D-shaped background on next button */
            .ytp-next-button.ytp-button,
            .ytp-next-button.ytp-button:hover,
            .ytp-next-button.ytp-button:focus,
            .ytp-next-button.ytp-playlist-ui {
                background: transparent !important;
                background-color: transparent !important;
                border-radius: 0 !important;
                border-top-left-radius: 0 !important;
                border-bottom-left-radius: 0 !important;
                backdrop-filter: none !important;
            }
            
            /* Hide rectangular hover background on pause/play button, keep only oval */
            .ytp-play-button.ytp-button:hover,
            .ytp-play-button.ytp-button:focus,
            .ytp-pause-button.ytp-button:hover,
            .ytp-pause-button.ytp-button:focus {
                background: transparent !important;
                background-color: transparent !important;
            }
            
            /* Hide backgrounds on the button itself */
            .ytp-play-button.ytp-button,
            .ytp-pause-button.ytp-button {
                background: transparent !important;
                background-color: transparent !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Function to ensure next button is visible when page loads
    function ensureNextButtonVisible() {
        // Try to show YouTube's native next button if it exists but is hidden
        showNativeNextButton();
        // Inject custom styles for button backgrounds
        injectCustomStyles();
    }


    // Function to check if we're on a YouTube video page
    function isVideoPage() {
        return window.location.pathname.includes("/watch") ||
            window.location.pathname.includes("/embed/");
    }

    // Track the last URL to detect navigation
    let lastUrl = location.href;

    // Function to handle video page changes
    function onVideoPageChange() {
        if (!isVideoPage()) return;

        // Try multiple times with increasing delays to catch the button
        // YouTube's player loads asynchronously, so we need to be patient
        const delays = [500, 1000, 2000, 3000];
        delays.forEach(delay => {
            setTimeout(ensureNextButtonVisible, delay);
        });
    }

    // Observe URL changes (YouTube is a SPA)
    function observeUrlChanges() {
        const observer = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                onVideoPageChange();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Observe video player changes
    function observePlayerChanges() {
        // Watch for when the video player controls are added/changed
        const observer = new MutationObserver(() => {
            if (isVideoPage()) {
                ensureNextButtonVisible();
            }
        });

        // Observe the movie_player element which contains the controls
        const checkForPlayer = setInterval(() => {
            const moviePlayer = document.querySelector('#movie_player');
            if (moviePlayer) {
                clearInterval(checkForPlayer);
                observer.observe(moviePlayer, {
                    childList: true,
                    subtree: true
                });
            }
        }, 500);
    }

    // Initial setup
    function init() {
        // Inject custom styles immediately
        injectCustomStyles();

        // Show next button if we're on a video page
        if (isVideoPage()) {
            onVideoPageChange();
        }

        // Set up observers for navigation and player changes
        observeUrlChanges();
        observePlayerChanges();

        // Listen for failure messages from the injected script
        window.addEventListener('message', (event) => {
            // We only accept messages from ourselves
            if (event.source !== window || !event.data || event.data.type !== 'YOUTUBE_NEXT_ERROR') {
                return;
            }
            showNotification(event.data.message);
        });
    }

    // Wait for DOM to be ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();

