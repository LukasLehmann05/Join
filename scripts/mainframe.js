function loadCurrentUserRaw() {
  return localStorage.getItem("currentUser");
}

function parseJsonSafe(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
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

function initHeaderAvatar() {
  const { avatarButton, menu } = getAvatarCoreElements();
  if (!avatarButton || !menu) return;

  renderHeaderAvatar();
  setupAvatarToggle(avatarButton, menu);
  setupAvatarOutsideClick(avatarButton, menu);
  setupAvatarMenuLinks();
}

/**
 * Checks if user is authenticated
 */
function checkUserAuthentication() {
  const user = loadCurrentUser();
  if (!user) {
    redirectToLoginPage();
  }
}


/**
 * Loads current user from storage
 * @returns {Object|null} User object or null
 */
function loadCurrentUser() {
  return getCurrentUserSafe();
}


/**
 * Redirects to login page
 */
function redirectToLoginPage() {
  redirectToLogin();
}


/**
 * Saves current user ID to DOM element
 */
function saveCurrentUserIdToDOM() {
  const user = loadCurrentUser();
  if (!user || !user.id) return;
  
  setUserIdAttribute(user.id);
}


/**
 * Sets user ID as data attribute on element
 * @param {string} userId - User ID to set
 */
function setUserIdAttribute(userId) {
  const element = document.getElementById("current_user_id");
  if (element) {
    element.setAttribute("data-current-user-id", userId);
  }
}


/**
 * Dispatches mainframe-ready custom event
 */
function notifyMainframeReady() {
  const event = new CustomEvent('mainframe-ready');
  window.dispatchEvent(event);
}


/**
 * Initializes mainframe functionality
 */
function startMainframe() {
  checkUserAuthentication();
  saveCurrentUserIdToDOM();
  initHeaderAvatar();
  notifyMainframeReady();
}


document.addEventListener("DOMContentLoaded", startMainframe);