export function post(url, body) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem('userToken'),
      'Content-Type': 'application/json',
    }),
  }).then((r) => {
    if (r.status == 401) RefreshWhenExpired();
    else return r;
  });
}

export function get(url) {
  return fetch(url, {
    headers: new Headers({
      Authorization: 'Bearer ' + localStorage.getItem('userToken'),
    }),
  }).then((response) => {
    if (response.status === 401) RefreshWhenExpired()
    else return response.json();
  })
}

export function put(url, body) {
  return fetch(url, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: new Headers({
      Authorization: 'Bearer ' + localStorage.getItem('userToken'),
      'Content-Type': 'application/json',
    }),
  }).then((r) => {
    if (r.status == 401) RefreshWhenExpired();
    else return r;
  });
}

export function del(url) {
  return fetch(url, {
    method: 'DELETE',
    headers: new Headers({
      Authorization: 'Bearer ' + localStorage.getItem('userToken'),
      'Content-Type': 'application/json',
    }),
  }).then((r) => {
    if (r.status == 401) RefreshWhenExpired();
    else return r;
  });
}

function RefreshWhenExpired() {
  post(`http://v1683738.hosted-by-vdsina.ru:5000/auth/refresh?token=${localStorage.getItem('refreshUserToken')}`)
    .then(async (response) =>{
      if (response.ok){
        let newToken = await response.json();
        localStorage.setItem('userToken', newToken.accessToken);
        localStorage.setItem('refreshUserToken', newToken.refreshToken);
        window.location.reload()
      }
    })
}
