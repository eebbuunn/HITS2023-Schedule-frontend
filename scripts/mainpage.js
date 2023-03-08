import { get, post} from "./requests.js";

$(document).ready(function () {
    navbarChek();
});

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