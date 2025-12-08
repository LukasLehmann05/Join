function loadCurrentUserRaw() {
    return localStorage.getItem("currentUser");
}

function parseJsonSafe(json) {
    try {
        return JSON.parse(json);
    } catch (e) {
        console.warn("currentUser in localStorage ist kein gültiges JSON:", json);
        return null;
    }
}

function getCurrentUserSafe() {
    const raw = loadCurrentUserRaw();
    if (!raw) return null;
    return parseJsonSafe(raw);
}

function redirectToLogin() {
    window.location.href = "../html/login.html";
}

function requireAuth() {
    const user = getCurrentUserSafe();
    if (!user) redirectToLogin();
}

function getInitialsFromParts(parts) {
    if (parts.length === 0) return "?";
    if (parts.length === 1) {
        return parts[0][0].toUpperCase();
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getInitials(name) {
    const cleanName = name ? name.trim() : "";
    if (!cleanName) return "?";
    const parts = cleanName.split(" ");
    return getInitialsFromParts(parts);
}

function getUserInitials(user) {
    if (!user || !user.name) return "?";
    return getInitials(user.name);
}

function updateAvatarText(avatarElement, initials) {
    avatarElement.textContent = initials;
}

function renderHeaderAvatar() {
    const avatarElement = document.getElementById("header-avatar");
    if (!avatarElement) return;
    const user = getCurrentUserSafe();
    const initials = getUserInitials(user);
    updateAvatarText(avatarElement, initials);
}

function getGreetingElements() {
    const greetingTextEl = document.querySelector(".greeting-text");
    const greetingNameEl = document.querySelector(".greeting-name");
    return { greetingTextEl, greetingNameEl };
}

function getSafeUserName(user) {
    const name = user?.name?.trim();
    return name || "Guest";
}

function calculateGreeting(hour) {
    if (hour >= 12 && hour < 18) return "Good afternoon";
    if (hour >= 18 || hour < 5) return "Good evening";
    return "Good morning";
}

function showGreeting(greetingTextEl, greetingNameEl, greeting, fullName) {
    greetingTextEl.textContent = `${greeting},`;
    greetingNameEl.textContent = fullName;
}

function renderGreeting() {
    const { greetingTextEl, greetingNameEl } = getGreetingElements();
    if (!greetingTextEl || !greetingNameEl) return;

    const user = getCurrentUserSafe();
    const fullName = getSafeUserName(user);
    const hour = new Date().getHours();
    const greeting = calculateGreeting(hour);

    showGreeting(greetingTextEl, greetingNameEl, greeting, fullName);
}

function getAvatarCoreElements() {
    const avatarButton = document.getElementById("avatar-button");
    const menu = document.getElementById("avatar-menu");
    return { avatarButton, menu };
}

function toggleMenuVisibility(event, menu) {
    event.stopPropagation();
    menu.classList.toggle("hidden");
}

function setupAvatarToggle(avatarButton, menu) {
    avatarButton.addEventListener("click", (event) => {
        toggleMenuVisibility(event, menu);
    });
}

function hideMenuIfClickedOutside(event, avatarButton, menu) {
    if (menu.classList.contains("hidden")) return;
    const inMenu = menu.contains(event.target);
    const inAvatar = avatarButton.contains(event.target);
    if (!inMenu && !inAvatar) {
        menu.classList.add("hidden");
    }
}

function setupAvatarOutsideClick(avatarButton, menu) {
    document.addEventListener("click", (event) => {
        hideMenuIfClickedOutside(event, avatarButton, menu);
    });
}

function handleLegalClick() {
    window.location.href = "../html/legalNotice.html";
}

function handlePrivacyClick() {
    window.location.href = "../html/privacyPolicy.html";
}

function handleLogoutClick() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isGuest");
    redirectToLogin();
}

function addClickIfPresent(element, handler) {
    if (!element) return;
    element.addEventListener("click", handler);
}

function setupAvatarMenuLinks() {
    const legalBtn = document.getElementById("menu-legal");
    const privacyBtn = document.getElementById("menu-privacy");
    const logoutBtn = document.getElementById("menu-logout");

    addClickIfPresent(legalBtn, handleLegalClick);
    addClickIfPresent(privacyBtn, handlePrivacyClick);
    addClickIfPresent(logoutBtn, handleLogoutClick);
}

function setupAvatarMenu() {
    const { avatarButton, menu } = getAvatarCoreElements();
    if (!avatarButton || !menu) return;

    setupAvatarToggle(avatarButton, menu);
    setupAvatarOutsideClick(avatarButton, menu);
    setupAvatarMenuLinks();
}

function initHeader() {
    requireAuth();
    renderHeaderAvatar();
    setupAvatarMenu();
    renderGreeting();
}

document.addEventListener("DOMContentLoaded", initHeader);
