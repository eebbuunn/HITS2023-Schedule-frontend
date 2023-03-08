import { get, post} from "./requests.js";

$(document).ready(function () {
    loadSelectors();
    navbarChek()
    let choice = window.location.hash.substring(1);
    console.log(choice)
    switch (choice){
        case 'teacher':
            $('#div-teacher-id').removeClass('d-none')
            $('#div-class').addClass('d-none')
            $('#div-group').addClass('d-none')
            break
        case 'class':
            $('#div-teacher').addClass('d-none')
            $('#div-class').removeClass('d-none')
            $('#div-group').addClass('d-none')
            break
        case 'group':
            $('#div-teacher').addClass('d-none')
            $('#div-class').addClass('d-none')
            $('#div-group').removeClass('d-none')
            break
    }
});

function loadSelectors(){
    get('http://v1683738.hosted-by-vdsina.ru:5000/cabinets')
        .then(r => {
            r.forEach(cabinet => {
                    $('#input-class').append(`<option value="${cabinet}">
                                       ${cabinet}
                                  </option>`)
                }
            );
        })

    get('http://v1683738.hosted-by-vdsina.ru:5000/teachers')
        .then(r => {
            r.forEach(teacher => {
                    $('#input-teacher-id').append(`<option value="${teacher.id}">
                                       ${teacher.name}
                                  </option>`)
                }
            );
        })

    //todo: fill groups
}

function navbarChek(){
    get(`http://v1683738.hosted-by-vdsina.ru:5000/users/me`)
        .then(profile => {
            $("#nickname").text(profile.login);
            if (!isUserAdmin(profile.roles)){
                $("#users").addClass("d-none")
                $("#button-users").addClass("d-none")
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

function isUserAdmin(roles){
    if (roles.includes(3) || roles.includes(4)){
        return true
    }
    else{
        return false
    }
}