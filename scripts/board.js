let testTasks = {
  "task_id_0123": 
    {
      "category": "Development",
      "title": "Implementiere Login-Funktion",
      "description": "Erstelle das Frontend und Backend für die Nutzeranmeldung.",
      "due_date": "2025-12-10",
      "priority": "Urgent",
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
        case 'toDoColumn':
            container.innerHTML = noTasksDoToTemplate();
            break;
        case 'inProgressColumn':
            container.innerHTML = noTaskInProgressTemplate();
            break;
        case 'awaitFeedbackColumn':
            container.innerHTML = noTaskInFeedbackTemplate();
            break;
        case 'doneColumn':
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
  let elementId = getTaskIdAsStringFromTask(taskId) + '_subtasks_done';
  const element = document.getElementById(elementId);
  element.innerHTML = formatSubtaskProgress(taskId.subtasks);
  renderSubtaskStatusBar(taskId);
}

function renderSubtaskStatusBar(task) {
    let relationOfDoneSubtasks = formatSubtaskProgress(task.subtasks).split('/');
    let percentage = 0;
    if (relationOfDoneSubtasks[1] > 0) {
        percentage = (relationOfDoneSubtasks[0] / relationOfDoneSubtasks[1]) * 100;
    }
    const fillElement = document.getElementById(getTaskIdAsStringFromTask(task) + '_subtasks_status_bar');
    fillElement.style.width = `${percentage}%`;
}

function renderTaskCard(task, containerId) {
    let taskId = getTaskIdAsStringFromTask(task);
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

function renderAssignedUserIcons(task) {
  let containerIdSuffix = 'assigned_users';
  
  for (let userId of task.assigned_to) {
      const user = testUser[userId];
      const initials = getInitialsFromUser(user);
      const iconHTML = assignedUserIconTemplate(initials);
      const container = document.getElementById(getTaskIdAsStringFromTask(task) + '_' + containerIdSuffix);
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

function renderPriorityIndicator(task, prioritySuffix) {
    let iconPath = getIconForPriority(task.priority);
    let element = document.getElementById(getTaskIdAsStringFromTask(task) + '_' + prioritySuffix);
    element.innerHTML = priorityIndicatorTemplate(iconPath);
}

function getTaskIdAsStringFromTask(task) {
    for (let id in testTasks) {
        if (testTasks[id] === task) {
            return id;
        }
    }
    return null;
}

function getTaskByTaskId(taskId) {
    return testTasks[taskId];
}

let lastDropAcceptanceColumnId = null;
let currentDropAcceptanceColumnId = null;

function dragStartHandler(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
    lastDropAcceptanceColumnId = findParentAndReturnId(event.target);
}

function findParentAndReturnId(element) {
    let parent = element.parentElement;
    while (parent) {
        if (parent.classList.contains('column_content')) {
            return parent.id;
        }
        parent = parent.parentElement;
    }
    return null;
}


function dragOverHandler(event) {
    currentDropAcceptanceColumnId = getIdOfCurrentColumn(event);   
    if (lastDropAcceptanceColumnId !== currentDropAcceptanceColumnId) {
        renderDropAcceptanceInColumn(currentDropAcceptanceColumnId);
        lastDropAcceptanceColumnId = currentDropAcceptanceColumnId;
    }
    event.preventDefault();
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

function hideDropAcceptanceFromLastColumn() {
    if (lastDropAcceptanceColumnId) {
        const lastColumn = document.getElementById(lastDropAcceptanceColumnId);
        const dropAcceptanceElement = lastColumn.querySelector('.drop_acceptance');
        if (dropAcceptanceElement) {
            dropAcceptanceElement.remove();
        }
        lastDropAcceptanceColumnId = null;
    }
}

function hideDropAcceptanceInAllColumns() {
    const columns = document.querySelectorAll('.column_content .drop_acceptance');
    columns.forEach(drop => drop.remove());
    lastDropAcceptanceColumnId = null;
}

function removeNoTaskInfoElement(columnId) {
    const noTaskClassName = 'no_task_yet';
    const columnContent = document.getElementById(columnId);
    findChildAndRemoveNoTaskElement(columnContent, noTaskClassName);
}

function findChildAndRemoveNoTaskElement(parentElement, className) {
    const noTaskElement = parentElement.querySelector(`.${className}`);
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
    hideDropAcceptanceInAllColumns();
}

function checkIfNoTasksInColumn(columnId) {
    const container = document.getElementById(columnId);
    if (container.innerHTML.trim() === '') {
        renderNoTaskInfo(columnId);
    }
}

function renderNoTaskInfoOnDOMLoad(){
    const columns = ['toDoColumn', 'inProgressColumn', 'awaitFeedbackColumn', 'doneColumn'];
    columns.forEach(columnId => {
        checkIfNoTasksInColumn(columnId);
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
    observeColumnEmpty('toDoColumn');
    observeColumnEmpty('inProgressColumn');
    observeColumnEmpty('awaitFeedbackColumn');
    observeColumnEmpty('doneColumn');
    renderNoTaskInfoOnDOMLoad();
});

renderNoTaskInfo('toDoColumn');
renderTaskCard(testTasks.task_id_0123, 'inProgressColumn');
renderSubtaskProgress(testTasks.task_id_0123);
renderAssignedUserIcons(testTasks.task_id_0123);
renderPriorityIndicator(testTasks.task_id_0123, 'priority');

function openTaskInOverlay(taskId) {
    let task = getTaskByTaskId(taskId);
    console.log("Open task overlay for task ID:", taskId);
    document.getElementById('overlay').classList.add('show');
    setTimeout(() => {
        document.getElementById('overlay_content').classList.add('show');
    }, 10);
    renderOverlayContent(task, taskId);
}

function closeOverlay(event) {
    if(event.target === event.currentTarget) {
        removeShowClass();
    }
}

function removeShowClass() {
    const overlay = document.getElementById('overlay');
    const content = document.getElementById('overlay_content');

    if (overlay.classList.contains('show')) {
        content.classList.remove('show');
         setTimeout(() => {
            overlay.classList.remove('show');
        }, 500);
    } 

}

function renderOverlayContent(task, taskId) {
    const overlayContent = document.getElementById('overlay_content');
    overlayContent.innerHTML = overlayContentTemplate(task, taskId);
    renderPriorityIndicator(testTasks.task_id_0123, 'priority_overlay');
    renderAssignedUserInfos(taskId, 'assigned_users_overlay');
    renderSubtasksListItems(taskId);
}

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

function renderAssignedUserInfos(taskId, containerIdSuffix) {
    let container = document.getElementById(taskId + '_' + containerIdSuffix);
    let task = getTaskByTaskId(taskId);
    for (let userId of task.assigned_to) {
        const user = testUser[userId];
        const initials = getInitialsFromUser(user);
        const userName = user.name;
        let userInfoHtml = assignedUserInfoTemplate(userName, initials);
        container.innerHTML += userInfoHtml;
    }
}

function renderSubtasksListItems(taskId) {
    let containerId = taskId + '_subtasks_list';
    let container = document.getElementById(containerId);
    let task = getTaskByTaskId(taskId);
    let subtaskCounter = 0;
    for (let subtask of task.subtasks) {
        subtaskCounter += 1;
        let subtaskHtml = subtasksListItemTemplate(taskId, subtask.title, subtaskCounter);
        container.innerHTML += subtaskHtml;
        renderSubtaskListItemsCheckboxes(taskId, subtaskCounter, subtask.done);
    }
}

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

function toggleSubtaskDone(taskId, subtaskCounter) {
    let task = getTaskByTaskId(taskId);
    let subtaskIndex = subtaskCounter - 1; 
    task.subtasks[subtaskIndex].done = !task.subtasks[subtaskIndex].done;
    renderSubtaskListItemsCheckboxes(taskId, subtaskCounter, task.subtasks[subtaskIndex].done);
    renderSubtaskProgress(task);
}

function openEditTaskOverlay(taskId) {
    const task = getTaskByTaskId(taskId);
    const overlayContent = document.getElementById('overlay_content');
    overlayContent.innerHTML = '';
    overlayContent.innerHTML = overlayEditTaskTemplate(task, taskId);
    editTaskTemplateWrapper(task);
}

function editTaskTemplateWrapper(task){
    const mainContent = document.getElementById('overlay_main_content');
    mainContent.innerHTML = `
    ${overlayEditTaskTitleTemplate(task)}
    ${overlayEditTaskDescriptionTemplate(task)}
    ${overlayEditTaskDueDateTemplate(task)}
    ${overlayEditTaskPriorityTemplate(task)}
    ${overlayEditTaskAssignedUsersTemplate(task)}
    ${overlayEditTaskSubtasksTemplate(task)}`;
}
