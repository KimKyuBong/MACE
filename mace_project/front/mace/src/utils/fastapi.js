import axios from 'axios';

const fastapi = (operation, url, params, success_callback, failure_callback) => {
  let method = operation;
  let baseUrl = process.env.REACT_APP_API_SERVER_URL; // 환경 변수 사용
  let _url = baseUrl + url;
  let options = {
    method: method,
    url: _url,
    headers: {
      "Content-Type": 'application/json'
    }
  };

  if (method.toLowerCase() === 'get') {
    options.params = params;
  } else {
    options.data = params;
  }

  axios(options)
    .then(response => {
      if (response.status === 204) {
        if (success_callback) {
          success_callback();
        }
      }
      if (success_callback) {
        success_callback(response.data);
      }
    })
    .catch(error => {
      if (failure_callback) {
        failure_callback(error.response ? error.response.data : error);
      } else {
        alert(JSON.stringify(error.response ? error.response.data : error));
      }
    });
}

export default fastapi;
