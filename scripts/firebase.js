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

async function fetchAllData() {
    let joinFetch = await fetch('https://remotestorage-d19c5-default-rtdb.europe-west1.firebasedatabase.app/join.json')
    let joinData = await joinFetch.json()
    return joinData
}