/**
 * changes sizes to display the clicked contact in responive width
 */
function changeDisplaySize() {
    let contactList = document.getElementById('contactsAsideElement');
    let mainView = document.getElementById('contactsMainElement');
    if (window.innerWidth <= 1150) {
        contactList.style.display = "none";
        mainView.style.display = "block";
    }
};


/**
 * changes the displayed elements based on the window size and their display status
 */
window.addEventListener("resize", () => {
    let contactList = document.getElementById('contactsAsideElement');
    let mainView = document.getElementById('contactsMainElement');
    if (window.innerWidth >= 1150 && contactList.style.display == "none" == true) {
        contactList.style.display = "flex";
    }
    if (window.innerWidth <= 1150 && contactList.style.display == "none" == false) {
        mainView.style.display = "none";
    }
    if (window.innerWidth >= 1150 && mainView.style.display == "none" == true) {
        mainView.style.display = "block";
    }
});


/**
 * goes back to display contact list
 */
function goBacktoList() {
    let contactList = document.getElementById('contactsAsideElement');
    let mainView = document.getElementById('contactsMainElement');
    contactList.style.display = "flex";
    mainView.style.display = "none";
};


/**
 * validates entered phone number
 */
function validatePhoneByLength(phone) {
    let validation = /^\d{5,15}$/;
    return validation.test(phone);
};


/**
 * validates entered email
 */
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};


/**
 * displays hint if phone number or email are invalid. used in adding a new contact
 */
function displayHint(id) {
    document.getElementById(id).style.opacity = 1;
    setTimeout(() => {
        document.getElementById(id).style.opacity = 0;
    }, 3000)
};


/**
 * emptys input fields if process of adding a user gets cancelled
 */
function emptyInput() {
    document.getElementById('nameAdd').value = "";
    document.getElementById('phoneAdd').value = "";
    document.getElementById('emailAdd').value = "";
};


/**
 * displays current edited contact in editing dialog
 */
function displayAvatarInEdit(id) {
    let avatar = document.getElementById('editedAvatar');
    let color = document.getElementById('short-' + id).style.backgroundColor;
    let acronym = document.getElementById('short-' + id).innerText;
    avatar.classList.add('fullname');
    avatar.innerText = acronym
    avatar.style.backgroundColor = color;
};


/**
 * remove contact from contact list
 */
function removeThisContactFromList(id) {
    let deletedContact = document.getElementById(id);
    deletedContact.remove();
};


/**
 * checks if the letter section is empty after deleting a contact and removes said section if empty
 */
function removeLetterSectionIfEmpty(letter) {
    let deletedContact = document.getElementById(letter);
    if (deletedContact.children.length <= 0) {
        deletedContact.parentElement.remove();
    }
    else return;
};


/**
 * get contact Data from Main Display to edit dialog window
 */
function displayMainDataInEditDialog() {
    let currentContact = getDataFromMain();
    document.getElementById('emailEdit').value = currentContact.email
    document.getElementById('nameEdit').value = currentContact.name
    document.getElementById('phoneEdit').value = currentContact.phone
    displayAvatarInEdit(currentContact.id);
};


/**
 * updates data in contact list for the edited user
 */
function displayEditedContactDataInList(editID, email, name) {
    let acronym = getAcronym(name);
    document.getElementById('short-' + editID).innerText = acronym;
    document.getElementById('email-' + editID).innerText = email;
    document.getElementById('name-' + editID).innerText = name;
};


/**
 * updates data in main display for the edited user
 */
function displayEditedContactDataInMainDisplay(email, name, phone) {
    let acronym = getAcronym(name);
    document.getElementById('mainMail').innerText = email;
    document.getElementById('mainName').innerText = name;
    document.getElementById('mainPhone').innerText = phone;
    document.getElementById('mainShort').innerText = acronym;
};









