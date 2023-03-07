import { get, post } from "./requests.js";
$(document).ready(function () {
    navbarChek();
    $('#legend').popover({
    html: true,
    trigger: 'hover',
    content: $('.popover-body'),
    placement: 'bottom',
    });
});

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