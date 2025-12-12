const BASE_URL = "https://remotestorage-d19c5-default-rtdb.europe-west1.firebasedatabase.app/join"
//contacts and subtasks are arrays
async function addTaskToDB(task_title, task_description, task_due_date, task_priority, task_category, task_state, allAssigneeArr, all_subtasks) {
    const newTask = {
        "category": task_category,
        "title": task_title,
        "description": task_description,
        "due_date": task_due_date,
        "priority": task_priority,
        "state": task_state,
        "assigned_to": allAssigneeArr,
        "subtasks": all_subtasks,
    }

    let response = await fetch(`${BASE_URL}/tasks.json`, {
        method: 'POST',
        body: JSON.stringify(newTask),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.ok) {
        console.log('Task added successfully')
    } else {
        console.error('Error adding task:', response.status)
    }
}

//fieldstoupdate == object with key value pairs (title : "new title")
async function updateTask(taskId, taskToUpdate) {
    try {
        let response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
            method: 'PUT',
            body: JSON.stringify(taskToUpdate),
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
        let response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
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
    let joinFetch = await fetch(BASE_URL + ".json")
    let joinData = await joinFetch.json()
    return joinData
}

// fetches data of a single task e.g. to fetch all tasks assigned to a user
async function fetchTaskById(taskId) {
    try {
        const response = await fetch(`${BASE_URL}/tasks/${taskId}.json`);
        if (!response.ok) {
            throw new Error(`Error fetching task: ${response.status}`);
        }
        const task = await response.json();
        return task;
    } catch (error) {
        console.error('Error fetching task by ID:', error);
        return null;
    }
}