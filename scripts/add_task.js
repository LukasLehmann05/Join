const task_title = document.getElementById("task_title")
const task_description = document.getElementById("task_description")
const task_due_date = document.getElementById("task_due_date")
const task_category = document.getElementById("task_category")
const req_title_text = document.getElementById("required_title")
const req_due_date_text = document.getElementById("required_date")
const req_category_text = document.getElementById("required_category")
const rendered_contact_images = document.getElementById("rendered_contact_images")

// const task_subtask = document.getElementById("task_subtask")
// const low_prio_button = document.getElementById("button_prio_low")
// const medium_prio_button = document.getElementById("button_prio_medium")
// const urgent_prio_button = document.getElementById("button_prio_urgent")
// const subtask_button_section = document.getElementById("subtask_button_section")
// const subtask_list = document.getElementById("subtask_render")

let task_subtask = null;
let low_prio_button = null;
let medium_prio_button = null;
let urgent_prio_button = null;
let subtask_button_section = null;
let subtask_list = null;
let task_assign = null;
let contact_selector = null;

let subtask_buttons_active = false
let contacts_shown = false

let current_priority = "medium"

let req_title = false
let req_due_date = false
let req_category = false

let all_subtasks = []
let all_contacts = []

async function init() {
    let api_data = await loadDataFromAPI()
    loadPrioButtonsAndSubtaskSectionById();
    addContactsToAssign(api_data);

}

function loadPrioButtonsAndSubtaskSectionById() {
    task_subtask = document.getElementById("task_subtask");
    low_prio_button = document.getElementById("button_prio_low");
    medium_prio_button = document.getElementById("button_prio_medium");
    urgent_prio_button = document.getElementById("button_prio_urgent");
    subtask_button_section = document.getElementById("subtask_button_section");
    subtask_list = document.getElementById("subtask_render");
    task_assign = document.getElementById("task_assign");
    contact_selector = document.getElementById("contact_selector")
}

function loadDataFromAPI() {
    let joinData = fetchAllData()
    console.log(joinData)
    return joinData
}

function createTask() {
    let can_create = checkForRequired()
    if (can_create == true) {
        sendTaskToDB()
        clearAllInputs()
    } else {
        missingInputs()

    }
}

function sendTaskToDB() {
    addTaskToDB(task_title.value, task_description.value, task_due_date.value, current_priority, task_category.value, all_contacts, all_subtasks)
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
    all_subtasks = []
    changePriority("medium")
    clearRequiredIndicators()
    clearContacts()
    clearSubtask()
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
    all_subtasks = []
    document.getElementById("subtask_render").innerHTML = ""
    hideSubtaskButtons()
}

function clearContacts() {
    console.log(all_contacts);

    for (let index = 0; index < all_contacts.length; index++) {
        const contact_element = document.getElementById(all_contacts[index]);
        contact_element.classList.remove("assigned-contact")
        const checkbox_icon = document.getElementById("checkbox_" + all_contacts[index])
        checkbox_icon.src = "../assets/icons/board/checkbox_undone.svg"
        checkbox_icon.classList.remove("checkbox-filter")
    }
    all_contacts = []
    rendered_contact_images.innerHTML = ""
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

// let testUser = {
//     "user_id_1": {
//         "email": "max.mustermann@example.com",
//         "name": "Max Mustermann",
//         "password": "hashed_password_123"
//     },
//     "user_id_2": {
//         "email": "erika.musterfrau@example.com",
//         "name": "Erika Musterfrau",
//         "password": "hashed_password_456"
//     }
// }

function addContactsToAssign(join_data) {
    let contacts = join_data.contacts
    for (let contact_id in contacts) {
        let contact = contacts[contact_id]
        let contact_option = returnContactTemplate(contact.name, contact_id)
        task_assign.innerHTML += contact_option
    }
}

function showContacts() {
    if (contacts_shown == false) {
        contact_selector.style.display = "block"
        contacts_shown = true
    } else {
        contact_selector.style.display = "none"
        contacts_shown = false
    }
}

function assignContact(contact_id) {
    if (all_contacts.includes(contact_id)) {
        unassignContact(contact_id)
    } else {
        all_contacts.push(contact_id)
        const contact_element = document.getElementById(contact_id)
        const checkbox_icon = document.getElementById("checkbox_" + contact_id)
        checkbox_icon.src = "../assets/icons/board/checkbox_done.svg"
        contact_element.classList.add("assigned-contact")
        checkbox_icon.classList.add("checkbox-filter")
        renderSmallContacts(contact_id)
    }
}

function unassignContact(contact_id) {
    let contact_index = all_contacts.indexOf(contact_id)
    all_contacts.splice(contact_index, 1)
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