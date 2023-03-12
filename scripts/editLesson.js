import {get, put} from "./requests.js";

let TIMESLOTS
let WEEK_DAY = ['Gbcmrb', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']


$("#edit-single").click(function (){
    $("#edit-all").addClass('d-none');
    $("#edit-single").addClass('d-none');
    $("#del-les-single").addClass('d-none');
    $("#del-les-all").addClass('d-none');
    $("#edit-ok-single").removeClass('d-none');
    $("#cancel").removeClass('d-none');
    $("#input-date-cur-edit").removeAttr('disabled');
    $("#input-timeslot-edit").removeAttr('disabled');
})

$("#edit-all").click(function (){
    $("#edit-all").addClass('d-none');
    $("#edit-single").addClass('d-none');
    $("#del-les-single").addClass('d-none');
    $("#del-les-all").addClass('d-none');
    $("#edit-ok-all").removeClass('d-none');
    $("#cancel").removeClass('d-none');
    $("#input-date-end-edit").removeAttr('disabled');
    $("#input-date-start-edit").removeAttr('disabled');
    $("#input-subject-edit").removeAttr('disabled');
    $("#input-teacher-id-edit").removeAttr('disabled');
    $("#input-groups-edit").removeAttr('disabled');
    $("#input-cabinet-edit").removeAttr('disabled');
    $("#input-type-edit").removeAttr('disabled');
    $("#input-timeslot-edit").removeAttr('disabled');
})

$("#cancel").click(function (){
    $("#edit-all").removeClass('d-none');
    $("#edit-single").removeClass('d-none');
    $("#del-les-single").removeClass('d-none');
    $("#del-les-all").removeClass('d-none');
    $("#edit-ok-all").addClass('d-none');
    $("#edit-ok-single").addClass('d-none');
    $("#cancel").addClass('d-none');
    $("#input-date-end-edit").attr('disabled', true);
    $("#input-date-start-edit").attr('disabled', true);
    $("#input-subject-edit").attr('disabled', true);
    $("#input-teacher-id-edit").attr('disabled', true);
    $("#input-groups-edit").attr('disabled', true);
    $("#input-cabinet-edit").attr('disabled', true);
    $("#input-type-edit").attr('disabled', true);
    $("#input-timeslot-edit").attr('disabled', true);
    $("#input-date-cur-edit").attr('disabled', true);
})

export function loadSelectors(teacherId, group, cabinet, timeslot, subj){
    get('http://v1683738.hosted-by-vdsina.ru:5000/teachers')
        .then(r => {
            r.teachers.forEach(teacher => {
                    $('#input-teacher-id-edit').append(`<option value="${teacher.id}">
                                       ${teacher.name}
                                  </option>`)

                }
            );
            $('#input-teacher-id-edit').val(teacherId);
        })

    get('http://v1683738.hosted-by-vdsina.ru:5000/subjects')
        .then(r => {
            r.subjects.forEach(sub => {
                    $('#input-subject-edit').append(`<option value="${sub.id}">
                                       ${sub.name}
                                  </option>`)
                if(sub.name === subj){
                    $('#input-subject-edit').val(sub.id)
                }
            });
        })


    get('http://v1683738.hosted-by-vdsina.ru:5000/groups')
        .then(r => {
            r.groups.forEach(g => {
                    $('#input-groups-edit').append(`<option value="${g}">
                                       ${g}
                                  </option>`)
                }
            );
            $('#input-groups-edit').val(group);
        })

    get('http://v1683738.hosted-by-vdsina.ru:5000/cabinets')
        .then(r => {
            r.cabinets.forEach(cabinet => {
                    let name = cabinet.name === null ? cabinet.number : cabinet.name
                    $('#input-cabinet-edit').append(`<option value="${cabinet.number}">
                                       ${name}
                                  </option>`)
                }
            );
            $('#input-cabinet-edit').val(cabinet);
        })

    get('http://v1683738.hosted-by-vdsina.ru:5000/timeslots')
        .then(r => {
            TIMESLOTS = r.timeslots;
            TIMESLOTS.sort(compareTimeslots)
            TIMESLOTS.forEach(timeslot => {
                    $('#input-timeslot-edit').append(`<option value="${timeslot.id}">
                                       ${new Date(timeslot.startAt).getHours()}:${new Date(timeslot.startAt).getMinutes()} - ${new Date(timeslot.endsAt).getHours()}:${new Date(timeslot.endsAt).getMinutes()}
                                  </option>`)
                }
            );
            $('#input-timeslot-edit').val(timeslot);
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

export function getFormattedDateTrue(datetime) {
    var date = new Date(datetime);
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return year + '-' + month + '-' + day;
}


$('#edit-ok-single').click(function (){
    let body  = {
        date: $("#input-date-cur-edit").val(),
        timeslotId: $('#input-timeslot-edit').val()
    }
    let id = localStorage.getItem('lessonIdSingle')

    put(`http://v1683738.hosted-by-vdsina.ru:5000/lesson/single/${id}`, body)
        .then(r => {
            if(!r.ok){
                $('.errorr').removeClass('d-none')
                return r.text().then(text => {
                    text = JSON.parse(text)
                    console.log(text.errors.message)
                    $('.errorr').text(text.errors.message)
                })
            } else {
                window.location.reload()
            }
        })
})

$('#edit-ok-all').click(function (){
    let day = new Date($("#input-date-cur-edit").val()).getDay();
    let body  = {
        teacher: $('#input-teacher-id-edit').val(),
        subject: $('#input-subject-edit').val(),
        groups: $('#input-groups-edit').val(),
        cabinet: $('#input-cabinet-edit').val(),
        timeslot:$('#input-timeslot-edit').val(),
        day: WEEK_DAY[day],
        type:  $('#input-type-edit').val(),
        startsAt: $('#input-date-start-edit').val(),
        endsAt: $('#input-date-end-edit').val()
    }

    console.log(body);
    let id = localStorage.getItem('lessonIdAll')

    put(`http://v1683738.hosted-by-vdsina.ru:5000/lesson/all/${id}`, body)
        .then(r => {
            if(!r.ok){
                $('.errorr').removeClass('d-none')
                return r.text().then(text => {
                    text = JSON.parse(text)
                    console.log(text.errors.message)
                    $('.errorr').text(text.errors.message)
                })
            } else {
                window.location.reload()
            }
        })
})