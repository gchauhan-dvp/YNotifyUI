/// <reference path="../js/angular.min.js" />
/// <reference path="../app.js" />

app.controller('RegisterController', ['$scope', function ($scope) {
    $scope.signIn = function () {
        var un = $("#username").val();
        var pwd = $("#password").val();
        if (un != "" && pwd != "") {
            window.location.href = "Category.html";
        }
        else {
            window.alert("Please enter your Username and Password");
        }
    }

    $scope.showHideForm = function(showFormId, hideFormId) {
        $('#' + showFormId).fadeIn('slow');
        $('#' + hideFormId).hide();

        if (showFormId == "login-form") {
            $("#login-form-link").fadeIn('slow');
            $("#login-form-link").addClass("active");
            $("#register-form-link").removeClass("active");
        }
        else {
            $("#register-form-link").fadeIn('slow');
            $("#register-form-link").addClass("active");
            $("#login-form-link").removeClass("active");
        }
    }

    $scope.signIn = function () {
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

    $scope.showAlert = function () {



    }
}]);