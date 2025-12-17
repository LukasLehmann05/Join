let showWideOverlay = false;

let newTitle = "";
let newCategory = "";
let newDescription = "";
let newDueDate = "";
let newPriority = "";
let newAssigneesArr = [];
let newSubtasksArr = [];
let newState = "";


async function sendUpdatedTaskToDB(taskId) {
    let taskToUpdate = await getTaskToUpdate(taskId);
    allTasksOfSingleUserObj[taskId] = taskToUpdate;
    clearElementsOfNewTask();
    if (Object.keys(taskToUpdate).length !== 0) {
        await updateTask(taskId, taskToUpdate);
    }
    await refreshTaskOnBoard(taskId, taskToUpdate);
}


async function getTaskToUpdate(taskId) {
    let taskToUpdate = await getTaskById(taskId);
    if (newTitle !== "") taskToUpdate.title = newTitle;
    if (newCategory !== "") taskToUpdate.category = newCategory;
    if (newDescription !== "") taskToUpdate.description = newDescription;
    if (newDueDate !== "") taskToUpdate.due_date = newDueDate;
    if (newPriority !== "") taskToUpdate.priority = newPriority;
    if (newAssigneesArr.length > 0) taskToUpdate.assigned_to = newAssigneesArr;
    if (newSubtasksArr.length > 0) taskToUpdate.subtasks = newSubtasksArr;
    if (newState !== "") taskToUpdate.state = newState;
    return taskToUpdate;
}


function getAllFieldValuesOfEditTaskWhenUpdated() {
    newTitle = document.getElementById('task_title').value;
    newDescription = document.getElementById('task_description').value;
    newDueDate = document.getElementById('task_due_date').value;
    newPriority = current_priority;
    newAssigneesArr = allAssigneesArr;
    newSubtasksArr = allSubtasksArr;
}


function openTaskInOverlay(taskId) {
    clearElementsOfNewTask();
    document.getElementById('overlay').classList.add('show');
    setTimeout(() => {
        document.getElementById('overlay_content').classList.add('show');
    }, 10);
    renderOverlayContent(taskId);
}


function clearElementsOfNewTask() {
    newTitle = "";
    newCategory = "";
    newDescription = "";
    newDueDate = "";
    newPriority = "";
    newAssigneesArr = [];
    newSubtasksArr = [];
    newState = "";
}


function renderOverlayContent(taskId) {
    const overlayContent = document.getElementById('overlay_content');
    let task = allTasksOfSingleUserObj[taskId];
    overlayContent.innerHTML = overlayContentTemplate(task, taskId);
    renderPriorityIndicator(taskId, task.priority, 'priority_overlay');
    renderAssignedUserInfos(task.assigned_to, false, 'assigned_users_overlay');
    renderSubtasksListItems(taskId, task.subtasks || []);
}


async function renderAssignedUserInfos(taskAssignees, onlyId, containerIdSuffix) {
    let container = document.getElementById(containerIdSuffix);
    getAssigneesOfTask(taskAssignees);
    
    for (let contactId of allAssigneesArr) {
        const user = await getContactById(contactId);
        if (user) {
            container.innerHTML += getContentToRenderAssignedUserInfos(onlyId, user);
        }
    }
}


function getAssigneesOfTask(taskAssignees) {
    allAssigneesArr = [];
    for (let contactId of taskAssignees) {
        allAssigneesArr.push(contactId);
    }
}


function getContentToRenderAssignedUserInfos(renderOnlyId, user) {
    if(renderOnlyId) {
        return  `   <div class="assigned_user_content">
                    ${assignedUserIconTemplate(getInitialsFromUser(user))}
                    </div>
                `;
    }
    else {
        return  `   <div class="assigned_user_content">
                    ${assignedUserIconTemplate(getInitialsFromUser(user))}
                    ${assignedUserNameTemplate(user.name)}
                    </div>
                `;
    }
}


function renderSubtasksListItems(taskId, subtasksArr) {
    let containerId = taskId + '_subtasks_list';
    let container = document.getElementById(containerId);
    let subtaskCounter = 0;
    getSubtasksOfTask(subtasksArr);
    for (let subtask of allSubtasksArr) {
        subtaskCounter += 1;
        let subtaskHtml = subtasksListItemTemplate(taskId, subtask.title, subtaskCounter);
        container.innerHTML += subtaskHtml;
        renderSubtaskListItemsCheckboxes(taskId, subtaskCounter, subtask.done);
    }
}


function getSubtasksOfTask(subtasksArr) {
    allSubtasksArr = [];
    for (let subtask of subtasksArr) {
        let subtaskObj = { title: subtask.title, done: subtask.done };
        allSubtasksArr.push(subtaskObj);
    }
}


function renderSubtaskListItemsCheckboxes(taskId, subtaskCounter, subtaskDone) {
    const doneImgPath ="../assets/icons/board/checkbox_done.svg"; 
    const undoneImgPath ="../assets/icons/board/checkbox_undone.svg";
    let checkboxCustomId = taskId + '_subtask_checkbox_custom_' + subtaskCounter;
    let checkboxCustomElement = document.getElementById(checkboxCustomId);
    if (subtaskDone) {
        checkboxCustomElement.innerHTML = `<img src="${doneImgPath}" alt="checkbox done icon">`;
    } else {
        checkboxCustomElement.innerHTML = `<img src="${undoneImgPath}" alt="checkbox undone icon">`;
    }
}


function closeOverlay(event) {
    if(event.target === event.currentTarget) {
        removeShowClass();
    }
}


function removeShowClass(buttonElement, taskId) {
    const buttonSaveOverlayWhenClosed = buttonElement ? buttonElement.getAttribute('data-save-task-when-close-overlay') === 'true' : false;
    if (buttonSaveOverlayWhenClosed) {
        sendUpdatedTaskToDB(taskId);        
    }

    const overlay = document.getElementById('overlay');
    const overlayContent = document.getElementById('overlay_content');

    if (overlay.classList.contains('show')) {
        overlayContent.classList.remove('show');
         setTimeout(() => {
            overlay.classList.remove('show');
            if(showWideOverlay) {
                toggleTitleCategorySeparatorInAddTaskOverlay();
            }
        }, 500);
    }
}


function swapImage(button, isHover) {
    const img = button.querySelector('img');
    const normalSrc = button.getAttribute('data-normal-src');
    const hoverSrc = button.getAttribute('data-hover-src');
    img.src = isHover ? hoverSrc : normalSrc;
    let p_tag = button.querySelector('p');
    if (isHover) {
        p_tag.style.color = "#29ABE2";
        p_tag.style.fontFamily = "Inter_Bold";
    } else {
        p_tag.style.color = "#2A3647";
        p_tag.style.fontFamily = "Inter";
    }
}


function toggleSubtaskDone(taskId, subtaskCounter) {
    let task = allTasksOfSingleUserObj[taskId];
    let subtaskIndex = subtaskCounter - 1;
    task.subtasks[subtaskIndex].done = !task.subtasks[subtaskIndex].done;
    renderSubtaskListItemsCheckboxes(taskId, subtaskCounter, task.subtasks[subtaskIndex].done);
    renderSubtaskProgress(taskId, task.subtasks);
    newSubtasksArr = task.subtasks;
}


function openEditTaskOverlay(taskId) {
    const overlayContent = document.getElementById('overlay_content');
    overlayContent.innerHTML = '';
    overlayContent.innerHTML = overlayUpsertTaskTemplate(taskId, 'Ok', `updateTaskElements(this, '${taskId}')`);
    let task = allTasksOfSingleUserObj[taskId];
    upsertTaskTemplateHandler(taskId);
    renderAssignedUserInfos(task.assigned_to, true, 'rendered_contact_images');
    renderSubtaskEditListItems(task.subtasks || []);
    addTaskInit();
}


function updateTaskElements(button, taskId) {
    clearElementsOfNewTask();
    getAllFieldValuesOfEditTaskWhenUpdated();
    removeShowClass(button, taskId);
}


function upsertTaskTemplateHandler(taskId){
    renderOverlayUpsertTaskDetailsContainer();
    upsertTaskTemplatesWrapperContainer1(taskId);
    upsertTaskTemplatesWrapperContainer2(taskId);
}
   

function renderOverlayUpsertTaskDetailsContainer() {
    let mainContent = document.getElementById('overlay_main_content');
    let detailContainerHtml = overlayUpsertTaskDetailsContainerTemplate();
    mainContent.innerHTML = detailContainerHtml;
}


function upsertTaskTemplatesWrapperContainer1(taskId){
    let task = checkTaskToAddOrEdit(taskId);
    let escapeTaskDescription = escapeTextareaContent(task.description);
    let taskDetailsContainer1 = document.getElementById('task_details_container_1');
    taskDetailsContainer1.innerHTML = `
    ${overlayUpsertTaskTitleTemplate(task.title)}
    ${overlayUpsertTaskDescriptionTemplate(escapeTaskDescription)}
    ${overlayUpsertTaskDueDateTemplate(task.due_date)}`; 
}


function upsertTaskTemplatesWrapperContainer2(taskId){
    let taskDetailsContainer2 = document.getElementById('task_details_container_2');
    taskDetailsContainer2.innerHTML = `
    ${overlayUpsertTaskPriorityTemplate()}
    ${overlayUpsertTaskAssignedUsersTemplate()}
    ${overlayUpsertCategoryOptionTemplate()}
    ${overlayUpsertTaskSubtasksTemplate(taskId)}`;
}


function checkTaskToAddOrEdit(taskId) {
    if (taskId.startsWith('new_task_id_')) {
        return createEmptyTask();
    } else {
        return allTasksOfSingleUserObj[taskId];
    }
}


function createEmptyTask() {
    return {
        assigned_to: [],
        category: "",
        description: "",
        due_date: "",
        priority: "low",
        subtasks: [],
        title: "",
        state: "todo"
    };
}


function renderSubtaskEditListItems(subtasksArr) {
    allSubtasksArr = [];
    subtask_list = document.getElementById('subtask_render');
    for (let subtask of subtasksArr) {
        let subtaskTitleHtml = returnSubtaskTemplate(subtask.title);
        subtask_list.innerHTML += subtaskTitleHtml;
        let subtaskObj = { title: subtask.title, done: subtask.done };
        allSubtasksArr.push(subtaskObj);
    }
}


function escapeTextareaContent(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}


async function openAddTaskOverlay() {
    allAssigneesArr = [];
    allSubtasksArr = [];
    clearElementsOfNewTask();
    const taskId = 'new_task_id_' + Date.now();
    document.getElementById('overlay').classList.add('show');
    setTimeout(() => {
        document.getElementById('overlay_content').classList.add('show');
    }, 10);
    renderOverlayAddTask(taskId).then(() => {
        addTaskInit();
    })
}


function renderOverlayAddTask(taskId) {
    const overlayContent = document.getElementById('overlay_content');
    overlayContent.innerHTML = '';
    overlayContent.innerHTML = overlayUpsertTaskTemplate(taskId, 'Create Task', `createTask()`);
    upsertTaskTemplateHandler(taskId);
    toggleTitleCategorySeparatorInAddTaskOverlay();
    return Promise.resolve();
}


function toggleTitleCategorySeparatorInAddTaskOverlay() {
    document.getElementById('overlay_title').classList.toggle('show');
    document.getElementsByClassName('upsert_category_container')[0].classList.toggle('show');
    document.getElementById('overlay_separator_add_task').classList.toggle('show');
    document.getElementById('overlay_main_content').classList.toggle('show_separator');
    document.getElementById('overlay_content').classList.toggle('add_task_attributes');
    document.getElementById('clear_button_container').classList.toggle('show');
    document.getElementById('required_text_field_section').classList.toggle('show');
    showWideOverlay = !showWideOverlay;
}