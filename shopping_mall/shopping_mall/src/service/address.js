import axios from '../utils/axios'

export function addAddress(params) {
  return axios.post('/api/v1/address', params);
}

export function EditAddress(params) {
  return axios.put('/api/v1/address', params);
}

export function DeleteAddress(id) {
  return axios.delete(`/api/v1/address/${id}`);
}

export function getDefaultAddress() {
  return axios.get('/api/v1/address/default');
}

export function getAddressList() {
  return axios.get('/api/v1/address', { pageNumber: 1, pageSize: 1000 })
}

export function getAddressDetail(id) {
  return axios.get(`/api/v1/address/${id}`)
}


