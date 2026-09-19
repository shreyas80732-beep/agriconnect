import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ---------- Crops ----------
export const getCrops = () => api.get('/crops').then((r) => r.data);

// ---------- Weather ----------
export const getWeather = (city) => api.post('/weather', { city }).then((r) => r.data);

// ---------- AI Features ----------
export const recommendCrop = (payload) => api.post('/recommend-crop', payload).then((r) => r.data);

export const predictYield = (payload) => api.post('/yield-prediction', payload).then((r) => r.data);

export const fertilizerGuide = (payload) => api.post('/fertilizer-guide', payload).then((r) => r.data);

export const detectDisease = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return axios
    .post('/api/detect-disease', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data);
};

// ---------- Community ----------
export const getPosts = () => api.get('/community/forum').then((r) => r.data);
export const createPost = (payload) => api.post('/community/forum', payload).then((r) => r.data);
export const addReply = (id, payload) => api.post(`/community/forum/${id}/reply`, payload).then((r) => r.data);

export const requestConsultation = (payload) => api.post('/community/consultations', payload).then((r) => r.data);

export const getFarmers = (params) => api.get('/community/farmers', { params }).then((r) => r.data);

export const getListings = (params) => api.get('/community/marketplace', { params }).then((r) => r.data);
export const createListing = (payload) => api.post('/community/marketplace', payload).then((r) => r.data);

export default api;
