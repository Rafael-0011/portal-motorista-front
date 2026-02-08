import axios, { AxiosError, AxiosInstance } from 'axios';
import { LoginDto, LoginResponse } from '@/types/auth';
import {
  Motorista,
  CreateMotoristaDto,
  UpdateMotoristaDto,
  MotoristaFilters,
  PaginatedResponse,
} from '@/types/motorista';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/autenticacao/autenticar')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: LoginDto): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/autenticacao/autenticar', credentials);
    return response.data;
  },
};

export const motoristaApi = {
  getAll: async (filters?: MotoristaFilters, page: number = 0, size: number = 10, sort: string = 'nome,asc'): Promise<PaginatedResponse<Motorista>> => {
    const response = await apiClient.post<PaginatedResponse<Motorista>>(
      `/usuarios/search?page=${page}&size=${size}&sort=${sort}`,
      filters || {}
    );
    return response.data;
  },

  getById: async (id: string): Promise<Motorista> => {
    const response = await apiClient.get<Motorista>(`/usuarios/${id}`);
    return response.data;
  },

  create: async (data: CreateMotoristaDto): Promise<Motorista> => {
    const response = await apiClient.post<Motorista>('/usuarios', data);
    return response.data;
  },

  update: async (id: string, data: UpdateMotoristaDto): Promise<Motorista> => {
    const response = await apiClient.put<Motorista>(`/usuarios/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/usuarios/${id}`);
  },
};

export const vehicleTypeApi = {
  getAll: async (): Promise<{ value: string; label: string }[]> => {
    const response = await apiClient.get<{ value: string; label: string }[]>('/vehicle-types');
    return response.data;
  },
};

export { apiClient };
