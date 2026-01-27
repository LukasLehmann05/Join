/**
 * fetches Contact Data from firebase database. Includes rendering functions for the contact list
 * @async
 * @global AllData
 */
async function fetchContactList() {
    let contactData = (await fetchAllDataGlobal()).contacts;
    for (let contactID in contactData) {
        let color = contactData[contactID].color;
        let name = contactData[contactID].name;
        let singleContactData = contactData[contactID];
        renderHtmlElements(singleContactData, contactID, name, color);
    } 
}


/**
 * vehicle for better structure
 * @param {Object} singleContactData - The data of a single contact.
 * @param {string} contactID - The ID of the contact.
 * @param {string} name - The name of the contact.
 * @param {string} color - The background color for the contact's acronym.
 * @async
 */
async function renderHtmlElements(singleContactData, contactID, name, color) {
    await renderListLetter(name);
    await renderContactList(singleContactData, contactID, color);
}


/**
 * renders the letters in the contactlist that function as a headline. Sorts them alphabetically at the end
 * @param {string} name - The name of the contact.
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
}


/**
 * function for sorting headline letters alphabetically. Gets called in function: "renderListLetter()"
 * @param {HTMLElement} parent - The parent element containing the letters to sort.
 */
function sortAlphabetically(parent) {
    let childrenArray = Array.from(parent.children);
    childrenArray.sort((a, b) => {
        return a.textContent.trim().localeCompare(b.textContent.trim());
    });
    childrenArray.forEach(child => {
        parent.appendChild(child);
    });
}


/**
 * renders contact into contact list. Gets called in function: "fetchContactList()"
 * @param {Object} singleContactData - The data of a single contact.
 * @param {string} contactID - The ID of the contact.
 * @param {string} color - The background color for the contact's acronym.
 * @async
 */
async function renderContactList(singleContactData, contactID, color) {
    let name = singleContactData.name;
    let email = singleContactData.email;
    let phone = singleContactData.phone;
    let userInitials = getInitialsFromUser(singleContactData);
    let letter = name.charAt(0).toUpperCase();
    document.getElementById(letter).innerHTML += contactListSingle(contactID, name, email, userInitials, phone);
    colorAcronym(contactID, color);
}


/**
 * fetches color from array and assigns it as backgroundcolor for the user acronym
 * @param {string} contactId - The ID of the contact.
 * @param {string} color - The background color for the contact's acronym.
 */
function colorAcronym(contactId, color) {
    let element = document.getElementById("short-" + contactId);
    if (!element) return;
    element.style.backgroundColor = color;
}


/**
 * fetches contact data from firebase and renders data into main Display
 * @param {HTMLElement} id - The HTML element containing data attributes for the contact.
 */
function displayInMain(id) {
    let currentId = id.getAttribute('data-id');
    let currentName = id.getAttribute('data-name');
    let currentPhone = id.getAttribute('data-phone');
    let currentMail = id.getAttribute('data-email');
    if (window.innerWidth <= 1150) {
        changeDisplaySize();
        renderMainDisplay(currentId, currentName, currentPhone, currentMail)
    }
    if (window.innerWidth >= 1150) {
        renderMainDisplay(currentId, currentName, currentPhone, currentMail);
    }
    checkForActiveClass(currentId);
}


/**
 * renders data into the main display. adds the phone number and background color
 * @param {string} currentId - The ID of the contact.
 * @param {string} currentName - The name of the contact.
 * @param {string} currentPhone - The phone number of the contact.
 * @param {string} currentMail - The email of the contact.
 */
function renderMainDisplay(currentId, currentName, currentPhone, currentMail) {
    let mainDisplay = document.getElementById('mainView');
    let acronym = document.getElementById("short-" + currentId).innerHTML;
    let color = document.getElementById("short-" + currentId).style.backgroundColor;
    mainDisplay.innerHTML = contactMain(currentId, currentName, currentPhone, currentMail, acronym);
    document.getElementById("mainShort").style.backgroundColor = color;
}


/**
 * fetches data from input fields and returns them as an object
 * @param {string} nameInput - The ID of the name input field.
 * @param {string} phoneInput - The ID of the phone input field.
 * @param {string} emailInput - The ID of the email input field.
 * @return {Object} newUser - The new contact data.
 */
function getContactInputData(nameInput, phoneInput, emailInput) {
    let name = document.getElementById(nameInput).value;
    let phone = document.getElementById(phoneInput).value;
    let email = document.getElementById(emailInput).value;
    let color = assignColorToContact();
    let newUser = {
        "email": email.trim(),
        "name": name.trim(),
        "phone": phone.trim(),
        "color": color
    };
    return newUser;
}


/**
 * shell for handling the whole process of adding a new contact including validation, posting data to base, restructuring html list and confirmation for user
 * @async
 */
async function addNewContactToDatabase() {
    let newUser = getContactInputData("nameAdd", "phoneAdd", "emailAdd");
    const isValid = validateContactInput(newUser, {
        name: 'required_name',
        email: 'required_email',
        phone: 'required_phone'
    });
    if (!isValid) return;
    await postNewContactToDatabase(newUser);
    await trimDownAddingContact(newUser, newUser.name, newUser.color);
}


/**
 * Validates contact input data and displays hints for invalid fields.
 * @param {Object} user - The contact object to validate.
 * @param {Object} hintKeys - Object with keys for name, email, phone hints.
 * @returns {boolean} true if all fields are valid, false otherwise.
 */
function validateContactInput(user, hintKeys) {
    let valid = true;
    if (user.name.length <= 3 || !isOnlyLetters(user.name)) {
        displayHint(hintKeys.name);
        valid = false;
    }
    if (!validateEmail(user.email) || user.email === "") {
        displayHint(hintKeys.email);
        valid = false;
    }
    if (!validatePhoneByLength(user.phone) || user.phone === "") {
        displayHint(hintKeys.phone);
        valid = false;
    }
    return valid;
}


/**
 * shell for restructuring html templates and dialog appearences
 * @param {Object} newUser - The new contact data.
 * @param {string} name - The name of the contact.
 * @param {string} color - The background color for the contact's acronym.
 * @async
 */
async function trimDownAddingContact(newUser, name, color) {
    let contactID = await getLastContactAddedFromDatabase();
    await renderHtmlElements(newUser, contactID, name, color);
    emptyInput();
    dialogAppearences('dialogWindow', 'addContent');
}


/**
 * shell for handling the whole process of editing a new contact including validation, editing data in firebase, restructuring html list and confirmation for user 
 * @async
 */
async function editContactInDatabase() {
    let editedUser = getEditedContactData();
    let currentId = document.getElementById('deleteUser').getAttribute('data-id');
    const isValid = validateContactInput(editedUser, {
        name: 'required_edit_name',
        email: 'required_edit_email',
        phone: 'required_edit_phone'
    });
    if (!isValid) return;
    await editContactDataInDatabase(editedUser, currentId);
    await trimDownEditingUser(currentId, editedUser);
}


/**
 * trim down for editing a user to improve readability and overview
 * @param {string} editID - The ID of the contact being edited.
 * @param {Object} editedUser - The edited contact data.
 * @async
 */
async function trimDownEditingUser(editID, editedUser) {
    removeThisContactFromList(editID);
    let letter = document.getElementById('mainName').innerText.charAt(0).toUpperCase();
    removeLetterSectionIfEmpty(letter);
    await renderHtmlElements(editedUser, editID, editedUser.name, editedUser.color);
    document.getElementById('responseMessage').innerHTML = "Contact successfully edited.";
    dialogAppearences('dialogWindow', 'editContent');
    displayEditedContactDataInList(editID, editedUser);
    displayEditedContactDataInMainDisplay(editedUser);
}


/**
 * get edited contact data
 * @return {Object} editedContact - The edited contact data.
 */
function getEditedContactData() {
    let email = document.getElementById('emailEdit').value;
    let name = document.getElementById('nameEdit').value;
    let phone = document.getElementById('phoneEdit').value;
    let color = document.getElementById("editedAvatar").style.backgroundColor;
    let editedContact = {
        "email": email.trim(),
        "name": name.trim(),
        "phone": phone.trim(),
        "color": color
    };
    return editedContact;
}


/**
 * get contact Data from Main Display to edit dialog window
 * @return {Object} currentContact - The current contact data from the main display.
 */
function getDataFromMain() {
    let email = document.getElementById('mainMail').innerText;
    let name = document.getElementById('mainName').innerText;
    let phone = document.getElementById('mainPhone').innerText;
    let currentId = document.getElementById('deleteUser').getAttribute('data-id');
    let currentContact = {
        "email": email,
        "name": name,
        "phone": phone,
        "id": currentId,
    };
    return currentContact;
}


/**
 * shell for handling the deleting process of a contact from the main display
 * @param {HTMLElement} id - The HTML element containing data attributes for the contact.
 */
async function deleteThisContactFromMain(id) {
    let currentId = id.getAttribute('data-id');
    deleteThisUser(currentId)
    responseMessageAppearance();
}


/**
 * shell for handling the deleting process of a contact in the editing dialog 
 */
async function deleteThisContactFromDialog() {
    let currentId = document.getElementById('deleteUser').getAttribute('data-id');
    deleteThisUser(currentId)
    dialogAppearences('dialogWindow', 'editContent');
    responseMessageAppearance();
}


/**
 * calls functions deleting a contact from the database, emptying the main display and checking the contact list
 * @param {string} currentId - The ID of the contact to delete.
 */
async function deleteThisUser(currentId) {
    removeThisContactFromList(currentId);
    let letter = document.getElementById("mainName").innerHTML.charAt(0).toUpperCase();
    removeLetterSectionIfEmpty(letter);
    document.getElementById('mainView').innerHTML = "";
    document.getElementById('responseMessage').innerHTML = "Contact successfully deleted.";
    await deleteThisContactFromDatabaseById(currentId);
}