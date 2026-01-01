document.addEventListener('DOMContentLoaded', startLoginPage);


/**
 * Initializes the login page by setting up event handlers
 */
function startLoginPage() {
  setupNormalLoginForm();
  setupGuestLoginButton();
}


/**
 * Sets up the normal login form with submit handler
 */
function setupNormalLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;
  
  form.addEventListener('submit', handleLoginFormSubmit);
}


/**
 * Sets up the guest login button with click handler
 */
function setupGuestLoginButton() {
  const button = document.getElementById('guest-login-btn');
  if (!button) return;
  
  button.addEventListener('click', handleGuestLoginClick);
}


/**
 * Handles the login form submission
 * @param {Event} event - The form submit event
 */
function handleLoginFormSubmit(event) {
  event.preventDefault();
  const email = getInputValue('login-email');
  const password = getInputValue('login-password');
  
  if (!isLoginInputValid(email, password)) return;
  
  performUserLogin(email, password);
}


/**
 * Gets the trimmed value of an input element
 * @param {string} elementId - The ID of the input element
 * @returns {string} The trimmed input value
 */
function getInputValue(elementId) {
  const input = document.getElementById(elementId);
  return input ? input.value.trim() : '';
}


/**
 * Validates login input fields
 * @param {string} email - The email input value
 * @param {string} password - The password input value
 * @returns {boolean} True if inputs are valid
 */
function isLoginInputValid(email, password) {
  if (!email || !password) {
    displayErrorMessage('Please enter email and password.');
    return false;
  }
  return true;
}


/**
 * Performs user login with provided credentials
 * @param {string} email - User email
 * @param {string} password - User password
 */
function performUserLogin(email, password) {
  loginUser(email, password)
    .then(user => redirectToSummary(user, false))
    .catch(error => displayErrorMessage('Login failed: ' + error.message));
}


/**
 * Authenticates user by email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User object if authenticated
 */
function loginUser(email, password) {
  return getUserByEmail(email)
    .then(user => validateAndReturnUser(user, password));
}


/**
 * Validates user credentials and returns user object
 * @param {Object} user - User object from database
 * @param {string} password - Password to validate
 * @returns {Object} Validated user object
 */
function validateAndReturnUser(user, password) {
  checkUserExists(user);
  checkPasswordExists(user);
  checkPasswordMatches(user.password, password);
  return user;
}


/**
 * Checks if user exists in database
 * @param {Object} user - User object to check
 * @throws {Error} If user does not exist
 */
function checkUserExists(user) {
  if (!user) {
    throw new Error('No account found with this email.');
  }
}


/**
 * Checks if user has a password set
 * @param {Object} user - User object to check
 * @throws {Error} If password is not set
 */
function checkPasswordExists(user) {
  if (!user.password) {
    throw new Error('This account has no password set.');
  }
}


/**
 * Checks if provided password matches user password
 * @param {string} userPassword - Password from database
 * @param {string} inputPassword - Password from input
 * @throws {Error} If passwords do not match
 */
function checkPasswordMatches(userPassword, inputPassword) {
  if (userPassword !== inputPassword) {
    throw new Error('Wrong password.');
  }
}


/**
 * Handles guest login button click
 */
function handleGuestLoginClick() {
  getOrCreateGuestUser()
    .then(user => redirectToSummary(user, true))
    .catch(error => displayErrorMessage('Guest login failed: ' + error.message));
}


/**
 * Redirects to summary page after successful login
 * @param {Object} user - Authenticated user object
 * @param {boolean} isGuest - Whether user is guest
 */
function redirectToSummary(user, isGuest) {
  clearErrorMessage();
  saveUserToStorage(user);
  saveGuestStatus(isGuest);
  navigateToSummaryPage();
}


/**
 * Saves user object to localStorage
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
 * Navigates to summary page
 */
function navigateToSummaryPage() {
  window.location.href = '../html/summary.html';
}


/**
 * Displays error message to user
 * @param {string} message - Error message to display
 */
function displayErrorMessage(message) {
  const errorBox = document.getElementById('login-error-message');
  if (errorBox) {
    errorBox.textContent = message;
  } else {
    alert(message);
  }
}


/**
 * Clears displayed error message
 */
function clearErrorMessage() {
  const errorBox = document.getElementById('login-error-message');
  if (errorBox) {
    errorBox.textContent = '';
  }
}