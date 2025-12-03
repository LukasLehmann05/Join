function returnSubtaskTemplate(subtask) {
    return `<li>${subtask}</li>`
}

function returnContactOption(contact_name) {
    return `
        <option value="${contact_name}">${contact_name}
        </option>`
}

function returnContactTemplate(contact_name) {
    return `    <li class="contact-element">
                    <button class="contact-select-button" type="button" onclick="assignContact('${contact_name}')">
                        <img src="../assets/icons/header/user_placeholder.svg" alt="contact_icon">
                        <p>${contact_name}</p>
                        <img src="../assets/icons/board/checkbox_undone.svg" alt="checkobx_icon">
                    </button type="button">
                </li>`
}