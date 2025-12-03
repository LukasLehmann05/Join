function openDialog() {
    let element = document.getElementById("addContact");
    element.open = true;
};

window.onclick = function (event) {
    let element = document.getElementById("addContact");
    if (event.target == element) {
        element.open = false;
    }
};

function dialogClose() {
    let element = document.getElementById("addContact");
    element.open = false;
};

function displayInMain() {
    let main = document.getElementById("mainView");
    main.innerHTML = contactMain();
}

function displayInList() {
    let list = document.getElementById("test");
    list.innerHTML = contactListsingle();
}