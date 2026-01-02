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
  return getUserByEmail(email).then((user) => {
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
  getOrCreateGuestUser()
    .then((guestUser) => {
      handleLoginSuccess(guestUser, true, errorBox);
    })
    .catch((error) => {
      showError(errorBox, 'Guest login failed: ' + error.message);
    });
}