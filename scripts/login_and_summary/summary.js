function getGreetingElements() {
  const greetingTextEl = document.querySelector(".greeting-text");
  const greetingNameEl = document.querySelector(".greeting-name");
  return { greetingTextEl, greetingNameEl };
}

function getSafeUserName(user) {
  const name = user?.name?.trim();
  if (!name || name.toLowerCase() === 'guest') {
    return '';
  }
  return name;
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
  if (!fullName) {
    greetingTextEl.textContent = greeting + '!';
    greetingNameEl.textContent = '';
  } else {
    showGreeting(greetingTextEl, greetingNameEl, greeting, fullName);
  }
}


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
  if (!fullName) {
    overlayText.textContent = greeting + '!';
    overlayName.textContent = '';
  } else {
    overlayText.textContent = `${greeting},`;
    overlayName.textContent = fullName;
  }
  overlay.classList.remove('hidden');
  setTimeout(() => {
    overlay.classList.add('hidden');
  }, 5000);
}

async function fetchTasksForSummary() {
  try {
    const tasksObj = (await fetchAllDataGlobal()).tasks;
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
  if (document.referrer.includes("login.html") && sessionStorage.getItem("visiting")){
    renderGreeting();
    showGreetingOverlay();
  }
  await loadAndRenderSummary();
}

document.addEventListener("DOMContentLoaded", initSummaryPage);



