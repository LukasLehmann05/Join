const userColorProperty = {};
const AllData = {};
const colours = [
    '#b4a429ff',
    '#FF4646',
    '#aa7f24ff',
    '#FFC701',
    '#0038FF',
    '#76a00eff',
    '#FF745E',
    '#FFA35E',
    '#FC71FF',
    '#9327FF',
    '#00BEE8',
    '#228f82ff',
    '#FF7A00',
    '#FF5EB3',
    '#6E52FF'
];


/**
 * Assigns a random color from the colours array to a contact.
 * @returns {string} - The assigned color in hexadecimal format.
 */
function assignColorToContact() {
    let userColor = colours[Math.floor(Math.random() * colours.length)];
    return userColor;
}


/**
 * Sets event listener to the subtask input field to prevent loading the site in enter
 */
function implementListenerToPreventEnterIssue() {
    document.getElementById('task_subtask').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSubtask();
        }
    });
}


/**
 * This function checks if a string contains only letters (a-z, A-Z).
 * @param {string} str - The string to check.
 * @returns {boolean} - True if the string contains only letters, false otherwise.
 */
function isOnlyLetters(str) {
    return /^[a-zA-Z]+( [a-zA-Z]+)*$/.test(str);
}


/**
 * This function checks if assignees in tasks exist in contacts.
 * @param {Array} allTasksByIdArr - Array of all task IDs.
 * @param {Object} joinData - Object containing tasks and contacts data.
 */
async function checkAssigneesExistence(allTasksByIdArr, joinData) {
    for (let i = 0; i < allTasksByIdArr.length; i++) {
        const singleTaskId = allTasksByIdArr[i];
        const assigneeIdArray = joinData.tasks[singleTaskId].assigned_to;
        if (assigneeIdArray === undefined) {
            continue;
        }
        for (let assigneeId of assigneeIdArray) {
            const assigneeExists = joinData.contacts.hasOwnProperty(assigneeId);
            if (!assigneeExists) {
                let taskToUpdate = joinData.tasks[singleTaskId];
                taskToUpdate.assigned_to = taskToUpdate.assigned_to.filter(id => id !== assigneeId);
                await updateTask(singleTaskId, taskToUpdate);
            }
        }
    }
}


/**
 * sets pickable date to a future date only
 */
function setDateToFuture() {
    let tomorrow = new Date();
    let minDate = tomorrow.toISOString().split('T')[0];
    document.getElementById("task_due_date").setAttribute('min', minDate);
}


/**
 * Checks if the required fields are filled.
 * @param {Array<string>} requiredFields - Array of field names to check (e.g. ['title', 'dueDate', 'category'])
 * @param {boolean} editOnlyMode - If true, skips certain validations (like past date check).
 * @returns {boolean} true if all required fields are filled, false otherwise
 */
function checkForRequired(requiredFields, editOnlyMode) {
    setRequiredValues();
    let isValid = true;
    for (const field of requiredFields) {
        switch (field) {
            case 'title':
                if (!document.getElementById('task_title').value.trim()) isValid = false;
                break;
            case 'dueDate':
                if (!document.getElementById('task_due_date').value.trim() || checkDate(editOnlyMode)) isValid = false;
                break;
            case 'category':
                if (!document.getElementById('task_category').value.trim()) isValid = false;
                break;
        }
    }
    return isValid;
}

/**
 * This function sets the required value flags based on current input values to be used in validation
 */
function setRequiredValues() {
    if (task_title.value.trim() !== "") {
        req_title = true
    }
    if (task_due_date.value.trim() !== "") {
        req_due_date = true
    }
    if (task_category.value.trim() !== "") {
        req_category = true
    }
}


/**
 * This function checks if the due date is in the future and therefore valid
 * @param {boolean} editOnlyMode - If true, skips the past date check.
 * @returns {boolean} - true if the date is invalid (in the past), false otherwise.
 */
function checkDate(editOnlyMode) {
    let date = new Date(document.getElementById('task_due_date').value);
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    if (date < today && !editOnlyMode) {
        req_due_date_invalid = true
        return true
    }
    req_due_date_invalid = false
    return false;
}