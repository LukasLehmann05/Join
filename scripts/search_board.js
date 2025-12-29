let searchEvent=false;
/**
 * This function initializes the input field event listener for task filtering.
 * It adds a debounced input event listener to the input field with ID 'task_filter_input_field'.
 */
function initInputFieldEventListener(allTasksByIdOfSingleUserArr) {
    const inputField = document.getElementById('task_filter_input_field');
    let debounceTimeout;
    if (!inputField) return;
    inputField.addEventListener('input', (event) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            handleTermOfInput(event, allTasksByIdOfSingleUserArr);
        }, 500);
    });
}

/**
 * This function handles the input event for task filtering.
 * 
 * @param {*} event The input event object.
 */
function handleTermOfInput(event, allTasksByIdOfSingleUserArr) {
    let inputText = event.target.value;
    handleInputSubmit(inputText, allTasksByIdOfSingleUserArr);
}


/**
 * This function handles the input submission for task filtering.
 * 
 * @param {string} inputText The text input for filtering tasks.
 */
async function handleInputSubmit(inputText, allTasksByIdOfSingleUserArr) {
    if (inputText.length > 2) {
        searchEvent = true;
        let filteredByTitle = filterTaskIdsByField(inputText, 'title');
        let filteredByDescription = filterTaskIdsByField(inputText, 'description');
        searchTaskBoardFilterLogic(filteredByTitle, filteredByDescription);
    } else {
        searchEvent = false;
    }
    if (inputText.length == 0 && searchEvent === false) {
        clearBoard();
        renderAllTaskCardsOnBoard(allTasksByIdOfSingleUserArr, getAllTasksOfSingleUserObj());
        renderNoTaskInfoOnDOMLoad();
    }
}

/**
 * This function applies the search filter logic to the task board.
 * 
 * @param {Array} filteredByTitle 
 * @param {Array} filteredByDescription 
 */
function searchTaskBoardFilterLogic(filteredByTitle, filteredByDescription) {
    if (filteredByTitle.length > 0) {
        clearBoard();
        disableShowNoSearchResultOnBoardInfo();
        renderAllTaskCardsOnBoard(filteredByTitle, getAllTasksOfSingleUserObj());
    } else if (filteredByDescription.length > 0) {
        clearBoard();
        disableShowNoSearchResultOnBoardInfo();
        renderAllTaskCardsOnBoard(filteredByDescription, getAllTasksOfSingleUserObj());
    } else if (filteredByTitle.length > 0 && filteredByDescription.length > 0) {
        clearBoard();
        disableShowNoSearchResultOnBoardInfo();
        let combinedFiltered = [...new Set([...filteredByTitle, ...filteredByDescription])];
        renderAllTaskCardsOnBoard(combinedFiltered, getAllTasksOfSingleUserObj());
    } else {
        clearBoard();
        showNoSearchResultOnBoardInfo();
    }
}

/**
 * Filters task IDs by a given field and input text.
 * @param {string} inputText The text to search for.
 * @param {string} field The field to search in ('title' or 'description').
 * @returns {Array} Array of filtered task ID objects.
 */
function filterTaskIdsByField(inputText, field) {
    let filteredTaskIdsArr = [];
    for (let taskId in allTasksOfSingleUserObj) {
        let task = allTasksOfSingleUserObj[taskId];
        if (task[field] && task[field].toLowerCase().includes(inputText.toLowerCase())) {
            let taskIdObj = {};
            taskIdObj[taskId] = true;
            filteredTaskIdsArr.push(taskIdObj);
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