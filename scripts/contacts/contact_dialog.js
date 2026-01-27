/**
 * checks for screen width to adjust dialog incoming direction.
 * @param {string} id - The ID of the dialog window.
 * @param {string} id2 - The ID of the dialog content.
 */
function directionOfIncomingDialog(id, id2) {
    renderDialog(id2);
    if (window.innerWidth <= 1150) {
        giveInitialPosition(id, id2);
    }
    if (window.innerWidth >= 1150) {
        document.getElementById(id2).style.transform = 'translateX(200%)';
        openDialog(id, id2);
    }
}


/**
 * gives dialogs initial translating values
 * @param {string} id - The ID of the dialog window.
 * @param {string} id2 - The ID of the dialog content.
 */
function giveInitialPosition(id, id2) {
    document.getElementById(id2).style.transform = 'translateY(200%)';
        openDialog(id, id2);
        if (id2 == "responseMenuContent") {
            document.getElementById(id2).style.transform = 'translateX(200%)';
            openDialog(id, id2);
        }
}


/**
 * opens dialog window.
 * @param {string} id - The ID of the dialog window.
 * @param {string} id2 - The ID of the dialog content.
 */
function openDialog(id, id2) {
    let dialog = document.getElementById(id);
    dialog.open = true;
    setTimeout(() => {
        if (window.innerWidth >= 1150) {
            document.getElementById(id2).style.transform = 'translateX(0%)';
        } else {
            document.getElementById(id2).style.transform = 'translateY(0%)';
        }
    }, 10)
}


/**
 * closes dialog window via button
 * @param {string} id - The ID of the dialog window.
 * @param {string} id2 - The ID of the dialog content.
 */
function closeDialog(id, id2) {
    let dialog = document.getElementById(id);
    if (window.innerWidth >= 1150) {
        decideTranslationBigScreen(id2);
    } else {
        decideTranslationSmallScreen(id2)
    }
    setTimeout(() => {
        dialog.open = false;
    }, 1000)
}


/**
 * decides specific translation values for specific dialogs
 * @param {string} id2 - The ID of the dialog content.
 */
function decideTranslationBigScreen(id2) {
    document.getElementById(id2).style.transform = 'translateX(200%)';
    if (id2 == "responseDialogContent") {
        document.getElementById(id2).style.transform = 'translateX(590%)';
    }
}


/**
 * choose specific values for specific dialogs
 * @param {string} id2 - The ID of the dialog content.
 */
function decideTranslationSmallScreen(id2) {
    document.getElementById(id2).style.transform = 'translateY(200%)';
    if (id2 == "responseMenuContent") {
        document.getElementById(id2).style.transform = 'translateX(200%)';
    }
    if (id2 == "responseDialogContent") {
        document.getElementById(id2).style.transform = 'translateY(400%)';
    }
}


/**
 * closes dialog window via window click
 * @param {Event} event - The click event.
 */
window.onclick = function (event) {
    let dialog = document.getElementById('dialogWindow');
    let dialogResponsiv = document.getElementById('responsivMenu');
    let childAdd = document.getElementById('addContent');
    let childEdit = document.getElementById('editContent');
    let childResp = document.getElementById('responseMenuContent');
    if (event.target == dialog && dialog.contains(childAdd)) {
        closeDialog('dialogWindow', 'addContent');}
    if (event.target == dialog && dialog.contains(childEdit)) {
        closeDialog('dialogWindow', 'editContent');}
    if (event.target == dialogResponsiv && dialogResponsiv.contains(childResp)) {
        closeDialog('responsivMenu', 'responseMenuContent');}
}


/**
 * shows response Message
 */
function responseMessageAppearance() {
    adjustPosition();
    setTimeout(() => {
        openDialog('responseDialog', 'responseDialogContent');
    }, 1500)
    setTimeout(() => {
        closeDialog('responseDialog', 'responseDialogContent');
    }, 3500)
    setTimeout(() => {
        document.getElementById('responseMessage').innerHTML = "Contact successfully created.";
    }, 6000)
}


/**
 * adjust position of response message based on window width
 */
function adjustPosition() {
    if (window.innerWidth >= 1150) {
        document.getElementById('responseDialogContent').style.transform = 'translateX(590%)';
    } else {
        document.getElementById('responseDialogContent').style.transform = 'translateY(200%)';
    }
}


/**
 * handles the appearing/disappearing of the dialogs during the process of adding a new contact
 * @param {string} id - The ID of the dialog window.
 * @param {string} idContent - The ID of the dialog content.
 */
function dialogAppearences(id, idContent) {
    closeDialog(id, idContent);
    responseMessageAppearance();
}


/**
 * renders edit or add dialog from html template
 * @param {string} id - The ID of the dialog content.
 */
function renderDialog(id) {
    let dialog = document.getElementById('dialogWindow');
    if (id === "addContent") {
        dialog.innerHTML = addDialogHTML();
    }
    if (id === "editContent") {
        dialog.innerHTML = editDialogHTML();
    }
}