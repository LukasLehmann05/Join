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

async function fetchAllData() {
  const url = `${FIREBASE_BASE_URL}/join.json`;
  return await fetchJson(url, 'Fehler beim Laden der Daten');
}

async function getAllUsers() {
  const url = getJoinUrl('users');
  return await fetchJson(url, 'Fehler beim Laden der User');
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

function buildTaskPayload(title, description, dueDate,
  priority, category, contacts, subtasks) {
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
    'Fehler beim Erstellen des Users'
  );
}

async function createGuestUserInDB() {
  const guestUser = buildGuestPayload();
  return await saveToJoin(
    'users',
    guestUser,
    'Fehler beim Erstellen des Guest-Users'
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

async function addTaskToDB(taskTitle, taskDescription, taskDueDate,
  taskPriority, taskCategory, allContacts, allSubtasks) {
  const task = buildTaskPayload(
    taskTitle,
    taskDescription,
    taskDueDate,
    taskPriority,
    taskCategory,
    allContacts,
    allSubtasks
  );
  return await saveToJoin(
    'tasks',
    task,
    'Fehler beim Erstellen der Aufgabe'
  );
}
