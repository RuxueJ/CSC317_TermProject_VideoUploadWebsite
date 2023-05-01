const form = document.getElementById('reg-form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmpassword = document.getElementById('confirmpassword');


var username_valid = false;
var email_valid = false;
var pswd_valid = false;
var conPswd_valid = false;
var form_valid = username_valid && email_valid && pswd_valid && conPswd_valid;

function setValid(element){
    element.classList.remove("invalid-text");
    element.classList.add("valid-text");
};

function setInValid(element){
    element.classList.remove("valid-text");
    element.classList.add("invalid-text");
};

function validateUsername(){
    var emailValue = username.value;
    var container = username.parentNode;
    var usernamePattern = /^[a-zA-Z]/;
    var error = container.querySelector('.error');
    var characterMessage = "<p>username must begin with a character</p>";
    var lengthMessage = "<p>username must be at least 3 characters</p>";
    var msg = '';
    if((!usernamePattern.test(emailValue))){
        msg += characterMessage;
        setInValid(username);
        username_valid = false;

    }
    if(((emailValue.length < 3))){
        msg += lengthMessage;
        setInValid(username);
        username_valid = false;

    }
    if(msg == ""){
        setValid(username);
        username_valid = true;

    }
    // showErrorMessage(error,msg);
    error.innerHTML = msg;
}

function validateEmail(){
    var emailValue = email.value;
    var container = email.parentNode;
    var error = container.querySelector('.error');
    if(emailValue.length == 0){
        setInValid(email);
        email_valid = false;
        error.textContent = "email is required";
    }else{
        setValid(email);
        email_valid = true;
        error.textContent = "";
    }
}


function validatePassword(){
    var passwordValue = password.value;
    var container = password.parentNode;
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /\d/;
    const specialRegex = /[/*\-+!@#$^&~[\]]/;
    var error = container.querySelector('.error');
    var msg = "";
    var upperCaseMessage = "<p>password must contain at least 1 upper case letter</p>";
    var numberMessage = "<p>password must contain at least 1 number</p>";
    var specialMessage = "<p>password must contain at least 1 special character in / * - + ! @ # $ ^ & ~ [ ]</p>";
    var lengthMessage = "<p>password must contain 8 or more characters</p>";
    if(!uppercaseRegex.test(passwordValue)){
        setInValid(password);
        msg += upperCaseMessage;
    }
    if(!numberRegex.test(passwordValue)){
        setInValid(password);
        msg += numberMessage;
    }
    if(!specialRegex.test(passwordValue)){
        setInValid(password);
        msg += specialMessage;
    }
    if(passwordValue.length < 8){
        setInValid(password);
        msg += lengthMessage;
    }
    if(msg == ""){
        setValid(password);
        pswd_valid = true;
    }
    error.innerHTML = msg;

};

function validateConfirmPassword(){
    var confirmpasswordValue = confirmpassword.value;
    var passwordValue = password.value;
    var container = confirmpassword.parentNode;
    var error = container.querySelector('.error');
    if(confirmpasswordValue.length === 0){
        setInValid(confirmpassword);
        error.textContent = "confirm password is required";
    }else if(passwordValue !== confirmpasswordValue){
        setInValid(confirmpassword);
        error.textContent = "password doesn't match";
        conPswd_valid = false;
    }else{
        conPswd_valid = true;
        setValid(confirmpassword);
    };
};

username.addEventListener('input', validateUsername);
email.addEventListener("input",validateEmail);
password.addEventListener("input", validatePassword);
confirmpassword.addEventListener("input",function(){
    confirmpassword.classList.remove("invalid-text");
})
form.addEventListener('input',function(){
    document.getElementById("submitbuttom").disabled = false;
    confirmpassword.parentNode.querySelector('.error').textContent = "";
});


form.addEventListener("submit", function(ev){
    ev.preventDefault();
    validateUsername();
    validateEmail(); 
    validatePassword();
    validateConfirmPassword();

    form_valid = username_valid && email_valid && pswd_valid && conPswd_valid;

    if (!form_valid){
        var button = document.getElementById("submitbuttom")
        button.disabled = true;
        return;
    }else{
        document.getElementById("submitbuttom").disabled = false;
        ev.currentTarget.submit();
        // console.log("form data is good");
        // window.alert("form is submitted. WIll refresh this page");
    }
    console.log(ev);
})



