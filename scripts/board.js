
let lastDropAcceptanceColumnId = null;
let startDropAcceptanceColumnId = null;
let dragOverCounter = 0;
const TASK_STATE_ARR = ['todo', 'in progress', 'awaiting feedback', 'done'];
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


let testTasks = {
  "task_id_x": 
    {
        "category": "Development",
        "title": "Implementiere Login-Funktion",
        "description": "Erstelle das Frontend und Backend für die Nutzeranmeldung.",
        "due_date": "2025-12-10",
        "priority": "Urgent",
        "state": "in progress",
        "assigned_to": [
            "user_id_1",
            "user_id_2"
        ],
        "subtasks": [
            {
            "title": "UI-Mockup erstellen",
            "done": true
            },
            {
            "title": "Validierung implementieren",
            "done": false
            }
        ]
    },
    "task_id_4567":
    {
        "category": "Marketing",
        "title": "Social Media Post erstellen",
        "description": "Post für die Vorstellung des neuen Features planen.",
        "due_date": "01/12/2025",
        "priority": "Medium",
        "state": "to do",
        "assigned_to": [
            "user_id_2"
        ],
        "subtasks": []
    }
  }

let testUser = {
    "user_id_1": {
      "email": "max.mustermann@example.com",
      "name": "Max Mustermann",
      "password": "hashed_password_123"
    },
    "user_id_2": {
      "email": "erika.musterfrau@example.com",
      "name": "Erika Musterfrau",
      "password": "hashed_password_456"
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


function formatSubtaskProgress(subtasks) {
    const completed = subtasks.filter(subtask => subtask.done).length;
    const total = subtasks.length;
    return `${completed}/${total}`;
}


function renderSubtaskProgress(taskId) {
  let elementId = taskId + '_subtasks_done';
  const element = document.getElementById(elementId);
  let task = getTaskByTaskId(taskId);
  element.innerHTML = formatSubtaskProgress(task.subtasks);
  renderSubtaskStatusBar(taskId);
}


function renderSubtaskStatusBar(taskId) {
    let task = getTaskByTaskId(taskId);
    let relationOfDoneSubtasks = formatSubtaskProgress(task.subtasks).split('/');
    let percentage = 0;
    if (relationOfDoneSubtasks[1] > 0) {
        percentage = (relationOfDoneSubtasks[0] / relationOfDoneSubtasks[1]) * 100;
    }
    const fillElement = document.getElementById(taskId + '_subtasks_status_bar');
    fillElement.style.width = `${percentage}%`;
}


function renderTaskCard(taskId) {
    let task = getTaskByTaskId(taskId);    
    let containerId = getColumnIdByTaskState(task.state);    
    const container = document.getElementById(containerId);
    container.innerHTML = taskCardTemplate(task, taskId);
}


function getInitialsFromUser(user) {
    const initials = user.name  
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();
    return initials;
}


function renderAssignedUserIcons(taskId) {
    let task = getTaskByTaskId(taskId);
    let containerIdSuffix = 'assigned_users';
    
    for (let userId of task.assigned_to) {
        const user = testUser[userId];
        const initials = getInitialsFromUser(user);
        const iconHTML = assignedUserIconTemplate(initials);
        const container = document.getElementById(taskId + '_' + containerIdSuffix);
        container.innerHTML += iconHTML;
    }
}


function getIconForPriority(priority) {
    const iconfolderpath = "../assets/icons/addTask/";
    switch(priority) {
        case 'Urgent':
            return iconfolderpath + "urgentTask.svg";
        case 'Medium':
            return iconfolderpath + "medTask.svg";
        case 'Low':
            return iconfolderpath + "lowTask.svg";
    }
}


function renderPriorityIndicator(taskId, prioritySuffix) {
    let task = getTaskByTaskId(taskId);
    let iconPath = getIconForPriority(task.priority);
    let element = document.getElementById(taskId + '_' + prioritySuffix);
    element.innerHTML = priorityIndicatorTemplate(iconPath);
}


function getTaskByTaskId(taskId) {
    return testTasks[taskId];
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
    const taskId = event.dataTransfer.getData("text/plain");
    const taskElement = document.getElementById(taskId);
    event.currentTarget.appendChild(taskElement);
    taskElement.classList.remove('drag-tilt');
    removeDropAcceptanceFieldByColumnId(lastDropAcceptanceColumnId);
    startDropAcceptanceColumnId = null;
    dragOverCounter = 0;
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
    renderNoTaskInfoOnDOMLoad();
});

renderTaskCard('task_id_x');
renderSubtaskProgress('task_id_x');
renderAssignedUserIcons('task_id_x');
renderPriorityIndicator('task_id_x', 'priority');