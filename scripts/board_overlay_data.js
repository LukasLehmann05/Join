let showWideOverlay = false;

let newTitle = "";
let newCategory = "";
let newDescription = "";
let newDueDate = "";
let newPriority = "";
let newAssigneesArr = [];
let newSubtasksArr = [];
let newState = "";
const DATA_ATTRIBUTE_SAVE_TASK_WHEN_CLOSE_OVERLAY = 'data-save-task-when-close-overlay';
const DATA_ATTRIBUTE_CREATE_TASK_AND_CLOSE_OVERLAY = 'data-create-task-and-close-overlay';
const DATA_ATTRIBUTE_EDIT_TASK_AND_CLOSE_OVERLAY = 'data-edit-task-and-close-overlay';

/**
 * This function sends the updated task to the database and refreshes the board.
 * 
 * @param {string} taskId The ID of the task to update.
 */
async function sendUpdatedTaskToDB(taskId) {
    let taskToUpdate = await getTaskToUpdate(taskId);
    updateAllTasksObj(taskId, taskToUpdate);
    clearElementsOfNewTask();
    if (Object.keys(taskToUpdate).length !== 0) {
        await updateTask(taskId, taskToUpdate);
    }
    await refreshTaskOnBoard(taskId, taskToUpdate);
}


/**
 * This function retrieves the updated task object with new field values.
 * 
 * @param {string} taskId The ID of the task to update.
 * @returns {Promise<Object>} The updated task object.
 */
async function getTaskToUpdate(taskId) {
    let taskToUpdate = await getTaskById(taskId);
    if (newTitle !== "") taskToUpdate.title = newTitle;
    if (newCategory !== "") taskToUpdate.category = newCategory;
    if (newDescription !== "") taskToUpdate.description = newDescription;
    if (newDueDate !== "") taskToUpdate.due_date = newDueDate;
    if (newPriority !== "") taskToUpdate.priority = newPriority;
    taskToUpdate.assigned_to = newAssigneesArr;
    taskToUpdate.subtasks = newSubtasksArr;
    if (newState !== "") taskToUpdate.state = newState;
    return taskToUpdate;
}


/**
 * This function collects all field values from the edit task form when updated.
 */
function getAllFieldValuesOfEditTaskWhenUpdated() {
    newTitle = document.getElementById('task_title').value;
    newDescription = document.getElementById('task_description').value;
    newDueDate = document.getElementById('task_due_date').value;
    newPriority = current_priority;
    newAssigneesArr = allAssigneesArr;
    newSubtasksArr = allSubtasksArr;
}


/**
 * This function opens a task in the overlay and renders its content.
 * 
 * @param {string} taskId The ID of the task to open.
 */
async function openTaskInOverlay(taskId) {
    clearElementsOfNewTask();
    document.getElementById('overlay').classList.add('show');
    setTimeout(() => {
        document.getElementById('overlay_content').classList.add('show');
    }, 10);
    await renderOverlayContent(taskId);
    disableScrollOnBody();
}


/**
 * This function clears all temporary variables for a new or edited task.
 */
function clearElementsOfNewTask() {
    newTitle = "";
    newCategory = "";
    newDescription = "";
    newDueDate = "";
    newPriority = "";
    newAssigneesArr = [];
    newSubtasksArr = [];
    newState = "";
}


/**
 * This function renders the overlay content for a given task.
 * 
 * @param {string} taskId The ID of the task to render in the overlay.
 */
async function renderOverlayContent(taskId) {
    const overlayContent = document.getElementById('overlay_content');
    let task = getSingleTaskOfAllTasksObj(taskId);
    if (!task) return;
    overlayContent.innerHTML = overlayContentTemplate(task, taskId, task.title);
    renderPriorityIndicator(taskId, task.priority, 'priority_overlay');
    await renderAssignedUserInfos(task.assigned_to, false, 'assigned_users_overlay');
    renderSubtasksListItems(taskId, task.subtasks || []);
}


/**
 * This function disables scrolling on the body element.
 */
function disableScrollOnBody() {
    document.body.style.overflow = 'hidden';
}


/**
 * This function enables scrolling on the body element.
 */
function enableScrollOnBody() {
    document.body.style.overflow = 'auto';
}


/**
 * This function renders the assigned user infos in the overlay.
 * It first checks if it is in edit mode to use add task rendering instead
 * 
 * @param {Array} taskAssignees Array of user/contact IDs assigned to the task.
 * @param {boolean} onlyId Whether to render only the ID/icon or also the name.
 * @param {string} containerIdSuffix The ID of the container to render into.
 */
async function renderAssignedUserInfos(taskAssignees, onlyId, containerIdSuffix) {
    getAssigneesOfTask(taskAssignees);
    if (containerIdSuffix == 'rendered_contact_images' && onlyId == true) {
        for (let contactId of allAssigneesArr) {
            await renderSmallContacts(contactId)
        }
    } else {
        renderEditOverlayAssignee(onlyId, containerIdSuffix)
    }
}

/**
 * This function renders the assigned user infos in the overlay.
 * 
 * @param {boolean} onlyId Whether to render only the ID/icon or also the name.
 * @param {string} containerIdSuffix The ID of the container to render into.
 */
async function renderEditOverlayAssignee(onlyId, containerIdSuffix) {
    let container = document.getElementById(containerIdSuffix);
    for (let contactId of allAssigneesArr) {
        const contact = await getContactById(contactId);
        if (contact) {
            rendered_contacts += 1
            container.innerHTML += getContentToRenderAssignedUserInfos(onlyId, contact);
        }
    }
}


/**
 * This function updates the global assignees array for the current task.
 * 
 * @param {Array} taskAssignees Array of user/contact IDs assigned to the task.
 */
function getAssigneesOfTask(taskAssignees) {
    allAssigneesArr = [];
    if (!taskAssignees || taskAssignees.length === 0) return;
    for (let contactId of taskAssignees) {
        allAssigneesArr.push(contactId);
    }
}


/**
 * This function returns the HTML content to render assigned user infos.
 * 
 * @param {boolean} renderOnlyId Whether to render only the ID/icon or also the name.
 * @param {Object} contact The user object.
 * @returns {string} The HTML string for the assigned user info.
 */
function getContentToRenderAssignedUserInfos(renderOnlyId, contact) {
    if (renderOnlyId) {
        return `   <div class="assigned_user_content">
                    ${assignedUserIconTemplate(getInitialsFromUser(contact), contact.color)}
                    </div>
                `;
    }
    else {
        return `   <div class="assigned_user_content display_limit_avatar">
                    ${assignedUserIconTemplate(getInitialsFromUser(contact), contact.color)}
                    ${assignedUserNameTemplate(contact.name)}
                    </div>
                `;
    }
}


/**
 * This function closes the overlay if the background is clicked.
 * 
 * @param {Event} event The click event object.
 */
function closeOverlayByBackdrop(event) {
    if (event.target === event.currentTarget) {
        closeOverlay();
    }
}


/**
 * This function removes the 'show' class from overlay elements and optionally triggers actions
 * such as saving, editing, or creating a task, depending on the data attributes of the button element.
 * 
 * @param {HTMLElement} buttonElement The button element that triggered the close (optional).
 * @param {string} taskId The ID of the task to save or edit (optional).
 */
async function closeOverlay(buttonElement, taskId) {
    createTaskOverlay(buttonElement);
    const saveAction = handleButtonSaveActionAndCloseOverlay(buttonElement, taskId);
    const editAction = handleButtonEditActionAndCloseOverlay(buttonElement, taskId);
    const [createdToast, createAction] = await handleButtonAddActionAndCloseOverlay(buttonElement);
    if (createdToast instanceof Promise) {
        await createdToast;
    }
    if (saveAction || editAction || createAction) {
        enableScrollOnBody();
        delayedClose();
        rendered_contacts = 0;
    }
}

/**
 * Checks whether a new task should be created or an existing task edited based on
    if (buttonElement) {
 *
 * @param {HTMLElement} buttonElement The button element that determines the task action.
 */
function createTaskOverlay(buttonElement) {
        if (buttonElement) {
        if (buttonElement.getAttribute(DATA_ATTRIBUTE_CREATE_TASK_AND_CLOSE_OVERLAY) === 'true') {
            if (!checkForRequired(['title', 'dueDate', 'category'])) {
                missingInputs();
                return;
            }
        } else if (buttonElement.getAttribute(DATA_ATTRIBUTE_EDIT_TASK_AND_CLOSE_OVERLAY) === 'true') {
            if (!checkForRequired(['title', 'dueDate'])) {
                missingInputs();
                return;
            }
        }
    }
}


/**
 * This function adds a delay before removing the 'show' class from overlay elements,
 * allowing for CSS transition effects to complete.
 */
function delayedClose() {
    const overlay = document.getElementById('overlay');
    const overlayContent = document.getElementById('overlay_content');
    const DELAY_BETWEEN_CLASSES = 500;
    const TOTAL_DELAY = 1000;
    if (overlay.classList.contains('show')) {
        setTimeout(() => {
            overlayContent.classList.remove('show');
        }, DELAY_BETWEEN_CLASSES);
        setTimeout(() => {
            overlay.classList.remove('show');
            if (showWideOverlay) {
                toggleTitleCategorySeparatorInAddTaskOverlay();
            }
        }, TOTAL_DELAY);
    }
}


/**
 * This function checks if the button has the data attribute for saving the task and closing the overlay,
 * and if so, saves the updated task to the database.
 * 
 * @param {HTMLElement} buttonElement The button element that triggered the action.
 * @param {string} taskId The ID of the task to save.
 */
function handleButtonSaveActionAndCloseOverlay(buttonElement, taskId) {
    const buttonSaveStateOfSubtasksAndCloseOverlay = buttonElement ? buttonElement.getAttribute(DATA_ATTRIBUTE_SAVE_TASK_WHEN_CLOSE_OVERLAY) === 'true' : false;
    if (buttonSaveStateOfSubtasksAndCloseOverlay) {
        sendUpdatedTaskToDB(taskId);
    }
    const hasAttribute = buttonElement && buttonElement.hasAttribute(DATA_ATTRIBUTE_SAVE_TASK_WHEN_CLOSE_OVERLAY);
    if (hasAttribute){
        return true;
    } 
    else {
        return false;
    } 
}


/**
 * This function checks if the button has the data attribute for editing the task and closing the overlay,
 * and if so, collects the updated field values and saves the task to the database.
 * 
 * @param {HTMLElement} buttonElement The button element that triggered the action.
 * @param {string} taskId The ID of the task to edit.
 */
function handleButtonEditActionAndCloseOverlay(buttonElement, taskId) {
    const buttonEditTaskAndCloseOverlay = buttonElement ? buttonElement.getAttribute(DATA_ATTRIBUTE_EDIT_TASK_AND_CLOSE_OVERLAY) === 'true' : false;
    if (buttonEditTaskAndCloseOverlay && checkForRequired(['title', 'dueDate'])) {
        clearElementsOfNewTask();
        getAllFieldValuesOfEditTaskWhenUpdated();
        sendUpdatedTaskToDB(taskId);
        return true;
    }
    else {
        return false;
    }
}


/**
 * This function checks if the button has the data attribute for creating a new task and closing the overlay,
 * and if so, triggers the creation of a new task.
 * 
 * @param {HTMLElement} buttonElement The button element that triggered the action.
 */
async function handleButtonAddActionAndCloseOverlay(buttonElement) {
    let taskState = '';
    if (buttonElement) {
        taskState = buttonElement.getAttribute('data-task-state');
    }
    else {
        taskState = 'todo';
    }
    const buttonCreateTaskAndCloseOverlay = buttonElement ? buttonElement.getAttribute(DATA_ATTRIBUTE_CREATE_TASK_AND_CLOSE_OVERLAY) === 'true' : false;
    if (buttonCreateTaskAndCloseOverlay && checkForRequired(['title', 'dueDate', 'category'])) {
        await sendTaskToDB(taskState);
        return [renderNewTaskAddedToastContainer(), true];
    }
    else {
        return [null, false];
    }
}


/**
 * This function swaps the image and text style on hover for a button.
 * 
 * @param {HTMLElement} button The button element.
 * @param {boolean} isHover Whether the button is being hovered.
 */
function swapImage(button, isHover) {
    const img = button.querySelector('img');
    const normalSrc = button.getAttribute('data-normal-src');
    const hoverSrc = button.getAttribute('data-hover-src');
    img.src = isHover ? hoverSrc : normalSrc;
    let p_tag = button.querySelector('p');
    if (isHover) {
        p_tag.style.color = "#29ABE2";
        p_tag.style.fontFamily = "Inter_Bold";
    } else {
        p_tag.style.color = "#2A3647";
        p_tag.style.fontFamily = "Inter";
    }
}


/**
 * This function toggles the visibility of the title/category separator and related elements in the add task overlay.
 */
function toggleTitleCategorySeparatorInAddTaskOverlay() {
    document.getElementById('overlay_title').classList.toggle('show');
    document.getElementsByClassName('upsert_category_container')[0].classList.toggle('show');
    document.getElementById('overlay_separator_add_task').classList.toggle('show');
    document.getElementById('overlay_main_content').classList.toggle('show_separator');
    document.getElementById('overlay_content').classList.toggle('add_task_attributes');
    document.getElementById('clear_button_container').classList.toggle('show');
    document.getElementById('required_text_field_section').classList.toggle('show');
    showWideOverlay = !showWideOverlay;
}


/**
 * This function deletes a task from the overlay and updates the UI and database accordingly.
 * 
 * @param {string} taskId This is the id of the task to delete
 * @param {string} userId This is the id of the user who owns the task
 */
async function deleteTaskInOverlay(taskId) {
    const taskCardElement = document.getElementById(taskId + "_task_card")
    try {
        await deleteTask(taskId);
        if (taskCardElement) {
            taskCardElement.remove();
            enableScrollOnBody();
            delayedClose();
        }
    } catch (error) {
        console.error("Error deleting task with id: " + taskId, error);
        alert("An error occurred while deleting the task. Please try again.");
    }
}