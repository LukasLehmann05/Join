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