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

/**
 * This function fetches a single task by its ID from the database.
 * 
 * @param {String} taskId Task ID to fetch
 * @returns {Object|null} Task data object or null if not found
 */
async function getTaskById(taskId) {
    try {
        let taskFetch = await fetch(`${BASE_URL}/tasks/${taskId}.json`);
        let taskData = await taskFetch.json();
        return taskData;
    } catch (error) {
        console.error('Error fetching task by ID:', error);
        return error;
    }
}


/**
 *department contacts: post new Contact that got add to database
 */
async function postNewContactToDatabase(newUser) {
    await fetch(BASE_URL + `/contacts.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser),
    });
};


/**
 *department contacts: deletes this single contact in firebase
 */
async function deleteThisContactFromDatabaseById(contactID) {
    await fetch(BASE_URL + `/contacts/${contactID}.json`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
};


/**
 *department contacts: post edited contact information in firebase
 */
async function editContactDataInDatabase(editedUser, contactID) {
    await fetch(BASE_URL + `/contacts/${contactID}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedUser),
    });
};


/**
 *department contacts: get last contact id that was added to the database
 */
async function getLastContactAddedFromDatabase() {
    let joinFetch = await fetch(BASE_URL + `/contacts.json`)
    let joinData = await joinFetch.json();
    return Object.keys(joinData).at(-1);
};


async function getContactById(contactID) {
    try {
    let contactFetch = await fetch(`${BASE_URL}/contacts/${contactID}.json`);
    if (!contactFetch.ok) {
        throw new Error('Network response was not ok');
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