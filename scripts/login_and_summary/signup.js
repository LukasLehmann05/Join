document.addEventListener("DOMContentLoaded", initSignup);

function initSignup() {
  const ui = getSignupElements();
  if (!ui.form) {
    return;
  }
  attachPrivacyCheckboxHandler(ui);
  attachSignupHandler(ui);
}

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

function attachPrivacyCheckboxHandler(ui) {

  if (!ui.checkbox || !ui.signupBtn) return;

  ui.checkbox.addEventListener("change", () => {
    handleCheckboxChange(ui);
  });

  ui.checkbox.addEventListener("keydown", (e) => {
    handleCheckboxKeydown(e, ui);
  });
}

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

function handleCheckboxKeydown(e, ui) {
  if (e.key !== "Enter") {
    return;
  }
  e.preventDefault();
  ui.checkbox.checked = !ui.checkbox.checked;
  ui.checkbox.dispatchEvent(new Event("change"));
}

function attachSignupHandler(ui) {
  ui.form.addEventListener("submit", (event) => {
    event.preventDefault();
    handleSignupSubmit(ui);
  });
}

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

function getFormData(ui) {
  return {
    name: ui.nameInput.value.trim(),
    email: ui.emailInput.value.trim(),
    password: ui.passwordInput.value,
    passwordConfirm: ui.passwordConfirmInput.value,
  };
}

function validateSignupData(data, checkbox) {
  const errors = {};
  validateName(data, errors);
  validateEmail(data, errors);
  validatePassword(data, errors);
  validatePasswordConfirm(data, errors);
  validatePrivacy(checkbox, errors);
  return errors;
}

function validateName(data, errors) {
  if (!data.name) {
    errors.name = "Please enter your name.";
  }
}

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

function validatePassword(data, errors) {
  if (!data.password) {
    errors.password = "Please enter a password.";
    return;
  }
  if (data.password.length < 6) {
    errors.password = "Password should be at least 6 characters long.";
  }
}

function validatePasswordConfirm(data, errors) {
  if (!data.passwordConfirm) {
    errors.passwordConfirm = "Please confirm your password.";
    return;
  }
  if (data.password !== data.passwordConfirm) {
    errors.passwordConfirm = "Passwords do not match.";
  }
}

function validatePrivacy(checkbox, errors) {
  if (!checkbox || !checkbox.checked) {
    errors.privacy = "You must accept the Privacy Policy.";
  }
}

function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}

function showValidationErrors(errors, ui) {
  showNameError(errors, ui);
  showEmailError(errors, ui);
  showPasswordError(errors, ui);
  showPasswordConfirmError(errors, ui);
  showPrivacyError(errors);
}

function showNameError(errors, ui) {
  if (!errors.name) return;
  setFieldError(ui.nameInput, "error-signup-name", errors.name);
}

function showEmailError(errors, ui) {
  if (!errors.email) return;
  setFieldError(ui.emailInput, "error-signup-email", errors.email);
}

function showPasswordError(errors, ui) {
  if (!errors.password) return;
  setFieldError(ui.passwordInput, "error-signup-password", errors.password);
}

function showPasswordConfirmError(errors, ui) {
  if (!errors.passwordConfirm) return;
  setFieldError(
    ui.passwordConfirmInput,
    "error-signup-password-confirm",
    errors.passwordConfirm
  );
}

function showPrivacyError(errors) {
  if (!errors.privacy) return;
  const privacyErr = document.getElementById("error-signup-privacy");
  if (privacyErr) {
    privacyErr.textContent = errors.privacy;
  }
}

function showGlobalValidationMessage(ui) {
  if (!ui.errorBox) return;
  ui.errorBox.textContent = "Please correct the highlighted fields.";
}

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

function setFieldError(inputElement, errorElementId, message) {
  const errEl = document.getElementById(errorElementId);
  if (errEl) {
    errEl.textContent = message;
  }
  if (inputElement) {
    inputElement.classList.add("error");
  }
}

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

function handleExistingUser(ui) {
  setFieldError(
    ui.emailInput,
    "error-signup-email",
    "An account with this email already exists."
  );
  if (!ui.errorBox) return;
  ui.errorBox.textContent = "Please use another email address.";
}

function handleSignupSuccess(newUser) {
  showSignupToast();
  setTimeout(() => {
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    localStorage.setItem("isGuest", "false");
    window.location.href = "../index.html";
  }, 1200);
}

function handleSignupError(ui) {
  if (!ui.errorBox) return;
  ui.errorBox.textContent = "Sign up failed. Please try again later.";
}

function setLoadingState(button, isLoading) {
  button.disabled = isLoading;
  button.textContent = isLoading ? "Signing up..." : "Sign up";
}

function enableButton(button) {
  button.disabled = false;
  button.classList.add("active");
}

function disableButton(button) {
  button.disabled = true;
  button.classList.remove("active");
}

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