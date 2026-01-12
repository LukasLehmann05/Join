/**
 * Retrieves commonly used signup form elements.
 * @returns {Object} UI element references.
 */
function getSignupElements() {
  return {
    checkbox: document.getElementById("privacy-checkbox"),
    signupBtn: document.getElementById("signup-btn"),
    form: document.getElementById("signup-form"),
    nameInput: document.getElementById("signup-name"),
    emailInput: document.getElementById("signup-email"),
    passwordInput: document.getElementById("signup-password"),
    passwordConfirmInput: document.getElementById("signup-password-confirm"),
    errorBox: document.getElementById("signup-error-message"),
  };
}


/**
 * Processes signup form submit: validates data and sends to backend.
 * @param {Object} ui - Signup UI elements.
 */
async function handleSignupSubmit(ui) {
  clearFieldErrors(ui);
  const data = getFormData(ui);
  const errors = validateSignupData(data, ui.checkbox);
  if (hasErrors(errors)) {
    showValidationErrors(errors, ui);
    showGlobalValidationMessage(ui);
    return;
  }
  await submitSignup(data, ui);
}


/**
 * Extracts and returns trimmed form data from UI inputs.
 * @param {Object} ui - Signup UI elements.
 * @returns {Object} Form data.
 */
function getFormData(ui) {
  return {
    name: ui.nameInput.value.trim(),
    email: ui.emailInput.value.trim(),
    password: ui.passwordInput.value,
    passwordConfirm: ui.passwordConfirmInput.value,
  };
}


/**
 * Submits signup data: checks for existing user and creates a new user.
 * @param {Object} data - Form data.
 * @param {Object} ui - Signup UI elements.
 */
async function submitSignup(data, ui) {
  if (ui.signupBtn) {
    setLoadingState(ui.signupBtn, true);}
  try {
    const existingUser = await findUserByEmail(data.email);
    if (existingUser) {
      handleExistingUser(ui);
      return;}
    const newUser = await saveNewUser(data.name, data.email, data.password);
    handleSignupSuccess(newUser);
  } catch (error) {
    handleSignupError(ui);
  } finally {
    if (ui.signupBtn) {
      setLoadingState(ui.signupBtn, false);}
  }
}
