let stateWidthOverlay = false;


function openTaskInOverlay(taskId) {
    let task = getTaskByTaskId(taskId);
    document.getElementById('overlay').classList.add('show');
    setTimeout(() => {
        document.getElementById('overlay_content').classList.add('show');
    }, 10);
    renderOverlayContent(task, taskId);
}


function renderOverlayContent(task, taskId) {
    const overlayContent = document.getElementById('overlay_content');
    overlayContent.innerHTML = overlayContentTemplate(task, taskId);
    renderPriorityIndicator(testTasks.task_id_0123, 'priority_overlay');
    renderAssignedUserInfos(taskId, 'assigned_users_overlay');
    renderSubtasksListItems(taskId);
}


function renderAssignedUserInfos(taskId, containerIdSuffix) {
    let container = document.getElementById(taskId + '_' + containerIdSuffix);
    let task = getTaskByTaskId(taskId);
    for (let userId of task.assigned_to) {
        const user = testUser[userId];
        const initials = getInitialsFromUser(user);
        const userName = user.name;
        let userInfoHtml = assignedUserInfoTemplate(userName, initials);
        container.innerHTML += userInfoHtml;
    }
}


function renderSubtasksListItems(taskId) {
    let containerId = taskId + '_subtasks_list';
    let container = document.getElementById(containerId);
    let task = getTaskByTaskId(taskId);
    let subtaskCounter = 0;
    for (let subtask of task.subtasks) {
        subtaskCounter += 1;
        let subtaskHtml = subtasksListItemTemplate(taskId, subtask.title, subtaskCounter);
        container.innerHTML += subtaskHtml;
        renderSubtaskListItemsCheckboxes(taskId, subtaskCounter, subtask.done);
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


function removeShowClass() {
    const overlay = document.getElementById('overlay');
    const contentContent = document.getElementById('overlay_content');

    if (overlay.classList.contains('show')) {
        contentContent.classList.remove('show');
         setTimeout(() => {
            overlay.classList.remove('show');
            if(stateWidthOverlay) {
                toggleTitleCategorySeperatorInAddTaskOverlay();
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
    let task = getTaskByTaskId(taskId);
    let subtaskIndex = subtaskCounter - 1; 
    task.subtasks[subtaskIndex].done = !task.subtasks[subtaskIndex].done;
    renderSubtaskListItemsCheckboxes(taskId, subtaskCounter, task.subtasks[subtaskIndex].done);
    renderSubtaskProgress(task);
}


function openEditTaskOverlay(taskId) {
    const overlayContent = document.getElementById('overlay_content');
    overlayContent.innerHTML = '';
    overlayContent.innerHTML = overlayUpsertTaskTemplate(taskId);
    upsertTaskTemplateHandler(taskId);
    renderSubtaskEditListItems(taskId);
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
        return getTaskByTaskId(taskId);
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
        title: ""
    };
}


function renderSubtaskEditListItems(taskId) {
    let containerId = taskId + '_subtasks_edit_list';
    let subListContainer = document.getElementById(containerId);
    let task = getTaskByTaskId(taskId);
    let subtaskCounter = 0;
    for (let subtask of task.subtasks) {
        subtaskCounter += 1;
        let subtaskHtml = overlayUpsertSubtaskListItemTemplate(taskId, subtask.title, subtaskCounter);
        subListContainer.innerHTML += subtaskHtml;
    }
}


function escapeTextareaContent(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}


function openAddTaskOverlay() {
    // const taskId = generateNewTaskId(); // sollte von Firebase kommen
    const taskId = 'new_task_id_' + Date.now(); // temporär
    document.getElementById('overlay').classList.add('show');
    setTimeout(() => {
        document.getElementById('overlay_content').classList.add('show');
    }, 10);
    renderOverlayAddTask(taskId);
}


function renderOverlayAddTask(taskId) {
    const overlayContent = document.getElementById('overlay_content');
    overlayContent.innerHTML = '';
    overlayContent.innerHTML = overlayUpsertTaskTemplate(taskId);
    upsertTaskTemplateHandler(taskId);
    toggleTitleCategorySeperatorInAddTaskOverlay();
}


function toggleTitleCategorySeperatorInAddTaskOverlay() {
    document.getElementById('overlay_title').classList.toggle('show');
    document.getElementsByClassName('edit_category_container')[0].classList.toggle('show');
    document.getElementById('overlay_seperator_add_task').classList.toggle('show');
    document.getElementById('overlay_main_content').classList.toggle('show_seperator');
    document.getElementById('overlay_content').classList.toggle('add_task_attributes');
    stateWidthOverlay = !stateWidthOverlay;
}