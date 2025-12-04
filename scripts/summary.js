function getInitials(name) {
    if (!name) return "?";

    const parts = name.trim().split(" ");

    // Ein Name → erster Buchstabe
    if (parts.length === 1) {
        return parts[0][0].toUpperCase();
    }

    // Zwei oder mehr Namen → erste zwei Buchstaben
    return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getInitials(name) {
    if (!name) return "?";

    const parts = name.trim().split(" ");

    if (parts.length === 1) {
        return parts[0][0].toUpperCase();
    }

    return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getCurrentUserSafe() {
    const raw = localStorage.getItem('currentUser');

    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch (e) {
        console.warn('currentUser in localStorage ist kein gültiges JSON:', raw);
        return null;
    }
}

function renderHeaderAvatar() {
    const avatarElement = document.getElementById('header-avatar');
    if (!avatarElement) return;

    const user = getCurrentUserSafe();

    let initials = "?";

    if (user && user.name) {
        initials = getInitials(user.name);
    }

    avatarElement.textContent = initials;
}


function setupAvatarMenu() {
    const avatarButton = document.getElementById('avatar-button');
    const menu = document.getElementById('avatar-menu');
    const legalBtn = document.getElementById('menu-legal');
    const privacyBtn = document.getElementById('menu-privacy');
    const logoutBtn = document.getElementById('menu-logout');

    if (!avatarButton || !menu) return;

    // Menü ein-/ausblenden beim Klick auf Avatar
    avatarButton.addEventListener('click', (event) => {
        event.stopPropagation(); // verhindert, dass der Document-Klick es direkt wieder schließt
        menu.classList.toggle('hidden');
    });

    // Klick außerhalb schließt das Menü
    document.addEventListener('click', (event) => {
        if (!menu.classList.contains('hidden')) {
            const clickedInsideMenu = menu.contains(event.target);
            const clickedAvatar = avatarButton.contains(event.target);
            if (!clickedInsideMenu && !clickedAvatar) {
                menu.classList.add('hidden');
            }
        }
    });

    // Menü-Aktionen
    if (legalBtn) {
        legalBtn.addEventListener('click', () => {
            window.location.href = '../html/legalNotice.html';
        });
    }

    if (privacyBtn) {
        privacyBtn.addEventListener('click', () => {
            window.location.href = '../html/privacyPolicy.html';
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isGuest');
            window.location.href = '../html/login.html';
        });
    }
}


document.addEventListener("DOMContentLoaded", () => {
    renderHeaderAvatar();
    setupAvatarMenu();
});
