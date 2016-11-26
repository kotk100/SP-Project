
document.addEventListener("DOMContentLoaded", function(event) {
    var element = document.getElementById('Email');
    if(element) element.addEventListener('keydown', validateEmail);

    element = document.getElementById('Username');
    if(element) element.addEventListener('keydown', validateUsername);

    element = document.getElementById('password');
    if(element) element.addEventListener('keydown', validatePassword);

    element = document.getElementById('passwordc');
    if(element) element.addEventListener('keydown', validatePassword);

    element = document.getElementById('terms');
    if(element) element.addEventListener('change', termsOfService);
});

function validateEmail(event) {
    var re = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    if(re.test(event.target.value))
        event.target.className = 'valid-true';
    else
        event.target.className = 'valid-false';
}

function termsOfService(el) {
    document.getElementById('submitDis').disabled = !el.target.checked;
}

function validateUsername(event) {
    var re = /(?=.{4,20}$)[a-zA-Z0-9]+([-_\.][a-zA-Z0-9]+)*[a-zA-Z0-9]/;
    if(re.test(event.target.value))
        event.target.className = 'valid-true';
    else
        event.target.className = 'valid-false';
}

function confirmPassword(event) {
    if (event.target.value != document.getElementById('password').value) {
        event.target.setCustomValidity('The two passwords must match.');
    } else {
        // event.target is valid -- reset the error message
        event.target.setCustomValidity('');
    }
}

function validatePassword(event) {
    var re = /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/;
    if(re.test(event.target.value))
        event.target.className = 'valid-true';
    else
        event.target.className = 'valid-false';
}