import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor to attach auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agri_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle stale/expired sessions cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 404) &&
      error.config?.url?.includes('/auth/me')
    ) {
      localStorage.removeItem('agri_token');
    }
    return Promise.reject(error);
  }
);

// ---------- Auth ----------
export const loginUser = (payload) => api.post('/auth/login', payload).then((r) => r.data);
export const registerUser = (payload) => api.post('/auth/register', payload).then((r) => r.data);
export const getMe = () => api.get('/auth/me').then((r) => r.data);

// ---------- Crops Reference ----------
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
  return api
    .post('/detect-disease', formData, {
      headers: {
        'Content-Type': undefined, // Let browser set boundary automatically
      },
    })
    .then((r) => r.data);
};

// ---------- Community & Local Connect ----------
export const getPosts = () => api.get('/community/forum').then((r) => r.data);
export const createPost = (payload) => api.post('/community/forum', payload).then((r) => r.data);
export const addReply = (id, payload) => api.post(`/community/forum/${id}/reply`, payload).then((r) => r.data);

export const requestConsultation = (payload) => api.post('/community/consultations', payload).then((r) => r.data);

export const getFarmers = (params) => api.get('/community/farmers', { params }).then((r) => r.data);
export const addFarmer = (payload) => api.post('/community/farmers', payload).then((r) => r.data);
export const addFarmerCrop = (farmerId, payload) => api.post(`/community/farmers/${farmerId}/crops`, payload).then((r) => r.data);
export const updateIrrigationMilestone = (farmerId, cropId, milestoneId, payload) =>
  api.patch(`/community/farmers/${farmerId}/crops/${cropId}/irrigation/${milestoneId}`, payload).then((r) => r.data);
export const getCropPresets = () => api.get('/community/crops/presets').then((r) => r.data);

// ---------- Marketplace (Seller Sell Posts & Items) ----------
export const getListings = (params) => api.get('/community/marketplace', { params }).then((r) => r.data);
export const createListing = (payload) => api.post('/community/marketplace', payload).then((r) => r.data);
export const updateListingStatus = (id, status) => api.patch(`/community/marketplace/${id}`, { status }).then((r) => r.data);

export default api;
