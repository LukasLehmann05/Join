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
            <div class="single_task_content" draggable="true" ondragstart="dragStartHandler(event)" id="${taskId}" onclick="openTaskInOverlay('${taskId}')">
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

function overlayContentTemplate(task, taskId) {
    return `
            <div class="overlay_header">
                <p class="category_overlay">${task.category}</p>
                <button class="close_overlay_button" onclick="removeShowClass()">
                    <img src="../assets/icons/board/close_button.svg" alt="close overlay icon">
                </button>
            </div>  
            <h1>${task.title}</h1>
            <p>${task.description}</p>
            <div class="due_date_info">
                <p class="attribute">Due date:</p>
                <p>${task.due_date}</p>
            </div>
            <div class="priority_info">
                <p class="attribute">Priority:</p>
                <div class="priority_content">
                    <p>${task.priority}</p>
                    <div class="priority_indicator" id="${taskId}_priority_overlay"></div>
                </div>
            </div>
            <div class="assigned_users_info">
                <p class="attribute">Assigned to:</p>
                <div class="assigned_users" id="${taskId}_assigned_users_overlay"></div>
            </div>
            <div class="subtasks_info">
                <p class="attribute">Subtasks</p>
                <div class="subtasks_list" id="${taskId}_subtasks_list"></div>
            </div>
            <div class="edit_overlay_button_container">
                <button 
                    class="edit_overlay_button seperator" 
                    onclick="deleteTaskOverlay('${taskId}')"
                    onmouseover="swapImage(this, true)" 
                    onmouseout="swapImage(this, false)"
                    data-normal-src="../assets/icons/board/delete_button.svg" 
                    data-hover-src="../assets/icons/board/delete_button_hover.svg">

                    <img src="../assets/icons/board/delete_button.svg" alt="delete task icon">
                    <p>Delete</p>
                </button>
                <button 
                    class="edit_overlay_button" 
                    onclick="openEditTaskOverlay('${taskId}')"
                    onmouseover="swapImage(this, true)" 
                    onmouseout="swapImage(this, false)"
                    data-normal-src="../assets/icons/board/edit_button.svg" 
                    data-hover-src="../assets/icons/board/edit_button_hover.svg">
                    <img src="../assets/icons/board/edit_button.svg" alt="edit task icon">
                    <p>Edit</p>
                </button>
            </div>
            <div class="edit_overlay_button_container">
                <button class="delete_overlay_button" onclick="deleteTaskOverlay('${taskId}')">
                    <img src="../assets/icons/board/edit_task_icon.svg" alt="delete task icon">
                    <p>Delete</p>
                </button>
                <button class="edit_overlay_button" onclick="openEditTaskOverlay('${taskId}')">
                    <img src="../assets/icons/board/edit_task_icon.svg" alt="edit task icon">
                    <p>Edit</p>
                </button>
            </div>
            `
}

function assignedUserInfoTemplate(userName, initials) {
    let userHtmnl = assignedUserIconTemplate(initials);
    return  `
            <div class="assigned_user_content">
                ${userHtmnl}
                <p>${userName}</p>
            </div>

            `;
}

function subtasksListItemTemplate(taskId, title, counter) {
    return `
            <div class="subtask_list_item">
                <div class="subtask_checkbox_custom" id="${taskId}_subtask_checkbox_custom_${counter}">
                </div>
                <p>${title}</p>
            </div>
            `;
}