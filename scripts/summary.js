document.addEventListener('DOMContentLoaded', startSummaryPage);


/**
 * Initializes the summary page
 */
async function startSummaryPage() {
  displayGreeting();
  showWelcomeOverlay();
  await loadTaskSummary();
}


/**
 * Loads current user from localStorage
 * @returns {Object|null} User object or null if not found
 */
function loadCurrentUser() {
  const userJson = localStorage.getItem('currentUser');
  if (!userJson) return null;
  
  return parseJsonSafely(userJson);
}


/**
 * Safely parses JSON string
 * @param {string} jsonString - JSON string to parse
 * @returns {Object|null} Parsed object or null on error
 */
function parseJsonSafely(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}


/**
 * Displays greeting message to user
 */
function displayGreeting() {
  const textElement = document.querySelector('.greeting-text');
  const nameElement = document.querySelector('.greeting-name');
  if (!textElement || !nameElement) return;
  
  const user = loadCurrentUser();
  const userName = extractUserName(user);
  const greeting = generateGreeting();
  
  if (!userName) {
    textElement.textContent = greeting + '!';
    nameElement.textContent = '';
  } else {
    textElement.textContent = greeting + ',';
    nameElement.textContent = userName;
  }
}


/**
 * Extracts user name from user object
 * @param {Object} user - User object
 * @returns {string} User name or empty string
 */
function extractUserName(user) {
  const name = user?.name?.trim();
  if (!name || name.toLowerCase() === 'guest') return '';
  
  return name;
}


/**
 * Generates time-appropriate greeting
 * @returns {string} Greeting message
 */
function generateGreeting() {
  const hour = new Date().getHours();
  
  if (hour >= 12 && hour < 18) return 'Good afternoon';
  if (hour >= 18 || hour < 5) return 'Good evening';
  return 'Good morning';
}


/**
 * Shows welcome overlay on mobile devices
 */
function showWelcomeOverlay() {
  if (window.innerWidth > 1025) return;
  
  const overlay = document.getElementById('greeting-overlay');
  if (!overlay) return;
  
  fillOverlayContent(overlay);
  displayOverlayTemporarily(overlay);
}


/**
 * Fills overlay with greeting content
 * @param {HTMLElement} overlay - Overlay element
 */
function fillOverlayContent(overlay) {
  const textElement = overlay.querySelector('.greeting-overlay-text');
  const nameElement = overlay.querySelector('.greeting-overlay-name');
  
  const user = loadCurrentUser();
  const userName = extractUserName(user);
  const greeting = generateGreeting();
  
  if (!userName) {
    textElement.textContent = greeting + '!';
    nameElement.textContent = '';
  } else {
    textElement.textContent = greeting + ',';
    nameElement.textContent = userName;
  }
}


/**
 * Displays overlay temporarily for 5 seconds
 * @param {HTMLElement} overlay - Overlay element
 */
function displayOverlayTemporarily(overlay) {
  overlay.classList.remove('hidden');
  
  setTimeout(() => {
    overlay.classList.add('hidden');
  }, 5000);
}


/**
 * Loads and displays task summary statistics
 */
async function loadTaskSummary() {
  try {
    const tasks = await fetchAllUserTasks();
    displayTaskStatistics(tasks);
  } catch (error) {
    console.error('Error loading summary:', error);
    displayEmptyStatistics();
  }
}


/**
 * Fetches all tasks for current user
 * @returns {Promise<Array>} Array of task objects
 */
async function fetchAllUserTasks() {
  const user = loadCurrentUser();
  if (!user || !user.id) {
    console.warn('No user found for summary');
    return [];
  }
  
  const tasksObject = await fetchTasksByUserId(user.id);
  return Object.values(tasksObject || {});
}


/**
 * Displays task statistics on page
 * @param {Array} tasks - Array of task objects
 */
function displayTaskStatistics(tasks) {
  const stats = calculateTaskStatistics(tasks);
  
  updateNumberDisplay('.todo-number', stats.todo);
  updateNumberDisplay('.done-number', stats.done);
  updateNumberDisplay('.board-number', stats.total);
  updateNumberDisplay('.progress-number', stats.inProgress);
  updateNumberDisplay('.feedback-number', stats.feedback);
  updateNumberDisplay('.urgent-number', stats.urgent);
  
  const deadline = findNextUrgentDeadline(tasks);
  updateTextDisplay('.urgent-date', formatDeadline(deadline));
}


/**
 * Calculates statistics from tasks array
 * @param {Array} tasks - Array of task objects
 * @returns {Object} Statistics object
 */
function calculateTaskStatistics(tasks) {
  return {
    todo: countTasksWithState(tasks, 'todo'),
    done: countTasksWithState(tasks, 'done'),
    inProgress: countTasksWithState(tasks, 'in progress'),
    feedback: countTasksWithState(tasks, 'awaiting feedback'),
    urgent: countTasksWithPriority(tasks, 'urgent'),
    total: tasks.length
  };
}


/**
 * Counts tasks with specific state
 * @param {Array} tasks - Array of task objects
 * @param {string} state - State to count
 * @returns {number} Number of tasks
 */
function countTasksWithState(tasks, state) {
  return tasks.filter(task => 
    (task.state || '').toLowerCase() === state.toLowerCase()
  ).length;
}


/**
 * Counts tasks with specific priority
 * @param {Array} tasks - Array of task objects
 * @param {string} priority - Priority to count
 * @returns {number} Number of tasks
 */
function countTasksWithPriority(tasks, priority) {
  return tasks.filter(task => 
    (task.priority || '').toLowerCase() === priority.toLowerCase()
  ).length;
}


/**
 * Finds next urgent deadline from tasks
 * @param {Array} tasks - Array of task objects
 * @returns {Date|null} Earliest deadline or null
 */
function findNextUrgentDeadline(tasks) {
  const urgentTasks = tasks.filter(task => 
    (task.priority || '').toLowerCase() === 'urgent'
  );
  
  if (urgentTasks.length === 0) return null;
  
  let earliestDate = null;
  
  for (const task of urgentTasks) {
    const date = parseDueDateString(task.due_date);
    if (!date) continue;
    
    if (!earliestDate || date < earliestDate) {
      earliestDate = date;
    }
  }
  
  return earliestDate;
}


/**
 * Parses due date string to Date object
 * @param {string} dateString - Date string to parse
 * @returns {Date|null} Parsed date or null
 */
function parseDueDateString(dateString) {
  if (!dateString) return null;
  
  if (dateString.includes('-')) {
    return new Date(dateString);
  }
  
  if (dateString.includes('/') || dateString.includes('.')) {
    const parts = dateString.split(/[./]/);
    const [day, month, year] = parts;
    return new Date(`${year}-${month}-${day}`);
  }
  
  return null;
}


/**
 * Formats date for display
 * @param {Date|null} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDeadline(date) {
  if (!date) return 'No deadline';
  
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}


/**
 * Updates number display element
 * @param {string} selector - CSS selector
 * @param {number} value - Value to display
 */
function updateNumberDisplay(selector, value) {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = String(value);
  }
}


/**
 * Updates text display element
 * @param {string} selector - CSS selector
 * @param {string} text - Text to display
 */
function updateTextDisplay(selector, text) {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = text;
  }
}


/**
 * Displays empty statistics (all zeros)
 */
function displayEmptyStatistics() {
  updateNumberDisplay('.todo-number', 0);
  updateNumberDisplay('.done-number', 0);
  updateNumberDisplay('.board-number', 0);
  updateNumberDisplay('.progress-number', 0);
  updateNumberDisplay('.feedback-number', 0);
  updateNumberDisplay('.urgent-number', 0);
  updateTextDisplay('.urgent-date', 'No deadline');
}