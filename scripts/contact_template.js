function contactListSingle(contactID, name, email, acronym, phone) {
    return `<div id="${contactID}" class="single-User" data-id="${contactID}" data-name="${name}" data-email="${email}" data-phone="${phone}" onclick="displayInMain(this)">
                <p id="short-${contactID}" class="two-letter-name-small">${acronym}</p>
                <div class="list-info">
                  <p id="name-${contactID}" class="font-size-20">${name}</p>
                  <span id="email-${contactID}" class="font-size-16 color-mail">${email}</span>
                </div>
            </div>`
};


function contactListLetterSection(letter) {
    return `<article class="single-letter-section">
                <h2 class="single-letter font-size-20">${letter}</h2>
                <div class="separator-list"></div>
                <section class="list-user" id="${letter}"></section>
            </article>`
};


function contactMain(currentId, currentName, currentPhone, currentMail, acronym) {
    return `<div class="main-name">
                <div id="mainShort" class="two-letter-name fullname">${acronym}</div>
                <div class="name-field">
                    <p id="mainName" class="fullname">${currentName}</p>
                    <div class="main-name-btns">
                        <button id="editUser" data-id="${currentId}" onclick="openDialog('editContact' , 'editContent', this) , displayMainDataInEditDialog()" class="name-btn font-size-16">Edit</button>
                        <button onclick="deleteThisContactFromMain(this)" id="deleteUser" data-id="${currentId}" class="name-btn font-size-16">Delete</button>
                    </div>
                </div>
            </div>
            <span class="sub-header-information font-size-20">Contact Information</span>
            <div class="info-display">
                <p class="info-text">Email</p>
                <span id="mainMail" class="color-mail">${currentMail}</span>
            </div>
            <div class="info-display">
                <p class="info-text">Phone</p>
                <span id="mainPhone">${currentPhone}</span>
            </div>`
};