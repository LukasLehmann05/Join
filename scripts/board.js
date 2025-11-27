function renderNoTasksToDo(columnId) {
    const container = document.getElementById(columnId);
    container.innerHTML = noTasksDoToTemplate(columnId);
}

function formatSubtaskProgress(subtasks) {
    const completed = subtasks.filter(subtask => subtask.completed).length;
    const total = subtasks.length;
    return `${completed}/${total}`;
}

function renderSubtaskProgress(elementId, subtasks) {
    const element = document.getElementById(elementId);
    element.innerHTML = formatSubtaskProgress(subtasks);
}

renderNoTasksToDo('toDoContainer');