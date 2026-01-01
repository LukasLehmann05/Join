/**
 * This function opens the edit overlay for a task and renders its content.
 * 
 * @param {HTMLElement} buttonElement The button element that triggered the overlay.
 * @param {string} taskId The ID of the task to edit.
 */
async function openEditTaskOverlay(buttonElement, taskId) {
    let taskState = '';
    if (buttonElement) {
        taskState = buttonElement.getAttribute('data-task-state');
    }
    const overlayContent = document.getElementById('overlay_content');
    overlayContent.innerHTML = '';
    overlayContent.innerHTML = overlayUpsertTaskTemplate(taskId, 'Ok', DATA_ATTRIBUTE_EDIT_TASK_AND_CLOSE_OVERLAY, taskState);
    let task = getSingleTaskOfAllTasksOfSingleUserObj(taskId);
    upsertTaskTemplateHandler(taskId);
    await renderAssignedUserInfos(task.assigned_to, true, 'rendered_contact_images');
    renderSubtaskEditListItems(task.subtasks || []);
    addTaskInit();
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
        return getSingleTaskOfAllTasksOfSingleUserObj(taskId);
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
 * @param {HTMLElement} buttonElement The button element that triggered the overlay.
 */
async function openAddTaskOverlay(buttonElement) {
    let taskState = '';
    if (buttonElement) {
        taskState = buttonElement.getAttribute('data-task-state');
    }
    allAssigneesArr = [];
    allSubtasksArr = [];
    clearElementsOfNewTask();
    const taskId = 'new_task_id_' + Date.now();
    document.getElementById('overlay').classList.add('show');
    setTimeout(() => {
        document.getElementById('overlay_content').classList.add('show');
    }, 10);
    renderOverlayAddTask(taskId, taskState).then(() => {
        addTaskInit();
    })
    disableScrollOnBody();
}


/**
 * This function renders the overlay content for adding a new task.
 * 
 * @param {string} taskId The ID of the new task.
 * @returns {Promise<void>} A promise that resolves when rendering is complete.
 */
function renderOverlayAddTask(taskId, taskState) {
    const overlayContent = document.getElementById('overlay_content');
    overlayContent.innerHTML = '';
    overlayContent.innerHTML = overlayUpsertTaskTemplate(taskId, 'Create Task', DATA_ATTRIBUTE_CREATE_TASK_AND_CLOSE_OVERLAY, taskState);
    upsertTaskTemplateHandler(taskId);
    toggleTitleCategorySeparatorInAddTaskOverlay();
    return Promise.resolve();
}

 /**
 * Duration (in ms) for which the toast is visibly displayed.
 */
const TOAST_DISPLAY_DURATION = 1500;

/**
 * Buffer time (in ms) to allow toast animations/setup before and after display.
 */
const TOAST_ANIMATION_BUFFER = 100;

/**
 * Total duration (in ms) from showing the toast to hiding it again.
 * Equals TOAST_DISPLAY_DURATION + TOAST_ANIMATION_BUFFER.
 */
const TOAST_TOTAL_DURATION = TOAST_DISPLAY_DURATION + TOAST_ANIMATION_BUFFER;

/**
 * This function renders a toast notification indicating that a new task has been added.
 */
function renderNewTaskAddedToastContainer() {
    return new Promise((resolve) => {
        setTimeout(() => {
            document.getElementsByTagName("body")[0].style.overflow = "hidden";
            toggleNewTaskToast();
        }, TOAST_ANIMATION_BUFFER);
        setTimeout(() => {
            toggleNewTaskToast();
            document.getElementsByTagName("body")[0].style.overflow = "auto";
            resolve();
        }, TOAST_TOTAL_DURATION);
    });
}

/**
 * This function toggles the visibility of the new task toast notification.
 * Toggles the 'show' class on the toast element.
 */
function toggleNewTaskToast() {
    document.getElementById('responseToast').classList.toggle('show');
}