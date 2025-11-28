const task_title = document.getElementById("task_title")
const task_description = document.getElementById("task_description")
const task_due_date = document.getElementById("task_due_date")
const task_assign = document.getElementById("task_assign")
const task_category = document.getElementById("task_category")
const task_subtask = document.getElementById("task_subtask")

const low_prio_button = document.getElementById("button_prio_low")
const medium_prio_button = document.getElementById("button_prio_medium")
const urgent_prio_button = document.getElementById("button_prio_urgent")

let current_priority = "medium"

let req_title = false
let req_due_date = false

function createTask() {
    console.log("TEST");
    let can_create = checkForRequired()
    if (can_create == true) {
        console.log("CREATE");
        clearAllInputs()
    } else {
        console.log("CANNOT");
        
    }
}

function checkForRequired() {
    if (task_title.value != "") {
        req_title = true
    }
    if (task_due_date.value != "") {
        req_due_date = true
    }

    if (req_title == true && req_due_date == true) {
        return true
    } else {
        return false
    }
}

function clearAllInputs() {
    task_title.value = ""
    task_description.value = ""
    task_subtask.value = ""
    task_due_date.value = ""
    req_title = false
    req_due_date = false
    changePriority("medium")
}

function changePriority(priority) {
    switch (priority) {
        case "low":
            changeToLowPrio()
            break;
        case "medium":
            changeToMedPrio()
            break
        case "urgent":
            changeToUrgentPrio()
            break
        default:
            break;
    }
}

function removeOldBackground() {
    switch (current_priority) {
        case "low":
            low_prio_button.classList.remove("bg-green")
            break;
        case "medium":
            medium_prio_button.classList.remove("bg-yellow")
            medium_prio_button.classList.add("yellow-filter")
            break;
        case "urgent":
            urgent_prio_button.classList.remove("bg-red")
            break;
        default:
            break;
    }
}

function changeToLowPrio() {
    removeOldBackground()
    current_priority = "low"
    low_prio_button.classList.add("bg-green")
}

function changeToMedPrio() {
    removeOldBackground()
    current_priority = "medium"
    medium_prio_button.classList.add("bg-yellow")
    medium_prio_button.classList.remove("yellow-filter")
}

function changeToUrgentPrio() {
    removeOldBackground()
    current_priority = "urgent"
    urgent_prio_button.classList.add("bg-red")
}