import { del } from './requests.js';
async function deleteUser(user_id) {
  const url = 'http://v1683738.hosted-by-vdsina.ru:5000/users/' + user_id;
  const response = await del(url);
  window.location.href = 'users.html';
}

$(document).ready(function () {
  const user_id = window.location.href.substring(41);
  $(document).on('click', '#delete_user', function () {
    deleteUser(user_id);
  });
});
