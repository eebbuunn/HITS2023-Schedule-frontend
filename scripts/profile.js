import {del, get, post, put} from './requests.js';

async function deleteUser(user_id) {
  const url = 'http://v1683738.hosted-by-vdsina.ru:5000/users/' + user_id;
  const response = await del(url);
  if (response.ok) {
    $('#error').addClass('d-none');
    window.location.href = 'users.html';
  } else {
    response.text().then((text) => {
      $('#deleteModal').modal('hide');
      $('#errorModal').find('.modal-body').text(JSON.parse(text).errors.message);
      $('#errorModal').modal('show');
    });
  }
}

function fillGroups(group_number) {
  $('#input-group').empty();
  get('http://v1683738.hosted-by-vdsina.ru:5000/groups').then((r) => {
    r.groups.forEach((group) => {
      if (group !== group_number) {
        $('#input-group').append(`<option value="${group}">
                                       ${group}
                                  </option>`);
      } else {
        $('#input-group').append(`<option selected value="${group}">
                                       ${group}
                                  </option>`);
      }
    });
  });
}
function fillTeachers(teacher_id) {
  $('#input-teacher').empty();
  get('http://v1683738.hosted-by-vdsina.ru:5000/teachers').then((r) => {
    r.teachers.forEach((teacher) => {
      if (teacher.id !== teacher_id) {
        $('#input-teacher').append(`<option value="${teacher.id}">
                                         ${teacher.name}
                                    </option>`);
      } else {
        $('#input-teacher').append(`<option selected value="${teacher.id}">
                                         ${teacher.name}
                                    </option>`);
      }
    });
  });
}
async function loadProfile(user_id) {
  const url = 'http://v1683738.hosted-by-vdsina.ru:5000/users/' + user_id;
  const user = await get(url);
  let block = $('#profile-template');
  block.find('#profile-nickname').text(user.login);
  if (user.avatarLink !== null && user.avatarLink !== '') {
    block.find('#input-avatar-link').val(user.avatarLink);
    block.find('#profile-image ').attr('src', user.avatarLink);
  }

  for (const role of user.roles) {
    switch (role) {
      case 'STUDENT':
        fillGroups(user.group);
        block.find('#studentCheck').attr('checked', true);
        block.find('.input-group-container').removeClass('d-none');
        break;
      case 'TEACHER':
        fillTeachers(user.teacherId.id);
        block.find('#teacherCheck').attr('checked', true);
        block.find('.input-teacher-container').removeClass('d-none');
        break;
      case 'EDITOR':
        block.find('#editorCheck').attr('checked', true);
        break;
      case 'ADMIN':
        block.find('#adminCheck').attr('checked', true);
        break;
    }
  }
  block.removeClass('d-none');
  $('#profile-image').on('error', function () {
    $('#profile-image').attr('src', '../logos/user.svg');
  });
}
async function editUser(user_id) {
  const url = 'http://v1683738.hosted-by-vdsina.ru:5000/users/' + user_id;
  let roles = [];
  $('input:checkbox[name=checkbox]:checked').each(function () {
    roles.push($(this).val());
  });
  let group = null;
  let teacher_id = null;
  if (roles.includes('STUDENT')) {
    group = $('#input-group').val();
  }
  if (roles.includes('TEACHER')) {
    teacher_id = $('#input-teacher').val();
  }
  const avatarLink = $('#input-avatar-link').val();
  const body = {
    roles: roles,
    teacherId: teacher_id,
    group: Number(group),
    avatar: avatarLink,
  };
  const response = await put(url, body);
  if (response.ok) {
    window.location.reload();
  } else if (response.status == 409) {
    $('#errorModal').find('.modal-body').text('There is already an account for this teacher');
    $('#errorModal').modal('show');
  } else {
    response.text().then((text) => {
      if (
        JSON.parse(text).errors.Roles == "The field Roles must be a string or array type with a minimum length of '1'."
      ) {
        $('#errorModal').find('.modal-body').text('You cannot create a user without roles');
      } else {
        $('#errorModal').find('.modal-body').text(JSON.parse(text).errors.message);
      }
      $('#errorModal').modal('show');
    });
  }
}

$(document).ready(function () {
  navbarChek()
  const user_id = window.location.hash.substring(1);
  loadProfile(user_id);
  $('#studentCheck').change(function () {
    if ($('#studentCheck').prop('checked')) {
      $('.input-group-container').removeClass('d-none');
      fillGroups(null);
    } else {
      $('.input-group-container').addClass('d-none');
    }
  });
  $('#teacherCheck').change(function () {
    if ($('#teacherCheck').prop('checked')) {
      $('.input-teacher-container').removeClass('d-none');
      fillTeachers(null);
    } else {
      $('.input-teacher-container').addClass('d-none');
    }
  });
  $(document).on('click', '#delete_user', function () {
    deleteUser(user_id);
  });
  $(document).on('click', '#edit_user', function () {
    editUser(user_id);
  });
});

function navbarChek(){
  get(`http://v1683738.hosted-by-vdsina.ru:5000/users/me`)
      .then(profile => {
        $("#navbar").find("#nickname").text(profile.login);
        if(!profile.roles.includes("ADMIN") && !profile.roles.includes("ROOT")){
          window.location.href = "../pages/mainpage.html"
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
