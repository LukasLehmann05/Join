let lastDropAcceptanceColumnId = null;
let startDropAcceptanceColumnId = null;
let dragOverCounter = 0;
let allTasksOfSingleUserObj = {};

const BOARD_COLUMN_ID_ARR = ['toDoColumn', 'inProgressColumn', 'awaitFeedbackColumn', 'doneColumn'];

// Define the mapping from state to column ID
const STATE_TO_COLUMN_ID = {
    [TASK_STATE_ARR[0]]: BOARD_COLUMN_ID_ARR[0],
    [TASK_STATE_ARR[1]]: BOARD_COLUMN_ID_ARR[1],
    [TASK_STATE_ARR[2]]: BOARD_COLUMN_ID_ARR[2],
    [TASK_STATE_ARR[3]]: BOARD_COLUMN_ID_ARR[3],
};

// Generate the reverse mapping
const COLUMN_ID_TO_STATE = Object.fromEntries(
    Object.entries(STATE_TO_COLUMN_ID).map(([state, columnId]) => [columnId, state])
);

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
    switch(columnId) {
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
    let containerIdSuffix = 'assigned_users';
    
    for (let contactId of taskAssignees) {        
        const user = await getContactById(contactId);
        if (!user) continue;
        const initials = getInitialsFromUser(user);
        const iconHTML = assignedUserIconTemplate(initials);
        const container = document.getElementById(taskId + '_' + containerIdSuffix);
        container.innerHTML += iconHTML;
    }
}

/**
 * This function returns the initials from a user object.
 * 
 * @param {Object} user The user object.
 * @returns {string} The initials of the user.
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
 * This function returns the icon path for a given priority.
 * 
 * @param {string} priority The priority level of the task.
 * @returns {string} The file path to the priority icon.
 */
function getIconForPriority(priority) {
    const iconfolderpath = "../assets/icons/addTask/";
    switch(priority) {
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
    updateAllTasksOfSingleUserObj(newTaskId, newTask);
    renderTaskCard(newTaskId, newTask);
    removeNoTaskInfoElement(getColumnIdByTaskState(newTask.state));
}

/**
 * This function updates the allTasksOfSingleUserObj with the updated task.
 * 
 * @param {string} taskId The ID of the task to update.
 * @param {Object} updatedTask The updated task object.
 */
function updateAllTasksOfSingleUserObj(taskId, updatedTask) {
    allTasksOfSingleUserObj[taskId] = updatedTask;
}

/**
 * This function return a single task from allTasksOfSingleUserObj by its ID.
 * 
 * @param {string} taskId The ID of the task to retrieve.
 * @returns {Object} The task object.
 */
function getSingleTaskOfAllTasksOfSingleUserObj(taskId) {
    return allTasksOfSingleUserObj[taskId];
}

/**
 * This function sets the allTasksOfSingleUserObj from the given array of 
 * task ID objects and all tasks data.
 * @param {Array} allTasksByIdOfSingleUserArr Array of task ID objects for the user.
 * @returns {Object} The allTasksOfSingleUserObj object.
 */
function setAllTasksOfSingleUserObj(allTasksByIdOfSingleUserArr, allTasks) {
    allTasksOfSingleUserObj = {};
    for (let taskIndex in allTasksByIdOfSingleUserArr) {
        let taskId = Object.keys(allTasksByIdOfSingleUserArr[taskIndex])[0];
        let task = allTasks[taskId];
        if (task) {
            allTasksOfSingleUserObj[taskId] = task;
        }
    }
}

/**
 * This function returns all tasks of the single user object.
 * 
 * @returns {Object} The allTasksOfSingleUserObj object.
 */
function getAllTasksOfSingleUserObj() {
    return allTasksOfSingleUserObj; 
}

function resetAllTasksOfSingleUserObj() {
    allTasksOfSingleUserObj = {};
}

/**
 * This function renders "no task" info for all columns on DOM load.
 */
function renderNoTaskInfoOnDOMLoad(){
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
    container.querySelectorAll('.drop_acceptance').forEach(drop => { drop.remove()
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
    initializeBoard(testUserId);
});


/**
 * This function initializes the board for a user.
 * 
 * @param {string} userId The ID of the user whose board is initialized.
 */
async function initializeBoard(userId) {
    let allTasksByIdOfSingleUserArr = await getAllTaskIdByUserId(userId);
    initInputFieldEventListener(allTasksByIdOfSingleUserArr);
    const joinData = await fetchAllDataGlobal();
    
    setAllTasksOfSingleUserObj(allTasksByIdOfSingleUserArr, joinData.tasks);
    renderAllTaskCardsOnBoard(allTasksByIdOfSingleUserArr, joinData.tasks);
    renderNoTaskInfoOnDOMLoad();
    return allTasksByIdOfSingleUserArr;
}

/**
 * This function renders all task cards on the board.
 * 
 * @param {Array} allTasksByIdOfSingleUserArr Array of task ID objects for the user.
 * @param {Object} allTaskData The global task data object.
 */
function renderAllTaskCardsOnBoard(allTasksByIdOfSingleUserArr, allTaskData) {
    for (let taskIndex in allTasksByIdOfSingleUserArr) {
        if (allTasksByIdOfSingleUserArr[taskIndex] === null) continue;
        let taskId = Object.keys(allTasksByIdOfSingleUserArr[taskIndex])[0];        
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
    let taskCardElementId = taskId + '_task_card';
    const columnContainer = document.getElementById(taskCardElementId).parentElement;
    document.getElementById(taskCardElementId).remove();
    if (columnContainer) {
        columnContainer.innerHTML += taskCardTemplate(taskToUpdate, taskId);
        renderSubtaskProgress(taskId, taskToUpdate.subtasks || []);
        await renderAssignedUserIcons(taskId, taskToUpdate.assigned_to || []);
        renderPriorityIndicator(taskId, taskToUpdate.priority, 'priority');
    }
}