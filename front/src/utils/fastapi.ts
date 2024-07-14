import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// 매개변수와 콜백 함수들에 대한 타입을 정의합니다.
type Operation = 'get' | 'post' | 'put' | 'delete';
interface Params {
  [key: string]: any;
}

interface RequestOptions {
  headers?: { [key: string]: string };
}

const fastapi = (
  operation: Operation,
  url: string,
  params: Params,
  success_callback?: (data?: any) => void,
  failure_callback?: (error: any) => void,
  options?: RequestOptions
): void => {
  const method = operation;
  const baseUrl = process.env.REACT_APP_API_SERVER_URL; // 환경 변수 사용
  const _url = baseUrl + url;

  // AxiosRequestConfig 타입을 사용하여 options를 정의합니다.
  const axiosOptions: AxiosRequestConfig = {
    method: method,
    url: _url,
    headers: {
      "Content-Type": 'application/json',
      ...options?.headers, // 추가 헤더를 병합
    },
  };

  if (method.toLowerCase() === 'get') {
    axiosOptions.params = params;
  } else {
    axiosOptions.data = params;
  }

  axios(axiosOptions)
    .then((response: AxiosResponse) => {
      if (response.status === 204) {
        success_callback?.();
      } else {
        success_callback?.(response.data);
      }
    })
    .catch((error) => {
      if (failure_callback) {
        failure_callback(error.response ? error.response.data : error);
      } else {
        alert(JSON.stringify(error.response ? error.response.data : error));
      }
    });
}

export default fastapi;
