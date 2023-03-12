import { get, post } from "./requests.js";

let START_DATE
let END_DATE
let type = {
    LECTURE: "lecture_bg_color",
    SEMINAR: "seminar_bg_color",
    PRACTICE: "practical_bg_color",
    LABWORK: "lab_bg_color",
    INDIVIDUAL_LESSON: "individual_bg_color",
    CONTROL_POINT: "control_bg_color",
    CONSULTATION: "consultation_bg_color",
    RESERVATION: "booking_bg_color",
    OTHER : "other_bg_color"
}
let MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

$(document).ready(function () {
    navbarChek();
    $('#legend').popover({
    html: true,
    trigger: 'hover',
    content: $('.popover-body'),
    placement: 'bottom',
    });
    setDateWeek()
    setMain()
});


//main

function loadForTeacher(id){
    let name;
    get('http://v1683738.hosted-by-vdsina.ru:5000/teachers')
        .then(r => {
            r.teachers.forEach(t => {
                if(t.id === id){
                    name = t.name;
                }
            })
        }).then(() => {
            $('#sch-for').append(` для преподавателя ${name}`)
    })

    let timeslots
    get('http://v1683738.hosted-by-vdsina.ru:5000/timeslots')
        .then(r => {
            timeslots = r.timeslots;
            timeslots.sort(compareTimeslots)
        })
        .then(() => {

    get(`http://v1683738.hosted-by-vdsina.ru:5000/teachers/${id}/schedule?startsAt=${getDateForUrl(START_DATE)}&endsAt=${getDateForUrl(END_DATE)}`)
        .then(r => {
            r.lessons.forEach(l => {
                let slotIndex
                for (let i = 0; i < timeslots.length; i++) {
                    if (timeslots[i].id === l.timeslot.id){
                        slotIndex = i;
                        break;
                    }
                }

                let lessonDate = new Date(l.date);
                START_DATE.setHours(0, 0, 0, 0)
                lessonDate.setHours(0, 0, 0, 0)
                let timeDiff = Math.abs(lessonDate - START_DATE);
                let daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                let cell = slotIndex * 6 + daysDiff;

                let lessonCard = getFilledLesson(l)
                $(`#c${cell}`).append(lessonCard);
            });
            console.log("aaaaa chleeen")
        })})
}

function loadForGroup(number){
    $('#sch-for').append(` для группы ${number}`)

    let timeslots
    get('http://v1683738.hosted-by-vdsina.ru:5000/timeslots')
        .then(r => {
            timeslots = r.timeslots;
            timeslots.sort(compareTimeslots)
        })
        .then(() => {
    get(`http://v1683738.hosted-by-vdsina.ru:5000/groups/${number}/schedule?startsAt=${getDateForUrl(START_DATE)}&endsAt=${getDateForUrl(END_DATE)}`)
        .then(r => {
            r.lessons.forEach(l => {
                let slotIndex
                for (let i = 0; i < timeslots.length; i++) {
                    if (timeslots[i].id === l.timeslot.id){
                        slotIndex = i;
                        break;
                    }
                }

                let lessonDate = new Date(l.date);
                START_DATE.setHours(0, 0, 0, 0)
                lessonDate.setHours(0, 0, 0, 0)
                let timeDiff = Math.abs(lessonDate - START_DATE);
                let daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                let cell = slotIndex * 6 + daysDiff;

                let lessonCard = getFilledLesson(l)
                $(`#c${cell}`).append(lessonCard);

            })});
        })
}

function loadForClass(number){
    $('#sch-for').append(` для аудитории ${number}`)

    let timeslots
    get('http://v1683738.hosted-by-vdsina.ru:5000/timeslots')
        .then(r => {
            timeslots = r.timeslots;
            timeslots.sort(compareTimeslots)
        })
        .then(() => {
    get(`http://v1683738.hosted-by-vdsina.ru:5000/cabinets/${number}/schedule?startsAt=${getDateForUrl(START_DATE)}&endsAt=${getDateForUrl(END_DATE)}`)
        .then(r => {
            r.lessons.forEach(l => {
                let slotIndex
                for (let i = 0; i < timeslots.length; i++) {
                    if (timeslots[i].id === l.timeslot.id){
                        slotIndex = i;
                        break;
                    }
                }

                let lessonDate = new Date(l.date);
                START_DATE.setHours(0, 0, 0, 0)
                lessonDate.setHours(0, 0, 0, 0)
                let timeDiff = Math.abs(lessonDate - START_DATE);
                let daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                let cell = slotIndex * 6 + daysDiff;

                let lessonCard = getFilledLesson(l)
                $(`#c${cell}`).append(lessonCard);
            })});
        })
}

function getFilledLesson(lesson){
    let template, lessonCard;
    template = $("#lesson-template");
    lessonCard = template.clone();
    lessonCard.removeClass("d-none");
    lessonCard.find(".l-class").text(lesson.lesson.cabinet.number);
    lessonCard.find(".l-name").text(lesson.lesson.subject)
    lessonCard.find(".l-group").text(lesson.lesson.groups);
    lessonCard.addClass(type[lesson.lesson.type])
    return lessonCard;
}



//navbar

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



//auxiliary

function setDateWeek(){
    let sd = localStorage.getItem('startDate');
    // let ed = localStorage.getItem('endDate');
    let dateEnd;
    let dateStart;
    if (sd == null){
        dateStart = new Date();
        dateEnd = new Date();
    }
    else{
        dateStart = new Date(sd) ;
        dateEnd = new Date(sd) ;
        console.log(dateStart, dateEnd);
    }
    // let dateEnd = new Date();
    // let dateStart = new Date();
    let weekDay = dateStart.getDay();
    dateStart.setDate(dateStart.getDate() - weekDay + 1)
    dateEnd.setDate(dateEnd.getDate() - weekDay + 6)

    START_DATE = dateStart
    END_DATE = dateEnd

    $('#monday').text(getColDate(dateStart, 0))
    $('#tuesday').text(getColDate(dateStart, 1))
    $('#wednesday').text(getColDate(dateStart, 1))
    $('#thursday').text(getColDate(dateStart, 1))
    $('#friday').text(getColDate(dateStart, 1))
    $('#saturday').text(getColDate(dateStart, 1))
    START_DATE.setDate(START_DATE.getDate() - 5)

    dateStart = getFormattedDate(dateStart)
    dateEnd = getFormattedDate(dateEnd)

    $('#date-week').text(`${dateStart} - ${dateEnd}`)
}

function getFormattedDate(datetime) {
    var date = new Date(datetime);
    let year = date.getFullYear();
    let month = MONTHS[date.getMonth()];
    let day = date.getDate().toString().padStart(2, '0');
    return day + ' ' + month + ' ' + year;
}

function getColDate(datetime, daysPlus){
    datetime.setDate(datetime.getDate() + daysPlus)
    var date = new Date(datetime);
    let month = MONTHS[date.getMonth()];
    let day = date.getDate().toString().padStart(2, '0');
    return day + ' ' + month;
}

function getDateForUrl(datetime) {
    var date = new Date(datetime);
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return year + '-' + month + '-' + day;
}

function setMain(){
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
}


//buttons

$("#nextWeek").click(function (){
    START_DATE.setDate(START_DATE.getDate() + 7);
    // END_DATE.setDate(END_DATE.getDate() + 2);
    localStorage.setItem('startDate', START_DATE);
    // localStorage.setItem('endDate', END_DATE);
    window.location.reload();
})

$("#previousWeek").click(function (){
    START_DATE.setDate(START_DATE.getDate() - 7);
    // END_DATE.setDate(END_DATE.getDate() - 12);
    localStorage.setItem('startDate', START_DATE);
    // localStorage.setItem('endDate', END_DATE);
    window.location.reload();
})

function compareTimeslots( a, b ) {
    if ( a.startAt < b.startAt ){
        return -1;
    }
    if ( a.startAt > b.startAt ){
        return 1;
    }
    return 0;
}
