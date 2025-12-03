function returnSubtaskTemplate(subtask) {
    return `<li>${subtask}</li>`
}

function returnContactTemplate(contact_name,user_id) {
    return `<li class="contact-element">
                <button class="contact-select-button" type="button" onclick="assignContact('${user_id}')">
                    <img src="../assets/icons/header/user_placeholder.svg" alt="contact_icon">
                    <p>${contact_name}</p>
                    <img src="../assets/icons/board/checkbox_undone.svg" alt="checkobx_icon">
                </button type="button">
            </li>`
}