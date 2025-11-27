let testTask = {
      "category": "Development",
      "title": "Implementiere Login-Funktion",
      "description": "Erstelle das Frontend und Backend für die Nutzeranmeldung.",
      "due_date": "2025-12-10",
      "priority": "High",
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
    const container = document.getElementById(containerId);
    container.innerHTML = taskCardTemplate(task);
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

renderNoTasksToDo('toDoContainer');
renderTaskCard(testTask, 'inProgressContainer');
renderSubtaskProgress('number_of_subtasks', testTask.subtasks);
renderAssignedUserIcons(testTask, 'assigned_users_container');