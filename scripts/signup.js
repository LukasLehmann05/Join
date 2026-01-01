document.addEventListener('DOMContentLoaded', startSignupPage);


/**
 * Initializes the signup page by setting up event handlers
 */
function startSignupPage() {
  setupPrivacyCheckbox();
  setupSignupForm();
}


/**
 * Sets up privacy checkbox with change and keydown handlers
 */
function setupPrivacyCheckbox() {
  const checkbox = document.getElementById('privacy-checkbox');
  if (!checkbox) return;
  
  checkbox.addEventListener('change', handlePrivacyCheckboxChange);
  checkbox.addEventListener('keydown', handlePrivacyCheckboxKeyPress);
}


/**
 * Handles privacy checkbox change event
 */
function handlePrivacyCheckboxChange() {
  const checkbox = document.getElementById('privacy-checkbox');
  const button = document.getElementById('signup-btn');
  
  if (checkbox.checked) {
    enableSignupButton(button);
    clearPrivacyError();
  } else {
    disableSignupButton(button);
  }
}


/**
 * Handles privacy checkbox keypress event
 * @param {KeyboardEvent} event - The keyboard event
 */
function handlePrivacyCheckboxKeyPress(event) {
  if (event.key !== 'Enter') return;
  
  event.preventDefault();
  toggleCheckbox(event.target);
}


/**
 * Toggles checkbox state
 * @param {HTMLInputElement} checkbox - The checkbox element
 */
function toggleCheckbox(checkbox) {
  checkbox.checked = !checkbox.checked;
  checkbox.dispatchEvent(new Event('change'));
}


/**
 * Enables the signup button
 * @param {HTMLButtonElement} button - The button to enable
 */
function enableSignupButton(button) {
  if (!button) return;
  button.disabled = false;
  button.classList.add('active');
}


/**
 * Disables the signup button
 * @param {HTMLButtonElement} button - The button to disable
 */
function disableSignupButton(button) {
  if (!button) return;
  button.disabled = true;
  button.classList.remove('active');
}


/**
 * Clears privacy policy error message
 */
function clearPrivacyError() {
  const errorElement = document.getElementById('error-signup-privacy');
  if (errorElement) {
    errorElement.textContent = '';
  }
}


/**
 * Sets up signup form with submit handler
 */
function setupSignupForm() {
  const form = document.getElementById('signup-form');
  if (!form) return;
  
  form.addEventListener('submit', handleSignupFormSubmit);
}


/**
 * Handles signup form submission
 * @param {Event} event - The form submit event
 */
function handleSignupFormSubmit(event) {
  event.preventDefault();
  clearAllFieldErrors();
  
  const formData = collectFormData();
  const errors = validateAllFields(formData);
  
  if (hasValidationErrors(errors)) {
    showAllErrors(errors);
    return;
  }
  
  submitSignupData(formData);
}


/**
 * Collects form data from input fields
 * @returns {Object} Form data object
 */
function collectFormData() {
  return {
    name: getInputValue('signup-name'),
    email: getInputValue('signup-email'),
    password: getPasswordValue('signup-password'),
    passwordConfirm: getPasswordValue('signup-password-confirm')
  };
}


/**
 * Gets trimmed value from input element
 * @param {string} elementId - The input element ID
 * @returns {string} Trimmed input value
 */
function getInputValue(elementId) {
  const input = document.getElementById(elementId);
  return input ? input.value.trim() : '';
}


/**
 * Gets password value from input element
 * @param {string} elementId - The input element ID
 * @returns {string} Password value
 */
function getPasswordValue(elementId) {
  const input = document.getElementById(elementId);
  return input ? input.value : '';
}


/**
 * Validates all form fields
 * @param {Object} data - Form data to validate
 * @returns {Object} Validation errors object
 */
function validateAllFields(data) {
  const errors = {};
  
  validateNameField(data.name, errors);
  validateEmailField(data.email, errors);
  validatePasswordField(data.password, errors);
  validatePasswordConfirmField(data.password, data.passwordConfirm, errors);
  validatePrivacyAcceptance(errors);
  
  return errors;
}


/**
 * Validates name field
 * @param {string} name - Name to validate
 * @param {Object} errors - Errors object to populate
 */
function validateNameField(name, errors) {
  if (!name) {
    errors.name = 'Please enter your name.';
  }
}


/**
 * Validates email field
 * @param {string} email - Email to validate
 * @param {Object} errors - Errors object to populate
 */
function validateEmailField(email, errors) {
  if (!email) {
    errors.email = 'Please enter your email.';
    return;
  }
  
  if (!isEmailFormatValid(email)) {
    errors.email = 'Please enter a valid email.';
  }
}


/**
 * Checks if email format is valid
 * @param {string} email - Email to check
 * @returns {boolean} True if email format is valid
 */
function isEmailFormatValid(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}


/**
 * Validates password field
 * @param {string} password - Password to validate
 * @param {Object} errors - Errors object to populate
 */
function validatePasswordField(password, errors) {
  if (!password) {
    errors.password = 'Please enter a password.';
    return;
  }
  
  if (password.length < 6) {
    errors.password = 'Password should be at least 6 characters long.';
  }
}


/**
 * Validates password confirmation field
 * @param {string} password - Original password
 * @param {string} confirm - Confirmation password
 * @param {Object} errors - Errors object to populate
 */
function validatePasswordConfirmField(password, confirm, errors) {
  if (!confirm) {
    errors.passwordConfirm = 'Please confirm your password.';
    return;
  }
  
  if (password !== confirm) {
    errors.passwordConfirm = 'Passwords do not match.';
  }
}


/**
 * Validates privacy policy acceptance
 * @param {Object} errors - Errors object to populate
 */
function validatePrivacyAcceptance(errors) {
  const checkbox = document.getElementById('privacy-checkbox');
  
  if (!checkbox || !checkbox.checked) {
    errors.privacy = 'You must accept the Privacy Policy.';
  }
}


/**
 * Checks if validation errors exist
 * @param {Object} errors - Errors object to check
 * @returns {boolean} True if errors exist
 */
function hasValidationErrors(errors) {
  return Object.keys(errors).length > 0;
}


/**
 * Displays all validation errors
 * @param {Object} errors - Errors object with messages
 */
function showAllErrors(errors) {
  if (errors.name) showNameError(errors.name);
  if (errors.email) showEmailError(errors.email);
  if (errors.password) showPasswordError(errors.password);
  if (errors.passwordConfirm) showPasswordConfirmError(errors.passwordConfirm);
  if (errors.privacy) showPrivacyError(errors.privacy);
  
  showGlobalError('Please correct the highlighted fields.');
}


/**
 * Shows name field error
 * @param {string} message - Error message
 */
function showNameError(message) {
  showFieldError('signup-name', 'error-signup-name', message);
}


/**
 * Shows email field error
 * @param {string} message - Error message
 */
function showEmailError(message) {
  showFieldError('signup-email', 'error-signup-email', message);
}


/**
 * Shows password field error
 * @param {string} message - Error message
 */
function showPasswordError(message) {
  showFieldError('signup-password', 'error-signup-password', message);
}


/**
 * Shows password confirmation error
 * @param {string} message - Error message
 */
function showPasswordConfirmError(message) {
  showFieldError('signup-password-confirm', 'error-signup-password-confirm', message);
}


/**
 * Shows privacy policy error
 * @param {string} message - Error message
 */
function showPrivacyError(message) {
  const errorElement = document.getElementById('error-signup-privacy');
  if (errorElement) {
    errorElement.textContent = message;
  }
}


/**
 * Shows field-specific error
 * @param {string} inputId - Input element ID
 * @param {string} errorId - Error element ID
 * @param {string} message - Error message
 */
function showFieldError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const errorElement = document.getElementById(errorId);
  
  if (input) input.classList.add('error');
  if (errorElement) errorElement.textContent = message;
}


/**
 * Shows global error message
 * @param {string} message - Error message
 */
function showGlobalError(message) {
  const errorBox = document.getElementById('signup-error-message');
  if (errorBox) {
    errorBox.textContent = message;
  }
}


/**
 * Clears all field errors
 */
function clearAllFieldErrors() {
  clearErrorTexts();
  clearErrorStyles();
  clearGlobalError();
}


/**
 * Clears all error text messages
 */
function clearErrorTexts() {
  const errorElements = document.querySelectorAll('.input-error');
  errorElements.forEach(element => element.textContent = '');
}


/**
 * Clears error styling from inputs
 */
function clearErrorStyles() {
  const inputs = document.querySelectorAll('.login-input');
  inputs.forEach(input => input.classList.remove('error'));
}


/**
 * Clears global error message
 */
function clearGlobalError() {
  const errorBox = document.getElementById('signup-error-message');
  if (errorBox) {
    errorBox.textContent = '';
  }
}


/**
 * Submits signup data to server
 * @param {Object} data - Form data to submit
 */
async function submitSignupData(data) {
  const button = document.getElementById('signup-btn');
  setButtonLoadingState(button, true);
  
  try {
    const existingUser = await getUserByEmail(data.email);
    
    if (existingUser) {
      handleEmailAlreadyExists();
      return;
    }
    
    const newUser = await createUserInDB(data.name, data.email, data.password);
    handleSignupSuccess(newUser);
    
  } catch (error) {
    handleSignupFailure();
  } finally {
    setButtonLoadingState(button, false);
  }
}


/**
 * Sets button loading state
 * @param {HTMLButtonElement} button - Button element
 * @param {boolean} isLoading - Loading state
 */
function setButtonLoadingState(button, isLoading) {
  if (!button) return;
  
  button.disabled = isLoading;
  button.textContent = isLoading ? 'Signing up...' : 'Sign up';
}


/**
 * Handles existing email error
 */
function handleEmailAlreadyExists() {
  showEmailError('An account with this email already exists.');
  showGlobalError('Please use another email address.');
}


/**
 * Handles successful signup
 * @param {Object} user - Created user object
 */
function handleSignupSuccess(user) {
  showSuccessToast();
  
  setTimeout(() => {
    navigateToLoginPage();
  }, 1200);
}


/**
 * Handles signup failure
 */
function handleSignupFailure() {
  showGlobalError('Sign up failed. Please try again later.');
}


/**
 * Shows success toast notification
 */
function showSuccessToast() {
  const toast = document.getElementById('signup-toast');
  if (!toast) return;
  
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('show'), 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, 2000);
}


/**
 * Saves user to localStorage
 * @param {Object} user - User object to save
 */
function saveUserToStorage(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}


/**
 * Saves guest status to localStorage
 * @param {boolean} isGuest - Guest status
 */
function saveGuestStatus(isGuest) {
  localStorage.setItem('isGuest', String(isGuest));
}


/**
 * Navigates to login page
 */
function navigateToLoginPage() {
  window.location.href = '../html/login.html';
}