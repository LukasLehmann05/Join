/**
 * opens dialog window.
 */
function openDialog(id, id2) {
    renderDialog(id2);
    let dialog = document.getElementById(id);
    dialog.open = true;
    setTimeout(() => {
        document.getElementById(id2).classList.add('show');
    }, 10)

};


/**
 * opens dialog window.
 */
function directionOfIncomingDialog(id, id2) {
    if (window.innerWidth <= 767) {
        console.log(window.innerWidth);
    }
    if (window.innerWidth >= 767) {
        openDialog(id, id2);
    }
}



/**
 * closes dialog window via button
 */
function closeDialog(id, id2) {
    let dialog = document.getElementById(id);
    document.getElementById(id2).classList.remove('show');
    setTimeout(() => {
        dialog.open = false;
    }, 1000)
};


/**
 * closes dialog window via window click
 */
window.onclick = function (event) {
    let dialog = document.getElementById('dialogWindow');
    let childAdd = document.getElementById('addContent');
    let childEdit = document.getElementById('editContent');
    if (event.target == dialog && dialog.contains(childAdd)) {
        closeDialog('dialogWindow', 'addContent');
    }
    if (event.target == dialog && dialog.contains(childEdit)) {
        closeDialog('dialogWindow', 'editContent');
    }
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
function displayEditedContactDataInMainDisplay(editID, email, name, phone) {
    let acronym = getAcronym(name);
    document.getElementById('mainMail').innerText = email;
    document.getElementById('mainName').innerText = name;
    document.getElementById('mainPhone').innerText = phone;
    document.getElementById('mainShort').innerText = acronym;
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
 * remove contact from contact list
 */
function removeThisContactFromList(id) {
    let deletedContact = document.getElementById(id);
    deletedContact.remove();
};


/**
 * shows response Message
 */
function responseMessageAppearance() {
    setTimeout(() => {
        document.getElementsByTagName("body")[0].style.overflow = "hidden";
        openDialog('responseDialog', 'responseDialog');
    }, 1500)
    document.getElementsByTagName("body")[0].style.overflow = "auto";
    setTimeout(() => {
        closeDialog('responseDialog', 'responseDialog');
    }, 3500)
    setTimeout(() => {
        document.getElementById('responseMessage').innerHTML = "Contact successfully created.";
    }, 4000)
};


/**
 * handles the appearing/disappearing of the dialogs during the process of adding a new contact
 */
function dialogAppearences(id, idContent) {
    closeDialog(id, idContent);
    responseMessageAppearance();
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
 * renders edit or add dialog from html template
 */
function renderDialog(id) {
    let dialog = document.getElementById('dialogWindow');
    if (id === "addContent") {
        dialog.innerHTML = addDialogHTML();
    }
    if (id === "editContent") {
        dialog.innerHTML = editDialogHTML();
    }
};


/**
 * changes sizes to display the clicked contact in responive width
 */
function changeDisplaySize() {
    let contactList = document.getElementById('contactsAsideElement');
    let mainView = document.getElementById('contactsMainElement');
    if (window.innerWidth <= 767) {
        contactList.style.display = "none";
        mainView.style.display = "block";
    }
};


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
 * opens sub menu in single contact to display edit and delete options
 */
function openSubMenu() {
    let subMenu = document.getElementById('subMenuBtns');
    subMenu.style.transform = "translateX(0%)"
};


/**
 * closes sub menu in single contact by accessing translateX property
 */
window.addEventListener('click', (event) => {
  if (!event.target.closest('.sub-menu-btn') && window.innerWidth <= 767) {
    document.getElementById('subMenuBtns').style.transform = "translateX(200%)";
  }
});








