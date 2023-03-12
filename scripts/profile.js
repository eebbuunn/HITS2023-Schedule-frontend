import { del, get, put } from './requests.js';

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
}
async function editUser(user_id) {
  const url = 'http://v1683738.hosted-by-vdsina.ru:5000/users/' + user_id;
  let roles = [];
  $('input:checkbox[name=checkbox]:checked').each(function () {
    roles.push($(this).val());
  });
  const group = $('#input-group').val();
  const teacher_id = $('#input-teacher').val();
  const body = {
    roles: roles,
    teacherId: teacher_id,
    group: Number(group),
  };
  const response = await put(url, body);
  if (response.ok) {
    loadProfile(user_id);
  } else {
    response.text().then((text) => {
      $('#errorModal').find('.modal-body').text(JSON.parse(text).errors.message);
      $('#errorModal').modal('show');
    });
  }
}

$(document).ready(function () {
  const user_id = window.location.href.substring(41);
  loadProfile(user_id);
  $('#studentCheck').change(function () {
    if ($('#studentCheck').prop('checked')) {
      $('.input-group-container').removeClass('d-none');
    } else {
      $('.input-group-container').addClass('d-none');
    }
  });
  $('#teacherCheck').change(function () {
    if ($('#teacherCheck').prop('checked')) {
      $('.input-teacher-container').removeClass('d-none');
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
