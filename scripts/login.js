// login.js

// Wird ausgeführt, sobald das DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
    setupGuestLogin();
    // setupNormalLogin(); // später, wenn nötig
});

/**
 * Event-Listener für den Guest-Login Button.
 * Nutzt die Backend-Funktion getOrCreateGuestUser() aus firebase.js
 */
function setupGuestLogin() {
    const guestLoginBtn = document.getElementById('guest-login-btn');
    if (!guestLoginBtn) {
        console.warn('Guest-Login-Button mit id="guest-login-btn" nicht gefunden.');
        return;
    }

    guestLoginBtn.addEventListener('click', async () => {
        try {
            // ⬇️ Backend-Aufruf: Guest-User holen oder erzeugen
            const guestUser = await getOrCreateGuestUser();

            console.log('Guest-User aus Backend:', guestUser);

            // Im Frontend merken (z.B. für summary/board/contacts)
            localStorage.setItem('currentUser', JSON.stringify(guestUser));
            localStorage.setItem('isGuest', 'true');

            // Weiterleitung – passe den Pfad an deine Struktur an
            window.location.href = '../html/summary.html';
        } catch (error) {
            console.error('Guest-Login fehlgeschlagen:', error);
            alert('Guest login failed: ' + error.message);
        }
    });
}
