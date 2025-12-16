const PRIORITY_ARR = ["low", "medium", "urgent"];
const TASK_STATE_ARR = ['todo', 'in progress', 'awaiting feedback', 'done'];

let task_subtask = null;
let low_prio_button = null;
let medium_prio_button = null;
let urgent_prio_button = null;
let subtask_button_section = null;
let subtask_list = null;
let task_assign = null;
let rendered_contact_images = null;
let task_title = null;
let task_description = null;
let task_due_date = null;
let task_category = null;
let req_title_text = null;
let req_due_date_text = null;
let req_category_text = null;

let subtask_buttons_active = false
let contacts_shown = false

let current_priority = PRIORITY_ARR[1]  // default medium priority
let stateOfNewTask = TASK_STATE_ARR[0] // default "todo" state

let req_title = false
let req_due_date = false
let req_category = false

let allSubtasksArr = []
let allAssigneesArr = []

let testUserId = "-OfhU5mv5Jc_R3Ybzq8T" // to be removed later


function addTaskInit() {
    loadPrioButtonsAndSubtaskSectionById();
    
}


function loadPrioButtonsAndSubtaskSectionById() {
    low_prio_button = document.getElementById("button_prio_low");
    medium_prio_button = document.getElementById("button_prio_medium");
    urgent_prio_button = document.getElementById("button_prio_urgent");
    task_subtask = document.getElementById("task_subtask");
    subtask_button_section = document.getElementById("subtask_button_section");
    subtask_list = document.getElementById("subtask_render");
    task_assign = document.getElementById("task_assign");
    rendered_contact_images = document.getElementById("rendered_contact_images");
    task_title = document.getElementById("task_title");
    task_description = document.getElementById("task_description");
    task_due_date = document.getElementById("task_due_date");
    task_category = document.getElementById("task_category");
    req_title_text = document.getElementById("required_title");
    req_due_date_text = document.getElementById("required_date");
    req_category_text = document.getElementById("required_category");
}

function loadDataFromAPI() {
    let joinData = fetchAllData()
    console.log(joinData)
    return joinData
}

function createTask() {
    let can_create = checkForRequired()
    if (can_create == true) {
        sendTaskToDB();
        clearAllInputs();
    } else {
        missingInputs()

    }
}

function sendTaskToDB() {
    addTaskToDB(task_title.value, task_description.value, task_due_date.value, current_priority, task_category.value, stateOfNewTask, allAssigneesArr, allSubtasksArr, testUserId)
}


function checkForRequired() {
    if (task_title.value != "") {
        req_title = true
    }
    if (task_due_date.value != "") {
        req_due_date = true
    }
    if (task_category.value != "") {
        req_category = true
    }
    if (req_title == true && req_due_date == true && req_category == true) {
        return true
    } else {
        return false
    }
}

function clearAllInputs() {
    task_title.value = ""
    task_description.value = ""
    task_due_date.value = ""
    req_title = false
    req_due_date = false
    req_category = false
    allSubtasksArr = []
    changePriority(PRIORITY_ARR[1]) // reset to medium priority
    clearRequiredIndicators()
    clearContacts()
    clearSubtask()
}

function changePriority(priority) {
    switch (priority) {
        case PRIORITY_ARR[0]:
            changeToLowPrio()
            break;
        case PRIORITY_ARR[1]:
            changeToMedPrio()
            break
        case PRIORITY_ARR[2]:
            changeToUrgentPrio()
            break
        default:
            break;
    }
}

function removeOldBackground() {
    switch (current_priority) {
        case PRIORITY_ARR[0]:
            low_prio_button.classList.remove("bg-green")
            break;
        case PRIORITY_ARR[1]:
            medium_prio_button.classList.remove("bg-yellow")
            medium_prio_button.classList.add("yellow-filter")
            break;
        case PRIORITY_ARR[2]:
            urgent_prio_button.classList.remove("bg-red")
            break;
        default:
            break;
    }
}

function changeToLowPrio() {
    removeOldBackground()
    current_priority = PRIORITY_ARR[0]
    low_prio_button.classList.add("bg-green")
}

function changeToMedPrio() {
    removeOldBackground()
    current_priority = PRIORITY_ARR[1]
    medium_prio_button.classList.add("bg-yellow")
    medium_prio_button.classList.remove("yellow-filter")
}

function changeToUrgentPrio() {
    removeOldBackground()
    current_priority = PRIORITY_ARR[2]
    urgent_prio_button.classList.add("bg-red")
}

function missingInputs() {
    if (req_title == false) {
        req_title_text.style.opacity = "1"
        task_title.classList.add("missing-input")
    }
    if (req_due_date == false) {
        req_due_date_text.style.opacity = "1"
        task_due_date.classList.add("missing-input")
    }
    if (req_category == false) {
        req_category_text.style.opacity = "1"
        task_category.classList.add("missing-input")
    }
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

function clearSubtask() {
    task_subtask.value = ""
    allSubtasksArr = []
    document.getElementById("subtask_render").innerHTML = ""
    hideSubtaskButtons()
}

function clearContacts() {
    console.log(allAssigneesArr);

    for (let index = 0; index < allAssigneesArr.length; index++) {
        const contact_element = document.getElementById(allAssigneesArr[index]);
        contact_element.classList.remove("assigned-contact")
        const checkbox_icon = document.getElementById("checkbox_" + allAssigneesArr[index])
        checkbox_icon.src = "../assets/icons/board/checkbox_undone.svg"
        checkbox_icon.classList.remove("checkbox-filter")
    }
    allAssigneesArr = []
    rendered_contact_images.innerHTML = ""
}

function addSubtask() {
    if (task_subtask.value != "") {
        let subtask = task_subtask.value
        let subtask_template = returnSubtaskTemplate(subtask)
        subtask_list.innerHTML += subtask_template
        let subtaskObj = { title: task_subtask.value, done: false };
        allSubtasksArr.push(subtaskObj)
        task_subtask.value = ""
        hideSubtaskButtons()
    }
}


function addContactsToAssign(join_data) {
    let contacts = join_data.contacts
    for (let contact_id in contacts) {
        let contact = contacts[contact_id]
        let contact_option = returnContactTemplate(contact.name, contact_id)
        task_assign.innerHTML += contact_option
    }
}

async function showContacts() {
    let apiData = await loadDataFromAPI()
    addContactsToAssign(apiData);

    let contact_selector = document.getElementById("contact_selector");
    if (contacts_shown == false) {
        contact_selector.style.display = "block"
        contacts_shown = true
    } else {
        contact_selector.style.display = "none"
        contacts_shown = false
    }
}

function assignContact(contact_id) {
    if (allAssigneesArr.includes(contact_id)) {
        unassignContact(contact_id)
    } else {
        allAssigneesArr.push(contact_id)
        const contact_element = document.getElementById(contact_id)
        const checkbox_icon = document.getElementById("checkbox_" + contact_id)
        checkbox_icon.src = "../assets/icons/board/checkbox_done.svg"
        contact_element.classList.add("assigned-contact")
        checkbox_icon.classList.add("checkbox-filter")
        renderSmallContacts(contact_id)
    }
}

function unassignContact(contact_id) {
    let contact_index = allAssigneesArr.indexOf(contact_id)
    allAssigneesArr.splice(contact_index, 1)
    const contact_element = document.getElementById(contact_id)
    const checkbox_icon = document.getElementById("checkbox_" + contact_id)
    checkbox_icon.src = "../assets/icons/board/checkbox_undone.svg"
    contact_element.classList.remove("assigned-contact")
    checkbox_icon.classList.remove("checkbox-filter")
    removeSmallContact(contact_id)
}

function renderSmallContacts(contact_id) {
    const small_contact_template = returnSmallContactTemplate(contact_id)
    rendered_contact_images.innerHTML += small_contact_template
}

function removeSmallContact(contact_id) {
    const small_contact_element = document.getElementById("small_contact_" + contact_id)
    rendered_contact_images.removeChild(small_contact_element)
}

function clearRequiredIndicators() {
    req_title_text.style.opacity = "0"
    req_due_date_text.style.opacity = "0"
    req_category_text.style.opacity = "0"
    task_title.classList.remove("missing-input")
    task_due_date.classList.remove("missing-input")
    task_category.classList.remove("missing-input")
}

function removeIndicatorOnInput(field) {
    switch (field) {
        case "title":
            req_title_text.style.opacity = "0"
            task_title.classList.remove("missing-input")
            break;
        case "due_date":
            req_due_date_text.style.opacity = "0"
            task_due_date.classList.remove("missing-input")
            break;
        case "category":
            req_category_text.style.opacity = "0"
            task_category.classList.remove("missing-input")
            break;
        default:
            break;
    }
}


document.addEventListener("DOMContentLoaded", addTaskInit);