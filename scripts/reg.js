import { get, post} from "./requests.js";
let ROLES

$(document).ready(function () {
    navbarChek()
    fillTeachersAndGroups()
    //todo: fill groups
});

$("#button-register").click(function (){
    if(CheckValidation()) {
        let roles = $('#input-role').val()
        // roles = roles.map(Number);
        let group = $("#input-group-id").val()
        let teacher = $("#input-teacher-id").val()
        group = group === "" ? null : group
        teacher = teacher === "" ? null : teacher
        let registerCreds = {
            login: $("#input-login").val().trim(),
            teacherId: teacher,
            groupNumber: group,
            password: $("#input-password").val().trim(),
            roles: roles
        }
        registerUser(registerCreds);
    }
})

function CheckValidation(){
    let flag = true
    $('#error').addClass('d-none')
    let login = $('#input-login').val()
    let loginExp = /[a-zA-z]+\w*/
    if(loginExp.test(login) && login.length >= 6){
        $('#input-login').removeClass('is-invalid')
    } else {
        $('#input-login').addClass('is-invalid')
        flag = false
    }

    if($('#input-role').val().length !== 0){
        $('#input-role').removeClass('is-invalid')
    } else {
        $('#input-role').addClass('is-invalid')
        flag = false
    }

  let password = $('#input-password').val();
  if (password.length < 6) {
    $('#input-password').addClass('is-invalid');
    flag = false;
  } else {
    $('#input-password').removeClass('is-invalid');
  }

    let confirm = $('#input-confirm').val();
    if (confirm !== password) {
        $('#input-confirm').addClass('is-invalid');
        flag = false;
    } else {
        $('#input-confirm').removeClass('is-invalid');
    }

  let teacher = $('#input-teacher-id').val();
  let group = $('#input-group-id').val();
  let roles = $('#input-role').val();
  if(group === "" && roles.includes("STUDENT") || group !== "" && !roles.includes("STUDENT")){
      $('#error').removeClass('d-none')
      $('#error').text("Должны быть выбранны оба поля 'номер группы' и 'роль студент'")
      flag = false
  }
    if(teacher === "" && roles.includes("TEACHER") || teacher !== "" && !roles.includes("TEACHER")){
        $('#error').removeClass('d-none')
        $('#error').text("Должны быть выбранны оба поля 'Имя учителя' и 'роль учитель'")
        flag = false
    }
    return flag
}

function fillTeachersAndGroups(){
    get('http://v1683738.hosted-by-vdsina.ru:5000/teachers')
        .then(r => {
            r.teachers.forEach(teacher => {
                $('#input-teacher-id').append(`<option value="${teacher.id}">
                                       ${teacher.name}
                                  </option>`)
                }
            );
        })

    get('http://v1683738.hosted-by-vdsina.ru:5000/groups')
        .then(r => {
            r.groups.forEach(g => {
                    $('#input-group-id').append(`<option value="${g}">
                                       ${g}
                                  </option>`)
                }
            );
        })
}

function navbarChek(){
    get(`http://v1683738.hosted-by-vdsina.ru:5000/users/me`)
        .then(profile => {
            $("#navbar").find("#nickname").text(profile.login);
            ROLES = profile.roles;
            if(!profile.roles.includes("ROOT")){
                $("#input-role option[value='ADMIN']").remove();
            }
            $("#signout").click(() => {
                post(`http://v1683738.hosted-by-vdsina.ru:5000/auth/logout`)
                    .then(() => {
                        localStorage.setItem("userToken", "");
                        localStorage.setItem("refreshUserToken", "");
                        window.location.href = '../pages/login.html'
                    });
            })
            localStorage.setItem("userId", profile.id);
        })
}

function registerUser(requestsBody){
    post('http://v1683738.hosted-by-vdsina.ru:5000/auth/register', requestsBody)
        .then(async (response) =>{
            if (response.ok){
                window.location.href = '../pages/mainpage.html'
            }
            else{
                $('#error').removeClass('d-none')
                return response.text().then(text => {
                    text = JSON.parse(text)
                    $('#error').text(text.errors.message)
                })
            }
        })
        .catch(e => {
            console.log(e)
            console.log(typeof(e))
        })
}