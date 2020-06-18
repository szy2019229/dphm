import axios from '../utils/axios'

export function getDetail(id) {
  return axios.get(`/api/v1/goods/detail/${id}`);
}

export function getCategory() {
  return axios.get('/api/v1/categories');
}

export function search(params) {
  return axios.get('/api/v1/search', { params });
}

