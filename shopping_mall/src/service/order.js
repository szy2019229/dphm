import axios from '../utils/axios'

export function createOrder(params) {
  return axios.post('/api/v1/saveOrder', params);
}

export function getOrderList(params) {
  return axios.get('/api/v1/order', { params });
}

export function getOrderDetail(id) {
  return axios.get(`/api/v1/order/${id}`);
}

export function cancelOrder(id) {
  return axios.put(`/api/v1/order/${id}/cancel`);
}

export function confirmOrder(id) {
  return axios.put(`/api/v1/order/${id}/finish`)
}

export function payOrder(params) {
  return axios.get('/api/v1/paySuccess', { params })
}




