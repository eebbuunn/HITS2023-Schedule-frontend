import { get, post } from "./requests.js";
$(document).ready(function () {
    navbarChek();
    $('#legend').popover({
    html: true,
    trigger: 'hover',
    content: $('.popover-body'),
    placement: 'bottom',
    });

    let hash = window.location.hash;
    if(hash.includes("#teacher=")){
        loadForTeacher(hash.substring(9))
    }
    else if(hash.includes("#group=")){
        loadForGroup(hash.substring(7))
    }
    else if(hash.includes("#class=")){
        loadForClass(hash.substring(7))
    }
});

function loadForTeacher(id){
    let name;
    get('http://v1683738.hosted-by-vdsina.ru:5000/teachers')
        .then(r => {
            r.teachers.forEach(t => {
                if(t.id === id){
                    name = t.name;
                    console.log("suck")
                }
            })
        }).then(() => {
            $('#sch-for').append(` для преподавателя ${name}`)
    })
}

function loadForGroup(number){
    $('#sch-for').append(` для группы ${number}`)
}

function loadForClass(number){
    $('#sch-for').append(` для аудитории ${number}`)

}

function navbarChek(){
  get(`http://v1683738.hosted-by-vdsina.ru:5000/users/me`)
      .then(profile => {
          $("#navbar").find("#nickname").text(profile.login);
          if (!isUserAdmin(profile.roles)){
              $("#users").addClass("d-none")
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