function contactListSingle(contactID, name, email, acronym, phone) {
    return `<div id="${contactID}" class="single-User" data-id="${contactID}" data-name="${name}" data-email="${email}" data-phone="${phone}" onclick="displayInMain(this)">
                <p id="short-${contactID}" class="two-letter-name-small">${acronym}</p>
                <div class="list-info">
                  <p id="name-${contactID}" class="font-size-20">${name}</p>
                  <a href="mailto:${email}" id="email-${contactID}" class="font-size-16 color-mail">${email}</a>
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
                    <div id="subMenuBtns" class="main-name-btns">
                        <button id="editUser" data-id="${currentId}" onclick="openDialog('dialogWindow' ,'editContent') , displayMainDataInEditDialog(this)" class="name-btn font-size-16">Edit</button>
                        <button onclick="deleteThisContactFromMain(this)" id="deleteUser" data-id="${currentId}" class="name-btn font-size-16">Delete</button>
                    </div>
                </div>
            </div>
            <span class="sub-header-information font-size-20">Contact Information</span>
            <div class="info-display">
                <p class="info-text">Email</p>
                <a href="mailto:${currentMail}" id="mainMail" class="color-mail">${currentMail}</a>
            </div>
            <div class="info-display">
                <p class="info-text">Phone</p>
                <span id="mainPhone">${currentPhone}</span>
            </div>
            <button onclick="openDialog('responsivMenu' ,'responseMenuContent')" class="sub-menu-btn">
                <img src="../assets/icons/contacts/three_dots.svg"
                    alt="three dots opening sub menu">
            </button>
            <dialog id="responsivMenu" class="dialog-window-message">
                <div class="sub-menu-btns" id="responseMenuContent">
                    <button id="editUser" data-id="${currentId}" onclick="openDialog('dialogWindow' ,'editContent') , displayMainDataInEditDialog(this)" class="name-btn font-size-16">Edit</button>
                    <button onclick="deleteThisContactFromMain(this)" id="deleteUser" data-id="${currentId}" class="name-btn font-size-16">Delete</button>
                </div>
            </dialog>`
};

function addDialogHTML() {
    return `<div id="addContent" class="dialog-content">
               <section class="main-left">
                   <img class="logo-dialog" src="../assets/icons/logo/logo_white.svg" alt="Join logo">
                   <h1 class="white margin">Add Contact</h1>
                   <p class="contact-sub white margin">Tasks are better with a team!</p>
                   <div class="separator-horizontal"></div>
               </section>
               <section class="main-right">
                   <div class="two-letter-name position">
                       <img src="../assets/icons/contacts/person_white.svg" alt="placeholder for name">
                   </div>
                   <div class="add-contact-info">
                       <button class="close-btn" onclick="closeDialog('dialogWindow' ,'addContent')">
                             <picture>
                               <source media="(max-width: 767px)" srcset="../assets/icons/contacts/close_white.svg">
                               <img class="icon-close" src="../assets/icons/contacts/close.svg"
                               alt="close overlay icon">
                             </picture>
                       </button>
                       <label class="subtask-section name label-responsiv">
                           <input id="nameAdd" type="text" placeholder="Name">
                       </label>
                       <p id="required_name" class="required-info margin-add-dialog">Please enter a name.</p>
                       <label class="subtask-section mail label-responsiv">
                           <input id="emailAdd" type="email" placeholder="Email">
                       </label>
                       <p id="required_email" class="required-info margin-add-dialog">Please enter a valid email
                           address.</p>
                       <label class="subtask-section phone label-responsiv">
                           <input id="phoneAdd" type="tel" placeholder="Phone">
                       </label>
                       <p id="required_phone" class="required-info margin-add-dialog">Please enter a valid phone
                           number.</p>
                       <section class="button-section-contact">
                           <div class="cancel-add-btn">
                               <button onclick="closeDialog('dialogWindow' ,'addContent') , emptyInput()"
                                   class="action-buttons">Cancel</button>
                           </div>
                           <div class="create-task create-contact-btn">
                               <button onclick="addNewContactToDatabase()" class="action-buttons create-button">
                                   <p>Create contact</p>
                                   <img src="../assets/icons/contacts/check.svg" alt="create contact icon">
                               </button>
                           </div>
                       </section>
                   </div>
               </section>
           </div> `
};


function editDialogHTML() {
    return `<div id="editContent" class="dialog-content">
               <section class="main-left">
                   <img class="logo-dialog" src="../assets/icons/logo/logo_white.svg" alt="Join logo">
                   <h1 class="white margin">Edit Contact</h1>
                   <div class="separator-horizontal"></div>
               </section>
               <section class="main-right">
                   <div id="editedAvatar" class="two-letter-name position">
                      </div>
                   <div class="add-contact-info">
                       <button class="close-btn" onclick="closeDialog('dialogWindow' ,'editContent')">
                           <img class="icon-close" src="../assets/icons/contacts/close.svg"
                               alt="close overlay icon">
                       </button>
                       <label class="subtask-section name">
                           <input id="nameEdit" type="text" placeholder="Name">
                       </label>
                       <p id="required_edit_name" class="required-info margin-add-dialog">Please enter a name.</p>
                       <label class="subtask-section mail">
                           <input id="emailEdit" type="email" placeholder="Email">
                       </label>
                       <p id="required_edit_email" class="required-info margin-add-dialog">Please enter a valid
                           email address.</p>
                       <label class="subtask-section phone">
                           <input id="phoneEdit" type="tel" placeholder="Phone">
                       </label>
                       <p id="required_edit_phone" class="required-info margin-add-dialog">Please enter a valid
                           phone number.</p>
                       <section class="button-section-contact">
                           <div class="clear-button">
                                <div class="cancel-add-btn">
                                   <button onclick="deleteThisContactFromDialog()" class="action-buttons">
                                       Delete
                                   </button>
                                </div>
                           </div>
                           <div class="create-task"><button onclick="editContactInDatabase()"
                                   class="action-buttons create-button">
                                   <p>Save</p>
                                   <img src="../assets/icons/contacts/check.svg" alt="create contact icon">
                               </button>
                           </div>
                       </section>
                   </div>
               </section>
           </div>`
};