import { get, post } from './requests.js';
async function loadUsers(roles) {
  $('#users-container').empty();
  let url = 'http://v1683738.hosted-by-vdsina.ru:5000/users/?';
  for (const role of roles) {
    url += new URLSearchParams({ role: role }) + '&';
  }
  url = url.substring(0, url.length - 1);
  const response = await fetch(url, {
    headers: new Headers({
      Authorization: 'Bearer ' + localStorage.getItem('userToken'),
    }),
  });
  const users = await response.json();
  const template = $('#user-template');
  for (const user of users.users) {
    let roles = [];
    for (const role of user.roles) {
      switch (role) {
        case 'STUDENT':
          roles.push('студент');
          break;
        case 'TEACHER':
          roles.push('преподаватель');
          break;
        case 'EDITOR':
          roles.push('редактор');
          break;
        case 'ADMIN':
          roles.push('администратор');
          break;
      }
    }
    const block = template.clone();
    block.find('.user-login').text(user.login);
    block.attr('user-id', user.id);
    block.find('.user-role').text(user.role);
    if (user.group != null) {
      block.find('.user-group').text(user.group);
    } else {
      block.find('.user-group').text('');
    }
    block.find('.user-role').text(roles.join(', '));
    block.removeClass('d-none');
    if (roles.length > 0) {
      $('#users-container').append(block);
    }
  }
}

function navbarChek() {
  get(`http://v1683738.hosted-by-vdsina.ru:5000/users/me`).then((profile) => {
    $('#navbar').find('#nickname').text(profile.login);
    $('#signout').click(() => {
      post(`http://v1683738.hosted-by-vdsina.ru:5000/auth/logout`).then(() => {
        localStorage.setItem('userToken', '');
        localStorage.setItem('refreshUserToken', '');
        window.location.href = '../pages/login.html';
      });
    });
    // todo добавить обработку ролей
    localStorage.setItem('userId', profile.id);
  });
}
function toUserDetail(user_id) {
  window.location.href = 'profile.html#' + user_id;
}

$(document).ready(function () {
  navbarChek();
  $('#findButton').click(function () {
    let roles = [];
    $('input:checkbox[name=checkbox]:checked').each(function () {
      roles.push($(this).val());
    });
    loadUsers(roles);
  });
  $(document).on('click', '.card', function () {
    toUserDetail($(this).attr('user-id'));
  });
});
