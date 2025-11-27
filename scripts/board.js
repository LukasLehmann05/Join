function renderNoTasksToDo(columnId) {
    const container = document.getElementById(columnId);
    container.innerHTML = noTasksDoToTemplate(columnId);
}

renderNoTasksToDo('toDoContainer');