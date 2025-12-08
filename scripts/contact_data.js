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
 * @global AllData
 */
async function fetchContactList() {
    await fetchAllDataGlobal();
    let contactData = AllData.data.contacts;
    colorUser(contactData);
    await renderListLetter(contactData);
    await renderContactList(contactData);
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
async function renderContactList(contactData) {
    for (let contact in contactData) {
        let name = contactData[contact].name;
        let email = contactData[contact].email;
        let phone = contactData[contact].phone;
        let acronym = getAcronym(name);
        let letter = name.charAt(0);
        document.getElementById(letter).innerHTML += contactListSingle(contact, name, email, acronym, phone);
        colorAcronym(contact);
    }
};


/**
 * generates acronym from contact name. Gets called in function: "renderContactList()"
 */
function getAcronym(name) {
    let matches = name.match(/\b(\w)/g);
    let acronym = matches.join('').toUpperCase();
    return acronym;
};


/**
 * fetches color from array and assigns it as backgroundcolor for the user acronym
 */
function colorAcronym(data) {
    let element = document.getElementById("short-" + data);
    if (!element) return; // guard if element not found
    // find entry by id (not by dynamic key)
    let position = userColourProperty.findIndex(item => item.id === data);
    if (position === -1) {
        console.warn('No color assigned for', data);
        return;
    }
    element.style.backgroundColor = userColourProperty[position].color;
};


/**
 * chooses color for user randomly from colours array. Gets called in function: "renderContactList()"
 * assigns colors to user permanently in userColourProperty
 * @const userColourProperty
 */
function colorUser(contactData) {
    for (let contact in contactData) {
        let colorUser = colours[Math.floor(Math.random() * colours.length)];
        userColourProperty.push(
            { id: contact, color: colorUser }
        )
    }
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

async function addContactToBase() {
    let name = document.getElementById('nameInfo').value;
    let phone = document.getElementById('phoneInfo').value;
    let email = document.getElementById('emailInfo').value;

    let newUser = {
        "email": email,
        "name": name,
        "phone": phone,
    }

    if (validateEmail(email) && validatePhoneByLength(phone) == true) {
        /* await fetch(base_url + "/contacts.json", {
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser),
        }) */
        emptyInput();
        closeDialog('addContact', 'addContent');
        setTimeout(() => {
            openDialog('responseDialog', 'responseDialog');
        }, 500)
        setTimeout(() => {
            closeDialog('responseDialog', 'responseDialog');
        }, 2000)
        

    } else {
        console.log(error);

    }
};


/**
 * edits contacts in firebase
 */
async function editContactInDatabase() {
    let name = document.getElementById('nameInfo').value;
    let phone = document.getElementById('phoneInfo').value;
    let email = document.getElementById('emailInfo').value;
    let userPath = "";
    const editedUser = {
        "email": email,
        "name": name,
        "phone": phone,
    }

    await fetch(base_url + "/contacts.json", {
        method: 'PUT',
        header: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedUser),
    })
};


/**
 * deletes contacts in firebase
 */
async function addContactToDatabase() {
    await fetch(base_url + "/contacts.json", {
        method: 'DELETE',
        header: {
            'Content-Type': 'application/json'
        },
    })
};


/**
 * emptys input fields if process of adding a user gets cancelled
 */
function emptyInput() {
    document.getElementById('nameInfo').value = "";
    document.getElementById('phoneInfo').value = "";
    document.getElementById('emailInfo').value = "";
};


/**
 * validates entered email
 */
function validateEmail(email) {
    // Checks for: (anything not space/symbol) + @ + (anything not space/symbol) + . + (anything)
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};


/**
 * validates entered phone number
 */
function validatePhoneByLength(phone) {
    // 1. Remove everything that is NOT a number (replace non-digits with empty string)
    const cleanNumber = phone.replace(/\D/g, '');

    // 2. Check length (International is usually 7-15 digits)
    // Adjust these numbers based on your specific needs
    return cleanNumber.length >= 10 && cleanNumber.length <= 15;
}