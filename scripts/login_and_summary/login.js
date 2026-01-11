document.addEventListener('DOMContentLoaded', initLogin);

/**
 * Initializes login page event handlers.
 * Sets up normal and guest login flows when DOM is ready.
 */
function initLogin() {
  setupNormalLogin();
  setupGuestLogin();
}


/**
 * Attaches submit handler for the normal login form.
 * Binds form submit to `onLoginSubmit` and passes input elements.
 */
function setupNormalLogin() {
  const form = document.getElementById('login-form');
  const email = document.getElementById('login-email');
  const password = document.getElementById('login-password');
  const errorBox = document.getElementById('login-error-message');
  if (!form || !email || !password) {
    return;
  }
  form.addEventListener('submit', (event) => {
    onLoginSubmit(event, email, password, errorBox);
  });
}


/**
 * Attaches click handler for guest login button.
 * When clicked, triggers `onGuestClick` to perform guest login.
 */
function setupGuestLogin() {
  const guestBtn = document.getElementById('guest-login-btn');
  const errorBox = document.getElementById('login-error-message');
  if (!guestBtn) {
    return;
  }
  guestBtn.addEventListener('click', () => {
    onGuestClick(errorBox);
  });
}


/**
 * Displays an error message either in `errorBox` element or via `alert`.
 * @param {?HTMLElement} errorBox - Element to render the message into.
 * @param {string} msg - Message to show.
 */
function showError(errorBox, msg) {
  if (errorBox) {
    errorBox.textContent = msg;
    return;
  }
  alert(msg);
}


/**
 * Clears an error message from the provided `errorBox` element.
 * @param {?HTMLElement} errorBox - Element to clear the message from.
 */
function clearError(errorBox) {
  if (errorBox) {
    errorBox.textContent = '';
  }
}


/**
 * Validates presence of email and password values.
 * Shows an error if either value is missing.
 * @param {string} email - Email value to validate.
 * @param {string} password - Password value to validate.
 * @param {?HTMLElement} errorBox - Element to show validation errors.
 * @returns {boolean} True if inputs are valid.
 */
function validateLoginInputs(email, password, errorBox) {
  if (!email || !password) {
    showError(errorBox, 'Please enter email and password.');
    return false;
  }
  return true;
}


/**
 * Handles normal login form submission: prevents default, validates
 * inputs and starts the login process.
 * @param {Event} event - Submit event.
 * @param {HTMLInputElement} emailInput - Email input element.
 * @param {HTMLInputElement} passwordInput - Password input element.
 * @param {?HTMLElement} errorBox - Element to display errors.
 */
function onLoginSubmit(event, emailInput, passwordInput, errorBox) {
  event.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!validateLoginInputs(email, password, errorBox)) {
    return;
  }
  handleLogin(email, password, errorBox);
}


/**
 * Attempts to authenticate a user with provided credentials and
 * handles success or failure.
 * @param {string} email - User email.
 * @param {string} password - User password.
 * @param {?HTMLElement} errorBox - Element to display errors.
 */
function handleLogin(email, password, errorBox) {
  loginUser(email, password)
    .then((user) => {
      handleLoginSuccess(user, false, errorBox);
    })
    .catch((error) => {
      showError(errorBox, 'Login failed: ' + error.message);
    });
}


/**
 * Finds a user by email and validates their password.
 * @param {string} email - Email to search for.
 * @param {string} password - Password to validate.
 * @returns {Promise<Object>} Resolved user object if valid.
 */
function loginUser(email, password) {
  return findUserByEmail(email).then((user) => {
    validateUserCredentials(user, password);
    return user;
  });
}


/**
 * Validates retrieved user object against provided password and
 * throws descriptive errors on mismatch or missing data.
 * @param {?Object} user - User object retrieved from storage.
 * @param {string} password - Password to check.
 */
function validateUserCredentials(user, password) {
  if (!user) {
    throw new Error('No account found with this email.');
  }
  if (!user.password) {
    throw new Error('This account has no password set.');
  }
  if (user.password !== password) {
    throw new Error('Wrong password.');
  }
}


/**
 * Finalizes login by clearing errors, saving session info and
 * redirecting to the summary page.
 * @param {Object} user - Authenticated user object.
 * @param {boolean} isGuest - Whether the login is a guest login.
 * @param {?HTMLElement} errorBox - Element to clear errors from.
 */
function handleLoginSuccess(user, isGuest, errorBox) {
  clearError(errorBox);
  localStorage.setItem('currentUser', JSON.stringify(user));
  localStorage.setItem('isGuest', String(isGuest));
  sessionStorage.setItem("visiting", "true");
  window.location.href = '../html/summary.html';
}


/**
 * Handles guest login button click: loads or creates a guest user
 * and advances to the logged-in state.
 * @param {?HTMLElement} errorBox - Element to show errors.
 */
function onGuestClick(errorBox) {
  loadOrCreateGuest()
    .then((guestUser) => {
      handleLoginSuccess(guestUser, true, errorBox);
    })
    .catch((error) => {
      showError(errorBox, 'Guest login failed: ' + error.message);
    });
}


/**
 * Saves data to Firebase and returns with ID
 * @param {string} path - Firebase path
 * @param {Object} payload - Data to save
 * @param {string} errorMessage - Error message prefix
 * @returns {Promise<Object>} Saved data with ID
 */
async function saveDataToFirebase(payload, errorMessage) {
  const responseData = await sendDataToUrl(payload, errorMessage);
  const generatedId = responseData.name;
  return { id: generatedId, ...payload };
}


/**
 * Converts data to array format
 * @param {Object|Array} data - Data to convert
 * @returns {Array} Converted array
 */
function convertToArray(data) {
  return Array.isArray(data) ? data : Object.values(data);
}


/**
 * Loads all users from database
 * @returns {Promise<Object>} All users object
 */
async function loadAllUsers() {
  const url = buildFirebaseUrl('users');
  return await fetchDataFromUrl(url, 'Error loading users');
}


/**
 * Finds user by email address
 * @param {string} email - Email to search for
 * @returns {Promise<Object|null>} User object or null
 */
async function findUserByEmail(email) {
  const allUsers = (await fetchAllDataGlobal()).users;
  for (const userId in allUsers) {
    const user = allUsers[userId];
    if (!user || !user.email) continue;

    if (isEmailMatch(user.email, email)) {
      return { id: userId, ...user };
    }
  }
  return null;
}


/**
 * Checks if emails match (case-insensitive)
 * @param {string} userEmail - User's email
 * @param {string} searchEmail - Email to compare
 * @returns {boolean} True if emails match
 */
function isEmailMatch(userEmail, searchEmail) {
  return userEmail.toLowerCase() === searchEmail.toLowerCase();
}


/**
 * Creates user object with metadata
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} User object
 */
function createUserObject(name, email, password) {
  return {
    name,
    email,
    password,
    role: 'user',
    createdAt: new Date().toISOString(),
  };
}


/**
 * Creates guest user object
 * @returns {Object} Guest user object
 */
function createGuestObject() {
  return {
    name: 'Guest',
    email: 'guest@example.com',
    role: 'guest',
    createdAt: new Date().toISOString(),
  };
}


/**
 * Saves new user to database
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Created user with ID
 */
async function saveNewUser(name, email, password) {
  const userData = createUserObject(name, email, password);
  let newUser = createNewContactInSignUp(name, email);
  await postNewContactToDatabase(newUser)
  return await saveDataToFirebase(userData, 'Error creating user');
}


/**
 * Saves new guest user to database
 * @returns {Promise<Object>} Created guest user with ID
 */
async function saveNewGuest() {
  const guestData = createGuestObject();
  return await saveDataToFirebase(guestData, 'Error creating guest user');
}


/**
 * Searches for guest user in users object
 * @param {Object} allUsers - All users object
 * @returns {Object|null} Guest user or null
 */
function searchGuestInUsers(allUsers) {
  for (const userId in allUsers) {
    const user = allUsers[userId];
    if (user && user.role === 'guest') {
      return { id: userId, ...user };
    }
  }
  return null;
}


/**
 * Loads existing guest or creates new one
 * @returns {Promise<Object>} Guest user object
 */
async function loadOrCreateGuest() {
  const allUsers = (await fetchAllDataGlobal()).users;
  const existingGuest = searchGuestInUsers(allUsers);

  if (existingGuest) {
    return existingGuest;
  }
  return await saveNewGuest();
}

