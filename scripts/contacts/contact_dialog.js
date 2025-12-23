/**
 * opens dialog window.
 */
function directionOfIncomingDialog(id, id2) {
    renderDialog(id2);
    if (window.innerWidth <= 1150) {
        document.getElementById(id2).style.transform = 'translateY(200%)';
        openDialog(id, id2);
    }
    if (window.innerWidth >= 1150) {
        document.getElementById(id2).style.transform = 'translateX(200%)';
        openDialog(id, id2);
    }
};


/**
 * opens dialog window.
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
};


/**
 * closes dialog window via button
 */
function closeDialog(id, id2) {
    let dialog = document.getElementById(id);
    if (window.innerWidth >= 1150) {
        document.getElementById(id2).style.transform = 'translateX(200%)';
    } else {
        document.getElementById(id2).style.transform = 'translateY(200%)';
    }
    setTimeout(() => {
        dialog.open = false;
    }, 1000)
};


/**
 * closes dialog window via window click
 */
window.onclick = function (event) {
    let dialog = document.getElementById('dialogWindow');
    let dialogResponsiv = document.getElementById('responsivMenu');
    let childAdd = document.getElementById('addContent');
    let childEdit = document.getElementById('editContent');
    let childResp = document.getElementById('responseMenuContent');
    if (event.target == dialog && dialog.contains(childAdd)) {
        closeDialog('dialogWindow', 'addContent');
    }
    if (event.target == dialog && dialog.contains(childEdit)) {
        closeDialog('dialogWindow', 'editContent');
    }
    if (event.target == dialogResponsiv && dialogResponsiv.contains(childResp)) {
        closeDialog('responsivMenu', 'responseMenuContent');
    }
};


/**
 * shows response Message
 */
function responseMessageAppearance() {
    setTimeout(() => {
        openDialog('responseDialog', 'responseDialogContent');
    }, 1500)
    setTimeout(() => {
        closeDialog('responseDialog', 'responseDialogContent');
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