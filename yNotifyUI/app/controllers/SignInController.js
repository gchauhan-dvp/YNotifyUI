/// <reference path="../js/angular.min.js" />
/// <reference path="../app.js" />

app.controller('SignInController', ['$scope', '$http', function ($scope, $http) {

    $scope.showHideForm = function (showFormId, hideFormId) {
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
            $http({
                url: "Login/LoginAuthenticate/",
                method: "POST",
                data: JSON.stringify({ 'username': un, 'password': pwd }),
            }).success(function (data, status, headers, config) {
                alert(data);
            }).error(function (data, status, headers, config) {
                alert('no');
            });
        }
        else {
            showAlert();
        }
    }

    $scope.showAlert = function () {
    }

    $scope.signOut = function () {
        window.location.href = "SignIn.html";
    }
}]).factory('ConnectToDb', function ($scop, $http) {
    $scop.getServerData = function () {
        return $http.get('');

    }



});