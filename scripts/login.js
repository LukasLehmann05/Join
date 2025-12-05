document.addEventListener('DOMContentLoaded', () => {
    setupNormalLogin();
    setupGuestLogin();
});

function setupNormalLogin() {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const errorBox = document.getElementById('login-error-message');

function showError(msg) {
    if (errorBox) {
        errorBox.textContent = msg;
    } else {
        alert(msg); 
    }
}

    if (!loginForm || !emailInput || !passwordInput) {
        console.warn('Login form or input fields not found');
        return;
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
        showError('Please enter email and password.');
        return;
}

        try {
           const user = await getUserByEmail(email);

    if (!user) {
    showError('No account found with this email.');
    return;
}

if (!user.password) {
    showError('This account has no password set.');
    return;
}

if (user.password !== password) {
    showError('Wrong password.');
    return;
}

if (errorBox) errorBox.textContent = '';

           
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('isGuest', 'false');

            window.location.href = '../html/summary.html';
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed: ' + error.message);
        }
    });
}

function setupGuestLogin() {
    const guestLoginBtn = document.getElementById('guest-login-btn');
    const errorBox = document.getElementById('login-error-message');

    function showError(msg) {
        if (errorBox) {
            errorBox.textContent = msg;
        } else {
            alert(msg);
        }
    }

    if (!guestLoginBtn) {
        console.warn('Guest login button not found (id="guest-login-btn").');
        return;
    }

    guestLoginBtn.addEventListener('click', async () => {
        try {
            const guestUser = await getOrCreateGuestUser();
            console.log('Guest user from backend:', guestUser);

            localStorage.setItem('currentUser', JSON.stringify(guestUser));
            localStorage.setItem('isGuest', 'true');

            window.location.href = '../html/summary.html';
        } catch (error) {
            console.error('Guest login failed:', error);
            showError('Guest login failed: ' + error.message);
        }
    });
}
