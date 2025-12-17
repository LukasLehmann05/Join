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

function showDropAcceptanceTemplate() {
    return  `
            <div class="drop_acceptance"></div>
            `
}

function taskCardTemplate(task, taskId) {
    return  `
            <div class="single_task_content" 
                draggable="true" 
                ondragstart="dragStartHandler(event); this.classList.add('drag-tilt');" 
                ondragend="this.classList.remove('drag-tilt');"
                id="${taskId}_task_card" 
                onclick="openTaskInOverlay('${taskId}')">
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
            <header class="overlay_header">
                <p class="category_overlay">${task.category}</p>
                <button class="close_overlay_button" onclick="removeShowClass(this, '${taskId}')" data-save-task-when-close-overlay="true">
                    <img src="../assets/icons/board/close_button.svg" alt="close overlay icon">
                </button>
            </header>
            <section class="overlay_main_content">
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
                    <div class="assigned_users" id="assigned_users_overlay"></div>
                </div>
                <div class="subtasks_info">
                    <p class="attribute">Subtasks</p>
                    <div class="subtasks_list" id="${taskId}_subtasks_list"></div>
                </div>
            </section>
            <aside class="edit_overlay_button_container">
                <button 
                    class="edit_overlay_button separator_overlay" 
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
            </aside>
            `
}

function assignedUserNameTemplate(userName) {
    return  `
                <p>${userName}</p>
            `;
}

function subtasksListItemTemplate(taskId, title, counter) {
    return `
            <div class="subtask_list_item">
                <button 
                    class="subtask_checkbox_custom" 
                    id="${taskId}_subtask_checkbox_custom_${counter}"
                    onclick="toggleSubtaskDone('${taskId}', ${counter})">
                </button>
                <p>${title}</p>
            </div>
            `;
}

function overlayUpsertTaskTemplate(taskId, confirmButtonText, selectedTaskFunction) {
    return  `
            <header class="overlay_header upsert_overlay_header">
                <h1 id="overlay_title">Add Task</h1>
                <button class="close_overlay_button" onclick="removeShowClass(this, '${taskId}')" data-save-task-when-close-overlay="false">
                    <img src="../assets/icons/board/close_button.svg" alt="close overlay icon">
                </button>
            </header>
            <section class="overlay_main_content" id="overlay_main_content"></section>
            <footer class="action-button-section">
                <section class="required-field-section">
                    <p class="required-text" id="required_text_field_section"><span class="required">*</span>This field is required</p>
                </section>
                <section class="button-section">
                    <div class="clear-button" id="clear_button_container">
                        <button class="action-buttons" onclick="clearAllInputs()">
                            <p>Cancel</p>
                            <img src="../assets/icons/contacts/close.svg" alt="clear icon">
                        </button>
                    </div>
                    <div class="create-task">
                        <button class="action-buttons create-button" onclick="${selectedTaskFunction}" data-save-task-when-close-overlay="true">
                            <p>${confirmButtonText}</p>
                            <img src="../assets/icons/contacts/check.svg" alt="submit icon">
                        </button>
                    </div>
                </section>
            </footer>
            `
}

function overlayUpsertTaskTitleTemplate(taskTitle) {
    return  `
             <section class="upsert_title_container">
                <form class="input-form">
                    <label for="task_title" class="task_field_title">Title<span class="required">*</span></label>
                    <input 
                        id="task_title" 
                        class="task-input" 
                        type="text" 
                        value="${taskTitle}" 
                        placeholder="Enter a title" 
                        required 
                        onclick="removeIndicatorOnInput('title')">
                    <p id="required_title" class="required-info">This field is required</p>
                </form>
            </section>
            `
}

function overlayUpsertTaskDescriptionTemplate(taskDescription) {
    return  `
            <section class="upsert_description_container">
                <form class="input-form description">
                    <label for="task_description" class="task_field_title">Description</label>
                    <textarea 
                        id="task_description" 
                        class="task-input" 
                        placeholder="Enter a description">${taskDescription}
                    </textarea>
                </form>
            </section>
            `
}

function overlayUpsertTaskDueDateTemplate(taskDueDate) {
    return  `
            <section class="upsert_due_date_container">
                <form class="input-form">
                    <label for="task_due_date" class="task_field_title">Due date<span class="required">*</span></label>
                    <input 
                        id="task_due_date" 
                        class="task-input" 
                        type="date" 
                        value="${taskDueDate}" 
                        placeholder="dd/mm/yyyy" 
                        required 
                        onclick="removeIndicatorOnInput('due_date')">
                    <p id="required_date" class="required-info">This field is required</p>
                </form>
            </section>
            `
}

function overlayUpsertTaskPriorityTemplate() {
    return  `
            <section class="upsert_priority_container">
                <form class="input-form">
                    <p class="task_field_title">Priority</p>
                    <section class="priority-section" id="priority_section">
                        <button 
                            class="priority-button" 
                            id="button_prio_urgent" 
                            onclick="changePriority('urgent')" 
                            type="button">
                                <p>Urgent</p>
                                <img src="../assets/icons/addTask/urgentTask.svg" alt="urgent prio icon">
                        </button>
                        <button 
                            class="priority-button bg-yellow" 
                            id="button_prio_medium" 
                            onclick="changePriority('medium')" 
                            type="button">
                                <p>Medium</p>
                                <img src="../assets/icons/addTask/medTask.svg" alt="medium prio icon">
                        </button>
                        <button 
                            class="priority-button" 
                            id="button_prio_low" 
                            onclick="changePriority('low')" 
                            type="button">
                                <p>Low</p>
                                <img src="../assets/icons/addTask/lowTask.svg" alt="low prio icon">
                        </button>
                    </section>
                </form>
            </section>
            `
}

function overlayUpsertTaskAssignedUsersTemplate() {
    return  `
            <section class="upsert_assigned_users_container">
                <form class="input-form">
                    <p class="task_field_title">Assigned to</p>
                    <button class="contact-button" type="button" onclick="showContacts()">
                        <p>Select contacts to assign</p>
                        <img src="../assets/icons/addTask/dropdown.svg" alt="dropdown_icon">
                    </button>
                    <div class="contact-selector" id="contact_selector">
                        <ul id="task_assign">
                            
                        </ul>
                    </div>
                    <aside id="rendered_contact_images" class="rendered-contacts">
                        
                    </aside>
                </form>
            </section>
            `
}

function overlayUpsertTaskSubtasksTemplate(taskId) {
    return  `
            <section class="upsert_subtasks_container">
                <form class="input-form">
                    <label for="task_subtask" class="task_field_title">Subtasks</label>
                    <section class="subtask-section">
                        <input 
                            onclick="showSubtaskButtons()" 
                            id="task_subtask"
                            type="text" 
                            placeholder="Add new subtask">
                        <aside id="subtask_button_section">
                            <button type="button" onclick="addSubtask()">
                                <img class="subtask-img filter-check" src="../assets/icons/contacts/check.svg"
                                    alt="add_icon">
                            </button>
                            <div class="subtask-separator"></div>
                            <button type="button" onclick="clearSubtask()">
                                <img class="subtask-img" src="../assets/icons/contacts/close.svg"
                                    alt="close_icon">
                            </button>
                        </aside>
                    </section>
                </form>
                <ul class="subtasks_upsert_list" id="subtask_render"></ul>
            </section>
            `
}


function overlayUpsertCategoryOptionTemplate() {
    return `
            <section class="upsert_category_container">
                <form class="input-form" category_template>
                    <label for="task_category" class="task_field_title">Category<span class="required">*</span></label>
                    <select class="select-input" name="category" id="task_category" required onclick="removeIndicatorOnInput('category')">
                        <option value="">Select task category</option>
                        <option value="Technical Task">Technical Task</option>
                        <option value="User Story">User Story</option>
                    </select>
                    <p id="required_category" class="required-info">This field is required</p>
                </form>
            </section>
            `
}

function overlayUpsertTaskDetailsContainerTemplate() {
    return  `
            <section class="task_details_container" id="task_details_container_1"></section>
            <section class="overlay_separator_add_task" id="overlay_separator_add_task"></section>
            <section class="task_details_container" id="task_details_container_2"></section>
            `
}