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
async function addTaskToDB(task_title, task_description, task_due_date, task_priority, task_category, task_state, allAssigneesArr, allSubtasksArr, userId) {
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
        await assignNewTaskToUserById(newTaskId, userId);
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


async function getAllTaskIdByUserId(userId) {
    try {
        let joinFetchAllTasks = await fetch(BASE_URL + `/tasks_by_user/${userId}.json`)
        let joinDataAllTasksByUser = await joinFetchAllTasks.json();
        let taskIdsByUser = [];
        for (let taskId in joinDataAllTasksByUser) {
            taskIdsByUser.push(joinDataAllTasksByUser[taskId]);
        }
        if (!joinFetchAllTasks.ok) {
            throw new Error('Network response was not ok');
        }
        return taskIdsByUser;
    } catch (error) {
        console.error('Error fetching tasks by user ID:', error);
    }
}


async function assignNewTaskToUserById(taskId, userId) {
    try {
        let userTasksArr = await getAllTaskIdByUserId(userId);
        let taskObj = {[taskId]: true};
        if (!userTasksArr) {
            userTasksArr = [];
        }
        userTasksArr.push(taskObj);
        let response = await fetch(`${BASE_URL}/tasks_by_user/${userId}.json`, {
            method: 'PUT',
            body: JSON.stringify(userTasksArr),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Error assigning task to user: ' + response.status);
        }
    } catch (error) {
        console.error('Error assigning task to user:', error)
    }
}
