function validateEmail(input) {
    var re = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    if(re.test(input.value))
        input.className = 'valid-true';
    else
        input.className = 'valid-false';
}

function termsOfService(el) {
    document.getElementById('submitDis').disabled = !el.checked;
}

function validateUsername(input) {
    var re = /(?=.{4,20}$)[a-zA-Z0-9]+([-_\.][a-zA-Z0-9]+)*[a-zA-Z0-9]/;
    if(re.test(input.value))
        input.className = 'valid-true';
    else
        input.className = 'valid-false';
}

function confirmPassword(input) {
    if (input.value != document.getElementById('password').value) {
        input.setCustomValidity('The two passwords must match.');
    } else {
        // input is valid -- reset the error message
        input.setCustomValidity('');
    }
}

function validatePassword(input) {
    var re = /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/;
    if(re.test(input.value))
        input.className = 'valid-true';
    else
        input.className = 'valid-false';
}