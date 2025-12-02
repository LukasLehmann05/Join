function returnSubtaskTemplate(subtask) {
    return `<li>${subtask}</li>`
}

function returnContactOption(contact_name) {
    return `
        <option value="${contact_name}">
            <img src="../assets/icons/header/user_placeholder.svg" alt="user_placeholder">${contact_name}
        </option>`
}