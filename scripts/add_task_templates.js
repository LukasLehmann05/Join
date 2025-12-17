function returnSubtaskTemplate(subtask, subtask_id) {
    return `<li class="subtask-list-element" id="${subtask_id}">
                <button type="button" class="subtask-button" role="button" onclick="showSubtaskEdit('${subtask_id}')">
                    <section class="subtask-text">
                        <p>•</p>
                        <span id="subtask_text_${subtask_id}">${subtask}</span>
                    </section>
                    <section class="subtask-edit-section">
                        <img src="../assets/icons/board/edit_button.svg" alt="edit button">
                        <div class="subtask-edit-separator"></div>
                        <img src="../assets/icons/board/delete_button.svg" alt="delete button" onclick="deleteSubtask(event,'${subtask_id}')">
                    </section>
                </button>
            </li>`
}

function returnEditedSubtaskTemplate(subtask_id, subtask_text) {
    return `<button type="button" class="subtask-button" role="button" onclick="showSubtaskEdit('${subtask_id}')">
                    <section class="subtask-text">
                        <p>•</p>
                        <span id="subtask_text_${subtask_id}">${subtask_text}</span>
                    </section>
                    <section class="subtask-edit-section">
                        <img src="../assets/icons/board/edit_button.svg" alt="edit button">
                        <div class="subtask-edit-separator"></div>
                        <img src="../assets/icons/board/delete_button.svg" alt="delete button" onclick="deleteSubtask(event,'${subtask_id}')">
                    </section>
                </button>`
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

function returnSubtaskEditTemplate(subtask_id, subtask_text) {
    return `
                    <div class="subtask-edit-container">
                        <article class="subtask-edit">
                            <input type="text" value="${subtask_text}" id="subtask_edit_input_${subtask_id}">
                            <section class="subtask-edit-buttons">
                                <img src="../assets/icons/board/delete_button.svg" alt="delete button" onclick="deleteSubtask(event,'${subtask_id}')">
                                <div class="subtask-edit-separator"></div>
                                <img src="../assets/icons/contacts/check.svg" alt="edit button" class="subtask-check" onclick="confirmSubtaskEdit('${subtask_id}')">
                            </section>
                        </article>
                        <aside class="subtask-underline-blue"></aside>
                    </div>`
}

