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
      "due_date": "2025-12-01",
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

function renderPriorityIndicator(task) {
  let prioritySuffix = 'priority';
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

function dragStartHandler(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
}

function dragOverHandler(event) {
    event.preventDefault();
}

function dropHandler(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/plain");  
    const taskElement = document.getElementById(taskId);
    const noTaskElement = event.currentTarget.querySelector('.no_task_yet');
    if (noTaskElement) {
        noTaskElement.remove();
    }
    event.currentTarget.appendChild(taskElement);
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
renderPriorityIndicator(testTasks.task_id_0123);

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