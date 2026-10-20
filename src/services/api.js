import axios from 'axios';
import { getIdToken } from './auth';
import router from '../router';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const PATIENTS_ENDPOINT = '/patients';
export const ANAMNESIS_ENDPOINT = '/anamnesis';
export const SKIN_EVALUATION_ENDPOINT = '/skin-evaluation';
export const HEALTH_SAFETY_HABITS_ENDPOINT = '/health-safety-habits';
export const FACIAL_ANALYSIS_ENDPOINT = '/facial-analysis';
export const SESSIONS_ENDPOINT = '/sessions';
export const ROUTINES_ENDPOINT = '/routines';
export const PATIENTS_URL = `${API_BASE_URL}${PATIENTS_ENDPOINT}`;
export const SESSION_URL = `${PATIENTS_URL}/{patient_id}${SESSIONS_ENDPOINT}`;

export const SkinEvaluationAPI = {
  get(patientId) {
    return axios.get(`${PATIENTS_URL}/${patientId}${SKIN_EVALUATION_ENDPOINT}`);
  },
  save(patientId, payload) {
    return axios.put(`${PATIENTS_URL}/${patientId}${SKIN_EVALUATION_ENDPOINT}`, payload);
  },
  patch(patientId, payload) {
    return axios.patch(`${PATIENTS_URL}/${patientId}${SKIN_EVALUATION_ENDPOINT}`, payload);
  }
};

export const HealthSafetyHabitsAPI = {
  get(patientId) {
    return axios.get(`${PATIENTS_URL}/${patientId}${HEALTH_SAFETY_HABITS_ENDPOINT}`);
  },
  save(patientId, payload) {
    return axios.put(`${PATIENTS_URL}/${patientId}${HEALTH_SAFETY_HABITS_ENDPOINT}`, payload);
  },
  patch(patientId, payload) {
    return axios.patch(`${PATIENTS_URL}/${patientId}${HEALTH_SAFETY_HABITS_ENDPOINT}`, payload);
  }
};

export const FACIAL_IMAGE_TYPES = Object.freeze({
  DIRECT_WHITE_LIGHT: 'DIRECT_WHITE_LIGHT',
  CROSS_POLARIZED_LIGHT: 'CROSS_POLARIZED_LIGHT',
  UV_WOOD_LIGHT: 'UV_WOOD_LIGHT',
  LUZ_BLANCA_DIRECTA: 'DIRECT_WHITE_LIGHT',
  LUZ_POLARIZADA_CRUZADA: 'CROSS_POLARIZED_LIGHT',
  LUZ_UV_WOOD: 'UV_WOOD_LIGHT'
});

export const FacialAnalysisAPI = {
  get(patientId) {
    return axios.get(`${PATIENTS_URL}/${patientId}${FACIAL_ANALYSIS_ENDPOINT}`);
  },
  save(patientId, payload) {
    return axios.put(`${PATIENTS_URL}/${patientId}${FACIAL_ANALYSIS_ENDPOINT}`, payload);
  },
  patch(patientId, payload) {
    return axios.patch(`${PATIENTS_URL}/${patientId}${FACIAL_ANALYSIS_ENDPOINT}`, payload);
  },
  uploadImage(patientId, file, categoryType, note = '', zone = '') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category_type', categoryType);
    if (note) {
      formData.append('note', note);
    }
    if (zone) {
      formData.append('zone', zone);
    }
    return axios.post(`${PATIENTS_URL}/${patientId}${FACIAL_ANALYSIS_ENDPOINT}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateImage(patientId, imageId, payload) {
    return axios.patch(`${PATIENTS_URL}/${patientId}${FACIAL_ANALYSIS_ENDPOINT}/images/${imageId}`, payload);
  },
  deleteImage(patientId, imageId) {
    return axios.delete(`${PATIENTS_URL}/${patientId}${FACIAL_ANALYSIS_ENDPOINT}/images/${imageId}`);
  }
};

export const AnamnesisAPI = {
  get(patientId) {
    return axios.get(`${PATIENTS_URL}/${patientId}${ANAMNESIS_ENDPOINT}`);
  },
  save(patientId, payload) {
    return axios.put(`${PATIENTS_URL}/${patientId}${ANAMNESIS_ENDPOINT}`, payload);
  },
  patch(patientId, payload) {
    return axios.patch(`${PATIENTS_URL}/${patientId}${ANAMNESIS_ENDPOINT}`, payload);
  }
};

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
  getCategories() {
    return axios.get(`${SERVICES_URL}/categories`);
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
  reorderCategories(categoryNames) {
    return axios.put(`${SERVICES_URL}/categories/reorder`, categoryNames);
  },
  deleteCategory(name) {
    return axios.delete(`${SERVICES_URL}/categories`, { params: { name } });
  },
};

const CONSENTS_URL = `${API_BASE_URL}/consents`;

export const ConsentsAPI = {
  getActiveTemplate() {
    return axios.get(`${CONSENTS_URL}/template/active`);
  },
  getTemplateHistory() {
    return axios.get(`${CONSENTS_URL}/template/history`);
  },
  createTemplateVersion(payload) {
    return axios.post(`${CONSENTS_URL}/template`, payload);
  },
  getPatientConsentStatus(patientId) {
    return axios.get(`${PATIENTS_URL}/${patientId}/consent`);
  },
  signPatientConsent(patientId, payload) {
    return axios.post(`${PATIENTS_URL}/${patientId}/consent`, payload);
  },
  getPatientConsentHistory(patientId) {
    return axios.get(`${PATIENTS_URL}/${patientId}/consent/history`);
  },
};

const WHATSAPP_MESSAGES_URL = `${API_BASE_URL}/whatsapp-messages`;

export const WhatsappMessagesAPI = {
  list() {
    return axios.get(WHATSAPP_MESSAGES_URL);
  },
  get(id) {
    return axios.get(`${WHATSAPP_MESSAGES_URL}/${id}`);
  },
  create(payload) {
    return axios.post(WHATSAPP_MESSAGES_URL, payload);
  },
  update(id, payload) {
    return axios.put(`${WHATSAPP_MESSAGES_URL}/${id}`, payload);
  },
  remove(id) {
    return axios.delete(`${WHATSAPP_MESSAGES_URL}/${id}`);
  },
};

const SUPPLIERS_URL = `${API_BASE_URL}/suppliers`;

export const SuppliersAPI = {
  list() {
    return axios.get(SUPPLIERS_URL);
  },
  get(id) {
    return axios.get(`${SUPPLIERS_URL}/${id}`);
  },
  create(payload) {
    return axios.post(SUPPLIERS_URL, payload);
  },
  update(id, payload) {
    return axios.put(`${SUPPLIERS_URL}/${id}`, payload);
  },
  remove(id) {
    return axios.delete(`${SUPPLIERS_URL}/${id}`);
  },
};


