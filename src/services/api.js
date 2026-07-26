import axios from 'axios';
import { getIdToken } from './auth';
import router from '../router';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const PATIENTS_ENDPOINT = '/patients';
export const MEDICAL_HISTORY_ENDPOINT = '/medical-history';
export const SESSIONS_ENDPOINT = '/sessions';
export const HOME_SUPPORTS_ENDPOINT = '/home-supports';
export const ROUTINES_ENDPOINT = '/routines';
export const DIAGNOSTICS_ENDPOINT = '/diagnostics';
export const PATIENTS_URL = `${API_BASE_URL}${PATIENTS_ENDPOINT}`;
export const SESSION_URL = `${PATIENTS_URL}/{patient_id}${SESSIONS_ENDPOINT}`;

// Interceptor: agrega el token Firebase en cada request
axios.interceptors.request.use(async (config) => {
  const token = await getIdToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: redirige a login si recibe 401
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export const SessionsAPI = {
  list(patientId, params) {
    return axios.get(`${PATIENTS_URL}/${patientId}${SESSIONS_ENDPOINT}`, { params });
  },
  create(patientId, payload) {
    return axios.post(`${PATIENTS_URL}/${patientId}${SESSIONS_ENDPOINT}`, payload);
  },
  get(patientId, sessionId) {
    return axios.get(`${PATIENTS_URL}/${patientId}${SESSIONS_ENDPOINT}/${sessionId}`);
  },
  update(patientId, sessionId, payload) {
    return axios.patch(`${PATIENTS_URL}/${patientId}${SESSIONS_ENDPOINT}/${sessionId}`, payload);
  },
  remove(patientId, sessionId) {
    return axios.delete(`${PATIENTS_URL}/${patientId}${SESSIONS_ENDPOINT}/${sessionId}`);
  },
};

const RECOMMENDED_PRODUCTS_URL = `${API_BASE_URL}/recommended-products`;

export const RecommendedProductsAPI = {
  list() {
    return axios.get(RECOMMENDED_PRODUCTS_URL);
  },
  create(payload) {
    return axios.post(RECOMMENDED_PRODUCTS_URL, payload);
  },
  update(id, payload) {
    return axios.put(`${RECOMMENDED_PRODUCTS_URL}/${id}`, payload);
  },
  remove(id) {
    return axios.delete(`${RECOMMENDED_PRODUCTS_URL}/${id}`);
  },
  getBrands() {
    return axios.get(`${RECOMMENDED_PRODUCTS_URL}/brands`);
  },
  getCategories() {
    return axios.get(`${RECOMMENDED_PRODUCTS_URL}/categories`);
  },
  getFunctions() {
    return axios.get(`${RECOMMENDED_PRODUCTS_URL}/functions`);
  },
  getSkinTypes() {
    return axios.get(`${RECOMMENDED_PRODUCTS_URL}/skin-types`);
  },
};

const SERVICES_URL = `${API_BASE_URL}/services`;

export const ServicesAPI = {
  list() {
    return axios.get(SERVICES_URL);
  },
  get(id) {
    return axios.get(`${SERVICES_URL}/${id}`);
  },
  create(payload) {
    return axios.post(SERVICES_URL, payload);
  },
  update(id, payload) {
    return axios.put(`${SERVICES_URL}/${id}`, payload);
  },
  remove(id) {
    return axios.delete(`${SERVICES_URL}/${id}`);
  },
};

