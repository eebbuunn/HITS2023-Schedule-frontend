import { post } from "./requests.js";

$(document).ready(function (){
    setLoginButtonEvent();
    registerLoginFieldsEvent();
});

export function setLoginButtonEvent() {
    $("#login-form").submit((e) => {
        e.preventDefault();
        let requestsBody =  {
            login: $("#login").val().trim(),
            password: $("#password").val().trim()
        }


        post('http://v1683738.hosted-by-vdsina.ru:5000/auth/login/web', requestsBody)
            .then(async (response) =>{
                if (response.ok){
                    let json = await response.json();
                    console.log(json);
                    localStorage.setItem('userToken', json.accessToken)
                    localStorage.setItem('refreshUserToken', json.refreshToken)
                    localStorage.removeItem('startDate');
                    window.location.href = '../pages/mainpage.html'

                }
                else{
                    let json = await response.json();
                    console.log(json);
                    $("#login-form").addClass("invalid");
                    $("#login-form").removeClass("valid");
                }
            })

    });
}

export function registerLoginFieldsEvent() {
    $(".form-control").on("input", function() {
        $(this).parent().parent().addClass("valid");
        $(this).parent().parent().removeClass("invalid");
    });
}
