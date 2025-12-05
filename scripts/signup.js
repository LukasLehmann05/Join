// signup.js

document.addEventListener("DOMContentLoaded", () => {
    const checkbox = document.getElementById("privacy-checkbox");
    const signupBtn = document.getElementById("signup-btn");
    const signupForm = document.getElementById("signup-form");

    const nameInput = document.getElementById("signup-name");
    const emailInput = document.getElementById("signup-email");
    const passwordInput = document.getElementById("signup-password");
    const passwordConfirmInput = document.getElementById("signup-password-confirm");
    const errorBox = document.getElementById("signup-error-message");

    function showSignupToast() {
        const toast = document.getElementById("signup-toast");
        if (!toast) return;

        toast.classList.remove("hidden");

        setTimeout(() => {
            toast.classList.add("show");
        }, 10);

        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.classList.add("hidden"), 300);
        }, 2000);
    }

    function clearFieldErrors() {
        document.querySelectorAll(".input-error").forEach(el => el.textContent = "");
        document.querySelectorAll(".login-input").forEach(el => el.classList.remove("error"));
        if (errorBox) errorBox.textContent = "";
    }

    function setFieldError(inputElement, errorElementId, message) {
        const errEl = document.getElementById(errorElementId);
        if (errEl) errEl.textContent = message;
        if (inputElement) inputElement.classList.add("error");
    }

    // Checkbox steuert Button aktiv/deaktiv
    if (checkbox && signupBtn) {
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                signupBtn.disabled = false;
                signupBtn.classList.add("active");
                const privacyErr = document.getElementById("error-signup-privacy");
                if (privacyErr) privacyErr.textContent = "";
            } else {
                signupBtn.disabled = true;
                signupBtn.classList.remove("active");
            }
        });
    }

    if (!signupForm) {
        console.warn("Signup-Form nicht gefunden.");
        return;
    }

    // Form-Submit -> User registrieren
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearFieldErrors();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const passwordConfirm = passwordConfirmInput.value;

        let hasError = false;

        // Name
        if (!name) {
            setFieldError(nameInput, "error-signup-name", "Please enter your name.");
            hasError = true;
        }

        // Email
        if (!email) {
            setFieldError(emailInput, "error-signup-email", "Please enter your email.");
            hasError = true;
        } else if (!email.includes("@")) {
            setFieldError(emailInput, "error-signup-email", "Please enter a valid email.");
            hasError = true;
        }

        // Passwort
        if (!password) {
            setFieldError(passwordInput, "error-signup-password", "Please enter a password.");
            hasError = true;
        } else if (password.length < 6) {
            setFieldError(passwordInput, "error-signup-password", "Password should be at least 6 characters long.");
            hasError = true;
        }

        // Passwort-Bestätigung
        if (!passwordConfirm) {
            setFieldError(passwordConfirmInput, "error-signup-password-confirm", "Please confirm your password.");
            hasError = true;
        } else if (password !== passwordConfirm) {
            setFieldError(passwordConfirmInput, "error-signup-password-confirm", "Passwords do not match.");
            hasError = true;
        }

        // Privacy-Checkbox
        if (!checkbox || !checkbox.checked) {
            const privacyErr = document.getElementById("error-signup-privacy");
            if (privacyErr) privacyErr.textContent = "You must accept the Privacy Policy.";
            hasError = true;
        }

        if (hasError) {
            if (errorBox) {
                errorBox.textContent = "Please correct the highlighted fields.";
            }
            return;
        }

        // Ab hier: Validierung ok -> Button blocken, Request ausführen
        if (signupBtn) {
            signupBtn.disabled = true;
            signupBtn.textContent = "Signing up...";
        }

        try {
            // Prüfen, ob E-Mail schon existiert
            const existingUser = await getUserByEmail(email);
            if (existingUser) {
                setFieldError(emailInput, "error-signup-email", "An account with this email already exists.");
                if (errorBox) errorBox.textContent = "Please use another email address.";
                if (signupBtn) {
                    signupBtn.disabled = false;
                    signupBtn.textContent = "Sign up";
                }
                return;
            }

            const newUser = await createUserInDB(name, email, password);
            console.log("New user created:", newUser);

            showSignupToast();

            setTimeout(() => {
                localStorage.setItem("currentUser", JSON.stringify(newUser));
                localStorage.setItem("isGuest", "false");

                window.location.href = "../html/summary.html";
            }, 1200);
        } catch (error) {
            console.error("Sign up failed:", error);
            if (errorBox) {
                errorBox.textContent = "Sign up failed. Please try again later.";
            }
            if (signupBtn) {
                signupBtn.disabled = false;
                signupBtn.textContent = "Sign up";
            }
        }
    });
});
