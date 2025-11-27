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

renderNoTasksToDo('toDoContainer');
renderTaskCard(testTask, 'inProgressContainer');
renderSubtaskProgress('number_of_subtasks', testTask.subtasks);