function returnSubtaskTemplate(subtask) {
    return `<li>${subtask}</li>`
}

function returnContactOption(contact_name) {
    return `
        <option value="${contact_name}">${contact_name}
        </option>`
}