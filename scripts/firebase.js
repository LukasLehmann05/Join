const BASE_URL = "https://remotestorage-d19c5-default-rtdb.europe-west1.firebasedatabase.app/join/"

/**
 * fetches data onetime and stores it in const "AllData" for everybodys use at the start
 * @returns {Promise<Object>} All data from the database
 * @async @global
 */
async function fetchAllDataGlobal() {
    let AllData = {};
    let response = await fetch(BASE_URL + ".json", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (!response.ok) {
        throw new Error('Error fetching data: ' + response.status);
    }
    let joinData = await response.json();
    return AllData.data = joinData;
}


/**
 * Adds a task object to the database and displays it on the board when applicable.
 * @param {string} task_title - Title of the task.
 * @param {string} task_description - Description text.
 * @param {string} task_due_date - Due date string.
 * @param {string} task_priority - Priority value.
 * @param {string} task_category - Category value.
 * @param {string} task_state - Initial state of the task.
 * @param {Array<string>} allAssigneesArr - Array of assigned user ids.
 * @param {Array<Object>} allSubtasksArr - Array of subtask objects.
 * @returns {Promise<void>}
 */
async function addTaskToDB(task_title, task_description, task_due_date, task_priority, task_category, task_state, allAssigneesArr, allSubtasksArr) {
    const newTask = {
        "category": task_category,
        "title": task_title,
        "description": task_description,
        "due_date": task_due_date,
        "priority": task_priority,
        "state": task_state,
        "assigned_to": allAssigneesArr,
        "subtasks": allSubtasksArr,
    }
    let response = await fetch(`${BASE_URL}/tasks.json`, {
        method: 'POST',
        body: JSON.stringify(newTask),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (!response.ok) {
        throw new Error('Error adding task: ' + response.status);
    }
    let responseData = await response.json();
    let newTaskId = responseData.name;
    if (window.location.pathname.endsWith('board.html')) {
        displayNewTaskOnBoard(newTaskId, newTask);
    }
}


/**
 * Updates an existing task in the database by replacing its data.
 * @param {string} taskId - ID of the task to update.
 * @param {Object} taskToUpdate - Task object to save.
 * @returns {Promise<void>}
 */
async function updateTask(taskId, taskToUpdate) {
    let response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
        method: 'PUT',
        body: JSON.stringify(taskToUpdate),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (!response.ok) {
        throw new Error('Error updating task: ' + response.status);
            }
}


/**
 * Deletes a task from the database by id.
 * @param {string} taskId - ID of the task to delete.
 * @returns {Promise<void>}
 */
async function deleteTask(taskId) {
    let response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
        method: 'DELETE'
    })
    if (!response.ok) {
        throw new Error('Error deleting task: ' + response.status);
    }
}


/**
 * This function fetches a single task by its ID from the database.
 * 
 * @param {String} taskId Task ID to fetch
 * @returns {Object|null} Task data object or null if not found
 */
async function getTaskById(taskId) {
    let response = await fetch(`${BASE_URL}/tasks/${taskId}.json`);
    if (!response.ok) {
        throw new Error('Error fetching task: ' + response.status);
    }
    let taskData = await response.json();
    return taskData;
}


/**
 * Adds a new contact to the contacts collection in the database.
 * @param {Object} newUser - Contact object containing name, email, phone, etc.
 */
async function postNewContactToDatabase(newUser) {
    let response = await fetch(BASE_URL + `/contacts.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser),
    });
    if (!response.ok) {
        throw new Error('Error adding contact: ' + response.status);
    }
}


/**
 * Deletes a contact from the database by id.
 * @param {string} contactID - Contact id to delete.
 * @returns {Promise<void>}
 */
async function deleteThisContactFromDatabaseById(contactID) {
    let response = await fetch(BASE_URL + `/contacts/${contactID}.json`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    if (!response.ok) {
        throw new Error('Error deleting contact: ' + response.status);
    }
}


/**
 * Replaces contact data in the database for a given id.
 * @param {Object} editedUser - Updated contact object.
 * @param {string} contactID - Contact id to update.
 * @returns {Promise<void>}
 */
async function editContactDataInDatabase(editedUser, contactID) {
    let response = await fetch(BASE_URL + `/contacts/${contactID}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedUser),
    });
    if (!response.ok) {
        throw new Error('Error updating contact: ' + response.status);
    }
}


/**
 * Returns the key of the last contact added to the contacts collection.
 * @returns {Promise<string|undefined>} Last contact id or undefined.
 */
async function getLastContactAddedFromDatabase() {
    let response = await fetch(BASE_URL + `/contacts.json`)
    if (!response.ok) {
        throw new Error('Error fetching contacts: ' + response.status);
    }
    let joinData = await response.json();
    return Object.keys(joinData).at(-1);
}


/**
 * Fetches a single contact by id from the database.
 * @param {string} contactID - Contact id to fetch.
 * @returns {Promise<Object|null>} Contact object or null on error/not found.
 */
async function getContactById(contactID) {
    let response = await fetch(`${BASE_URL}/contacts/${contactID}.json`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    let contactData = await response.json();
    if (contactData === null) {
        return null;
    }
    return contactData;
}


/**
 * Sends data to URL via POST
 * @param {Object} payload - Data to send
 * @param {string} errorMessage - Error message prefix
 * @returns {Promise<Object>} Response data
 */
async function sendDataToUrl(payload, errorMessage) {
  let response = await fetch(BASE_URL + `/users.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`${errorMessage}: ${response.status}`);
  }
  return await response.json();
}