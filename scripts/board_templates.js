function noTasksDoToTemplate() {
    return  ` 
            <div class="no_task_yet">
                 <p>No tasks to do</p>
            </div>
            `
}

function noTaskInProgressTemplate() {
    return  ` 
            <div class="no_task_yet">
                 <p>No tasks in progress</p>
            </div>
            `
}

function noTaskInFeedbackTemplate() {
    return  ` 
            <div class="no_task_yet">
                 <p>No tasks for feedback</p>
            </div>
            `
}

function noTaskDoneTemplate() {
    return  ` 
            <div class="no_task_yet">
                 <p>No tasks done</p>
            </div>
            `
}

function taskCardTemplate(task, taskId) {
    return  `
            <div class="single_task_content" draggable="true" ondragstart="dragStartHandler(event)" id="${taskId}">
                <p class="category">${task.category}</p>
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <div class="subtask_status_bar">
                    <div class="subtask_status_bar_bg">
                        <div class="subtask_status_bar_fill" id="${taskId}_subtasks_status_bar" style="width: 60%;"></div>
                    </div>
                    <div class="subtask_info">
                        <p class="number_of_subtasks" id="${taskId}_subtasks_done">0/5</p>
                        <p class="subtask_status_bar_text">Subtasks</p>
                    </div>
                </div>
                <div class="assigned_users_section_and_priority">
                    <div class="assigned_users" id="${taskId}_assigned_users"></div>
                    <div class="priority_indicator" id="${taskId}_priority"></div>
                </div>
            </div>
            `
}

function assignedUserIconTemplate(initials) {
     return `
            <div class="assigned_user_avatar" style="background-color: #${Math.floor(Math.random()*16777215).toString(16)};">
                ${initials}
            </div>
            `
}

function priorityIndicatorTemplate( iconPath) {
    return `
            <img src="${iconPath}" alt="Priority Icon" />
            `
}