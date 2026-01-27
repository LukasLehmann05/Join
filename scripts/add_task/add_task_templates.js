/**
 * Returns HTML markup for a subtask list item.
 * @param {string} subtask - Subtask title text.
 * @param {string} subtask_id - Unique id for the subtask element.
 * @returns {string} HTML string for the subtask list item.
 */
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


/**
 * Returns HTML markup for an edited subtask display (non-list wrapper).
 * @param {string} subtask_id - Unique id for the subtask element.
 * @param {string} subtask_text - Text to display for the subtask.
 * @returns {string} HTML string for the edited subtask.
 */
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


/**
 * Returns HTML markup for a selectable contact option used when assigning.
 * @param {string} contact_name - Display name of the contact.
 * @param {string} user_id - Contact's unique id.
 * @param {string} contact_initial - Short initials to show in the icon.
 * @param {string} contact_color - Background color for the contact icon.
 * @returns {string} HTML string for a contact option element.
 */
function returnContactTemplate(contact_name,user_id,contact_initial,contact_color) {
    return `<li class="contact-element" id="${user_id}">
                <button class="contact-select-button" type="button" onclick="assignContact('${user_id}')">
                    <div class="contact-icon" style="background-color: ${contact_color};">${contact_initial}</div>
                    <p>${contact_name}</p>
                    <img src="../assets/icons/board/checkbox_undone.svg" alt="checkobx_icon" id="checkbox_${user_id}">
                </button type="button">
            </li>`
}


/**
 * Returns HTML for a compact contact icon used in the assigned contacts area.
 * @param {string} user_id - Contact's unique id.
 * @param {string} contact_initial - Initials to display.
 * @param {string} contact_color - Background color for the icon.
 * @returns {string} HTML string for a small contact icon.
 */
function returnSmallContactTemplate(user_id, contact_initial, contact_color) {
    return `<div class="contact-icon" style="background-color: ${contact_color};" id="small_contact_${user_id}">${contact_initial}</div>`
}


/**
 * Returns HTML for a compact overflow contact indicator in the assigned contacts area.
 * @param {(number|string)} overflow_amount - Number of additional contacts not shown.
 * @returns {string} HTML string for the overflow indicator element.
 */
function returnSmallContactOverflowTemplate(overflow_amount) {
    return `<div class="contact-icon contact-overflow-display";" id="contact_render_overflow">${overflow_amount}</div>`
}


/**
 * Returns HTML for a compact overflow contact indicator in the board view.
 * @param {(number|string)} overflow_amount - Number of additional contacts not shown.
 * @returns {string} HTML string for the overflow indicator element.
 */
function returnSmallContactOverflowTemplateBoard(overflow_amount) {
    return `<div class="assigned_user_avatar contact-overflow-display" id="contact_render_overflow_board">${overflow_amount}</div>`
}


/**
 * Returns HTML for the subtask edit UI (input + action buttons).
 * @param {string} subtask_id - Unique id for the subtask edit input.
 * @param {string} subtask_text - Current subtask text to populate the input.
 * @returns {string} HTML string for the subtask edit container.
 */
function returnSubtaskEditTemplate(subtask_id, subtask_text) {
    return `
                    <div class="subtask-edit-container">
                        <article class="subtask-edit">
                            <input type="text" value="${subtask_text}" id="subtask_edit_input_${subtask_id}">
                            <section class="subtask-edit-buttons">
                                <img src="../assets/icons/board/delete_button.svg" alt="delete button" onclick="deleteSubtaskEdit(event,'${subtask_id}')">
                                <div class="subtask-edit-separator"></div>
                                <img src="../assets/icons/contacts/check.svg" alt="edit button" class="subtask-check" onclick="confirmSubtaskEdit('${subtask_id}')">
                            </section>
                        </article>
                        <aside class="subtask-underline-blue"></aside>
                    </div>`
}