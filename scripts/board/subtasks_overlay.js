/**
 * This function renders the list items for subtasks in the overlay.
 * @param {string} taskId The ID of the task.
 * @param {Array} subtasksArr Array of subtask objects.
 */
function renderSubtasksListItems(taskId, subtasksArr) {
    let containerId = taskId + '_subtasks_list';
    let container = document.getElementById(containerId);
    let subtaskCounter = 0;
    getSubtasksOfTask(subtasksArr);
    for (let subtask of allSubtasksArr) {
        subtaskCounter += 1;
        let subtaskHtml = subtasksListItemTemplate(taskId, subtask.title, subtaskCounter);
        container.innerHTML += subtaskHtml;
        renderSubtaskListItemsCheckboxes(taskId, subtaskCounter, subtask.done);
    }
}

/**
 * This function updates the global subtasks array for the current task.
 * @param {Array} subtasksArr Array of subtask objects.
 */
function getSubtasksOfTask(subtasksArr) {
    allSubtasksArr = [];
    for (let subtask of subtasksArr) {
        let subtaskObj = { title: subtask.title, done: subtask.done };
        allSubtasksArr.push(subtaskObj);
    }
}


/**
 * This function renders the checkbox for a subtask list item.
 * @param {string} taskId The ID of the task.
 * @param {number} subtaskCounter The index of the subtask (1-based).
 * @param {boolean} subtaskDone Whether the subtask is done.
 */
function renderSubtaskListItemsCheckboxes(taskId, subtaskCounter, subtaskDone) {
    const doneImgPath ="../assets/icons/board/checkbox_done.svg"; 
    const undoneImgPath ="../assets/icons/board/checkbox_undone.svg";
    let checkboxCustomId = taskId + '_subtask_checkbox_custom_' + subtaskCounter;
    let checkboxCustomElement = document.getElementById(checkboxCustomId);
    if (subtaskDone) {
        checkboxCustomElement.innerHTML = `<img src="${doneImgPath}" alt="checkbox done icon">`;
    } else {
        checkboxCustomElement.innerHTML = `<img src="${undoneImgPath}" alt="checkbox undone icon">`;
    }
}


/**
 * This function toggles the done state of a subtask and updates the UI.
 * @param {string} taskId The ID of the task.
 * @param {number} subtaskCounter The index of the subtask (1-based).
 */
function toggleSubtaskDone(taskId, subtaskCounter) {
    let task = getSingleTaskOfAllTasksObj(taskId);
    let subtaskIndex = subtaskCounter - 1;
    task.subtasks[subtaskIndex].done = !task.subtasks[subtaskIndex].done;
    renderSubtaskListItemsCheckboxes(taskId, subtaskCounter, task.subtasks[subtaskIndex].done);
    renderSubtaskProgress(taskId, task.subtasks);
    newSubtasksArr = task.subtasks;
}


/**
 * This function renders the editable list items for subtasks in the overlay.
 * @param {Array} subtasksArr Array of subtask objects.
 */
function renderSubtaskEditListItems(subtasksArr) {
    allSubtasksArr = [];
    subtask_list = document.getElementById('subtask_render');
    for (let subtask of subtasksArr) {
        let subtask_id = returnSubtaskId()
        let subtaskTitleHtml = returnSubtaskTemplate(subtask.title,subtask_id);
        subtask_list.innerHTML += subtaskTitleHtml;
        let subtaskObj = { title: subtask.title, done: subtask.done };
        allSubtasksArr.push(subtaskObj);
    }
}
