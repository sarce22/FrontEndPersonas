import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  // Registrar usuario
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Iniciar sesión
  login: async (credentials) => {
    const response = await api.post('/personas/login', credentials);
    return response.data;
  },

  // Verificar credenciales
  verify: async (credentials) => {
    const response = await api.post('/auth/verify', credentials);
    return response.data;
  },

  // Obtener usuarios
  getUsers: async () => {
    const response = await api.get('/auth/users');
    return response.data;
  }
};

// Servicios de personas
export const personasService = {
  // Obtener todas las personas
  getAll: async (search = '') => {
    const url = search ? `/personas?search=${encodeURIComponent(search)}` : '/personas';
    const response = await api.get(url);
    return response.data;
  },

  // Obtener persona por ID
  getById: async (id) => {
    const response = await api.get(`/personas/${id}`);
    return response.data;
  },

  // Crear nueva persona
  create: async (personaData) => {
    const response = await api.post('/personas', personaData);
    return response.data;
  },

  // Actualizar persona
  update: async (id, personaData) => {
    const response = await api.put(`/personas/${id}`, personaData);
    return response.data;
  },

  // Eliminar persona
  delete: async (id) => {
    const response = await api.delete(`/personas/${id}`);
    return response.data;
  },

  // Buscar personas
  search: async (term) => {
    const response = await api.get(`/personas/search?term=${encodeURIComponent(term)}`);
    return response.data;
  },

  // Obtener estadísticas
  getStats: async () => {
    const response = await api.get('/personas/stats');
    return response.data;
  }
};

// Servicio general para health check
export const generalService = {
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

export default api;