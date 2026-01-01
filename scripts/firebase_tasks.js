/**
 * Creates task object with metadata
 * @param {string} title - Task title
 * @param {string} description - Task description
 * @param {string} dueDate - Due date
 * @param {string} priority - Task priority
 * @param {string} category - Task category
 * @param {Array} contacts - Assigned contacts
 * @param {Array} subtasks - Task subtasks
 * @returns {Object} Task object
 */
function createTaskObject(title, description, dueDate, priority, category, contacts, subtasks) {
  return {
    title,
    description,
    dueDate,
    priority,
    category,
    contacts,
    subtasks,
    createdAt: new Date().toISOString(),
  };
}


/**
 * Saves task for specific user
 * @param {string} userId - User ID
 * @param {string} title - Task title
 * @param {string} description - Task description
 * @param {string} dueDate - Due date
 * @param {string} priority - Task priority
 * @param {string} category - Task category
 * @param {Array} contacts - Assigned contacts
 * @param {Array} subtasks - Task subtasks
 * @returns {Promise<Object>} Created task with ID
 */
async function saveTaskForUser(userId, title, description, dueDate, priority, category, contacts, subtasks) {
  const taskData = createTaskObject(
    title,
    description,
    dueDate,
    priority,
    category,
    contacts,
    subtasks
  );

  return await saveDataToFirebase(
    `users/${userId}/tasks`,
    taskData,
    'Error creating task for user'
  );
}


/**
 * Loads all tasks for specific user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Tasks object
 */
async function loadTasksForUser(userId) {
  const url = buildFirebaseUrl(`users/${userId}/tasks`);
  return await fetchDataFromUrl(url, 'Error loading tasks for user');
}


/**
 * Loads tasks by user ID from task references
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User tasks object
 */
async function loadTasksByUserId(userId) {
  try {
    const taskReferences = await loadTaskReferences(userId);
    if (!taskReferences) return {};
    
    const referencesArray = convertToArray(taskReferences);
    if (referencesArray.length === 0) return {};
    
    const allTasks = await loadAllTasks();
    return extractUserTasks(referencesArray, allTasks);
    
  } catch (error) {
    console.error('Error fetching tasks by user ID:', error);
    return {};
  }
}


/**
 * Loads task references for user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Task references
 */
async function loadTaskReferences(userId) {
  const url = buildFirebaseUrl(`tasks_by_user/${userId}`);
  return await fetchDataFromUrl(url, 'Error loading task refs for user');
}


/**
 * Loads all tasks from database
 * @returns {Promise<Object>} All tasks object
 */
async function loadAllTasks() {
  const url = buildFirebaseUrl('tasks');
  return await fetchDataFromUrl(url, 'Error loading all tasks');
}


/**
 * Extracts user tasks from references and all tasks
 * @param {Array} referencesArray - Task references array
 * @param {Object} allTasks - All tasks object
 * @returns {Object} User tasks object
 */
function extractUserTasks(referencesArray, allTasks) {
  const userTasks = {};
  
  for (const item of referencesArray) {
    if (!item || typeof item !== 'object') continue;
    
    const taskId = Object.keys(item)[0];
    
    if (taskId && allTasks[taskId]) {
      userTasks[taskId] = allTasks[taskId];
    }
  }
  
  return userTasks;
}


/**
 * Loads all task IDs for user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of task IDs
 */
async function loadAllTaskIds(userId) {
  try {
    const taskReferences = await loadTaskReferences(userId);
    if (!taskReferences) return [];
    
    return convertToArray(taskReferences);
    
  } catch (error) {
    console.error('Error getting task IDs by user ID:', error);
    return [];
  }
}


/**
 * Loads task by ID
 * @param {string} taskId - Task ID
 * @returns {Promise<Object|null>} Task object or null
 */
async function loadTaskById(taskId) {
  try {
    const url = buildFirebaseUrl(`tasks/${taskId}`);
    return await fetchDataFromUrl(url, 'Error loading task');
  } catch (error) {
    console.error('Error fetching task:', error);
    return null;
  }
}


/**
 * Removes task from user's task list
 * @param {string} taskId - Task ID to remove
 * @param {string} userId - User ID
 */
async function removeTaskFromUser(taskId, userId) {
  try {
    const taskReferences = await loadTaskReferences(userId);
    if (!taskReferences) return;
    
    const taskIndex = findTaskIndex(taskReferences, taskId);
    
    if (taskIndex !== -1) {
      await deleteTaskAtIndex(userId, taskIndex);
    }
    
  } catch (error) {
    console.error('Error deleting task from user:', error);
  }
}


/**
 * Finds task index in references array
 * @param {Object} taskReferences - Task references object
 * @param {string} taskId - Task ID to find
 * @returns {number} Task index or -1
 */
function findTaskIndex(taskReferences, taskId) {
  const referencesArray = convertToArray(taskReferences);
  
  return referencesArray.findIndex(item => {
    if (!item || typeof item !== 'object') return false;
    const id = Object.keys(item)[0];
    return id === taskId;
  });
}


/**
 * Deletes task at specific index
 * @param {string} userId - User ID
 * @param {number} index - Task index
 */
async function deleteTaskAtIndex(userId, index) {
  const deleteUrl = `${FIREBASE_BASE_URL}/join/tasks_by_user/${userId}/${index}.json`;
  await fetch(deleteUrl, { method: 'DELETE' });
}


/**
 * Creates task and links to user
 * @param {string} userId - User ID
 * @param {Object} taskData - Task data object
 * @returns {Promise<Object>} Created task with ID
 */
async function saveTaskAndLinkToUser(userId, taskData) {
  try {
    const taskId = await createTaskInDatabase(taskData);
    await linkTaskToUser(userId, taskId);
    
    return { taskId, ...taskData };
    
  } catch (error) {
    console.error('Error creating task and linking to user:', error);
    throw error;
  }
}


/**
 * Creates task in database
 * @param {Object} taskData - Task data
 * @returns {Promise<string>} Created task ID
 */
async function createTaskInDatabase(taskData) {
  const taskUrl = buildFirebaseUrl('tasks');
  const response = await sendDataToUrl(taskUrl, taskData, 'Error creating task');
  return response.name;
}


/**
 * Links task to user's task list
 * @param {string} userId - User ID
 * @param {string} taskId - Task ID
 */
async function linkTaskToUser(userId, taskId) {
  const currentReferences = await loadTaskReferences(userId);
  const updatedReferences = addTaskReference(currentReferences, taskId);
  await saveTaskReferences(userId, updatedReferences);
}


/**
 * Adds task reference to existing references
 * @param {Object|null} existingReferences - Existing references
 * @param {string} taskId - Task ID to add
 * @returns {Array} Updated references array
 */
function addTaskReference(existingReferences, taskId) {
  const referencesArray = existingReferences 
    ? convertToArray(existingReferences) 
    : [];
  
  const newReference = {};
  newReference[taskId] = true;
  referencesArray.push(newReference);
  
  return referencesArray;
}


/**
 * Saves task references to database
 * @param {string} userId - User ID
 * @param {Array} referencesArray - References array
 */
async function saveTaskReferences(userId, referencesArray) {
  const updateUrl = `${FIREBASE_BASE_URL}/join/tasks_by_user/${userId}.json`;
  
  await fetch(updateUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(referencesArray)
  });
}


const createTaskForUser = saveTaskForUser;
const fetchTasksForUser = loadTasksForUser;
const fetchTasksByUserId = loadTasksByUserId;
const getAllTaskIdByUserId = loadAllTaskIds;
const getTaskById = loadTaskById;
const deleteTaskFromUserById = removeTaskFromUser;
const createTaskAndLinkToUser = saveTaskAndLinkToUser;