/**
 * opens dialog window.
 */
function openDialog(id, id2) {
    let dialog = document.getElementById(id);
    dialog.open = true;
    setTimeout(() => {
        document.getElementById(id2).classList.add('show');
    }, 10)
};


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
    let dialog1 = document.getElementById('addContact');
    let dialog2 = document.getElementById('editContact');
    if (event.target == dialog1) {
        closeDialog('addContact', 'addContent');
    }
    if (event.target == dialog2) {
        closeDialog('editContact', 'editContent');
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





