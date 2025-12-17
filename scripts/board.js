
let lastDropAcceptanceColumnId = null;
let startDropAcceptanceColumnId = null;
let dragOverCounter = 0;
let allTasksOfSingleUserObj = {};

const BOARD_COLUMN_ID_ARR = ['toDoColumn', 'inProgressColumn', 'awaitFeedbackColumn', 'doneColumn'];


function getColumnIdByTaskState(state) {
    switch(state) {
        case TASK_STATE_ARR[0]:
            return BOARD_COLUMN_ID_ARR[0];
        case TASK_STATE_ARR[1]:
            return BOARD_COLUMN_ID_ARR[1];
        case TASK_STATE_ARR[2]:
            return BOARD_COLUMN_ID_ARR[2];
        case TASK_STATE_ARR[3]:
            return BOARD_COLUMN_ID_ARR[3];
        default:
            return BOARD_COLUMN_ID_ARR[0];
    }   
}


function getTaskStateByColumnId(columnId) {
    switch(columnId) {
        case BOARD_COLUMN_ID_ARR[0]:
            return TASK_STATE_ARR[0];
        case BOARD_COLUMN_ID_ARR[1]:
            return TASK_STATE_ARR[1];
        case BOARD_COLUMN_ID_ARR[2]:
            return TASK_STATE_ARR[2];
        case BOARD_COLUMN_ID_ARR[3]:
            return TASK_STATE_ARR[3];
        default:
            return TASK_STATE_ARR[0];
    }
}


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


function renderSubtaskProgress(taskId, subtasksArr) {
    let elementId = taskId + '_subtasks_done';
    const element = document.getElementById(elementId);
    element.innerHTML = formatSubtaskProgress(subtasksArr);
    renderSubtaskStatusBar(taskId, subtasksArr);
}


function formatSubtaskProgress(subtasks) {
    const completed = subtasks.filter(subtask => subtask.done).length;
    const total = subtasks.length;
    return `${completed}/${total}`;
}


function renderSubtaskStatusBar(taskId, subtasksArr) {
    let relationOfDoneSubtasks = formatSubtaskProgress(subtasksArr).split('/');
    let percentage = 0;
    if (relationOfDoneSubtasks[1] > 0) {
        percentage = (relationOfDoneSubtasks[0] / relationOfDoneSubtasks[1]) * 100;
    }
    const fillElement = document.getElementById(taskId + '_subtasks_status_bar');
    fillElement.style.width = `${percentage}%`;
}


async function renderTaskCard(taskId, task) {
    let containerId = getColumnIdByTaskState(task.state);    
    const container = document.getElementById(containerId);
    container.innerHTML += taskCardTemplate(task, taskId);
    renderSubtaskProgress(taskId, task.subtasks || []);
    renderAssignedUserIcons(taskId, task.assigned_to || []);
    renderPriorityIndicator(taskId, task.priority, 'priority');
}


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


function getInitialsFromUser(user) {
    const initials = user.name  
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();
    return initials;
}


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


function renderPriorityIndicator(taskId, taskPriority, prioritySuffix) {
    let iconPath = getIconForPriority(taskPriority);
    let element = document.getElementById(taskId + '_' + prioritySuffix);
    element.innerHTML = priorityIndicatorTemplate(iconPath);
}


function dragStartHandler(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
}


function dragOverHandler(event) {
    startDropAcceptanceColumnId = getCurrentColumnId(event)[0];
    let currentColumnId = getCurrentColumnId(event)[1];
    clearLastDropAcceptanceIfChangedColumn(currentColumnId);
    setDropAcceptanceInCurrentColumn(currentColumnId);
    event.preventDefault();
}


function getCurrentColumnId(event) {
    let currentColumnId = null;

    if (dragOverCounter < 1) {
        startDropAcceptanceColumnId = getIdOfCurrentColumn(event);        
        currentColumnId = startDropAcceptanceColumnId;
        dragOverCounter++;
    }
    else {
        currentColumnId = getIdOfCurrentColumn(event);
    }
    return [startDropAcceptanceColumnId, currentColumnId];
}


function clearLastDropAcceptanceIfChangedColumn(currentColumnId) {
     if (lastDropAcceptanceColumnId && lastDropAcceptanceColumnId !== currentColumnId) {
        removeDropAcceptanceFieldByColumnId(lastDropAcceptanceColumnId);
    }    
    lastDropAcceptanceColumnId = currentColumnId;
}


function setDropAcceptanceInCurrentColumn(currentColumnId) {
    if(startDropAcceptanceColumnId !== currentColumnId && currentColumnId !== null) {
        renderDropAcceptanceInColumn(currentColumnId);
    }
}


function getIdOfCurrentColumn(event) {
    return event.currentTarget.id;
}


function renderDropAcceptanceInColumn(columnId) {
    const columnContent = document.getElementById(columnId);  
    if (!columnContent.querySelector('.drop_acceptance')) {
        columnContent.innerHTML += showDropAcceptanceTemplate();
    }
    removeNoTaskInfoElement(columnId);
}


function removeNoTaskInfoElement(columnId) {
    const columnContent = document.getElementById(columnId);
    findChildAndRemoveNoTaskElement(columnContent);
}


function findChildAndRemoveNoTaskElement(parentElement) {
    const noTaskClassName = 'no_task_yet';
    const noTaskElement = parentElement.querySelector(`.${noTaskClassName}`);
    if (noTaskElement) {
        noTaskElement.remove();
    }
}


function dropHandler(event) {
    event.preventDefault();
    const taskCardContainer = event.dataTransfer.getData("text/plain");
    const taskElement = document.getElementById(taskCardContainer);
    const taskId = taskCardContainer.replace('_task_card', '');
    event.currentTarget.appendChild(taskElement);
    taskElement.classList.remove('drag-tilt');
    removeDropAcceptanceFieldByColumnId(lastDropAcceptanceColumnId);
    updateStateOfDroppedTask(taskId, event.currentTarget.id);
    startDropAcceptanceColumnId = null;
    dragOverCounter = 0;
}


function updateStateOfDroppedTask(taskId, newColumnId) {
    const newState = getTaskStateByColumnId(newColumnId);
    allTasksOfSingleUserObj[taskId].state = newState;
    updateTask(taskId, allTasksOfSingleUserObj[taskId]);
}


function displayNewTaskOnBoard(newTaskId, newTask) {
    allTasksOfSingleUserObj[newTaskId] = newTask;
    renderTaskCard(newTaskId, newTask);
    removeNoTaskInfoElement(getColumnIdByTaskState(newTask.state));
}


function removeDropAcceptanceFieldByColumnId(columnId) {
    const columnOfDrop = document.getElementById(columnId).querySelectorAll('.drop_acceptance');
    columnOfDrop.forEach(drop => drop.remove());
}


function renderNoTaskInfoOnDOMLoad(){
    BOARD_COLUMN_ID_ARR.forEach(columnId => {
        checkIfNoTasksInColumn(columnId);
    });
}


function checkIfNoTasksInColumn(columnId) {
    const container = document.getElementById(columnId);
    if (container.innerHTML.trim() === '') {
        renderNoTaskInfo(columnId);
    }
    container.querySelectorAll('.drop_acceptance').forEach(drop => { drop.remove()
    });
}


function observeColumnEmpty(columnId) {
    const container = document.getElementById(columnId);
    if (!container) return;
    const observer = new MutationObserver(() => {
        if (container.innerHTML.trim() === '') {
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


async function initializeBoard(userId) {
    let allTasksByIdOfSingleUserArr = await getAllTaskIdByUserId(userId);
    
    for (let taskIndex in allTasksByIdOfSingleUserArr) {
        if (allTasksByIdOfSingleUserArr[taskIndex] === null) continue;
        let taskId = Object.keys(allTasksByIdOfSingleUserArr[taskIndex])[0];        
        let task = await getTaskById(taskId);
        if (!task) continue;
        allTasksOfSingleUserObj[taskId] = task;
        renderTaskCard(taskId, task);
    }

    renderNoTaskInfoOnDOMLoad();
}


function refreshTaskOnBoard(taskId, taskToUpdate) {
    let taskCardElementId = taskId + '_task_card';
    const columnContainer = document.getElementById(taskCardElementId).parentElement;
    document.getElementById(taskCardElementId).remove();
    if (columnContainer) {
        columnContainer.innerHTML += taskCardTemplate(taskToUpdate, taskId);
        renderSubtaskProgress(taskId, taskToUpdate.subtasks || []);
        renderAssignedUserIcons(taskId, taskToUpdate.assigned_to || []);
        renderPriorityIndicator(taskId, taskToUpdate.priority, 'priority');
    }
    
}

// Example function to create tasks_by_user object for testing
function createTasksByUserObjExample() {
    let tasks_by_user = {"-OfhU5mv5Jc_R3Ybzq8T": [{"-OgVOFImFYhl08hbX_G0": true}, {"-OgVP8F6Ee7L2UHtEKTx": true}]};
    updateUserTasksInDB("-OfhU5mv5Jc_R3Ybzq8T", tasks_by_user["-OfhU5mv5Jc_R3Ybzq8T"]);
}
