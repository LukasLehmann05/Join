let lastDropAcceptanceColumnId = null;
let startDropAcceptanceColumnId = null;
let dragOverCounter = 0;
let allTasksObj = {};

const BOARD_COLUMN_ID_ARR = ['toDoColumn', 'inProgressColumn', 'awaitFeedbackColumn', 'doneColumn'];

// Define the mapping from state to column ID
const STATE_TO_COLUMN_ID = {
    [TASK_STATE_ARR[0]]: BOARD_COLUMN_ID_ARR[0],
    [TASK_STATE_ARR[1]]: BOARD_COLUMN_ID_ARR[1],
    [TASK_STATE_ARR[2]]: BOARD_COLUMN_ID_ARR[2],
    [TASK_STATE_ARR[3]]: BOARD_COLUMN_ID_ARR[3],
}


// Generate the reverse mapping
const COLUMN_ID_TO_STATE = Object.fromEntries(
    Object.entries(STATE_TO_COLUMN_ID).map(([state, columnId]) => [columnId, state])
)


/**
 * This function returns the column ID corresponding to a given task state.
 * 
 * @param {string} state The state of the task.
 * @returns {string} The column ID associated with the given task state.
 */
function getColumnIdByTaskState(state) {
    return STATE_TO_COLUMN_ID[state] || BOARD_COLUMN_ID_ARR[0];
}


/**
 * This function returns the task state corresponding to a given column ID.
 * 
 * @param {string} columnId The ID of the column.
 * @returns {string} The task state associated with the given column ID.
 */
function getTaskStateByColumnId(columnId) {
    return COLUMN_ID_TO_STATE[columnId] || TASK_STATE_ARR[0];
}


/**
 * This function renders the "no task" info template for a given column.
 * 
 * @param {string} columnId The ID of the column to render the info in.
 */
function renderNoTaskInfo(columnId) {
    const container = document.getElementById(columnId);
    switch (columnId) {
        case BOARD_COLUMN_ID_ARR[0]:
            container.innerHTML = noTasksDoToTemplate();
            break;
        case BOARD_COLUMN_ID_ARR[1]:
            container.innerHTML = noTaskInProgressTemplate();
            break;
        case BOARD_COLUMN_ID_ARR[2]:
            container.innerHTML = noTaskInFeedbackTemplate();
            break;
        case BOARD_COLUMN_ID_ARR[3]:
            container.innerHTML = noTaskDoneTemplate();
            break;
    }
}


/**
 * This function renders the subtask progress for a task.
 * 
 * @param {string} taskId The ID of the task.
 * @param {Array} subtasksArr Array of subtasks for the task.
 */
function renderSubtaskProgress(taskId, subtasksArr) {
    let elementId = taskId + '_subtasks_done';
    const element = document.getElementById(elementId);
    element.innerHTML = formatSubtaskProgress(subtasksArr);
    renderSubtaskStatusBar(taskId, subtasksArr);
}


/**
 * This function formats the subtask progress as a string "completed/total".
 * 
 * @param {Array} subtasks Array of subtask objects.
 * @returns {string} A string representing completed and total subtasks.
 */
function formatSubtaskProgress(subtasks) {
    const completed = subtasks.filter(subtask => subtask.done).length;
    const total = subtasks.length;
    return `${completed}/${total}`;
}


/**
 * This function renders the subtask status bar for a task.
 * 
 * @param {string} taskId The ID of the task.
 * @param {Array} subtasksArr Array of subtasks for the task.
 */
function renderSubtaskStatusBar(taskId, subtasksArr) {
    let relationOfDoneSubtasks = formatSubtaskProgress(subtasksArr).split('/');
    let percentage = 0;
    if (relationOfDoneSubtasks[1] > 0) {
        percentage = (relationOfDoneSubtasks[0] / relationOfDoneSubtasks[1]) * 100;
    }
    const fillElement = document.getElementById(taskId + '_subtasks_status_bar');
    fillElement.style.width = `${percentage}%`;
    if (relationOfDoneSubtasks[0] === '0') {
        let taskBar = document.getElementById(taskId + '_subtasks_status_bar_element');
        taskBar.style.display ="none";
    }
}


/**
 * This function renders a task card in the appropriate column.
 * 
 * @param {string} taskId The ID of the task.
 * @param {Object} task The task object to render.
 */
async function renderTaskCard(taskId, task) {
    let containerId = getColumnIdByTaskState(task.state);
    const container = document.getElementById(containerId);
    container.innerHTML += taskCardTemplate(task, taskId);
    renderSubtaskProgress(taskId, task.subtasks || []);
    await renderAssignedUserIcons(taskId, task.assigned_to || []);
    renderPriorityIndicator(taskId, task.priority, 'priority');
}


/**
 * This function renders the assigned user icons for a task.
 * 
 * @param {string} taskId The ID of the task.
 * @param {Array} taskAssignees Array of user/contact IDs assigned to the task.
 */
async function renderAssignedUserIcons(taskId, taskAssignees) {
    let rendered_amount = 0;
    let containerIdSuffix = 'assigned_users';
    let iconsHTML = '';
    for (let contactId of taskAssignees) {
        rendered_amount += 1
        if (rendered_amount <= amount_for_render_overflow) {
            const contact = await getContactById(contactId);
            if (contact != undefined) {
                const initials = getInitialsFromUser(contact);
                const iconHTML = assignedUserIconTemplate(initials, contact.color);
                iconsHTML += iconHTML;
            }
        }
    }
    addAssigneeIconsToTaskCard(taskId, containerIdSuffix, iconsHTML, rendered_amount)
}


// Get fresh container reference and update once
function addAssigneeIconsToTaskCard(taskId, containerIdSuffix, iconsHTML, rendered_amount) {
    const container = document.getElementById(taskId + '_' + containerIdSuffix);
    if (container) {
        container.innerHTML = iconsHTML;
        checkForAssigneeOverflow(rendered_amount, container);
    }
}


// This function adds a overflow div for assignee display when rendered amount higher than the limit
function checkForAssigneeOverflow(rendered_amount, container) {
    if (rendered_amount > amount_for_render_overflow) {
        let overflow_amount = rendered_amount - amount_for_render_overflow
        container.innerHTML += returnSmallContactOverflowTemplateBoard('+' + overflow_amount)
    }
}


/**
 * This function returns the icon path for a given priority.
 * 
 * @param {string} priority The priority level of the task.
 * @returns {string} The file path to the priority icon.
 */
function getIconForPriority(priority) {
    const iconfolderpath = "../assets/icons/addTask/";
    switch (priority) {
        case PRIORITY_ARR[2]:
            return iconfolderpath + "urgentTask.svg";
        case PRIORITY_ARR[1]:
            return iconfolderpath + "medTaskorange.svg";
        case PRIORITY_ARR[0]:
            return iconfolderpath + "lowTask.svg";
    }
}


/**
 * This function renders the priority indicator for a task.
 * 
 * @param {string} taskId The ID of the task.
 * @param {string} taskPriority The priority of the task.
 * @param {string} prioritySuffix The suffix for the element ID.
 */
function renderPriorityIndicator(taskId, taskPriority, prioritySuffix) {
    let iconPath = getIconForPriority(taskPriority);
    let element = document.getElementById(taskId + '_' + prioritySuffix);
    element.innerHTML = priorityIndicatorTemplate(iconPath);
}


/**
 * This function displays a new task on the board.
 * 
 * @param {string} newTaskId The ID of the new task.
 * @param {Object} newTask The new task object.
 */
function displayNewTaskOnBoard(newTaskId, newTask) {
    updateAllTasksObj(newTaskId, newTask);
    renderTaskCard(newTaskId, newTask);
    removeNoTaskInfoElement(getColumnIdByTaskState(newTask.state));
}


/**
 * This function updates the allTasksObj with the updated task.
 * 
 * @param {string} taskId The ID of the task to update.
 * @param {Object} updatedTask The updated task object.
 */
function updateAllTasksObj(taskId, updatedTask) {
    allTasksObj[taskId] = updatedTask;
}


/**
 * This function return a single task from allTasksObj by its ID.
 * 
 * @param {string} taskId The ID of the task to retrieve.
 * @returns {Object} The task object.
 */
function getSingleTaskOfAllTasksObj(taskId) {
    return allTasksObj[taskId];
}


/**
 * This function sets the allTasksObj from the given array of 
 * task ID objects and all tasks data.
 * @param {Array} allTasksByIdArr Array of task IDs.
 * @returns {Object} The allTasksObj object.
 */
function setAllTasksObj(allTasksByIdArr, allTasks) {
    allTasksObj = {};
    for (let taskIndex in allTasksByIdArr) {
        if (allTasksByIdArr[taskIndex] === null) continue;
        let taskId = allTasksByIdArr[taskIndex];
        let task = allTasks[taskId];
        if (task) {
            allTasksObj[taskId] = task;
        }
    }
}


/**
 * This function returns all tasks.
 * 
 * @returns {Object} The allTasksObj object.
 */
function getAllTasksObj() {
    return allTasksObj;
}


/**
 * This function resets the allTasksObj to an empty object.
 */
function resetAllTasksObj() {
    allTasksObj = {};
}


/**
 * This function renders "no task" info for all columns on DOM load.
 */
function renderNoTaskInfoOnDOMLoad() {
    BOARD_COLUMN_ID_ARR.forEach(columnId => {
        checkIfNoTasksInColumn(columnId);
    });
}


/**
 * This function checks if a column has no tasks and renders "no task" info if needed.
 * 
 * @param {string} columnId The ID of the column to check.
 */
function checkIfNoTasksInColumn(columnId) {
    const container = document.getElementById(columnId);
    if (container.innerHTML.trim() === '') {
        renderNoTaskInfo(columnId);
    }
    container.querySelectorAll('.drop_acceptance').forEach(drop => {
        drop.remove()
    });
}


/**
 * This function observes a column for becoming empty and renders "no task" info.
 * 
 * @param {string} columnId The ID of the column to observe.
 */
function observeColumnEmpty(columnId) {
    const container = document.getElementById(columnId);
    if (!container) return;
    const observer = new MutationObserver(() => {
        if (container.innerHTML.trim() === '' && searchEvent === false) {
            renderNoTaskInfo(columnId);
        }
    });
    observer.observe(container, { childList: true, subtree: false });
}


document.addEventListener('DOMContentLoaded', () => {
    observeColumnEmpty(BOARD_COLUMN_ID_ARR[0]);
    observeColumnEmpty(BOARD_COLUMN_ID_ARR[1]);
    observeColumnEmpty(BOARD_COLUMN_ID_ARR[2]);
    observeColumnEmpty(BOARD_COLUMN_ID_ARR[3]);
    initializeBoard();
})


/**
 * This function initializes the board by fetching data and rendering tasks.
 * @returns {Array} Array of all task IDs.
 */
async function initializeBoard() {
    const joinData = await fetchAllDataGlobal();
    let allTasksByIdArr = getAllTaskIds(joinData);
    initInputFieldEventListener(allTasksByIdArr);

    setAllTasksObj(allTasksByIdArr, joinData.tasks);
    await checkAssigneesExistence(allTasksByIdArr, joinData);
    renderAllTaskCardsOnBoard(allTasksByIdArr, joinData.tasks);
    renderNoTaskInfoOnDOMLoad();
    return allTasksByIdArr;
}


/**
 * This function retrieves all task IDs from the join data.
 * 
 * @param {Object} joinData This is the global join data object.
 * @returns {Array} Array of all task IDs.
 */
function getAllTaskIds(joinData) {
    let allTaskIds = [];
    for (let taskId in joinData.tasks) {
        allTaskIds.push(taskId);
    }
    return allTaskIds;
}


/**
 * This function renders all task cards on the board.
 * 
 * @param {Array} allTasksByIdArr Array of task IDs.
 * @param {Object} allTaskData The global task data object.
 */
function renderAllTaskCardsOnBoard(allTasksByIdArr, allTaskData) {
    for (let taskIndex in allTasksByIdArr) {
        if (allTasksByIdArr[taskIndex] === null) continue;
        let taskId = allTasksByIdArr[taskIndex];
        let task = allTaskData[taskId];
        if (!task) continue;
        renderTaskCard(taskId, task);
    }
}


/**
 * This function refreshes a task card on the board after an update.
 * 
 * @param {string} taskId The ID of the task to refresh.
 * @param {Object} taskToUpdate The updated task object.
 */
async function refreshTaskOnBoard(taskId, taskToUpdate) {
    const oldCard = document.getElementById(taskId + '_task_card');
    if (oldCard) {
        const newCard = document.createElement('div');
        newCard.innerHTML = taskCardTemplate(taskToUpdate, taskId);
        const newCardElement = newCard.firstElementChild;
        oldCard.replaceWith(newCardElement);
        renderSubtaskProgress(taskId, taskToUpdate.subtasks || []);
        await renderAssignedUserIcons(taskId, taskToUpdate.assigned_to || []);
        renderPriorityIndicator(taskId, taskToUpdate.priority, 'priority');
    }
}