/**
 * Loads the raw `currentUser` JSON string from localStorage.
 * @returns {?string} Raw JSON string or null.
 */
function loadCurrentUserRaw() {
  return localStorage.getItem("currentUser");
}


/**
 * Safely parses JSON and returns null on failure.
 * @param {string} json - JSON string to parse.
 * @returns {?Object} Parsed object or null if invalid.
 */
function parseJsonSafe(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}


/**
 * Retrieves the current user object from localStorage, safely parsed.
 * @returns {?Object} Parsed current user object or null.
 */
function getCurrentUserSafe() {
  const raw = loadCurrentUserRaw();
  if (!raw) return null;
  return parseJsonSafe(raw);
}


/**
 * Redirects the browser to the login page.
 */
function redirectToLogin() {
  window.location.href = "../index.html";
}


/**
 * Builds initials string from name parts.
 * @param {string[]} parts - Array of name parts.
 * @returns {string} Initials or '?' when not available.
 */
function getInitialsFromParts(parts) {
  if (parts.length === 0) return "?";
  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}


/**
 * Computes initials from a full name string.
 * @param {string} name - Full name.
 * @returns {string} Initials.
 */
function getInitials(name) {
  const cleanName = name ? name.trim() : "";
  if (!cleanName) return "?";
  const parts = cleanName.split(" ");
  return getInitialsFromParts(parts);
}


/**
 * Returns initials for a user object.
 * @param {?Object} user - User object containing `name`.
 * @returns {string} Initials or '?'.
 */
function getUserInitials(user) {
  if (!user || !user.name) return "?";
  return getInitials(user.name);
}


/**
 * Updates the avatar element's displayed text.
 * @param {HTMLElement} avatarElement - Element to update.
 * @param {string} initials - Text to set.
 */
function updateAvatarText(avatarElement, initials) {
  avatarElement.textContent = initials;
}


/**
 * Renders the header avatar using current user initials.
 */
function renderHeaderAvatar() {
  const avatarElement = document.getElementById("header-avatar");
  if (!avatarElement) return;
  const user = getCurrentUserSafe();
  const initials = getUserInitials(user);
  updateAvatarText(avatarElement, initials);
}


/**
 * Returns the core avatar DOM elements (button and menu).
 * @returns {{avatarButton: HTMLElement|null, menu: HTMLElement|null}}
 */
function getAvatarCoreElements() {
  const avatarButton = document.getElementById("avatar-button");
  const menu = document.getElementById("avatar-menu");
  return { avatarButton, menu };
}


/**
 * Toggles visibility of the avatar menu and stops event propagation.
 * @param {Event} event - Click event.
 * @param {HTMLElement} menu - Menu element to toggle.
 */
function toggleMenuVisibility(event, menu) {
  event.stopPropagation();
  menu.classList.toggle("show-avatar-menu");
}


/**
 * Attaches click handler to avatar button to toggle menu.
 * @param {HTMLElement} avatarButton - Button that toggles menu.
 * @param {HTMLElement} menu - Menu element to toggle.
 */
function setupAvatarToggle(avatarButton, menu) {
  avatarButton.addEventListener("click", (event) => {
    toggleMenuVisibility(event, menu);
  });
}


/**
 * Hides the avatar menu when a click occurs outside of it.
 * @param {Event} event - Click event.
 * @param {HTMLElement} avatarButton - Avatar button element.
 * @param {HTMLElement} menu - Menu element.
 */
function hideMenuIfClickedOutside(event, avatarButton, menu) {
  if (!menu.classList.contains("show-avatar-menu")) return;
  const inMenu = menu.contains(event.target);
  const inAvatar = avatarButton.contains(event.target);
  if (!inMenu && !inAvatar) {
    menu.classList.remove("show-avatar-menu");
  }
}


/**
 * Sets up a document click listener to close the avatar menu when
 * clicking outside.
 * @param {HTMLElement} avatarButton - Avatar button element.
 * @param {HTMLElement} menu - Menu element.
 */
function setupAvatarOutsideClick(avatarButton, menu) {
  document.addEventListener("click", (event) => {
    hideMenuIfClickedOutside(event, avatarButton, menu);
  });
}


/**
 * Navigates to the legal notice page.
 */
function handleLegalClick() {
  window.location.href = "../html/legal_notice.html";
}


/**
 * Navigates to the privacy policy page.
 */
function handlePrivacyClick() {
  window.location.href = "../html/privacy_policy.html";
}


/**
 * Clears session data and redirects to login (logout action).
 */
function handleLogoutClick() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("isGuest");
  redirectToLogin();
}


/**
 * Adds a click listener to an element if it exists.
 * @param {?HTMLElement} element - Element to attach handler to.
 * @param {Function} handler - Click event handler.
 */
function addClickIfPresent(element, handler) {
  if (!element) return;
  element.addEventListener("click", handler);
}


/**
 * Attaches click handlers to the avatar menu links (legal, privacy, logout).
 */
function setupAvatarMenuLinks() {
  const helpBtn = document.getElementById("menu-help");
  const legalBtn = document.getElementById("menu-legal");
  const privacyBtn = document.getElementById("menu-privacy");
  const logoutBtn = document.getElementById("menu-logout");
  addClickIfPresent(helpBtn, handleHelpClick);
  addClickIfPresent(legalBtn, handleLegalClick);
  addClickIfPresent(privacyBtn, handlePrivacyClick);
  addClickIfPresent(logoutBtn, handleLogoutClick);
}


/**
 * Initializes header avatar UI: renders avatar and hooks menu behavior.
 */
function initHeaderAvatar() {
  const { avatarButton, menu } = getAvatarCoreElements();
  if (!avatarButton || !menu) return;
  renderHeaderAvatar();
  setupAvatarToggle(avatarButton, menu);
  setupAvatarOutsideClick(avatarButton, menu);
  setupAvatarMenuLinks();
}


/**
 * Ensures a user is authenticated, redirects to login if not.
 */
function requireAuth() {
  const user = getCurrentUserSafe();
  if (!user) {
    redirectToLogin();
  }
}


/**
 * Updates DOM element with current user's id as a data attribute.
 */
function updateCurrentUserId() {
  const user = getCurrentUserSafe();
  if (!user || !user.id) return;
  const userIdElement = document.getElementById("current_user_id");
  if (userIdElement) {
    userIdElement.setAttribute("data-current-user-id", user.id);
  }
}


/**
 * Main initialization for pages using the mainframe: enforces auth,
 * updates user id, initializes header avatar and emits ready event.
 */
function initMainframe() {
  requireAuth();
  updateCurrentUserId();
  initHeaderAvatar();
  window.dispatchEvent(new CustomEvent('mainframe-ready'));
}


document.addEventListener("DOMContentLoaded", initMainframe);



