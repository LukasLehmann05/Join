const BASE_URL = "https://remotestorage-d19c5-default-rtdb.europe-west1.firebasedatabase.app/join"


/**
 * fetches data onetime and stores it in const "AllData" for everybodys use at the start
 * @async @global
 */
async function fetchAllDataGlobal() {
    let AllData = {};
    let joinFetch = await fetch(BASE_URL + ".json");
    let joinData = await joinFetch.json();
    return AllData.data = joinData;
};


//contacts and subtasks are arrays
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
    else {
        let responseData = await response.json();
        let newTaskId = responseData.name;
        if (window.location.pathname.endsWith('board.html')) {
            displayNewTaskOnBoard(newTaskId, newTask);
        }
    }
}


async function updateTask(taskId, taskToUpdate) {
    try {
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
    } catch (error) {
        console.error('Error updating task:', error)
    }
}


async function deleteTask(taskId) {
    try {
        let response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
            method: 'DELETE'
        })
        if (!response.ok) {
            throw new Error('Error deleting task: ' + response.status);
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
    let contactData = await contactFetch.json();
    if (contactData === null) {
        return null;
    }
    return contactData;
    } catch (error) {
        console.error('Error fetching contact by ID:', error)
        return null;
    }
}


/**
 * Sends data to URL via POST
 * @param {string} url - URL to send to
 * @param {Object} payload - Data to send
 * @param {string} errorMessage - Error message prefix
 * @returns {Promise<Object>} Response data
 */
async function sendDataToUrl(payload, errorMessage) {
  const response = await fetch(BASE_URL + `/users.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    throw new Error(`${errorMessage}: ${response.status}`);
  }
  
  return await response.json();
}