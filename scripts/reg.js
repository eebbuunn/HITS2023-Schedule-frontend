import { get, post} from "./requests.js";
let ROLES
let NEW_ROLES = [];

$(document).ready(function () {
    navbarChek()
    //todo: fill the teachers and groups
});

$("#button-submit").click(function (){
    CheckValidation();
    let group = $('#input-group-id').val();
    let teacher = $('#input-teacher-id').val();
    NEW_ROLES.push(group);
    NEW_ROLES.push(teacher);

    let registerCreds = {
        login: $("#input-login").val().trim(),
        teacherId: $("#input-teacher-id").val().trim(),
        groupNumber: $("#input-group-id").val().trim(),
        password: $("#input-password").val().trim(),
        roles: NEW_ROLES
    }
    registerUser(registerCreds);
})

$('#button-back').click(function (){
    $('#role-choice').removeClass("d-none");
    $('#register-user').addClass("d-none");
    $('#group-div').removeClass('d-none')
    $('#teacher-div').removeClass('d-none')
    $('#input-login').val("");
    $('#input-password').val("");
    $('#input-teacher-id').val("");
    $('#input-group-id').val("");
    $('#input-teacher-id').prop('required', true);
    $('#input-group-id').prop('required', true);
    NEW_ROLES = [];
})

$('#button-admin').click(function (){
    $('#role-choice').addClass("d-none");
    $('#register-user').removeClass("d-none");
    $('#group-div').addClass('d-none');
    $('#label-teacher').text("Id учителя");
    $('#input-teacher-id').prop('required', false);
    $('#input-group-id').prop('required', false);
    NEW_ROLES.push(3);
})

$('#button-student').click(function (){
    $('#role-choice').addClass("d-none");
    $('#register-user').removeClass("d-none");
    $('#teacher-div').addClass('d-none');
    $('#label-group').text("Номер группы *");
    $('#input-teacher-id').prop('required', false);
    NEW_ROLES.push(0);
})

$('#button-teacher').click(function (){
    $('#role-choice').addClass("d-none");
    $('#register-user').removeClass("d-none");
    $('#group-div').addClass('d-none');
    $('#label-teacher').text("Id учителя *");
    $('#input-group-id').prop('required', false);
    NEW_ROLES.push(1);
})

$('#button-editor').click(function (){
    $('#role-choice').addClass("d-none");
    $('#register-user').removeClass("d-none");
    $('#group-div').addClass('d-none');
    $('#label-teacher').text("Id учителя");
    $('#input-teacher-id').prop('required', false);
    $('#input-group-id').prop('required', false);
    NEW_ROLES.push(2);
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
    let profileRole;
    get(`http://v1683738.hosted-by-vdsina.ru:5000/users/me`)
        .then(profile => {
            $("#navbar").find("#nickname").text(profile.login);
            ROLES = profile.roles;
            if(profile.roles.includes(4)){
                $('#button-admin').removeClass('d-none');
            }
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

function registerUser(requestsBody){
    //todo: do registration
    /*post('', requestsBody)
        .then(async (response) =>{
            if (response.ok){
                let json = await response.json();
                console.log(json);
                localStorage.setItem('userToken', json.accessToken)
                localStorage.setItem('refreshUserToken', json.refreshToken)
                window.location.href = '../pages/mainpage.html'

            }
            else{
                let json = await response.json();
                console.log(json);
                $("#login-form").addClass("invalid");
                $("#login-form").removeClass("valid");
            }
        })*/
}