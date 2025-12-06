let current_priority = "medium"
let subtask_buttons_active = false

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


function showSubtaskButtons() {
    if (subtask_buttons_active == false) {
        subtask_button_section.style.display = "flex"
        subtask_buttons_active = true
    }
}


function hideSubtaskButtons() {
    if (subtask_buttons_active == true) {
        subtask_button_section.style.display = "none"
        subtask_buttons_active = false
    }
}


function addSubtask() {
    if (task_subtask.value != "") {
        let subtask = task_subtask.value
        let subtask_template = returnSubtaskTemplate(subtask)
        subtask_list.innerHTML += subtask_template
        all_subtasks.push(task_subtask.value)
        task_subtask.value = ""
        hideSubtaskButtons()
    }
}


function returnSubtaskTemplate(subtask) {
    return `<li>${subtask}</li>`
}