const base_url = "https://remotestorage-d19c5-default-rtdb.europe-west1.firebasedatabase.app/join"
const FIREBASE_BASE_URL = 'https://remotestorage-d19c5-default-rtdb.europe-west1.firebasedatabase.app';

async function addTaskToDB(task_title, task_description, task_due_date, task_priority, task_category, all_contacts, all_subtasks) {
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

async function fetchAllData() {
    let joinFetch = await fetch(base_url + ".json")
    let joinData = await joinFetch.json()
    return joinData
}

function buildFirebaseUrl(path) {
  return `${FIREBASE_BASE_URL}/join/${path}.json`;
}

function convertToArray(data) {
  return Array.isArray(data) ? data : Object.values(data);
}
