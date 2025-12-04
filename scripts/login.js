// login.js

document.addEventListener('DOMContentLoaded', () => {
    setupNormalLogin();
    setupGuestLogin();
});

/**
 * Normaler Login mit E-Mail und Passwort.
 * Nutzt getUserByEmail() aus firebase.js
 */
function setupNormalLogin() {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');

    if (!loginForm || !emailInput || !passwordInput) {
        console.warn('Login-Formular oder Inputs nicht gefunden.');
        return;
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            alert('Please enter email and password.');
            return;
        }

        try {
            const user = await getUserByEmail(email);

            if (!user) {
                alert('No account found with this email.');
                return;
            }

            if (!user.password) {
                alert('This account has no password set.');
                return;
            }

            if (user.password !== password) {
                alert('Wrong password.');
                return;
            }

            // Erfolgreich eingeloggt
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('isGuest', 'false');

            window.location.href = '../html/summary.html';
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed: ' + error.message);
        }
    });
}

/**
 * Guest Login – nutzt getOrCreateGuestUser() aus firebase.js
 */
function setupGuestLogin() {
    const guestLoginBtn = document.getElementById('guest-login-btn');

    if (!guestLoginBtn) {
        console.warn('Guest-Login-Button nicht gefunden (id="guest-login-btn").');
        return;
    }

    guestLoginBtn.addEventListener('click', async () => {
        try {
            const guestUser = await getOrCreateGuestUser();
            console.log('Guest-User aus Backend:', guestUser);

            localStorage.setItem('currentUser', JSON.stringify(guestUser));
            localStorage.setItem('isGuest', 'true');

            window.location.href = '../html/summary.html';
        } catch (error) {
            console.error('Guest login failed:', error);
            alert('Guest login failed: ' + error.message);
        }
    });
}
