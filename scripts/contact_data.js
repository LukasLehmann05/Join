/**
 * array for colours to choose from for generating background colour in contact list
 */
const colours = [
    '#aaa827ff',
    '#dd711fff',
    '#3567d3ff',
    '#539e27ff',
    '#b6322eff',
    '#992b97ff',
    '#8a6710ff',
    '#9077d4ff',
    '#2a0394ff',
    '#030303ff',
    '#157402ff',
    '#026269ff',
    '#c73abbff',
    '#17682fff',
    '#c93360ff'
];

/**
 * fetches Contact Data from firebase database. Includes rendering functions for the contact list
 * @async
 * @global base_url
 */
async function fetchContactList() {
    let response = await fetch(base_url + ".json");
    let responseJson = await response.json();
    let contactData = responseJson.contacts;
    await renderListLetter(contactData);
    renderContactList(contactData);
};


/**
 * renders the letters in the contactlist that function as a headline. Sorts them alphabetically at the end
 * @async
 */
async function renderListLetter(contactData) {
    for (let contact in contactData) {
        let contactList = document.getElementById('contactList');
        let letter = contactData[contact].name.charAt(0);
        let child = document.getElementById(letter);
        if (child == null) {
            contactList.innerHTML += contactListLetterSection(letter);
        }
        sortAlphabetically(contactList, child);
    }
};


/**
 * function for sorting headline letters alphabetically. Gets called in function: "renderListLetter()"
 */
function sortAlphabetically(parent) {
    let childrenArray = Array.from(parent.children);
    childrenArray.sort((a, b) => {
        return a.textContent.trim().localeCompare(b.textContent.trim());
    });
    childrenArray.forEach(child => {
        parent.appendChild(child);
    });
};


/**
 * renders contact into contact list. Gets called in function: "fetchContactList()"
 */
function renderContactList(contactData) {
    for (let contact in contactData) {
        let name = contactData[contact].name;
        let email = contactData[contact].email;
        let phone = contactData[contact].phone;
        let contactID = contact;
        let acronym = getAcronym(name);
        let letter = name.charAt(0);
        document.getElementById(letter).innerHTML += contactListSingle(contactID, name, email, acronym, phone);
        colorAcronym(contactID)
    }
};


/**
 * generates acronym from contact name. Gets called in function: "renderContactList()"
 */
function getAcronym(name) {
    let matches = name.match(/\b(\w)/g);
    let acronym = matches.join('');
    return acronym;
};


/**
 * chooses backgroundcolor for user acronym randomly from colours array. Gets called in function: "renderContactList()"
 */
function colorAcronym(data) {
    let element = document.getElementById("short-" + data);
    let color = colours[Math.floor(Math.random() * colours.length)];
    element.style.backgroundColor = color;
};


/**
 * fetches contact data from firebase and renders data into main Display
 */
async function displayInMain(id) {
    let currentId = id.getAttribute('data-id');
    let currentName = id.getAttribute('data-name');
    let currentPhone = id.getAttribute('data-phone');
    let currentMail = id.getAttribute('data-email');
    renderMainDisplay(currentId, currentName, currentPhone, currentMail);
};


/**
 * renders date into the main display. adds the phone number and background color
 */
function renderMainDisplay(currentId, currentName, currentPhone, currentMail) {
    let mainDisplay = document.getElementById('mainView');
    let acronym = document.getElementById("short-" + currentId).innerHTML;
    let color = document.getElementById("short-" + currentId).style.backgroundColor;
    mainDisplay.innerHTML = contactMain(currentId, currentName, currentPhone, currentMail, acronym);
    document.getElementById("mainShort").style.backgroundColor = color;
};


/**
 * adds new user to the database
 */
async function addContactToDatabase() {
    let name = document.getElementById('nameInfo').value;
    let phone = document.getElementById('phoneInfo').value;
    let email = document.getElementById('emailInfo').value;
    const newUser = {
        "email": email,
        "name": name,
        "phone": phone,
    }

    await fetch(base_url + "/contacts.json" , {
        method: 'POST',
        header: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser),
    })
    emptyInput();
};


/**
 * emptys input fields if process of adding a user gets cancelled
 */
function emptyInput() {
    document.getElementById('nameInfo').value = "";
    document.getElementById('phoneInfo').value = "";
    document.getElementById('emailInfo').value = "";
};

