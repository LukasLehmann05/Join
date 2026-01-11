/** @type {HTMLElement} The overlay container for the animated logo */
const animationOverlay = document.getElementById('animationOverlay');

/** @type {HTMLElement} The main login wrapper element */
const loginWrapper = document.querySelector('.login-wrapper');

/** @type {HTMLElement} The animated logo image element */
const animatedLogo = document.querySelector('.animated-logo');


/**
 * Initializes the logo animation on page load.
 * Displays a centered logo that animates to the top-left corner,
 * then transitions to a static logo position.
 */
function initLogoAnimation() {
    loginWrapper.classList.add('visible');
    setTimeout(() => {
        animationOverlay.classList.add('fade-out');
    }, 1000);
    setTimeout(() => {
        animationOverlay.classList.add('static');
    }, 1500);
}

document.addEventListener('DOMContentLoaded', initLogoAnimation);