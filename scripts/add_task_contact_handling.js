/**
 * Renders available contacts into the assign list.
 * @param {Object} join_data - Global data object containing contacts.
 */
async function addContactsToAssign(join_data) {
    if (!task_assign) return;
    let contacts = join_data.contacts
    for (let contact_id in contacts) {
        let contact = contacts[contact_id]
        let contact_initial = await getInitialsFromUser(contact)
        let contact_color = contact.color
        let contact_option = returnContactTemplate(contact.name, contact_id, contact_initial, contact_color)
        task_assign.innerHTML += contact_option
    }
    checkForAlreadyAssigned()
}

/**
 * Checks which contacts are already assigned to the task and updates the assign list UI accordingly.
 */
function checkForAlreadyAssigned() {
    for (let index = 0; index < allAssigneesArr.length; index++) {
        const assignee_to_check = allAssigneesArr[index];
        let assignee_section = document.getElementById(assignee_to_check)
        if (assignee_section != undefined) {
            assignee_section.classList.add('assigned-contact')
            let assignee_section_checkbox = document.getElementById('checkbox_' + assignee_to_check)
            assignee_section_checkbox.classList.add('checkbox-filter')
            assignee_section_checkbox.src = '../assets/icons/board/checkbox_done.svg'
        }
    }
}

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
}

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
}


/**
 * Loads contact data and populates the assign list if present.
 */
async function loadContactsForAssign() {
    if (!document.getElementById("task_assign")) return;
    let join_data = await loadDataFromAPI()
    addContactsToAssign(join_data)
}

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
    if (rendered_contacts <= amount_for_render_overflow) {
        removeSmallContact(contact_id)
    } else {
        checkForContactToRemove(contact_id)
    }
}

/**
 * Checks if the small contact image is rendered or not
 */
function checkForContactToRemove(contact_id) {
    let required_contact = document.getElementById("small_contact_" + contact_id)
    if (required_contact != undefined) {
        rendered_contacts = 0
        reRenderSmallContacts()
    } else {
        rendered_contacts -= 1
        contactRenderOverflow(rendered_contacts - amount_for_render_overflow)
    }
}


/**
 * Renders a compact contact icon into the assigned-contacts area.
 * @param {string} contact_id
 */
async function renderSmallContacts(contact_id) {
    let contact = await getContactById(contact_id)
    let contact_initial = getInitialsFromUser(contact)
    let contact_color = contact.color
    rendered_contacts += 1
    if (rendered_contacts <= amount_for_render_overflow) {
        const small_contact_template = returnSmallContactTemplate(contact_id, contact_initial, contact_color)
        document.getElementById('rendered_contact_images').innerHTML += small_contact_template
    } else {
        checkContactRenderAmount()
    }
}

/**
 * re-render all assigned contacts so that the max amount of assigned contacts can always be displayed (fires only when a already rendered assigned contact gets removed)
 */
function reRenderSmallContacts() {
    rendered_contact_images.innerHTML = ""
    for (let index = 0; index < allAssigneesArr.length; index++) {
        const assignee_to_rerender = allAssigneesArr[index];
        renderSmallContacts(assignee_to_rerender)
    }
}


/**
 * Removes a compact assigned-contact element from the DOM.
 * @param {string} contact_id
 */
function removeSmallContact(contact_id) {
    const small_contact_element = document.getElementById("small_contact_" + contact_id)
    rendered_contact_images.removeChild(small_contact_element)
    if (rendered_contacts > 0) {
        rendered_contacts -= 1
    }
}
/**
 * Checks if rendered_contacts is at the display limit
 */
function checkContactRenderAmount() {
    if (rendered_contacts > amount_for_render_overflow) {
        contactRenderOverflow(rendered_contacts - amount_for_render_overflow)
    }
}

/**
 * Creates the overflow container if it not exists, otherwise changes its amount
 * @param {number} amount
 */
function contactRenderOverflow(amount) {
    let contact_overflow_element = document.getElementById("contact_render_overflow")
    if (contact_overflow_element != undefined) {
        if (amount > 0) {
            contact_overflow_element.innerHTML = `+${amount}`
        } else {
            contact_overflow_element.remove()
        }
    } else {
        let new_overflow_element = returnSmallContactOverflowTemplate(`+${amount}`)
        document.getElementById('rendered_contact_images').innerHTML += new_overflow_element
    }
}

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
    rendered_contacts = 0;
}

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
}

/**
 * Associates a task id with a user by updating the user's tasks in DB.
 * @param {string} userId
 * @param {string} taskId
 */
function assignTaskToUserById(userId, taskId) {
    let allTasksOfUser = [];
    allTasksOfUser += taskId;
    updateUserTasksInDB(userId, allTasksOfUser);
}