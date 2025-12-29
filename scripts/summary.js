// ============================================
// AUTHENTICATION & USER MANAGEMENT
// ============================================

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

function requireAuth() {
  const user = getCurrentUserSafe();
  if (!user) {
    redirectToLogin();
  }
}

// ============================================
// HEADER AVATAR FUNCTIONS
// ============================================

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

// ============================================
// GREETING FUNCTIONS
// ============================================

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

// ============================================
// TASK DATA FUNCTIONS
// ============================================

async function fetchTasksForSummary() {
  const currentUser = getCurrentUserSafe();

  if (!currentUser || !currentUser.id) {
    console.warn("No current user found for summary");
    return [];
  }

  try {
    const tasksObj = await fetchTasksByUserId(currentUser.id); // <-- Nutzt jetzt die neue Funktion
    return Object.values(tasksObj || {});
  } catch (error) {
    console.error("Error fetching tasks for summary:", error);
    return [];
  }
}

function setTextContent(selector, value) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.textContent = String(value);
}

function countTasksByState(tasks, state) {
  return tasks.filter(
    (task) => (task.state || "").toLowerCase() === state.toLowerCase()
  ).length;
}

function countUrgentTasks(tasks) {
  return tasks.filter(
    (task) => (task.priority || "").toLowerCase() === "urgent"
  ).length;
}

// ============================================
// URGENT DEADLINE FUNCTIONS
// ============================================

function parseDueDate(rawDate) {
  if (!rawDate) return null;

  // Format: YYYY-MM-DD
  if (rawDate.includes("-")) {
    return new Date(rawDate);
  }

  // Format: DD/MM/YYYY or DD.MM.YYYY
  if (rawDate.includes("/") || rawDate.includes(".")) {
    const parts = rawDate.split(/[./]/);
    const [day, month, year] = parts;
    return new Date(`${year}-${month}-${day}`);
  }

  return null;
}

function findNextUrgentDeadline(tasks) {
  const urgentTasks = tasks.filter(
    (task) => (task.priority || "").toLowerCase() === "urgent"
  );

  if (urgentTasks.length === 0) {
    return null;
  }

  let nextDeadline = null;

  for (const task of urgentTasks) {
    const date = parseDueDate(task.due_date);
    if (!date) continue;
    if (!nextDeadline || date < nextDeadline) {
      nextDeadline = date;
    }
  }

  return nextDeadline;
}

function formatDateForDisplay(date) {
  if (!date) return "No deadline";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function updateUrgentCard(tasks) {
  const urgentCount = countUrgentTasks(tasks);
  const nextDeadline = findNextUrgentDeadline(tasks);

  setTextContent(".urgent-number", urgentCount);
  setTextContent(".urgent-date", formatDateForDisplay(nextDeadline));
}

// ============================================
// MAIN SUMMARY RENDER FUNCTION
// ============================================

async function loadAndRenderSummary() {
  try {
    const tasks = await fetchTasksForSummary();

    // Zähle Tasks nach State (entspricht der Board-Logik)
    const todo = countTasksByState(tasks, "todo");
    const done = countTasksByState(tasks, "done");
    const inProgress = countTasksByState(tasks, "in progress");
    const awaitFeedback = countTasksByState(tasks, "awaiting feedback");
    const total = tasks.length;

    // Aktualisiere die Zähler in der UI
    setTextContent(".todo-number", todo);
    setTextContent(".done-number", done);
    setTextContent(".board-number", total);
    setTextContent(".progress-number", inProgress);
    setTextContent(".feedback-number", awaitFeedback);

    // Urgent Tasks und Deadline
    updateUrgentCard(tasks);

  } catch (error) {
    console.error("Error loading summary data:", error);
    // Setze alle Werte auf 0 bei Fehler
    setTextContent(".todo-number", 0);
    setTextContent(".done-number", 0);
    setTextContent(".board-number", 0);
    setTextContent(".progress-number", 0);
    setTextContent(".feedback-number", 0);
    setTextContent(".urgent-number", 0);
    setTextContent(".urgent-date", "No deadline");
  }
}

async function initSummaryPage() {
  requireAuth();
  initHeaderAvatar();
  renderGreeting();
  
  
  await loadAndRenderSummary();
}

document.addEventListener("DOMContentLoaded", initSummaryPage);