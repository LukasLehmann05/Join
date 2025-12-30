const base_url = "https://remotestorage-d19c5-default-rtdb.europe-west1.firebasedatabase.app/join"
//contacts and subtasks are arrays
async function addTaskToDB(task_title, task_description, task_due_date, task_priority, task_category, all_contacts, all_subtasks) {
    const newTask = {
        "category": task_category,
        "title": task_title,
        "description": task_description,
        "due_date": task_due_date,
        "priority": task_priority,
        "assigned_to": all_contacts,
        "subtasks": all_subtasks,
    }

    let response = await fetch('https://remotestorage-d19c5-default-rtdb.europe-west1.firebasedatabase.app/join/tasks.json', {
        method: 'POST',
        body: JSON.stringify(newTask),
        header: {
            'Content-Type': 'application/json'
        }
    })
}

async function updateTask(taskId, fieldsToUpdate) {
    try {
        let response = await fetch(`https://remotestorage-d19c5-default-rtdb.europe-west1.firebasedatabase.app/join/tasks/${taskId}.json`, {
            method: 'PATCH',
            body: JSON.stringify(fieldsToUpdate),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (response.ok) {
            console.log('Task updated successfully')
        } else {
            console.error('Error updating task:', response.status)
        }
    } catch (error) {
        console.error('Error updating task:', error)
    }
}

async function deleteTask(taskId) {
    try {
        let response = await fetch(`https://remotestorage-d19c5-default-rtdb.europe-west1.firebasedatabase.app/join/tasks/${taskId}.json`, {
            method: 'DELETE'
        })
        if (response.ok) {
            console.log('Task deleted successfully')
        } else {
            console.error('Error deleting task:', response.status)
        }
    } catch (error) {
        console.error('Error deleting task:', error)
    }
}

async function fetchAllData() {
    let joinFetch = await fetch(base_url + ".json")
    let joinData = await joinFetch.json()
    return joinData
}

const FIREBASE_BASE_URL =
  'https://remotestorage-d19c5-default-rtdb.europe-west1.firebasedatabase.app';

function getJoinUrl(path) {
  return `${FIREBASE_BASE_URL}/join/${path}.json`;
}

async function fetchJson(url, errorMessage) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(errorMessage + ': ' + res.status);
  }
  const data = await res.json();
  return data || {};
}

async function postJson(url, payload, errorMessage) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(errorMessage + ': ' + res.status);
  }
  const data = await res.json();
  return data;
}

async function saveToJoin(path, payload, errorMessage) {
  const url = getJoinUrl(path);
  const resData = await postJson(url, payload, errorMessage);
  const id = resData.name;
  return { id, ...payload };
}

async function getAllUsers() {
  const url = getJoinUrl('users');
  return await fetchJson(url, 'Error loading users');
}

async function getUserByEmail(email) {
  const users = await getAllUsers();
  for (const userId in users) {
    const user = users[userId];
    if (!user || !user.email) {
      continue;
    }
    if (user.email.toLowerCase() === email.toLowerCase()) {
      return { id: userId, ...user };
    }
  }
  return null;
}

function buildUserPayload(name, email, password) {
  return {
    name,
    email,
    password,
    role: 'user',
    createdAt: new Date().toISOString(),
  };
}

function buildGuestPayload() {
  return {
    name: 'Guest',
    email: 'guest@example.com',
    role: 'guest',
    createdAt: new Date().toISOString(),
  };
}

function buildTaskPayload(
  title,
  description,
  dueDate,
  priority,
  category,
  contacts,
  subtasks
) {
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

async function createUserInDB(name, email, password) {
  const newUser = buildUserPayload(name, email, password);
  return await saveToJoin(
    'users',
    newUser,
    'Error creating user'
  );
}

async function createGuestUserInDB() {
  const guestUser = buildGuestPayload();
  return await saveToJoin(
    'users',
    guestUser,
    'Error creating guest user'
  );
}

function findGuestUser(users) {
  for (const userId in users) {
    const user = users[userId];
    if (user && user.role === 'guest') {
      return { id: userId, ...user };
    }
  }
  return null;
}

async function getOrCreateGuestUser() {
  const users = await getAllUsers();
  const guest = findGuestUser(users);
  if (guest) {
    return guest;
  }
  return await createGuestUserInDB();
}

async function createTaskForUser(
  userId,
  title,
  description,
  dueDate,
  priority,
  category,
  contacts,
  subtasks
) {

  const payload = buildTaskPayload(
    title,
    description,
    dueDate,
    priority,
    category,
    contacts,
    subtasks
  );

  return await saveToJoin(
    `users/${userId}/tasks`,
    payload,
    "Error creating task for user"
  );
}

async function fetchTasksForUser(userId) {
  const url = getJoinUrl(`users/${userId}/tasks`);
  return await fetchJson(url, "Error loading tasks for user");
}

async function fetchTasksByUserId(userId) {
  try {
    // 1. Hole die Task-Referenzen für diesen User
    const tasksByUserUrl = getJoinUrl(`tasks_by_user/${userId}`);
    const taskRefsArray = await fetchJson(tasksByUserUrl, 'Error loading task refs for user');
    
    // Prüfe ob Daten existieren und konvertiere zu Array falls nötig
    if (!taskRefsArray) {
      return {};
    }
    
    // Wenn es ein Objekt ist, konvertiere zu Array
    const refsArray = Array.isArray(taskRefsArray) 
      ? taskRefsArray 
      : Object.values(taskRefsArray);
    
    if (refsArray.length === 0) {
      return {};
    }
    
    // 2. Hole alle Tasks
    const allTasksUrl = getJoinUrl('tasks');
    const allTasks = await fetchJson(allTasksUrl, 'Error loading all tasks');
    
    // 3. Extrahiere Task-IDs aus den Objekten und filtere
    const userTasks = {};
    
    for (const item of refsArray) {
      if (!item || typeof item !== 'object') continue;
      
      // Hole die Task-ID (der Key des Objekts)
      const taskId = Object.keys(item)[0];
      
      if (taskId && allTasks[taskId]) {
        userTasks[taskId] = allTasks[taskId];
      }
    }
    
    return userTasks;
    
  } catch (error) {
    console.error('Error fetching tasks by user ID:', error);
    return {};
  }
}

async function getAllTaskIdByUserId(userId) {
  try {
    const tasksByUserUrl = getJoinUrl(`tasks_by_user/${userId}`);
    const taskRefs = await fetchJson(tasksByUserUrl, 'Error loading task IDs for user');
    
    if (!taskRefs) {
      return [];
    }
    
    // Konvertiere zu Array falls nötig
    const refsArray = Array.isArray(taskRefs) 
      ? taskRefs 
      : Object.values(taskRefs);
    
    return refsArray;
    
  } catch (error) {
    console.error('Error getting task IDs by user ID:', error);
    return [];
  }
}

// Funktion zum Holen eines einzelnen Contacts
async function getContactById(contactId) {
  try {
    const url = getJoinUrl(`contacts/${contactId}`);
    const contact = await fetchJson(url, 'Error loading contact');
    return contact;
  } catch (error) {
    console.error('Error fetching contact:', error);
    return null;
  }
}

// Funktion zum Holen eines einzelnen Tasks
async function getTaskById(taskId) {
  try {
    const url = getJoinUrl(`tasks/${taskId}`);
    const task = await fetchJson(url, 'Error loading task');
    return task;
  } catch (error) {
    console.error('Error fetching task:', error);
    return null;
  }
}

// Funktion zum Löschen eines Tasks aus der User-Liste
async function deleteTaskFromUserById(taskId, userId) {
  try {
    const tasksByUserUrl = getJoinUrl(`tasks_by_user/${userId}`);
    const taskRefs = await fetchJson(tasksByUserUrl, 'Error loading task refs');
    
    if (!taskRefs) return;
    
    // Finde den Index des Tasks
    const refsArray = Array.isArray(taskRefs) ? taskRefs : Object.values(taskRefs);
    const index = refsArray.findIndex(item => {
      if (!item || typeof item !== 'object') return false;
      const id = Object.keys(item)[0];
      return id === taskId;
    });
    
    if (index !== -1) {
      // Lösche den Task aus der Liste
      const deleteUrl = `${FIREBASE_BASE_URL}/join/tasks_by_user/${userId}/${index}.json`;
      await fetch(deleteUrl, { method: 'DELETE' });
    }
    
  } catch (error) {
    console.error('Error deleting task from user:', error);
  }
}

async function createTaskAndLinkToUser(userId, taskData) {
  try {
    // 1. Erstelle den Task in /tasks
    const taskUrl = getJoinUrl('tasks');
    const response = await postJson(taskUrl, taskData, 'Error creating task');
    const taskId = response.name;
    
    // 2. Hole die aktuelle Liste von Task-Referenzen
    const tasksByUserUrl = getJoinUrl(`tasks_by_user/${userId}`);
    let existingRefs = await fetchJson(tasksByUserUrl, 'Error loading task refs');
    
    // Wenn noch keine Referenzen existieren, erstelle leeres Array
    if (!existingRefs) {
      existingRefs = [];
    }
    
    // Konvertiere zu Array falls nötig
    const refsArray = Array.isArray(existingRefs) ? existingRefs : Object.values(existingRefs);
    
    // 3. Füge neue Task-Referenz hinzu
    const newTaskRef = {};
    newTaskRef[taskId] = true;
    refsArray.push(newTaskRef);
    
    // 4. Überschreibe die komplette Liste (PUT statt POST)
    const updateUrl = `${FIREBASE_BASE_URL}/join/tasks_by_user/${userId}.json`;
    await fetch(updateUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(refsArray)
    });
    
    return { taskId, ...taskData };
    
  } catch (error) {
    console.error('Error creating task and linking to user:', error);
    throw error;
  }
}

const fetchAllDataGlobal = fetchAllData;