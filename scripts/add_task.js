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

let subtask_amount = 0


/**
 * Initializes add-task page: caches DOM refs and loads contacts.
 */
function addTaskInit() {
    loadPrioButtonsAndSubtaskSectionById();
    loadContactsForAssign()
};


/**
 * Caches frequently used DOM elements for priority, subtasks and inputs.
 */
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
};


/**
 * Returns a promise for the globally fetched data object.
 * @returns {Promise<Object>} Global join data promise.
 */
function loadDataFromAPI() {
    let joinData = fetchAllDataGlobal()
    return joinData
};


/**
 * Validates required fields and creates a new task when valid.
 */
async function createTask() {
    let can_create = checkForRequired(['title', 'dueDate', 'category'])
    if (can_create == true) {
        await sendTaskToDB(TASK_STATE_ARR[0]);
        await renderNewTaskAddedToastContainer();
        clearAllInputs();
        setTimeout(redirectToBoard, 300);
    } else {
        missingInputs()
        resetRequiredValues()
    }
};


/**
 * Sends the new task payload to the database.
 * @param {string} stateOfNewTask - Initial state for the task.
 */
async function sendTaskToDB(stateOfNewTask) {
    await addTaskToDB(task_title.value, task_description.value, task_due_date.value, current_priority, task_category.value, stateOfNewTask, allAssigneesArr, allSubtasksArr);
};


/**
 * Redirects the user to the board page.
 */
function redirectToBoard() {
    window.location.replace("board.html");
};


/**
 * Checks if the required fields are filled.
 * @param {Array<string>} requiredFields - Array of field names to check (e.g. ['title', 'dueDate', 'category'])
 * @returns {boolean} true if all required fields are filled, false otherwise
 */
function checkForRequired(requiredFields) {
    let isValid = true;
    for (const field of requiredFields) {
        switch (field) {
            case 'title':
                if (!document.getElementById('task_title').value.trim()) isValid = false;
                break;
            case 'dueDate':
                if (!document.getElementById('task_due_date').value.trim()) isValid = false;
                break;
            case 'category':
                if (!document.getElementById('task_category').value.trim()) isValid = false;
                break;
            // ggf. weitere Felder ergänzen
        }
    }
    return isValid;
};


/**
 * Clears all add-task form inputs and resets internal state.
 */
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
    subtask_amount = 0
};


/**
 * Changes button styling and internal priority state.
 * @param {string} priority - One of PRIORITY_ARR values.
 */
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
};


/**
 * Removes the CSS classes for the current priority button background.
 */
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
};


/**
 * Sets the UI and internal state to low priority.
 */
function changeToLowPrio() {
    removeOldBackground()
    current_priority = PRIORITY_ARR[0]
    low_prio_button.classList.add("bg-green")
};


/**
 * Sets the UI and internal state to medium priority.
 */
function changeToMedPrio() {
    removeOldBackground()
    current_priority = PRIORITY_ARR[1]
    medium_prio_button.classList.add("bg-yellow")
    medium_prio_button.classList.remove("yellow-filter")
};


/**
 * Sets the UI and internal state to urgent priority.
 */
function changeToUrgentPrio() {
    removeOldBackground()
    current_priority = PRIORITY_ARR[2]
    urgent_prio_button.classList.add("bg-red")
};


/**
 * Shows UI indicators for any required fields that are missing.
 */
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
};


/**
 * Resets internal flags that track required-field completion.
 */
function resetRequiredValues() {
    req_title = false
    req_due_date = false
    req_category = false
};


/**
 * Displays subtask action buttons when a subtask is present.
 */
function showSubtaskButtons() {
    if (subtask_buttons_active == false) {
        subtask_button_section.style.display = "flex"
        subtask_buttons_active = true
    }
};


/**
 * Hides the subtask action buttons.
 */
function hideSubtaskButtons() {
    if (subtask_buttons_active == true) {
        subtask_button_section.style.display = "none"
        subtask_buttons_active = false
    }
};


/**
 * Clears subtask input, rendered list and resets subtask state.
 */
function clearSubtask() {
    task_subtask.value = ""
    allSubtasksArr = []
    document.getElementById("subtask_render").innerHTML = ""
    hideSubtaskButtons()
};


/**
 * Clears assigned contacts UI and internal assignee list.
 */
function clearContacts() {
    for (let index = 0; index < allAssigneesArr.length; index++) {
        const contact_element = document.getElementById(allAssigneesArr[index]);
        contact_element.classList.remove("assigned-contact")
        const checkbox_icon = document.getElementById("checkbox_" + allAssigneesArr[index])
        checkbox_icon.src = "../assets/icons/board/checkbox_undone.svg"
        checkbox_icon.classList.remove("checkbox-filter")
    }
    allAssigneesArr = []
    rendered_contact_images.innerHTML = ""
};


/**
 * Adds a new subtask to the UI and internal subtasks array.
 */
function addSubtask() {
    if (task_subtask.value != "") {
        let subtask = task_subtask.value
        let subtask_id = returnSubtaskId()
        let subtask_template = returnSubtaskTemplate(subtask, subtask_id)
        subtask_list.innerHTML += subtask_template
        let subtaskObj = { title: task_subtask.value, done: false };
        allSubtasksArr.push(subtaskObj)
        task_subtask.value = ""
        hideSubtaskButtons()
    }
};


/**
 * Returns a new unique subtask id.
 * @returns {string}
 */
function returnSubtaskId() {
    subtask_amount += 1
    return "subtask_" + subtask_amount
};


/**
 * Renders available contacts into the assign list.
 * @param {Object} join_data - Global data object containing contacts.
 */
async function addContactsToAssign(join_data) {
    if (!task_assign) return;
    let contacts = join_data.contacts
    for (let contact_id in contacts) {
        let contact = contacts[contact_id]
        let contact_intial = await getInitialsFromUser(contact)
        let contact_color = contact.color
        let contact_option = returnContactTemplate(contact.name, contact_id, contact_intial, contact_color)
        task_assign.innerHTML += contact_option
    }
};


/**
 * Computes initials string from a user's name.
 * @param {Object} user - User object with `name` property.
 * @returns {string}
 */
function getInitialsFromUser(user) {
    const initials = user.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();
    return initials;
};


/**
 * Loads contact data and populates the assign list if present.
 */
async function loadContactsForAssign() {
    if (!document.getElementById("task_assign")) return;
    let join_data = await loadDataFromAPI()
    addContactsToAssign(join_data)
};


/**
 * Toggles visibility of the contact selector panel.
 */
function showContacts() {
    let contact_selector = document.getElementById("contact_selector");
    if (contacts_shown == false) {
        contact_selector.style.display = "block"
        contacts_shown = true
    } else {
        contact_selector.style.display = "none"
        contacts_shown = false
    }
};


/**
 * Toggles assignment of a contact to the new task.
 * @param {string} contact_id
 */
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
};


/**
 * Removes a contact from the assignees list and updates UI.
 * @param {string} contact_id
 */
function unassignContact(contact_id) {
    let contact_index = allAssigneesArr.indexOf(contact_id)
    allAssigneesArr.splice(contact_index, 1)
    const contact_element = document.getElementById(contact_id)
    const checkbox_icon = document.getElementById("checkbox_" + contact_id)
    checkbox_icon.src = "../assets/icons/board/checkbox_undone.svg"
    contact_element.classList.remove("assigned-contact")
    checkbox_icon.classList.remove("checkbox-filter")
    removeSmallContact(contact_id)
};


/**
 * Renders a compact contact icon into the assigned-contacts area.
 * @param {string} contact_id
 */
async function renderSmallContacts(contact_id) {
    let contact = await getContactById(contact_id)
    let contact_intial = await getInitialsFromUser(contact)
    let contact_color = contact.color
    const small_contact_template = returnSmallContactTemplate(contact_id, contact_intial, contact_color)
    rendered_contact_images.innerHTML += small_contact_template
};


/**
 * Removes a compact assigned-contact element from the DOM.
 * @param {string} contact_id
 */
function removeSmallContact(contact_id) {
    const small_contact_element = document.getElementById("small_contact_" + contact_id)
    rendered_contact_images.removeChild(small_contact_element)
};


/**
 * Clears UI indicators for required fields.
 */
function clearRequiredIndicators() {
    req_title_text.style.opacity = "0"
    req_due_date_text.style.opacity = "0"
    req_category_text.style.opacity = "0"
    task_title.classList.remove("missing-input")
    task_due_date.classList.remove("missing-input")
    task_category.classList.remove("missing-input")
};


/**
 * Removes the missing-input indicator for a specific field.
 * @param {string} field
 */
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
};


/**
 * Associates a task id with a user by updating the user's tasks in DB.
 * @param {string} userId
 * @param {string} taskId
 */
function assignTaskToUserById(userId, taskId) {
    let allTasksOfUser = [];
    allTasksOfUser += taskId;
    updateUserTasksInDB(userId, allTasksOfUser);
};


/**
 * Replaces a subtask list item with its editable input UI.
 * @param {string} subtask_id
 */
function showSubtaskEdit(subtask_id) {
    let subtask_to_edit = document.getElementById(subtask_id);
    let original_subtask_text = document.getElementById("subtask_text_" + subtask_id).innerText;
    removeSubtaskFromArray(original_subtask_text);
    let subtask_edit_template = returnSubtaskEditTemplate(subtask_id, original_subtask_text);
    subtask_to_edit.innerHTML = subtask_edit_template
};


/**
 * Deletes a subtask element and removes it from internal array.
 * @param {Event} event
 * @param {string} subtask_id
 */
function deleteSubtask(event, subtask_id) {
    event.stopPropagation()
    let subtask_text = document.getElementById("subtask_text_" + subtask_id).innerText;
    removeSubtaskFromArray(subtask_text);
    let subtask_to_delete = document.getElementById(subtask_id)
    subtask_to_delete.remove()
};


/**
 * Deletes a subtask that is currently being edited.
 * @param {Event} event
 * @param {string} subtask_id
 */
function deleteSubtaskEdit(event, subtask_id) {
    event.stopPropagation()
    let subtask_text = document.getElementById("subtask_edit_input_" + subtask_id).value;
    removeSubtaskFromArray(subtask_text);
    let subtask_to_delete = document.getElementById(subtask_id)
    subtask_to_delete.remove()
};


/**
 * Removes a subtask object from the internal subtasks array by text match.
 * @param {string} subtask_text
 */
function removeSubtaskFromArray(subtask_text) {
    let subtask_index = allSubtasksArr.findIndex(subtask => subtask.title === subtask_text)
    if (subtask_index !== -1) {
        allSubtasksArr.splice(subtask_index, 1)
    }
};


/**
 * Reads the edited subtask input and appends it to the subtasks array.
 * @param {string} subtask_id
 */
function addSubtaskEditToArray(subtask_id) {
    let subtask_input_field = document.getElementById("subtask_edit_input_" + subtask_id)
    let edited_subtask_text = subtask_input_field.value
    let subtaskObj = { title: edited_subtask_text, done: false }
    allSubtasksArr.push(subtaskObj)
};


/**
 * Confirms an edit to a subtask: updates internal array and UI.
 * @param {string} subtask_id
 */
function confirmSubtaskEdit(subtask_id) {
    addSubtaskEditToArray(subtask_id)
    let subtask_to_confirm = document.getElementById(subtask_id)
    let edited_subtask_text = document.getElementById("subtask_edit_input_" + subtask_id).value
    let subtask_template = returnEditedSubtaskTemplate(subtask_id, edited_subtask_text)
    subtask_to_confirm.innerHTML = subtask_template
};


document.addEventListener("DOMContentLoaded", addTaskInit)