import {get, post} from "./requests.js";
let TIMESLOTS
let WEEK_DAY = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday ']

$(document).ready(function (){
    loadSelectors()
    setTimeout(setDefaultValuesInAdd, 1000)
    loadTimeslots()
})

function setDefaultValuesInAdd() {
    let hash = window.location.hash;
    if(hash.includes("#teacher=")){
        let teacher = hash.substring(9)
        $(`#input-teacher-id`).val(teacher)
        $('#input-teacher-id').addClass('d-none')
        $('#label-teacher').addClass('d-none')
    }

    if(hash.includes("#group=")){
        let group = hash.substring(7)
        $(`#input-groups`).val(group)
    }

    if(hash.includes("#class=")){
        let cabinet = hash.substring(7)
        $(`#input-cabinet`).val(cabinet)
        $('#input-cabinet').addClass('d-none')
        $('#label-cabinet').addClass('d-none')
    }
}

$('td').mouseenter(function () {
    if($(this).is(':empty')) {
        localStorage.setItem('cell', $(this).attr('id').substring(1))
        let template = $("#add-template");
        let btn = template.clone();
        btn.removeClass('d-none')
        btn.find('#button-add-lesson').click(function () {
        })
        $(this).append(btn)
    }
})

$('td').mouseleave(function () {
    $(this).find($('.button-add')).remove();
})

$('#create-lesson').click(function (){
    let cell = localStorage.getItem('cell')
    let newTimeslot = getLessonTimeByCell(cell)
    let newWeekDay = getWeekDayByCell(cell)

    let newLesson = {
        teacher: $('#input-teacher-id').val(),
        subject: $('#input-subject').val(),
        groups: $('#input-groups').val(),
        cabinet: $('#input-cabinet').val(),
        timeslot: newTimeslot.id,
        day: newWeekDay,
        type: $('#input-type').val(),
        startsAt: $('#input-date-start').val(),
        endsAt: $('#input-date-end').val()
    }

    if(checkLessonValidness(newLesson)) {
        post('http://v1683738.hosted-by-vdsina.ru:5000/lesson', newLesson)
            .then(r => {
                if(!r.ok){
                    $('.error').removeClass('d-none')
                    return r.text().then(text => {
                        text = JSON.parse(text)
                        console.log(text.errors.message)
                        $('.error').text(text.errors.message)
                    })
                } else {
                    window.location.reload()
                }
            })
    }
})



function checkLessonValidness(lesson){
    let valid = true
    if(lesson.startsAt === ''){
        $('#input-date-start').addClass('is-invalid')
        valid = false;
    } else {
        $('#input-date-start').removeClass('is-invalid')
    }

    if(lesson.endsAt === ''){
        $('#input-date-end').addClass('is-invalid')
        valid = false;
    } else {
        $('#input-date-end').removeClass('is-invalid')
    }

    if(lesson.groups.length === 0){
        $('#input-groups').addClass('is-invalid')
        valid = false;
    } else {
        $('#input-groups').removeClass('is-invalid')
    }
    if(lesson.endsAt < lesson.startsAt){
        $('#input-date-end').addClass('is-invalid')
        $('#input-date-start').addClass('is-invalid')
        valid = false;
    } else {
        $('#input-date-end').removeClass('is-invalid')
        $('#input-date-start').removeClass('is-invalid')
    }
    return valid
}

function getLessonTimeByCell(cell){
    return TIMESLOTS[Math.floor(cell / 6)]
}

function getWeekDayByCell(cell){
    return WEEK_DAY[cell % 6]
}

function loadSelectors(){
    get('http://v1683738.hosted-by-vdsina.ru:5000/teachers')
        .then(r => {
            r.teachers.forEach(teacher => {
                    $('#input-teacher-id').append(`<option value="${teacher.id}">
                                       ${teacher.name}
                                  </option>`)
                }
            );
        })

    get('http://v1683738.hosted-by-vdsina.ru:5000/subjects')
        .then(r => {
            r.subjects.forEach(s => {
                    $('#input-subject').append(`<option value="${s.id}">
                                       ${s.name}
                                  </option>`)
                }
            );
        })

    get('http://v1683738.hosted-by-vdsina.ru:5000/groups')
        .then(r => {
            r.groups.forEach(g => {
                    $('#input-groups').append(`<option value="${g}">
                                       ${g}
                                  </option>`)
                }
            );
        })

    get('http://v1683738.hosted-by-vdsina.ru:5000/cabinets')
        .then(r => {
            r.cabinets.forEach(cabinet => {
                let name = cabinet.name === null ? cabinet.number : cabinet.name
                    $('#input-cabinet').append(`<option value="${cabinet.number}">
                                       ${name}
                                  </option>`)
                }
            );
        })
}

function loadTimeslots(){
    get('http://v1683738.hosted-by-vdsina.ru:5000/timeslots')
        .then(r => {
            TIMESLOTS = r.timeslots;
            TIMESLOTS.sort(compareTimeslots)
        })
}

function compareTimeslots( a, b ) {
    if ( a.startAt < b.startAt ){
        return -1;
    }
    if ( a.startAt > b.startAt ){
        return 1;
    }
    return 0;
}