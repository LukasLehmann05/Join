// signup.js

document.addEventListener("DOMContentLoaded", () => {
    const checkbox = document.getElementById("privacy-checkbox");
    const signupBtn = document.getElementById("signup-btn");
    const signupForm = document.querySelector(".login-form");

    const nameInput = document.getElementById("signup-name");
    const emailInput = document.getElementById("signup-email");
    const passwordInput = document.getElementById("signup-password");
    const passwordConfirmInput = document.getElementById("signup-password-confirm");

    // Checkbox steuert Button aktiv/deaktiv
    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            signupBtn.disabled = false;
            signupBtn.classList.add("active");
        } else {
            signupBtn.disabled = true;
            signupBtn.classList.remove("active");
        }
    });

    // Form-Submit -> User registrieren
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const passwordConfirm = passwordConfirmInput.value;

        // Sicherheitsnetz: Checkbox prüfen
        if (!checkbox.checked) {
            alert("Please accept the Privacy policy to continue.");
            return;
        }

        // Basis-Validierung
        if (!name || !email || !password || !passwordConfirm) {
            alert("Please fill in all fields.");
            return;
        }

        if (password.length < 6) {
            alert("Password should be at least 6 characters long.");
            return;
        }

        if (password !== passwordConfirm) {
            alert("Passwords do not match.");
            return;
        }

        try {
            // Prüfen, ob E-Mail schon existiert
            const existingUser = await getUserByEmail(email);
            if (existingUser) {
                alert("An account with this email already exists.");
                return;
            }

            // Neuen User in der DB anlegen
            const newUser = await createUserInDB(name, email, password);
            console.log("New user created:", newUser);

            if (!newUser) {
                alert("User could not be created.");
                return;
            }

            // Direkt einloggen
            localStorage.setItem("currentUser", JSON.stringify(newUser));
            localStorage.setItem("isGuest", "false");

            // Weiterleitung zur Summary
            window.location.href = "../html/summary.html";
        } catch (error) {
            console.error("Sign up failed:", error);
            alert("Sign up failed: " + error.message);
        }
    });
});
