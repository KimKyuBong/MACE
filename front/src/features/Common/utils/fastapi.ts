import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 매개변수와 콜백 함수들에 대한 타입을 정의합니다.
type Operation = 'get' | 'post' | 'put' | 'delete';
interface Params {
  [key: string]: any;
}

interface RequestOptions {
  headers?: { [key: string]: string };
}

// Axios 인스턴스를 생성합니다.
const baseUrl = process.env.REACT_APP_API_SERVER_URL || '';
const axiosInstance: AxiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

const fastapi = (
  operation: Operation,
  url: string,
  params: Params,
  token?: string,
  success_callback?: (data?: any) => void,
  failure_callback?: (error: any) => void,
  options?: RequestOptions
): void => {
  const method = operation;
  const axiosOptions: AxiosRequestConfig = {
    method: method,
    url: url, // axiosInstance가 baseURL을 이미 설정했으므로 상대 URL 사용
    headers: {
      ...options?.headers, // 추가 헤더를 병합
      ...(token && { Authorization: `Bearer ${token}` }), // 토큰이 있으면 Authorization 헤더에 추가
    },
  };

  if (method.toLowerCase() === 'get') {
    axiosOptions.params = params;
  } else {
    axiosOptions.data = params;
  }

  axiosInstance(axiosOptions)
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
};

export default fastapi;
