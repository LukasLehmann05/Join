/**
 * Initializes the logo animation on page load.
 * Displays a centered logo that animates to the top-left corner,
 * then transitions to a static logo position.
 */
function initLogoAnimation() {
    /** @type {HTMLElement} The overlay container for the animated logo */
    const animationOverlay = document.getElementById('animationOverlay');
    
    /** @type {HTMLElement} The main login wrapper element */
    const loginWrapper = document.querySelector('.login-wrapper');
    
    /** @type {HTMLElement} The animated logo image element */
    const animatedLogo = document.querySelector('.animated-logo');
    
    // Make login page visible immediately
    loginWrapper.classList.add('visible');
    
    /**
     * Fades out the overlay background after 1 second
     * to reveal the login page beneath the moving logo
     */
    setTimeout(() => {
        animationOverlay.classList.add('fade-out');
    }, 1000);

    /**
     * Converts the animated overlay to a static positioned element
     * and transforms the animated logo into the permanent logo
     */
    setTimeout(() => {
                animationOverlay.classList.add('static');
            }, 1500);
}

// Execute animation when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initLogoAnimation);