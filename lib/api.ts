import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure axios to handle token in a way that works with SSR
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Handle API errors
    const message = error.response?.data?.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const login = async (username: string, password: string) => {
  console.log(username,password)
  const response = await api.post('/login', { username, password });
  return response.data;
};

export const getQueue = async () => {
  const response = await api.get('/queue');
  return response.data;
};

export const addToQueue = async (patientData: any) => {
  const response = await api.post('/queue', patientData);
  return response.data;
};

export const updateQueueStatus = async (id: string, status: string) => {
  const response = await api.patch(`/queue/${id}`, { status });
  return response.data;
};

export const getAppointments = async () => {
  const response = await api.get('/appointments');
  return response.data;
};

export const bookAppointment = async (appointmentData: any) => {
  const response = await api.post('/appointments', appointmentData);
  return response.data;
};

export const updateAppointment = async (id: string, data: any) => {
  const response = await api.patch(`/appointments/${id}`, data);
  return response.data;
};

export const getDoctors = async () => {
  const response = await api.get('/doctors');
  return response.data;
};

export const addDoctor = async (doctorData: any) => {
  const response = await api.post('/doctors', doctorData);
  return response.data;
};

export const updateDoctor = async (id: string, data: any) => {
  const response = await api.patch(`/doctors/${id}`, data);
  return response.data;
};

export const deleteDoctor = async (id: string) => {
  const response = await api.delete(`/doctors/${id}`);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const addUser = async (userData: any) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const updateUser = async (id: string, data: any) => {
  const response = await api.patch(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};