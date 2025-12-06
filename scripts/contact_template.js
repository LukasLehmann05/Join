function contactListSingle(data, short) {
    return `<p id="listShort${data}" class="two-letter-name-small">${short}</p>
            <div class="list-info">
                <p id="listName${data}" class="font-size-20">${data.name}</p>
                <span id="listMail${data}" class="font-size-16 color-mail">${data.email}</span>
            </div>
    `
}

function contactMain() {
    return `<div class="main-name">
                <div id="mainShort" class="two-letter-name fullname">AR</div>
                <div class="name-field">
                    <p id="mainName" class="fullname">Name Placeholder</p>
                    <div class="main-name-btns">
                        <button class="name-btn font-size-16"><img src="../assets/icons/contacts/edit.svg"
                            alt="edit contact">Edit</button>
                        <button class="name-btn font-size-16"><img src="../assets/icons/contacts/delete.svg"
                            alt="delete Contact">Delete</button>
                    </div>
                </div>
            </div>
            <span class="sub-header-information font-size-20">Contact Information</span>
            <div class="info-display">
                <p class="info-text">Email</p>
                <span id="mainShort" class="color-mail">Placeholder Mail</span>
            </div>
            <div class="info-display">
                <p class="info-text">Phone</p>
                <span id="mainPhone">Placeholder Number</span>
            </div>`
}