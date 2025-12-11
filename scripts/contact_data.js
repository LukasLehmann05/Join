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
    for (let contactID in contactData) {
        colorUser(contactID);
        let name = contactData[contactID].name;
        let singleContactData = contactData[contactID];
        renderHtmlElements(singleContactData, contactID, name);
    }
};


/**
 * vehicle for better structure
 * @async
 */
async function renderHtmlElements(singleContactData, contactID, name) {
    await renderListLetter(name);
    await renderContactList(singleContactData, contactID);
}

/**
 * renders the letters in the contactlist that function as a headline. Sorts them alphabetically at the end
 * @async
 */
async function renderListLetter(name) {
    let contactList = document.getElementById('contactList');
    let letter = name.charAt(0).toUpperCase();
    let child = document.getElementById(letter);
    if (child == null) {
        contactList.innerHTML += contactListLetterSection(letter);
    }
    sortAlphabetically(contactList);
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
async function renderContactList(singleContactData, contactID) {
    let name = singleContactData.name;
    let email = singleContactData.email;
    let phone = singleContactData.phone;
    let acronym = getAcronym(name);
    let letter = name.charAt(0).toUpperCase();
    document.getElementById(letter).innerHTML += contactListSingle(contactID, name, email, acronym, phone);
    colorAcronym(contactID);
};


/**
 * generates acronym from contact name. Gets called in function: "renderContactList()"
 */
function getAcronym(name) {
    if (!name || typeof name !== 'string') return '';
    let names = name.trim().split(/\s+/);
    let firstTwoNames = names.slice(0, 2);
    let acronym = firstTwoNames
        .map(word => word.charAt(0).toUpperCase())
        .join('');
    return acronym;
};


/**
 * fetches color from array and assigns it as backgroundcolor for the user acronym
 */
function colorAcronym(contact) {
    let element = document.getElementById("short-" + contact);
    if (!element) return; // guard if element not found
    let position = userColourProperty.findIndex(item => item.id === contact);
    element.style.backgroundColor = userColourProperty[position].color;
};


/**
 * chooses color for user randomly from colours array. Gets called in function: "renderContactList()"
 * assigns colors to user permanently in userColourProperty
 * @const userColourProperty
 */
function colorUser(contact) {
    let colorUser = colours[Math.floor(Math.random() * colours.length)];
    userColourProperty.push(
        { id: contact, color: colorUser }
    )
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
 * fetches data from input fields and returns them as an object
 */
function getContactInputData(nameInput, phoneInput, emailInput) {
    let name = document.getElementById(nameInput).value;
    let phone = document.getElementById(phoneInput).value;
    let email = document.getElementById(emailInput).value;
    let newUser = {
        "email": email,
        "name": name,
        "phone": phone,
    };
    return newUser;
};


/**
 * shell for handling the whole process of adding a new contact including validation, posting data to base, restructuring html list and confirmation for user
 * @async
 */
async function addNewContactToDatabase() {
    let newUser = getContactInputData("nameAdd", "phoneAdd", "emailAdd");
    if (newUser.name.length <= 0 == false) {
        if (validateEmail(newUser.email) == true && newUser.email != "") {
            if (validatePhoneByLength(newUser.phone) == true && newUser.phone != "") {
                await postNewContactToDatabase(newUser);
                await trimDown(newUser, newUser.name);
            } else {
                displayHint('required_phone');
            }
        } else {
            displayHint('required_email');
        }
    } else {
        displayHint('required_name');
    }
};


/**
 * shell for restructuring html templates and dialog appearences
 */
async function trimDown(newUser, name) {
    let contactID = await getLastContact();
    colorUser(contactID);
    await renderHtmlElements(newUser, contactID, name);
    emptyInput();
    dialogAppearences();
};


/**
 * get last contact that was added
 */
async function getLastContact() {
    let joinFetch = await fetch(base_url + `/contacts.json`)
    let joinData = await joinFetch.json();
    return Object.keys(joinData).at(-1);
};


/**
 * handles the appearing/disappearing of the dialogs during the process of adding a new contact
 */
function dialogAppearences() {
    closeDialog('addContact', 'addContent');
    setTimeout(() => {
        document.getElementsByTagName("body")[0].style.overflow = "hidden";
        openDialog('responseDialog', 'responseDialog');
    }, 1500)
    document.getElementsByTagName("body")[0].style.overflow = "auto";
    setTimeout(() => {
        closeDialog('responseDialog', 'responseDialog');
    }, 3500)
};



/**
 * shell for handling the deleting process of a contact
 */
async function deleteThisUser(id) {
    let currentId = id.getAttribute('data-id');
    await deleteThisContactFromDatabaseById(currentId);
};


/**
 * shell for handling the editing process of a contact
 */
async function editContactInDatabase() {
    let editedUser = getContactInputData("nameEdit", "phoneEdit", "emailEdit");
    await editContactInDatabase(editedUser)
};











