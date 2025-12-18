let showWideOverlay = false;

let newTitle = "";
let newCategory = "";
let newDescription = "";
let newDueDate = "";
let newPriority = "";
let newAssigneesArr = [];
let newSubtasksArr = [];
let newState = "";


/**
 * This function sends the updated task to the database and refreshes the board.
 * 
 * @param {string} taskId The ID of the task to update.
 */
async function sendUpdatedTaskToDB(taskId) {
    let taskToUpdate = await getTaskToUpdate(taskId);
    allTasksOfSingleUserObj[taskId] = taskToUpdate;
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
    if (newAssigneesArr.length > 0) taskToUpdate.assigned_to = newAssigneesArr;
    if (newSubtasksArr.length > 0) taskToUpdate.subtasks = newSubtasksArr;
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
    let task = allTasksOfSingleUserObj[taskId];
    if (!task) return;
    overlayContent.innerHTML = overlayContentTemplate(task, taskId);
    renderPriorityIndicator(taskId, task.priority, 'priority_overlay');
    await renderAssignedUserInfos(task.assigned_to, false, 'assigned_users_overlay');
    renderSubtasksListItems(taskId, task.subtasks || []);
}


/**
 * This function renders the assigned user infos in the overlay.
 * 
 * @param {Array} taskAssignees Array of user/contact IDs assigned to the task.
 * @param {boolean} onlyId Whether to render only the ID/icon or also the name.
 * @param {string} containerIdSuffix The ID of the container to render into.
 */
async function renderAssignedUserInfos(taskAssignees, onlyId, containerIdSuffix) {
    let container = document.getElementById(containerIdSuffix);
    getAssigneesOfTask(taskAssignees);
    
    for (let contactId of allAssigneesArr) {
        const user = await getContactById(contactId);
        if (user) {
            container.innerHTML += getContentToRenderAssignedUserInfos(onlyId, user);
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
    for (let contactId of taskAssignees) {
        allAssigneesArr.push(contactId);
    }
}


/**
 * This function returns the HTML content to render assigned user infos.
 * 
 * @param {boolean} renderOnlyId Whether to render only the ID/icon or also the name.
 * @param {Object} user The user object.
 * @returns {string} The HTML string for the assigned user info.
 */
function getContentToRenderAssignedUserInfos(renderOnlyId, user) {
    if(renderOnlyId) {
        return  `   <div class="assigned_user_content">
                    ${assignedUserIconTemplate(getInitialsFromUser(user))}
                    </div>
                `;
    }
    else {
        return  `   <div class="assigned_user_content">
                    ${assignedUserIconTemplate(getInitialsFromUser(user))}
                    ${assignedUserNameTemplate(user.name)}
                    </div>
                `;
    }
}


/**
 * This function closes the overlay if the background is clicked.
 * 
 * @param {Event} event The click event object.
 */
function closeOverlay(event) {
    if(event.target === event.currentTarget) {
        removeShowClass();
    }
}


/**
 * This function removes the 'show' class from overlay elements and optionally saves changes.
 * 
 * @param {HTMLElement} buttonElement The button element that triggered the close (optional).
 * @param {string} taskId The ID of the task to save (optional).
 */
function removeShowClass(buttonElement, taskId) {
    const buttonSaveOverlayWhenClosed = buttonElement ? buttonElement.getAttribute('data-save-task-when-close-overlay') === 'true' : false;
    if (buttonSaveOverlayWhenClosed) {
        sendUpdatedTaskToDB(taskId);        
    }

    const overlay = document.getElementById('overlay');
    const overlayContent = document.getElementById('overlay_content');

    if (overlay.classList.contains('show')) {
        overlayContent.classList.remove('show');
         setTimeout(() => {
            overlay.classList.remove('show');
            if(showWideOverlay) {
                toggleTitleCategorySeparatorInAddTaskOverlay();
            }
        }, 500);
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
 * This function opens the edit overlay for a task and renders its content.
 * 
 * @param {string} taskId The ID of the task to edit.
 */
async function openEditTaskOverlay(taskId) {
    const overlayContent = document.getElementById('overlay_content');
    overlayContent.innerHTML = '';
    overlayContent.innerHTML = overlayUpsertTaskTemplate(taskId, 'Ok', `updateTaskElements(this, '${taskId}')`);
    let task = allTasksOfSingleUserObj[taskId];
    upsertTaskTemplateHandler(taskId);
    await renderAssignedUserInfos(task.assigned_to, true, 'rendered_contact_images');
    renderSubtaskEditListItems(task.subtasks || []);
    addTaskInit();
}


/**
 * This function updates the task elements with new values and closes the overlay.
 * 
 * @param {HTMLElement} button The button element that triggered the update.
 * @param {string} taskId The ID of the task to update.
 */
function updateTaskElements(button, taskId) {
    clearElementsOfNewTask();
    getAllFieldValuesOfEditTaskWhenUpdated();
    removeShowClass(button, taskId);
}


/**
 * This function handles rendering the upsert task template containers.
 * 
 * @param {string} taskId The ID of the task to add or edit.
 */
function upsertTaskTemplateHandler(taskId){
    renderOverlayUpsertTaskDetailsContainer();
    upsertTaskTemplatesWrapperContainer1(taskId);
    upsertTaskTemplatesWrapperContainer2(taskId);
}
   

/**
 * This function renders the main details container for the upsert task overlay.
 */
function renderOverlayUpsertTaskDetailsContainer() {
    let mainContent = document.getElementById('overlay_main_content');
    let detailContainerHtml = overlayUpsertTaskDetailsContainerTemplate();
    mainContent.innerHTML = detailContainerHtml;
}


/**
 * This function renders the first wrapper container for the upsert task overlay.
 * 
 * @param {string} taskId The ID of the task to add or edit.
 */
function upsertTaskTemplatesWrapperContainer1(taskId){
    let task = checkTaskToAddOrEdit(taskId);
    let escapeTaskDescription = escapeTextareaContent(task.description);
    let taskDetailsContainer1 = document.getElementById('task_details_container_1');
    taskDetailsContainer1.innerHTML = `
    ${overlayUpsertTaskTitleTemplate(task.title)}
    ${overlayUpsertTaskDescriptionTemplate(escapeTaskDescription)}
    ${overlayUpsertTaskDueDateTemplate(task.due_date)}`; 
}


/**
 * This function renders the second wrapper container for the upsert task overlay.
 * 
 * @param {string} taskId The ID of the task to add or edit.
 */
function upsertTaskTemplatesWrapperContainer2(taskId){
    let taskDetailsContainer2 = document.getElementById('task_details_container_2');
    taskDetailsContainer2.innerHTML = `
    ${overlayUpsertTaskPriorityTemplate()}
    ${overlayUpsertTaskAssignedUsersTemplate()}
    ${overlayUpsertCategoryOptionTemplate()}
    ${overlayUpsertTaskSubtasksTemplate(taskId)}`;
}


/**
 * This function checks if a task is being added or edited and returns the appropriate object.
 * 
 * @param {string} taskId The ID of the task.
 * @returns {Object} The task object to add or edit.
 */
function checkTaskToAddOrEdit(taskId) {
    if (taskId.startsWith('new_task_id_')) {
        return createEmptyTask();
    } else {
        return allTasksOfSingleUserObj[taskId];
    }
}


/**
 * This function creates and returns an empty task object.
 * 
 * @returns {Object} An empty task object.
 */
function createEmptyTask() {
    return {
        assigned_to: [],
        category: "",
        description: "",
        due_date: "",
        priority: "low",
        subtasks: [],
        title: "",
        state: "todo"
    };
}


/**
 * This function escapes special characters in textarea content for safe HTML rendering.
 * 
 * @param {string} text The text to escape.
 * @returns {string} The escaped text.
 */
function escapeTextareaContent(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}


/**
 * This function opens the overlay for adding a new task and initializes the form.
 */
async function openAddTaskOverlay() {
    allAssigneesArr = [];
    allSubtasksArr = [];
    clearElementsOfNewTask();
    const taskId = 'new_task_id_' + Date.now();
    document.getElementById('overlay').classList.add('show');
    setTimeout(() => {
        document.getElementById('overlay_content').classList.add('show');
    }, 10);
    renderOverlayAddTask(taskId).then(() => {
        addTaskInit();
    })
}


/**
 * This function renders the overlay content for adding a new task.
 * 
 * @param {string} taskId The ID of the new task.
 * @returns {Promise<void>} A promise that resolves when rendering is complete.
 */
function renderOverlayAddTask(taskId) {
    const overlayContent = document.getElementById('overlay_content');
    overlayContent.innerHTML = '';
    overlayContent.innerHTML = overlayUpsertTaskTemplate(taskId, 'Create Task', `createTask()`);
    upsertTaskTemplateHandler(taskId);
    toggleTitleCategorySeparatorInAddTaskOverlay();
    return Promise.resolve();
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