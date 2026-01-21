const userColorProperty = {};
const contactColorProperty = {};

const AllData = {};

/**
 * array for colours to choose from for generating background colour in contact list
 */
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
 * chooses color for contact randomly from colours array. Gets called in function: "renderContactList()"
 * assigns colors to contact permanently in contactColorProperty
 * @const contactColorProperty
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
  return /^[a-zA-Z]+$/.test(str);
}