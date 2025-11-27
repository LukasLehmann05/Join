function noTasksDoToTemplate(columnId) {
    return  ` 
            <div class="no_task_yet">
                 <p>No tasks To do</p>
            </div>
            `
}

function taskCardTemplate(task) {
    return  `
            <div class="single_task_content">
                <p class="category" id="category">${task.category}</p>
                <h3 id="title">${task.title}</h3>
                <p id="description">${task.description}</p>
                <div class="subtask_status_bar">
                    <div class="subtask_status_bar_bg">
                        <div class="subtask_status_bar_fill" style="width: 60%;"></div> <!-- Dynamische Breite je nach Fortschritt -->
                    </div>
                    <div class="subtask_info">
                        <p class="number_of_subtasks" id="number_of_subtasks">3/5</p>
                        <span class="subtask_status_bar_text">Subtasks</span>
                    </div>
                </div>
                <div class="assigned_users_section_and_priority">
                    <div class="assigned_users" id="assigned_users_container"></div>
                    <div class="priority_indicator" id="priority"></div> <!-- hier wird das Bild je nach Priorität gerendert -->
                </div>
            </div>
            `
}