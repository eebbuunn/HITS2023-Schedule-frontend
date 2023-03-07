import { get, post} from "./requests.js";

$(document).ready(function () {
    navbarChek();
});
$("#button-submit").click(function (){
    CheckValidation();
})

$('#button-back').click(function (){
    $('#role-choice').removeClass("d-none");
    $('#register-user').addClass("d-none");
    $('#group-div').removeClass('d-none')
    $('#teacher-div').removeClass('d-none')
})

$('#button-admin').click(function (){
    $('#role-choice').addClass("d-none");
    $('#register-user').removeClass("d-none");
    $('#group-div').addClass('d-none');
    $('#label-teacher').text("Id учителя");
})

$('#button-student').click(function (){
    $('#role-choice').addClass("d-none");
    $('#register-user').removeClass("d-none");
    $('#teacher-div').addClass('d-none');
    $('#label-group').text("Номер группы *");
})

$('#button-teacher').click(function (){
    $('#role-choice').addClass("d-none");
    $('#register-user').removeClass("d-none");
    $('#group-div').addClass('d-none');
    $('#label-teacher').text("Id учителя *");
})

$('#button-editor').click(function (){
    $('#role-choice').addClass("d-none");
    $('#register-user').removeClass("d-none");
    $('#group-div').addClass('d-none');
    $('#label-teacher').text("Id учителя");
})

function CheckValidation(){
    let login = $('#input-login').val()
    let loginExp = /[a-zA-z]+\w*/
    if(loginExp.test(login) && login.length >= 5){
        $('#input-login').removeClass('is-invalid')
    } else {
        $('#input-login').addClass('is-invalid')
        return false
    }

  let password = $('#input-password').val();
  if (password.length < 6) {
    $('#input-password').addClass('is-invalid');
    return false;
  } else {
    $('#input-password').removeClass('is-invalid');
  }
}

function navbarChek(){
    get(`http://v1683738.hosted-by-vdsina.ru:5000/users/me`)
        .then(profile => {
            $("#navbar").find("#nickname").text(profile.login);
            $("#signout").click(() => {
                post(`http://v1683738.hosted-by-vdsina.ru:5000/auth/logout`)
                    .then(() => {
                        localStorage.setItem("userToken", "");
                        localStorage.setItem("refreshUserToken", "");
                        window.location.href = '../pages/login.html'
                    });
            })
            // todo добавить обработку ролей
            localStorage.setItem("userId", profile.id);
        })
}