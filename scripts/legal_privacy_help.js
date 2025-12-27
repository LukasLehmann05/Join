function redirectBack() {
    let referrer = document.referrer;
    if (referrer) {
        window.location.href = referrer;
    } else {
        
        window.location.href = '/';
    }
}