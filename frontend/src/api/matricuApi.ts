import axios from "axios";
import { store } from "@/store/store";
import { onLogout } from "@/store/auth/authSlice";
import { onCleanLogout } from "@/store/dashboard/dashboardSlice";
import type { AuthStudent } from "@/store/auth/authSlice";
import type { Curso } from "@/types/types";

// --- Tipos de respuesta de la API ---

export interface LoginResponse {
  token: string;
  id: number;
  nombre: string;
  carrera: string;
  semestre: number;
  matriculado: boolean;
}

export interface RenewResponse {
  token: string;
  id: number;
  nombre: string;
  carrera: string;
  semestre: number;
  matriculado: boolean;
}

export interface EstudianteResponse {
  id: number;
  nombre: string;
  carrera: string;
  semestre: number;
  matriculado: boolean;
  creditosMatriculados: number;
  creditosPermitidos: number;
  cursosMatriculados: number[];
}

// --- Instancia de axios ---

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Interceptor request: añade Bearer token desde localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor response: 401 → logout automático
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      store.dispatch(onLogout());
      store.dispatch(onCleanLogout());
    }
    return Promise.reject(error);
  }
);

// --- Funciones de la API ---

export const matricuApi = {
  login: (id: number, password: string) =>
    api
      .post<LoginResponse>("/auth/login", { id, password })
      .then((r) => r.data),

  renewToken: () =>
    api.get<RenewResponse>("/auth/renew").then((r) => r.data),

  getCursos: () =>
    api.get<Curso[]>("/cursos").then((r) => r.data),

  getEstudiante: (id: number) =>
    api.get<EstudianteResponse>(`/estudiantes/${id}`).then((r) => r.data),

  addMatricula: (estudianteId: number, cursoIds: number[]) =>
    api
      .post<EstudianteResponse>(`/estudiantes/${estudianteId}/matricula`, {
        cursoIds,
      })
      .then((r) => r.data),

  removeMatricula: (estudianteId: number, cursoId: number) =>
    api
      .delete<EstudianteResponse>(
        `/estudiantes/${estudianteId}/matricula/${cursoId}`
      )
      .then((r) => r.data),
};

// Helper para mapear LoginResponse/RenewResponse a AuthStudent
export const toAuthStudent = (
  response: LoginResponse | RenewResponse
): AuthStudent => ({
  id: response.id,
  nombre: response.nombre,
  carrera: response.carrera,
  semestre: response.semestre,
  matriculado: response.matriculado,
});
