import axios from 'axios';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000') + '/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authApi = {
    login: (username: string, password: string) =>
        api.post('/auth/login', { username, password }),
};

// Reports API
export const reportsApi = {
    getDaily: (date?: string, branchId?: string) =>
        api.get('/reports/daily', { params: { date, branchId } }),
    getMechanicCommission: (month?: string, branchId?: string) =>
        api.get('/reports/mechanic-commission', { params: { month, branchId } }),
    getTopProducts: (month?: string, branchId?: string, limit?: number) =>
        api.get('/reports/top-products', { params: { month, branchId, limit } }),
    getVehicleHistory: (plate: string) =>
        api.get(`/reports/vehicle-history/${plate}`),
    getLowStock: (branchId?: string) =>
        api.get('/reports/low-stock', { params: { branchId } }),
};

// Master Data API
export const branchesApi = {
    getAll: () => api.get('/branches'),
    getOne: (id: string) => api.get(`/branches/${id}`),
    create: (data: any) => api.post('/branches', data),
    update: (id: string, data: any) => api.patch(`/branches/${id}`, data),
    delete: (id: string) => api.delete(`/branches/${id}`),
};

export const productsApi = {
    getAll: () => api.get('/products'),
    getOne: (id: string) => api.get(`/products/${id}`),
    create: (data: any) => api.post('/products', data),
    update: (id: string, data: any) => api.patch(`/products/${id}`, data),
    delete: (id: string) => api.delete(`/products/${id}`),
};

export const mechanicsApi = {
    getAll: (branchId?: string) => api.get('/mechanics', { params: { branchId } }),
    getOne: (id: string) => api.get(`/mechanics/${id}`),
    create: (data: any) => api.post('/mechanics', data),
    update: (id: string, data: any) => api.patch(`/mechanics/${id}`, data),
    delete: (id: string) => api.delete(`/mechanics/${id}`),
};

export const transactionsApi = {
    getAll: (branchId?: string, status?: string) =>
        api.get('/transactions', { params: { branchId, status } }),
    getOne: (id: string) => api.get(`/transactions/${id}`),
};
