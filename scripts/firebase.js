//contacts and subtasks are arrays
function addTaskToDB(task_title, task_description, task_due_date, task_priority, task_category, all_contacts, all_subtasks) {

}

async function fetchAllData() {
    let joinFetch = await fetch('https://remotestorage-d19c5-default-rtdb.europe-west1.firebasedatabase.app/join.json')
    let joinData = await joinFetch.json()
    return joinData
}