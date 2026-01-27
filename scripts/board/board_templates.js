/**
 * This function returns the HTML template for the "No tasks to do" info.
 * @returns {string} The HTML string for the info template.
 */
function noTasksDoToTemplate() {
    return  ` 
            <div class="no_task_yet">
                 <p>No tasks to do</p>
            </div>
            `
}


/**
 * This function returns the HTML template for the "No tasks in progress" info.
 * @returns {string} The HTML string for the info template.
 */
function noTaskInProgressTemplate() {
    return  ` 
            <div class="no_task_yet">
                 <p>No tasks in progress</p>
            </div>
            `
}


/**
 * This function returns the HTML template for the "No tasks for feedback" info.
 * @returns {string} The HTML string for the info template.
 */
function noTaskInFeedbackTemplate() {
    return  ` 
            <div class="no_task_yet">
                 <p>No tasks for feedback</p>
            </div>
            `
}


/**
 * This function returns the HTML template for the "No tasks done" info.
 * @returns {string} The HTML string for the info template.
 */
function noTaskDoneTemplate() {
    return  ` 
            <div class="no_task_yet">
                 <p>No tasks done</p>
            </div>
            `
}


/**
 * This function returns the HTML template for the drop acceptance field.
 * @returns {string} The HTML string for the drop acceptance field.
 */
function showDropAcceptanceTemplate() {
    return  `
            <div class="drop_acceptance"></div>
            `
}


/**
 * This function returns the HTML template for a task card.
 * @param {Object} task The task object.
 * @param {string} taskId The ID of the task.
 * @returns {string} The HTML string for the task card.
 */
function taskCardTemplate(task, taskId) {
    return  `
            <div class="single_task_content" 
                draggable="true" 
                ondragstart="dragStartHandler(event); this.classList.add('drag-tilt');" 
                ondragend="this.classList.remove('drag-tilt');"
                id="${taskId}_task_card" 
                onclick="openTaskInOverlay('${taskId}')">
                <p class="category ${task.category.toLowerCase().replace(/ /g,"_")}">${task.category}</p>
                <h3>${task.title}</h3>
                <p class="task_card_description">${task.description}</p>
                <div class="subtask_status_bar" id="${taskId}_subtask_status_bar_container">
                    <div id="${taskId}_subtasks_status_bar_element" class="subtask_status_bar_bg">
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


/**
 * This function returns the HTML template for an assigned user icon.
 * @param {string} initials The initials of the user.
 * @param {string} contactColor The background color for the user icon.
 * @returns {string} The HTML string for the user icon.
 */
function assignedUserIconTemplate(initials, contactColor) {
     return `
            <div class="assigned_user_avatar" style="background-color: ${contactColor};">
                ${initials}
            </div>
            `
}


/**
 * This function returns the HTML template for the priority indicator.
 * @param {string} iconPath The file path to the priority icon.
 * @returns {string} The HTML string for the priority indicator.
 */
function priorityIndicatorTemplate(iconPath) {
    return `
            <img src="${iconPath}" alt="Priority Icon" />
            `
}


/**
 * This function returns the HTML template for the overlay content of a task.
 * @param {Object} task The task object.
 * @param {string} taskId The ID of the task.
 * @param {string} task_title The title of the task.
 * @returns {string} The HTML string for the overlay content.
 */
function overlayContentTemplate(task, taskId, task_title) {
    return `
            <header class="overlay_header">
                <p class="category_overlay ${task.category.toLowerCase().replace(/ /g,"_")}">${task.category}</p>
                <button class="close_overlay_button" onclick="closeOverlay(this, '${taskId}')" ${DATA_ATTRIBUTE_SAVE_TASK_WHEN_CLOSE_OVERLAY}="true">
                    <img src="../assets/icons/board/close_button.svg" alt="close overlay icon">
                </button>
            </header>
            <section class="overlay_main_content">
                <h1 class="overlay_title">${task_title}</h1>
                <p class="task_overlay_description">${task.description}</p>
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
                    onclick="deleteTaskInOverlay('${taskId}')"
                    onmouseover="swapImage(this, true)" 
                    onmouseout="swapImage(this, false)"
                    data-normal-src="../assets/icons/board/delete_button.svg" 
                    data-hover-src="../assets/icons/board/delete_button_hover.svg">

                    <img src="../assets/icons/board/delete_button.svg" alt="delete task icon">
                    <p>Delete</p>
                </button>
                <button 
                    class="edit_overlay_button" 
                    onclick="openEditTaskOverlay(this, '${taskId}')"
                    onmouseover="swapImage(this, true)" 
                    onmouseout="swapImage(this, false)"
                    data-normal-src="../assets/icons/board/edit_button.svg" 
                    data-hover-src="../assets/icons/board/edit_button_hover.svg"
                    data-task-state="${task.state}">
                    <img src="../assets/icons/board/edit_button.svg" alt="edit task icon">
                    <p>Edit</p>
                </button>
            </aside>
            `
}


/**
 * This function returns the HTML template for an assigned user's name.
 * @param {string} userName The name of the user.
 * @returns {string} The HTML string for the user's name.
 */
function assignedUserNameTemplate(userName) {
    return  `
                <p>${userName}</p>
            `
}


/**
 * This function returns the HTML template for a subtask list item.
 * @param {string} taskId The ID of the task.
 * @param {string} title The title of the subtask.
 * @param {number} counter The index of the subtask.
 * @returns {string} The HTML string for the subtask list item.
 */
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
            `
}


/**
 * This function returns the HTML template for the upsert task overlay.
 * @param {string} taskId The ID of the task.
 * @param {string} confirmButtonText The text for the confirm button.
 * @param {string} buttonDataAttribute The data attribute for the confirm button.
 * @param {string} taskState The state of the task.
 * @returns {string} The HTML string for the upsert task overlay.
 */
function overlayUpsertTaskTemplate(taskId, confirmButtonText, buttonDataAttribute, taskState) {
    return  `
            <header class="overlay_header upsert_overlay_header">
                <h1 id="overlay_title">Add Task</h1>
                <button class="close_overlay_button" onclick="closeOverlay(this, '${taskId}')" ${DATA_ATTRIBUTE_SAVE_TASK_WHEN_CLOSE_OVERLAY}="false">
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
                        <button class="action-buttons create-button" onclick="closeOverlay(this, '${taskId}')" ${buttonDataAttribute}="true" data-task-state="${taskState}">
                            <p>${confirmButtonText}</p>
                            <img src="../assets/icons/contacts/check.svg" alt="submit icon">
                        </button>
                    </div>
                </section>
            </footer>
            `
}


/**
 * This function returns the HTML template for the upsert task title input.
 * @param {string} taskTitle The title of the task.
 * @returns {string} The HTML string for the title input.
 */
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


/**
 * This function returns the HTML template for the upsert task description input.
 * @param {string} taskDescription The description of the task.
 * @returns {string} The HTML string for the description input.
 */
function overlayUpsertTaskDescriptionTemplate(taskDescription) {
    return  `
            <section class="upsert_description_container">
                <form class="input-form description">
                    <label for="task_description" class="task_field_title">Description</label>
                    <textarea type="text" id="task_description" class="task-input" placeholder="Enter a description">${taskDescription}</textarea>
                </form>
            </section>
            `
}


/**
 * This function returns the HTML template for the upsert task due date input.
 * @param {string} taskDueDate The due date of the task.
 * @returns {string} The HTML string for the due date input.
 */
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


/**
 * This function returns the HTML template for the upsert task priority selection.
 * @returns {string} The HTML string for the priority selection.
 */
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


/**
 * This function returns the HTML template for the upsert assigned users section.
 * @returns {string} The HTML string for the assigned users section.
 */
function overlayUpsertTaskAssignedUsersTemplate() {
    return  `
            <section class="upsert_assigned_users_container">
                <form class="input-form">
                    <p class="task_field_title">Assigned to</p>
                    <button id="contact-button" class="contact-button" type="button" onclick="showContacts()">
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


/**
 * This function returns the HTML template for the upsert subtasks section.
 * @returns {string} The HTML string for the subtasks section.
 */
function overlayUpsertTaskSubtasksTemplate() {
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
                <section class="required-field-section-responsive">
                    <p class="required-text" id="required_text_field_section"><span class="required">*</span>This field is required</p>
                </section>
            </section>
            `
}


/**
 * This function returns the HTML template for the upsert category option selection.
 * @returns {string} The HTML string for the category option selection.
 */
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


/**
 * This function returns the HTML template for the upsert task details container.
 * @returns {string} The HTML string for the task details container.
 */
function overlayUpsertTaskDetailsContainerTemplate() {
    return  `
            <section class="task_details_container" id="task_details_container_1"></section>
            <section class="overlay_separator_add_task" id="overlay_separator_add_task"></section>
            <section class="task_details_container" id="task_details_container_2"></section>
            `
}
