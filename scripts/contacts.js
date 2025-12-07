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
    }, 500)
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




