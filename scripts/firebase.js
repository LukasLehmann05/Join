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

//fieldstoupdate == object with key value pairs (title : "new title")
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


/**
 *department contacts: shell for handling the whole process of adding a new contact including validation, posting data to base, restructuring html list and confirmation for user
 * @async
 */
async function addNewContactToDatabase() {
    let newUser = getContactInputData("nameAdd", "phoneAdd", "emailAdd");
    if (newUser.name.length <= 0 == false) {
        if (validateEmail(newUser.email) == true && newUser.email != "") {
            if (validatePhoneByLength(newUser.phone) == true && newUser.phone != "") {
                /* await postDatatoBase(newUser); */
                await trimDown(newUser, newUser.name);
            } else {
                displayHint('required_phone');
            }
        } else {
            displayHint('required_email');
        }
    } else {
        displayHint('required_name');
    }
};