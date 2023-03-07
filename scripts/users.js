import { get } from './requests.js';
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
  for (const user of users) {
    let roles = [];
    for (const role of user.roles) {
      switch (role) {
        case 0:
          roles.push('студент');
          break;
        case 1:
          roles.push('преподаватель');
          break;
        case 2:
          roles.push('редактор');
          break;
        case 3:
          roles.push('администратор');
          break;
      }
    }
    const block = template.clone();
    block.find('.user-login').text(user.login);
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
$(document).ready(function () {
  $('#findButton').click(function () {
    let roles = [];
    $('input:checkbox[name=checkbox]:checked').each(function () {
      roles.push($(this).val());
    });
    loadUsers(roles);
  });
});
