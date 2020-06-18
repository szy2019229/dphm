import axios from '../utils/axios'

export function getUserInfo() {
  return axios.get('/api/v1/user/info');
}

export function EditUserInfo(params) {
  return axios.put('/api/v1/user/info', params);
}

export function login(params) {
  return axios.post('/api/v1/user/login', params);
}

export function logout() {
  return axios.post('/api/v1/user/logout')
}

export function register(params) {
  return axios.post('/api/v1/user/register', params);
}

