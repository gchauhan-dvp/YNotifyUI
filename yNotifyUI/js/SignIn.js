/// <reference path="../views/Category.html" />
/// <reference path="../views/Category.html" />

function showHideForm(showFormId, hideFormId) {
    $('#' + showFormId).fadeIn('slow');
    $('#' + hideFormId).hide();

    if (showFormId == "login-form") {
        $("#login-form-link").fadeIn('slow');
        $("#login-form-link").addClass("active");
        $("#register-form-link").removeClass("active");

        $("#login-li").fadeIn('slow');
        $("#login-li").addClass("active");
        $("#register-li").removeClass("active");
    }
    else {
        $("#register-form-link").fadeIn('slow');
        $("#register-form-link ").addClass("active");
        $("#login-form-link").removeClass("active");

        $("#register-li").fadeIn('slow');
        $("#register-li").addClass("active");
        $("#login-li").removeClass("active");
    }
}

function signIn() {
    $("#progressBar").css('visibility', 'visible');
    var un = $("#username").val();
    var pwd = $("#password").val();

    if (un != "" && pwd != "") {
        window.location.href = "Category.html";
    }
    else {
        showAlert();
    }
}

function signOut() {
    window.location.href = "SignIn.html";
}



function showAlert() {



}