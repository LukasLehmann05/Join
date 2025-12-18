/**
 * This function handles the drag start event for a task card.
 * 
 * @param {DragEvent} event The drag event object.
 */
function dragStartHandler(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
}

/**
 * This function handles the drag over event for a column.
 * 
 * @param {DragEvent} event The drag event object.
 */
function dragOverHandler(event) {
    startDropAcceptanceColumnId = getCurrentColumnId(event)[0];
    let currentColumnId = getCurrentColumnId(event)[1];
    clearLastDropAcceptanceIfChangedColumn(currentColumnId);
    setDropAcceptanceInCurrentColumn(currentColumnId);
    event.preventDefault();
}

/**
 * This function gets the start and current column IDs during drag over.
 * 
 * @param {DragEvent} event The drag event object.
 * @returns {[string, string]} An array with start and current column IDs.
 */
function getCurrentColumnId(event) {
    let currentColumnId = null;

    if (dragOverCounter < 1) {
        startDropAcceptanceColumnId = getIdOfCurrentColumn(event);        
        currentColumnId = startDropAcceptanceColumnId;
        dragOverCounter++;
    }
    else {
        currentColumnId = getIdOfCurrentColumn(event);
    }
    return [startDropAcceptanceColumnId, currentColumnId];
}

/**
 * This function clears the last drop acceptance field if the column has changed.
 * 
 * @param {string} currentColumnId The ID of the current column.
 */
function clearLastDropAcceptanceIfChangedColumn(currentColumnId) {
     if (lastDropAcceptanceColumnId && lastDropAcceptanceColumnId !== currentColumnId) {
        removeDropAcceptanceFieldByColumnId(lastDropAcceptanceColumnId);
    }    
    lastDropAcceptanceColumnId = currentColumnId;
}

/**
 * This function sets the drop acceptance field in the current column.
 * 
 * @param {string} currentColumnId The ID of the current column.
 */
function setDropAcceptanceInCurrentColumn(currentColumnId) {
    if(startDropAcceptanceColumnId !== currentColumnId && currentColumnId !== null) {
        renderDropAcceptanceInColumn(currentColumnId);
    }
}

/**
 * This function gets the ID of the current column from the event.
 * 
 * @param {Event} event The event object.
 * @returns {string} The ID of the current column.
 */
function getIdOfCurrentColumn(event) {
    return event.currentTarget.id;
}

/**
 * This function renders the drop acceptance field in a column.
 * 
 * @param {string} columnId The ID of the column.
 */
function renderDropAcceptanceInColumn(columnId) {
    const columnContent = document.getElementById(columnId);  
    if (!columnContent.querySelector('.drop_acceptance')) {
        columnContent.innerHTML += showDropAcceptanceTemplate();
    }
    removeNoTaskInfoElement(columnId);
}

/**
 * This function removes the "no task" info element from a column.
 * 
 * @param {string} columnId The ID of the column.
 */
function removeNoTaskInfoElement(columnId) {
    const columnContent = document.getElementById(columnId);
    findChildAndRemoveNoTaskElement(columnContent);
}

/**
 * This function finds and removes the "no task" element from a parent element.
 * 
 * @param {HTMLElement} parentElement The parent element to search in.
 */
function findChildAndRemoveNoTaskElement(parentElement) {
    const noTaskClassName = 'no_task_yet';
    const noTaskElement = parentElement.querySelector(`.${noTaskClassName}`);
    if (noTaskElement) {
        noTaskElement.remove();
    }
}

/**
 * This function handles the drop event for a task card.
 * 
 * @param {DragEvent} event The drop event object.
 */
function dropHandler(event) {
    event.preventDefault();
    const taskCardContainer = event.dataTransfer.getData("text/plain");
    const taskElement = document.getElementById(taskCardContainer);
    const taskId = taskCardContainer.replace('_task_card', '');
    event.currentTarget.appendChild(taskElement);
    taskElement.classList.remove('drag-tilt');
    removeDropAcceptanceFieldByColumnId(lastDropAcceptanceColumnId);
    updateStateOfDroppedTask(taskId, event.currentTarget.id);
    startDropAcceptanceColumnId = null;
    dragOverCounter = 0;
}

/**
 * This function updates the state of a dropped task and persists the change.
 * 
 * @param {string} taskId The ID of the task to update.
 * @param {string} newColumnId The ID of the new column.
 */
async function updateStateOfDroppedTask(taskId, newColumnId) {
    const task = allTasksOfSingleUserObj[taskId];
    if (!task) {
        console.error(`Task with ID ${taskId} not found.`);
        return;
    };
    const newState = getTaskStateByColumnId(newColumnId);
    task.state = newState;
    try{
        await updateTask(taskId, task);
    }
    catch(error){
        console.error('Error updating task in database:', error);
    }
}

/**
 * This function removes the drop acceptance field from a column by its ID.
 * 
 * @param {string} columnId The ID of the column.
 */
function removeDropAcceptanceFieldByColumnId(columnId) {
    const columnOfDrop = document.getElementById(columnId).querySelectorAll('.drop_acceptance');
    columnOfDrop.forEach(drop => drop.remove());
}