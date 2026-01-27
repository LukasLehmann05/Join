let searchEvent=false;


/**
 * This function initializes the input field event listener for task filtering.
 * It adds a debounced input event listener to the input field with ID 'task_filter_input_field'.
 * @param {Array} allTasksByIdArr Array of all tasks indexed by their IDs.
 * @returns {void}
 */
function initInputFieldEventListener(allTasksByIdArr) {
    const inputField = document.getElementById('task_filter_input_field');
    let debounceTimeout;
    if (!inputField) return;
    inputField.addEventListener('input', (event) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            handleTermOfInput(event, allTasksByIdArr);
        }, 500);
    });
}


/**
 * This function handles the input event for task filtering.
 * 
 * @param {*} event The input event object.
 * @param {Array} allTasksByIdArr Array of all tasks indexed by their IDs.
 */
function handleTermOfInput(event, allTasksByIdArr) {
    let inputText = event.target.value;
    handleInputSubmit(inputText, allTasksByIdArr);
}


/**
 * This function handles the input submission for task filtering.
 * 
 * @param {string} inputText The text input for filtering tasks.
 * @param {Array} allTasksByIdArr Array of all tasks indexed by their IDs.
 */
async function handleInputSubmit(inputText, allTasksByIdArr) {
    if (inputText.length > 2) {
        searchEvent = true;
        let filteredByTitle = filterTaskIdsByField(inputText, 'title');
        let filteredByDescription = filterTaskIdsByField(inputText, 'description');
        searchTaskBoardFilterLogic(filteredByTitle, filteredByDescription);
    }
    if (inputText.length === 0) {
        searchEvent = false;
        clearBoard();
        renderAllTaskCardsOnBoard(allTasksByIdArr, getAllTasksObj());
        renderNoTaskInfoOnDOMLoad();
        disableShowNoSearchResultOnBoardInfo();
    }
}


/**
 * This function applies the search filter logic to the task board.
 * 
 * @param {Array} filteredByTitle Array of task IDs filtered by title.
 * @param {Array} filteredByDescription Array of task IDs filtered by description.
 */
function searchTaskBoardFilterLogic(filteredByTitle, filteredByDescription) {
    clearBoard();
    let tasksToRender = [];
    if (filteredByTitle.length > 0 && filteredByDescription.length > 0) {
        tasksToRender = [...new Set([...filteredByTitle, ...filteredByDescription])];
    } else if (filteredByTitle.length > 0) {
        tasksToRender = filteredByTitle;
    } else if (filteredByDescription.length > 0) {
        tasksToRender = filteredByDescription;
    }
    if (tasksToRender.length > 0) {
        disableShowNoSearchResultOnBoardInfo();
        renderAllTaskCardsOnBoard(tasksToRender, getAllTasksObj());
    } else {
        showNoSearchResultOnBoardInfo();
    }
}


/**
 * Filters task IDs by a given field and input text.
 * @param {string} inputText The text to search for.
 * @param {string} field The field to search in ('title' or 'description').
 * @returns {Array} Array of filtered task IDs.
 */
function filterTaskIdsByField(inputText, field) {
    let filteredTaskIdsArr = [];
    for (let taskId in allTasksObj) {
        let task = allTasksObj[taskId];
        if (task[field] && task[field].toLowerCase().includes(inputText.toLowerCase())) {
            filteredTaskIdsArr.push(taskId);
        }
    }
    return filteredTaskIdsArr;
}


/**
 * This function shows the "no search result" message on the board overlay.
 */
function showNoSearchResultOnBoardInfo() {
    document.getElementById('no_task_found_message').classList.toggle('d-none', false);
}


/**
 * This function disables the "no search result" message on the board overlay.
 * 
 */
function disableShowNoSearchResultOnBoardInfo() {
    let noInfoContainer = document.getElementById('no_task_found_message');
    if (noInfoContainer.classList.contains('d-none'))
        return;
    else {
        noInfoContainer.classList.toggle('d-none', true);
    }
}


/**
 * This function clears all task cards from the board.
 */
function clearBoard() {
    BOARD_COLUMN_ID_ARR.forEach(columnId => {
        const container = document.getElementById(columnId);
        container.innerHTML = '';
    });
}