document.addEventListener("DOMContentLoaded", initSignup);

/**
 * Initializes signup page: collects UI elements and binds handlers.
 */
function initSignup() {
  const ui = getSignupElements();
  if (!ui.form) {
    return;
  }
  attachPrivacyCheckboxHandler(ui);
  attachSignupHandler(ui);
}


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
 * Attaches handlers to the privacy checkbox for state and accessibility.
 * @param {Object} ui - Signup UI elements.
 */
function attachPrivacyCheckboxHandler(ui) {
  if (!ui.checkbox || !ui.signupBtn) return;
  ui.checkbox.addEventListener("change", () => {
    handleCheckboxChange(ui);
  });
  ui.checkbox.addEventListener("keydown", (e) => {
    handleCheckboxKeydown(e, ui);
  });
}


/**
 * Enables or disables the signup button based on privacy checkbox.
 * Clears privacy error text when checked.
 * @param {Object} ui - Signup UI elements.
 */
function handleCheckboxChange(ui) {
  const privacyErr = document.getElementById("error-signup-privacy");
  if (ui.checkbox.checked) {
    enableButton(ui.signupBtn);
    if (privacyErr) {
      privacyErr.textContent = "";
    }
  } else {
    disableButton(ui.signupBtn);
  }
}


/**
 * Toggles privacy checkbox on Enter key for keyboard accessibility.
 * @param {KeyboardEvent} e - Keydown event.
 * @param {Object} ui - Signup UI elements.
 */
function handleCheckboxKeydown(e, ui) {
  if (e.key !== "Enter") {
    return;
  }
  e.preventDefault();
  ui.checkbox.checked = !ui.checkbox.checked;
  ui.checkbox.dispatchEvent(new Event("change"));
}


/**
 * Binds the signup form submit to the handler.
 * @param {Object} ui - Signup UI elements.
 */
function attachSignupHandler(ui) {
  ui.form.addEventListener("submit", (event) => {
    event.preventDefault();
    handleSignupSubmit(ui);
  });
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
 * Runs all field validators and returns an errors object.
 * @param {Object} data - Form data.
 * @param {HTMLInputElement} checkbox - Privacy checkbox.
 * @returns {Object} Errors map.
 */
function validateSignupData(data, checkbox) {
  const errors = {};
  validateName(data, errors);
  validateEmail(data, errors);
  validatePassword(data, errors);
  validatePasswordConfirm(data, errors);
  validatePrivacy(checkbox, errors);
  return errors;
}


/**
 * Validates the name field and appends to errors if invalid.
 * @param {Object} data - Form data.
 * @param {Object} errors - Errors map to populate.
 */
function validateName(data, errors) {
  if (!data.name) {
    errors.name = "Please enter your name.";
  }
}


/**
 * Validates the email format and presence, populates errors.
 * @param {Object} data - Form data.
 * @param {Object} errors - Errors map to populate.
 */
function validateEmail(data, errors) {
  if (!data.email) {
    errors.email = "Please enter your email.";
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    errors.email = "Please enter a valid email.";
  }
}


/**
 * Validates password presence and minimum length.
 * @param {Object} data - Form data.
 * @param {Object} errors - Errors map to populate.
 */
function validatePassword(data, errors) {
  if (!data.password) {
    errors.password = "Please enter a password.";
    return;
  }
  if (data.password.length < 6) {
    errors.password = "Password should be at least 6 characters long.";
  }
}


/**
 * Validates password confirmation matches the password.
 * @param {Object} data - Form data.
 * @param {Object} errors - Errors map to populate.
 */
function validatePasswordConfirm(data, errors) {
  if (!data.passwordConfirm) {
    errors.passwordConfirm = "Please confirm your password.";
    return;
  }
  if (data.password !== data.passwordConfirm) {
    errors.passwordConfirm = "Passwords do not match.";
  }
}


/**
 * Validates that the privacy checkbox is checked.
 * @param {HTMLInputElement} checkbox - Privacy checkbox.
 * @param {Object} errors - Errors map to populate.
 */
function validatePrivacy(checkbox, errors) {
  if (!checkbox || !checkbox.checked) {
    errors.privacy = "You must accept the Privacy Policy.";
  }
}


/**
 * Returns whether the errors object contains any keys.
 * @param {Object} errors - Errors map.
 * @returns {boolean}
 */
function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}


/**
 * Displays field-specific validation messages in the UI.
 * @param {Object} errors - Errors map.
 * @param {Object} ui - Signup UI elements.
 */
function showValidationErrors(errors, ui) {
  showNameError(errors, ui);
  showEmailError(errors, ui);
  showPasswordError(errors, ui);
  showPasswordConfirmError(errors, ui);
  showPrivacyError(errors);
}

/**
 * Shows name field error if present.
 */
function showNameError(errors, ui) {
  if (!errors.name) return;
  setFieldError(ui.nameInput, "error-signup-name", errors.name);
}


/**
 * Shows email field error if present.
 */
function showEmailError(errors, ui) {
  if (!errors.email) return;
  setFieldError(ui.emailInput, "error-signup-email", errors.email);
}


/**
 * Shows password field error if present.
 */
function showPasswordError(errors, ui) {
  if (!errors.password) return;
  setFieldError(ui.passwordInput, "error-signup-password", errors.password);
}


/**
 * Shows password confirmation error if present.
 */
function showPasswordConfirmError(errors, ui) {
  if (!errors.passwordConfirm) return;
  setFieldError(
    ui.passwordConfirmInput,
    "error-signup-password-confirm",
    errors.passwordConfirm
  );
}


/**
 * Shows privacy checkbox error message if present.
 * @param {Object} errors - Errors map.
 */
function showPrivacyError(errors) {
  if (!errors.privacy) return;
  const privacyErr = document.getElementById("error-signup-privacy");
  if (privacyErr) {
    privacyErr.textContent = errors.privacy;
  }
}


/**
 * Displays a general validation message in the error box.
 * @param {Object} ui - Signup UI elements.
 */
function showGlobalValidationMessage(ui) {
  if (!ui.errorBox) return;
  ui.errorBox.textContent = "Please correct the highlighted fields.";
}


/**
 * Clears all validation messages and error classes from the form.
 * @param {Object} ui - Signup UI elements.
 */
function clearFieldErrors(ui) {
  document
    .querySelectorAll(".input-error")
    .forEach((el) => (el.textContent = ""));
  document
    .querySelectorAll(".login-input")
    .forEach((el) => el.classList.remove("error"));
  if (ui.errorBox) {
    ui.errorBox.textContent = "";
  }
}


/**
 * Sets an error message for a specific field and marks the input.
 * @param {?HTMLElement} inputElement - Input element to mark.
 * @param {string} errorElementId - ID of the element to show message in.
 * @param {string} message - Error message.
 */
function setFieldError(inputElement, errorElementId, message) {
  const errEl = document.getElementById(errorElementId);
  if (errEl) {
    errEl.textContent = message;
  }
  if (inputElement) {
    inputElement.classList.add("error");
  }
}


/**
 * Submits signup data: checks for existing user and creates a new user.
 * @param {Object} data - Form data.
 * @param {Object} ui - Signup UI elements.
 */
async function submitSignup(data, ui) {
  if (ui.signupBtn) {
    setLoadingState(ui.signupBtn, true);

  }
  try {
    const existingUser = await findUserByEmail(data.email);
    if (existingUser) {
      handleExistingUser(ui);
      return;
    }
    const newUser = await saveNewUser(
      data.name,
      data.email,
      data.password
    );
    handleSignupSuccess(newUser);
  } catch (error) {
    handleSignupError(ui);
  } finally {
    if (ui.signupBtn) {
      setLoadingState(ui.signupBtn, false);
    }
  }
}


/**
 * Handles the case when a user already exists for the provided email.
 * @param {Object} ui - Signup UI elements.
 */
function handleExistingUser(ui) {
  setFieldError(
    ui.emailInput,
    "error-signup-email",
    "An account with this email already exists."
  );
  if (!ui.errorBox) return;
  ui.errorBox.textContent = "Please use another email address.";
}


/**
 * Finalizes signup success: shows a toast, stores session and redirects.
 * @param {Object} newUser - Newly created user object.
 */
function handleSignupSuccess(newUser) {
  showSignupToast();
  setTimeout(() => {
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    localStorage.setItem("isGuest", "false");
    window.location.href = "../index.html";
  }, 1200);
}


/**
 * Displays a generic signup error message.
 * @param {Object} ui - Signup UI elements.
 */
function handleSignupError(ui) {
  if (!ui.errorBox) return;
  ui.errorBox.textContent = "Sign up failed. Please try again later.";
}


/**
 * Toggles loading state on a button and updates its label.
 * @param {HTMLButtonElement} button - Button to modify.
 * @param {boolean} isLoading - Loading state flag.
 */
function setLoadingState(button, isLoading) {
  button.disabled = isLoading;
  button.textContent = isLoading ? "Signing up..." : "Sign up";
}


/**
 * Enables a button and applies the active class.
 * @param {HTMLButtonElement} button - Button to enable.
 */
function enableButton(button) {
  button.disabled = false;
  button.classList.add("active");
}


/**
 * Disables a button and removes the active class.
 * @param {HTMLButtonElement} button - Button to disable.
 */
function disableButton(button) {
  button.disabled = true;
  button.classList.remove("active");
}


/**
 * Shows a temporary signup toast notification.
 */
function showSignupToast() {
  const toast = document.getElementById("signup-toast");
  if (!toast) return;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.classList.add("hidden"), 300);
  }, 2000);
}