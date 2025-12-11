function requireAuth() {
  const user = getCurrentUserSafe();
  if (!user) {
    redirectToLogin(); 
  }
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


async function fetchTasksForSummary() {
  const currentUser = getCurrentUserSafe();

  if (!currentUser || !currentUser.id) {
    return [];
  }

  const tasksObj = await fetchTasksForUser(currentUser.id);

  return Object.values(tasksObj || {});
}

function setTextContent(selector, value) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.textContent = String(value);
}

function countTasksByStatus(tasks, status) {
  return tasks.filter(
    (task) => (task.status || "").toLowerCase() === status.toLowerCase()
  ).length;
}

function updateStatusCounters(tasks) {
  const total = tasks.length;
  const todo = countTasksByStatus(tasks, "toDo");
  const inProgress = countTasksByStatus(tasks, "inProgress");
  const awaitFeedback = countTasksByStatus(tasks, "awaitFeedback");
  const done = countTasksByStatus(tasks, "done");

  setTextContent(".todo-number", todo);
  setTextContent(".done-number", done);
  setTextContent(".board-number", total);
  setTextContent(".progress-number", inProgress);
  setTextContent(".feedback-number", awaitFeedback);
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

function findUrgentStats(tasks) {
  const urgentTasks = tasks.filter((task) => {
    const priority = (task.priority || "").toLowerCase();
    return priority === "urgent";
  });

  if (urgentTasks.length === 0) {
    return { count: 0, nextDeadline: null };
  }

  let nextDeadline = null;

  for (const task of urgentTasks) {
    const date = parseDueDate(task.due_date || task.dueDate);
    if (!date) continue;
    if (!nextDeadline || date < nextDeadline) {
      nextDeadline = date;
    }
  }

  return {
    count: urgentTasks.length,
    nextDeadline,
  };
}

function formatDateForDisplay(date) {
  if (!date) return "No upcoming deadline";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function updateUrgentCard(tasks) {
  const { count, nextDeadline } = findUrgentStats(tasks);

  setTextContent(".urgent-number", count);
  setTextContent(".urgent-date", formatDateForDisplay(nextDeadline));
}

async function loadAndRenderSummary() {
  try {
    const tasks = await fetchTasksForSummary();
    updateStatusCounters(tasks);
    updateUrgentCard(tasks);
  } catch (e) {

  }
}

async function initSummaryPage() {
  requireAuth();       
  initHeaderAvatar();  
  renderGreeting();   
  await loadAndRenderSummary();
}

document.addEventListener("DOMContentLoaded", initSummaryPage);
