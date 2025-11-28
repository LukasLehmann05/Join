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

function renderNoTasksToDo(columnId) {
    const container = document.getElementById(columnId);
    container.innerHTML = noTasksDoToTemplate(columnId);
}

function formatSubtaskProgress(subtasks) {
    const completed = subtasks.filter(subtask => subtask.done).length;
    const total = subtasks.length;
    return `${completed}/${total}`;
}

function renderSubtaskProgress(elementId, subtasks) {
    const element = document.getElementById(elementId);
    element.innerHTML = formatSubtaskProgress(subtasks);
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

function renderAssignedUserIcons(task, containerId) {
    for (let userId of task.assigned_to) {
        const user = testUser[userId];
        const initials = getInitialsFromUser(user);
        const iconHTML = assignedUserIconTemplate(initials);
        const container = document.getElementById(containerId);
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

function renderPriorityIndicator(task, elementId) {
    const iconPath = getIconForPriority(task.priority);
    const element = document.getElementById(elementId);
    element.innerHTML = priorityIndicatorTemplate(iconPath);
}

function getTaskIdAsStringFromTask(task) {
    for (let id in testTasks) {
        if (testTasks[id] === task) {
            console.log(id);
            
            return id;
        }
    }
    return null;
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
    // Entferne das "No tasks To do"-Element, falls vorhanden
    const noTaskElement = event.currentTarget.querySelector('.no_task_yet');
    if (noTaskElement) {
        noTaskElement.remove();
    }
    event.currentTarget.appendChild(taskElement);
}

function checkIfNoTasksInColumn(columnId) {
    const container = document.getElementById(columnId);
    if (container.innerHTML.trim() === '') {
        renderNoTasksToDo(columnId);
    }
}

function observeColumnEmpty(columnId) {
    const container = document.getElementById(columnId);
    if (!container) return;
    const observer = new MutationObserver(() => {
        if (container.innerHTML.trim() === '') {
            renderNoTasksToDo(columnId);
        }
    });
    observer.observe(container, { childList: true, subtree: false });
}

// Beispiel: Eventlistener für mehrere Spalten beim Laden aktivieren
document.addEventListener('DOMContentLoaded', () => {
    observeColumnEmpty('toDoColumn');
    observeColumnEmpty('inProgressColumn');
    observeColumnEmpty('awaitFeedbackColumn');
    observeColumnEmpty('doneColumn');
});

renderNoTasksToDo('toDoColumn');
renderTaskCard(testTasks.task_id_0123, 'inProgressColumn');
renderSubtaskProgress('number_of_subtasks', testTasks.task_id_0123.subtasks);
renderAssignedUserIcons(testTasks.task_id_0123, 'assigned_users_container');
renderPriorityIndicator(testTasks.task_id_0123, 'priority');