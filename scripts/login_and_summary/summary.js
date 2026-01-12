/**
 * Returns DOM elements used for rendering the greeting.
 * @returns {{greetingTextEl: Element|null, greetingNameEl: Element|null}}
 */
function getGreetingElements() {
  const greetingTextEl = document.querySelector(".greeting-text");
  const greetingNameEl = document.querySelector(".greeting-name");
  return { greetingTextEl, greetingNameEl };
}


/**
 * Returns a display-safe user name or empty string for guest/anonymous.
 * @param {?Object} user - User object.
 * @returns {string} Clean name or empty string.
 */
function getSafeUserName(user) {
  const name = user?.name?.trim();
  if (!name || name.toLowerCase() === 'guest') {
    return '';
  }
  return name;
}


/**
 * Chooses appropriate greeting text based on hour of day.
 * @param {number} hour - Hour in 0-23.
 * @returns {string} Greeting string.
 */
function calculateGreeting(hour) {
  if (hour >= 12 && hour < 18) return "Good afternoon";
  if (hour >= 18 || hour < 5) return "Good evening";
  return "Good morning";
}


/**
 * Renders greeting text and user name into provided elements.
 * @param {Element} greetingTextEl - Element for greeting text.
 * @param {Element} greetingNameEl - Element for name display.
 * @param {string} greeting - Greeting text.
 * @param {string} fullName - User name to display.
 */
function showGreeting(greetingTextEl, greetingNameEl, greeting, fullName) {
  greetingTextEl.textContent = `${greeting},`;
  greetingNameEl.textContent = fullName;
}


/**
 * Determines and renders the greeting for the summary page.
 */
function renderGreeting() {
  const { greetingTextEl, greetingNameEl } = getGreetingElements();
  if (!greetingTextEl || !greetingNameEl) return;
  const user = getCurrentUserSafe();
  const fullName = getSafeUserName(user);
  const hour = new Date().getHours();
  const greeting = calculateGreeting(hour);
  if (!fullName) {
    greetingTextEl.textContent = greeting + '!';
    greetingNameEl.textContent = '';
  } else {
    showGreeting(greetingTextEl, greetingNameEl, greeting, fullName);
  }
}


/**
 * Shows a mobile overlay greeting for short duration.
 */
function showGreetingOverlay() {
  if (window.innerWidth > 1025) return;
  const overlay = document.getElementById('greeting-overlay');
  const overlayText = document.querySelector('.greeting-overlay-text');
  const overlayName = document.querySelector('.greeting-overlay-name');
  if (!overlay) return;
  const user = getCurrentUserSafe();
  const fullName = getSafeUserName(user);
  const hour = new Date().getHours();
  const greeting = calculateGreeting(hour);
  chooseGreeting(fullName, overlayText, overlayName, greeting);
  displayOverlay(overlay);
}


/**
 * chooses the greeting message based on the availability of the user name
 */
function chooseGreeting(fullName, overlayText, overlayName, greeting) {
  if (!fullName) {
    overlayText.textContent = greeting + '!';
    overlayName.textContent = '';
  } else {
    overlayText.textContent = `${greeting},`;
    overlayName.textContent = fullName;
  }
}


/**
 * Removes and adds css classes to the overlay
 */
function displayOverlay(overlay) {
  overlay.classList.remove('hidden');
  setTimeout(() => {
    overlay.classList.add('hidden');
  }, 5000);
}

/**
 * Fetches tasks from the global data store for summary counts.
 * @returns {Promise<Array>} Array of task objects.
 */
async function fetchTasksForSummary() {
  try {
    const tasksObj = (await fetchAllDataGlobal()).tasks;
    return Object.values(tasksObj || {});
  } catch (error) {
    console.error("Error fetching tasks for summary:", error);
    return [];
  }
}


/**
 * Sets text content of the first element matching selector.
 * @param {string} selector - CSS selector.
 * @param {*} value - Value to display.
 */
function setTextContent(selector, value) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.textContent = String(value);
}


/**
 * Counts tasks matching a given state (case-insensitive).
 * @param {Array} tasks - Array of task objects.
 * @param {string} state - State to match.
 * @returns {number} Number of matching tasks.
 */
function countTasksByState(tasks, state) {
  return tasks.filter(
    (task) => (task.state || "").toLowerCase() === state.toLowerCase()
  ).length;
}


/**
 * Counts tasks with priority 'urgent'.
 * @param {Array} tasks - Array of task objects.
 * @returns {number} Number of urgent tasks.
 */
function countUrgentTasks(tasks) {
  return tasks.filter(
    (task) => (task.priority || "").toLowerCase() === "urgent"
  ).length;
}


/**
 * Parses a due date string into a Date object handling several formats.
 * @param {string} rawDate - Raw date string.
 * @returns {?Date} Parsed Date or null.
 */
function parseDueDate(rawDate) {
  if (!rawDate) return null;
  if (rawDate.includes("-")) {
    return new Date(rawDate);
  }
  if (rawDate.includes("/") || rawDate.includes(".")) {
    const parts = rawDate.split(/[./]/);
    const [day, month, year] = parts;
    return new Date(`${year}-${month}-${day}`);
  }
  return null;
}


/**
 * Finds the nearest upcoming due date among urgent tasks.
 * @param {Array} tasks - Array of task objects.
 * @returns {?Date} Closest urgent due date or null.
 */
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
  } return nextDeadline;
}


/**
 * Formats a Date for user display or returns a fallback string.
 * @param {?Date} date - Date to format.
 * @returns {string} Formatted date or fallback text.
 */
function formatDateForDisplay(date) {
  if (!date) return "No deadline";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}


/**
 * Updates the summary urgent card with count and next deadline.
 * @param {Array} tasks - Array of task objects.
 */
function updateUrgentCard(tasks) {
  const urgentCount = countUrgentTasks(tasks);
  const nextDeadline = findNextUrgentDeadline(tasks);
  setTextContent(".urgent-number", urgentCount);
  setTextContent(".urgent-date", formatDateForDisplay(nextDeadline));
}


/**
 * Loads summary data (tasks) and renders the various counters.
 */
async function loadAndRenderSummary() {
  try {
    const tasks = await fetchTasksForSummary();
    const todo = countTasksByState(tasks, "todo");
    const done = countTasksByState(tasks, "done");
    const inProgress = countTasksByState(tasks, "in progress");
    const awaitFeedback = countTasksByState(tasks, "awaiting feedback");
    const total = tasks.length;
    setTextContent(".todo-number", todo);
    setTextContent(".done-number", done);
    setTextContent(".board-number", total);
    setTextContent(".progress-number", inProgress);
    setTextContent(".feedback-number", awaitFeedback);
    updateUrgentCard(tasks);
  } catch (error) {
    setFallback();
  }
}


/**
 * Displays fallback number if fetching the data failed
 */
function setFallback() {
  setTextContent(".todo-number", 0);
  setTextContent(".done-number", 0);
  setTextContent(".board-number", 0);
  setTextContent(".progress-number", 0);
  setTextContent(".feedback-number", 0);
  setTextContent(".urgent-number", 0);
  setTextContent(".urgent-date", "No deadline");
}


/**
 * Initializes the summary page: checks auth, optionally shows greeting
 * and loads summary data.
 */
async function initSummaryPage() {
  requireAuth();
  if (document.referrer.includes("index.html") && sessionStorage.getItem("visiting")) {
    renderGreeting();
    showGreetingOverlay();
  }
  await loadAndRenderSummary();
}


document.addEventListener("DOMContentLoaded", initSummaryPage);



