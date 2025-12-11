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
