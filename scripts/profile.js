import { del, get } from './requests.js';

async function deleteUser(user_id) {
  const url = 'http://v1683738.hosted-by-vdsina.ru:5000/users/' + user_id;
  const response = await del(url);
  window.location.href = 'users.html';
}
async function loadProfile(user_id) {
  const url = 'http://v1683738.hosted-by-vdsina.ru:5000/users/' + user_id;
  const user = await get(url);
  let block = $('#profile-template');
  for (const role of user.roles) {
    switch (role) {
      case 'STUDENT':
        block.find('#studentCheck').attr('checked', true);
        block.find('#input-group option:selected').text(user.group);
        block.find('.input-group-container').removeClass('d-none');
        break;
      case 'TEACHER':
        block.find('#teacherCheck').attr('checked', true);
        block.find('#input-teacher option:selected').text(user.teacherId.name);
        block.find('.input-teacher-container').removeClass('d-none');
        break;
      case 'EDITOR':
        block.find('#editorCheck').attr('checked', true);
        break;
      case 'ADMIN':
        block.find('#adminCheck').attr('checked', true);
        break;
      case 'ROOT':
        block.find('#rootCheckй').attr('checked', true);
        break;
    }
  }
}

$(document).ready(function () {
  const user_id = window.location.href.substring(41);
  loadProfile(user_id);
  $(document).on('click', '#delete_user', function () {
    deleteUser(user_id);
  });
});
