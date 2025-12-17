function returnSubtaskTemplate(subtask, subtask_id) {
    return `<li class="subtask-list-element" id="${subtask_id}">
                <button type="button" class="subtask-button" role="button" onclick="showSubtaskEdit('${subtask_id}')">
                    <section class="subtask-text">
                        <p>•</p>
                        <span>${subtask}</span>
                    </section>
                    <section class="subtask-edit-section">
                        <img src="../assets/icons/board/edit_button.svg" alt="edit button">
                        <div class="subtask-edit-seperator"></div>
                        <img src="../assets/icons/board/delete_button.svg" alt="delete button">
                    </section>
                </button>
            </li>`
}

function returnContactTemplate(contact_name,user_id) {
    return `<li class="contact-element" id="${user_id}">
                <button class="contact-select-button" type="button" onclick="assignContact('${user_id}')">
                    <img src="../assets/icons/header/user_placeholder.svg" alt="contact_icon">
                    <p>${contact_name}</p>
                    <img src="../assets/icons/board/checkbox_undone.svg" alt="checkobx_icon" id="checkbox_${user_id}">
                </button type="button">
            </li>`
}

function returnSmallContactTemplate(user_id) {
    return `<img src="../assets/icons/header/user_placeholder.svg" alt="contact_icon" id="small_contact_${user_id}">`
}

function returnSubtaskEditTemplate(subtask_id) {
    return `
                    <div class="subtask-edit-container">
                        <article class="subtask-edit">
                            <input type="text">
                            <section class="subtask-edit-buttons">
                                <img src="../assets/icons/board/delete_button.svg" alt="delete button">
                                <div class="subtask-edit-seperator"></div>
                                <img src="../assets/icons/contacts/check.svg" alt="edit button">
                            </section>
                        </article>
                        <aside class="subtask-underline-blue"></aside>
                    </div>`
}

