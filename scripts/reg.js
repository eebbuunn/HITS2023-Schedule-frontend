$('#button-submit').click(function () {
  CheckValidation();
});

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

    let password = $("#input-password").val()
    if(password.length < 6){
        $("#input-password").addClass("is-invalid")
        return false
    } else {
        $("#input-password").removeClass("is-invalid")
    }
}