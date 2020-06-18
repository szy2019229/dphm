import axios from '../utils/axios'

export function addCart(params) {
  return axios.post('/api/v1/shop-cart', params);
}

export function modifyCart(params) {
  return axios.put('/api/v1/shop-cart', params);
}

export function getCart(params) {
  return axios.get('/api/v1/shop-cart', { params });
}

export function deleteCartItem(id) {
  return axios.delete(`/api/v1/shop-cart/${id}`);
}

export function getByCartItemIds(params) {
  return axios.get('/api/v1/shop-cart/settle', { params });
}

