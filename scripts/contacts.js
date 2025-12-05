function openAddContact() {
    let dialog =  document.getElementById('addContact');
    dialog.open = true;
    setTimeout(() => {
        document.getElementById('addContent').classList.add('show');
    }, 10);
};

window.onclick = function (event) {
    let dialog =  document.getElementById('addContact');
    if (event.target == dialog) {
        closeAddContact();
    }
};

function closeAddContact() {
    let dialog =  document.getElementById('addContact');
    document.getElementById('addContent').classList.remove('show');
    setTimeout(() => {
        dialog.open = false;
    }, 500);
};

function openEditContact() {
    let dialog =  document.getElementById('editContact');
    dialog.open = true;
    setTimeout(() => {
        document.getElementById('editContent').classList.add('show');
    }, 10);
};

window.onclick = function (event) {
    let dialog =  document.getElementById('editContact');
    if (event.target == dialog) {
        closeEditContact();
    }
};

function closeEditContact() {
    let dialog =  document.getElementById('editContact');
    document.getElementById('editContent').classList.remove('show');
    setTimeout(() => {
        dialog.open = false;
    }, 500);
};
