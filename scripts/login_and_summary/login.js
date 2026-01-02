document.addEventListener('DOMContentLoaded', initLogin);

function initLogin() {
  setupNormalLogin();
  setupGuestLogin();
}

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

function showError(errorBox, msg) {
  if (errorBox) {
    errorBox.textContent = msg;
    return;
  }
  alert(msg);
}

function clearError(errorBox) {
  if (errorBox) {
    errorBox.textContent = '';
  }
}

function validateLoginInputs(email, password, errorBox) {
  if (!email || !password) {
    showError(errorBox, 'Please enter email and password.');
    return false;
  }
  return true;
}

function onLoginSubmit(event, emailInput, passwordInput, errorBox) {
  event.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!validateLoginInputs(email, password, errorBox)) {
    return;
  }
  handleLogin(email, password, errorBox);
}

function handleLogin(email, password, errorBox) {
  loginUser(email, password)
    .then((user) => {
      handleLoginSuccess(user, false, errorBox);
    })
    .catch((error) => {
      showError(errorBox, 'Login failed: ' + error.message);
    });
}

function loginUser(email, password) {
  return findUserByEmail(email).then((user) => {
    validateUserCredentials(user, password);
    return user;
  });
}

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

function handleLoginSuccess(user, isGuest, errorBox) {
  clearError(errorBox);
  localStorage.setItem('currentUser', JSON.stringify(user));
  localStorage.setItem('isGuest', String(isGuest));
  window.location.href = '../html/summary.html';
}

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
 * Sends data to URL via POST
 * @param {string} url - URL to send to
 * @param {Object} payload - Data to send
 * @param {string} errorMessage - Error message prefix
 * @returns {Promise<Object>} Response data
 */
async function sendDataToUrl(url, payload, errorMessage) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    throw new Error(`${errorMessage}: ${response.status}`);
  }
  
  return await response.json();
}


/**
 * Saves data to Firebase and returns with ID
 * @param {string} path - Firebase path
 * @param {Object} payload - Data to save
 * @param {string} errorMessage - Error message prefix
 * @returns {Promise<Object>} Saved data with ID
 */
async function saveDataToFirebase(path, payload, errorMessage) {
  const url = buildFirebaseUrl(path);
  
  const responseData = await sendDataToUrl(url, payload, errorMessage);
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
  console.log(email);
  
  for (const userId in allUsers) {
    
    const user = allUsers[userId];
    
    console.log(user.email);
    
    
    if (!user || !user.email) continue;
    
    if (isEmailMatch(user.email, email)) {
      //return { id: userId, ...user };
    }
  }
  
  //return null;
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
  return await saveDataToFirebase('users', userData, 'Error creating user');
}


/**
 * Saves new guest user to database
 * @returns {Promise<Object>} Created guest user with ID
 */
async function saveNewGuest() {
  const guestData = createGuestObject();
  return await saveDataToFirebase('users', guestData, 'Error creating guest user');
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
  
  
  
  //return await saveNewGuest();
}


// Aliases für Abwärtskompatibilität
//const getUserByEmail = findUserByEmail;
//const createUserInDB = saveNewUser;
const getOrCreateGuestUser = loadOrCreateGuest;