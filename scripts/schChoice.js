import { get, post} from "./requests.js";

$(document).ready(function () {
    loadSelectors();
    navbarChek()
    let choice = window.location.hash.substring(1);
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

$('#button-show').click(function() {
    let hash = window.location.hash;
    let choice

    switch (hash){
        case '#teacher':
            choice = $('#input-teacher-id').val();
            break
        case '#class':
            choice = $('#input-class').val();
            break
        case '#group':
            choice = $('#input-group-id').val();
            break
    }

    window.location.href = `../pages/shedule.html${hash}=${choice}`
})

function loadSelectors(){
    get('http://v1683738.hosted-by-vdsina.ru:5000/cabinets')
        .then(r => {
            r.cabinets.forEach(cabinet => {
                    $('#input-class').append(`<option value="${cabinet.number}">
                                       ${cabinet.number}
                                  </option>`)
                }
            );
        })

    get('http://v1683738.hosted-by-vdsina.ru:5000/groups')
        .then(r => {
            r.groups.forEach(group => {
                    $('#input-group-id').append(`<option value="${group}">
                                       ${group}
                                  </option>`)
                }
            );
        })

    get('http://v1683738.hosted-by-vdsina.ru:5000/teachers')
        .then(r => {
            r.teachers.forEach(teacher => {
                    $('#input-teacher-id').append(`<option value="${teacher.id}">
                                       ${teacher.name}
                                  </option>`)
                }
            );
        })
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
    if (roles.includes("ADMIN") || roles.includes("ROOT")){
        return true
    }
    else{
        return false
    }
}