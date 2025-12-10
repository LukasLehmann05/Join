let stateWidthOverlay = false;

let newTitle = "";
let newCategory = "";
let newDescription = "";
let newDueDate = "";
let newPriority = "";
let newAssigneesArr = [];
let newSubtasksArr = [];
let fieldsToUpdate = {};

let newTask = {
    assigned_to: newAssigneesArr,
    category: newCategory,
    description: newDescription,
    due_date: newDueDate,
    priority: newPriority,
    subtasks: newSubtasksArr,
    title: newTitle
    };


function sendUpdatedTaskToDB(taskId, fieldsToUpdate) {
    updateTask(taskId, fieldsToUpdate);
}


function openTaskInOverlay(taskId) {
    clearElementsOfNewTask();
    let task = getTaskByTaskId(taskId);
    console.table(task);
    document.getElementById('overlay').classList.add('show');
    setTimeout(() => {
        document.getElementById('overlay_content').classList.add('show');
    }, 10);
    renderOverlayContent(task, taskId);
}


function clearElementsOfNewTask() {
    newTitle = "";
    newCategory = "";
    newDescription = "";
    newDueDate = "";
    newPriority = "";
    newAssigneesArr = [];
    newSubtasksArr = [];
}


function renderOverlayContent(task, taskId) {
    const overlayContent = document.getElementById('overlay_content');
    overlayContent.innerHTML = overlayContentTemplate(task, taskId);
    renderPriorityIndicator(testTasks.task_id_0123, 'priority_overlay');
    renderAssignedUserInfos(taskId, onlyId=false, 'assigned_users_overlay');
    renderSubtasksListItems(taskId);
}


function renderAssignedUserInfos(taskId, onlyId, containerIdSuffix) {
    let container = document.getElementById(containerIdSuffix);
    let task = getTaskByTaskId(taskId);
    getAssigneesOfTask(task);
    console.log("Array Of Assigness: " + allAssigneesArr);
    
    for (let userId of allAssigneesArr) {
        const user = testUser[userId];
        container.innerHTML += getContentToRenderAssignedUserInfos(onlyId, user);
    }
}


function getAssigneesOfTask(task) {
    allAssigneesArr = [];
    for (let userId of task.assigned_to) {
        allAssigneesArr.push(userId);
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
    // Aufruf Speicherfunktion der veränderten Taskdaten hier einfügen
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
    newSubtasksArr = task.subtasks;
    console.table(newSubtasksArr);
}


function openEditTaskOverlay(taskId) {
    const overlayContent = document.getElementById('overlay_content');
    overlayContent.innerHTML = '';
    overlayContent.innerHTML = overlayUpsertTaskTemplate('Ok');
    upsertTaskTemplateHandler(taskId);
    renderAssignedUserInfos(taskId, onlyId=true, 'rendered_contact_images');
    renderSubtaskEditListItems(taskId);
    addTaskInit();
}


function upsertTaskTemplateHandler(taskId){
    renderOverlayUpsertTaskDetailsContainer();
    upsertTaskTemplatesWrapperContainer1(taskId);
    upsertTaskTemplatesWrapperContainer2(taskId); //anhand der id eine unterscheidung machen ob edit oder add task
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
    subtask_list = document.getElementById('subtask_render');
    let task = getTaskByTaskId(taskId);
    for (let subtask of task.subtasks) {
        let subtaskHtml = returnSubtaskTemplate(subtask.title);
        subtask_list.innerHTML += subtaskHtml;
        allSubtasksArr.push(subtask.title);
    }
}


function escapeTextareaContent(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}


async function openAddTaskOverlay() {
    clearElementsOfNewTask();
    const taskId = 'new_task_id_' + Date.now(); // temporär
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
    overlayContent.innerHTML = overlayUpsertTaskTemplate('Create Task');
    upsertTaskTemplateHandler(taskId);
    toggleTitleCategorySeperatorInAddTaskOverlay();
    return Promise.resolve();
}


function toggleTitleCategorySeperatorInAddTaskOverlay() {
    document.getElementById('overlay_title').classList.toggle('show');
    document.getElementsByClassName('upsert_category_container')[0].classList.toggle('show');
    document.getElementById('overlay_seperator_add_task').classList.toggle('show');
    document.getElementById('overlay_main_content').classList.toggle('show_seperator');
    document.getElementById('overlay_content').classList.toggle('add_task_attributes');
    document.getElementById('clear_button_container').classList.toggle('show');
    document.getElementById('required_text_field_section').classList.toggle('show');
    stateWidthOverlay = !stateWidthOverlay;
}