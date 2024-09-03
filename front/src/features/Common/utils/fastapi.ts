import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 로컬 스토리지에서 토큰을 가져오는 헬퍼 함수
const getStoredToken = (): string | null => {
  return localStorage.getItem('access_token');
};

// 현재 접속한 주소를 바탕으로 baseUrl을 구성합니다.
const baseUrl = `${window.location.origin}/api`;

// Axios 인스턴스를 생성합니다.
const axiosInstance: AxiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

const fastapi = (
  operation: 'get' | 'post' | 'put' | 'delete',
  url: string,
  params: { [key: string]: any },
  token?: string,
  success_callback?: (data?: any) => void,
  failure_callback?: (error: any) => void,
  options?: { headers?: { [key: string]: string } }
): void => {
  const method = operation;

  // 로컬 스토리지에서 토큰을 가져옵니다.
  const authToken = token || getStoredToken(); // 로컬 스토리지에서 토큰을 가져옵니다.

  const axiosOptions: AxiosRequestConfig = {
    method: method,
    url: url, // axiosInstance가 baseURL을 이미 설정했으므로 상대 URL 사용
    headers: {
      ...options?.headers, // 추가 헤더를 병합
      ...(authToken && { Authorization: `Bearer ${authToken}` }), // 토큰이 있으면 Authorization 헤더에 추가
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
