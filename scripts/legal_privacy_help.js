/**
 * function to send user back to referrer site
 */
function redirectBack() {
    let referrer = document.referrer;
    if (referrer) {
        window.location.href = referrer;
    } else {
        window.location.href = '../board.html';
    }
};