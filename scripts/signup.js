document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('privacy-checkbox');
    const signupBtn = document.getElementById('signup-btn');

    function updateButtonState() {
        signupBtn.disabled = !checkbox.checked;
    }

    updateButtonState();

    checkbox.addEventListener('change', updateButtonState);
});
