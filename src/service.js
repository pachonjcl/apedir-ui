import axios from 'axios';

import { SERVER_URL } from './settings';

export function subscribeToNotifications(body) {
  return axios.post(`${SERVER_URL}/notifications/subscribe`, body, {
    headers: { Authorization: localStorage.getItem('token') }
  });
}

export function login(body) {
  return axios.post(`${SERVER_URL}/login`, body);
}

export function register(body) {
  return axios.post(`${SERVER_URL}/register`, body);
}

export function increaseTime(id, body) {
  return axios.post(`${SERVER_URL}/purchases/${id}/increase_time`, body, {
    headers: { Authorization: localStorage.getItem('token') }
  });
}

export function getPurchaseLogs(id) {
  return axios.get(`${SERVER_URL}/purchases/${id}/logs`, {
    headers: { Authorization: localStorage.getItem('token') }
  });
}

export function changePassword(body) {
  return axios.post(`${SERVER_URL}/users/change_password`, body, {
    headers: { Authorization: localStorage.getItem('token') }
  });
}

export function uploadImage(body) {
  return axios.post(`${SERVER_URL}/users/upload`, body, {
    headers: { 
      Authorization: localStorage.getItem('token'),
      'content-type': 'multipart/form-data'
    }
  }); 
}

export function createPurchase(body) {
  return axios.post(`${SERVER_URL}/purchases`, body, {
    headers: { Authorization: localStorage.getItem('token') }
  });
}

export function loadPurchases() {
  return axios.get(`${SERVER_URL}/purchases`, {
    headers: { Authorization: localStorage.getItem('token') }
  });
}

export function loadUsers() {
  return axios.get(`${SERVER_URL}/users`, {
    headers: { Authorization: localStorage.getItem('token') }
  });
}

export function loadProducts() {
  return axios.get(`${SERVER_URL}/products`, {
    headers: { Authorization: localStorage.getItem('token') }
  });
}

export function loadWishes(id) {
  return axios.get(`${SERVER_URL}/purchases/${id}/wishes`, {
    headers: { Authorization: localStorage.getItem('token') }
  });
}

export function loadUsersByPurchase(id) {
  return axios.get(`${SERVER_URL}/purchases/${id}/users`, {
    headers: { Authorization: localStorage.getItem('token') }
  });
}

export function loadProductsByPurchase(id) {
  return axios.get(`${SERVER_URL}/purchases/${id}/products`, {
    headers: { Authorization: localStorage.getItem('token') }
  });
}

export function loadWishProducts(id) {
  return axios.get(`${SERVER_URL}/wishes/${id}/products`, {
    headers: { Authorization: localStorage.getItem('token') }
  });
}

export function saveWishProducts(id, wishes) {
  return axios.post(`${SERVER_URL}/purchases/${id}/wishes`, wishes, {
    headers: { Authorization: localStorage.getItem('token') }
  });
}

export function loadPurchaseTypes() {
  return axios.get(`${SERVER_URL}/purchase_types`, {
    headers: { Authorization: localStorage.getItem('token') }
  });
}

export function loadPurchaseTypeProducts(id) {
  return axios.get(`${SERVER_URL}/purchase_types/${id}/products`, {
    headers: { Authorization: localStorage.getItem('token') }
  });
}

export function updateProductById(product) {
  let { product_id } = product;
  return axios.put(`${SERVER_URL}/products/${product_id}`, product, {
    headers: { Authorization: localStorage.getItem('token') }
  });
}

export function createPurchaseTypeProduct(id, product) {
  return axios.post(`${SERVER_URL}/purchase_types/${id}/products`, product, {
    headers: { Authorization: localStorage.getItem('token') }
  });
}

export default {
  login,
  register,
  uploadImage,
  increaseTime,
  loadPurchases,
  loadUsers,
  loadProducts,
  loadWishes,
  loadWishProducts,
  saveWishProducts,
  createPurchase,
  loadPurchaseTypes,
  loadUsersByPurchase,
  loadProductsByPurchase,
  loadPurchaseTypeProducts,
  updateProductById,
  createPurchaseTypeProduct
};
