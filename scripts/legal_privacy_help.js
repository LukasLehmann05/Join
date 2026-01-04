/**
 * function to send user back to referrer site
 */
function redirectBack() {
    let referrer = document.referrer;
    if (document.referrer.includes("help.html")) {
        window.location.href = '../html/board.html';
    } else {
        window.location.href = referrer;
    }
};