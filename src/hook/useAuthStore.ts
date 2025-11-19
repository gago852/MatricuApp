import {
  clearErrorMessage,
  onChecking,
  onLogin,
  onLogout,
} from "@/store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "./hooks";
import { EstudianteAuthSchemaArray } from "@/types/schemas";
import { onCleanLogout } from "@/store/dashboard/dashboardSlice";

export const useAuthStore = () => {
  const { status, user, errorMessage } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const startLogin = async (id: number, password: string) => {
    dispatch(onChecking());

    const backend = localStorage.getItem("estudiantes");

    if (!backend) {
      dispatch(onLogout("No hay conexión a internet"));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
      return;
    }

    const result = EstudianteAuthSchemaArray.safeParse(JSON.parse(backend));
    if (result.error) {
      dispatch(onLogout("No hay conexión a internet"));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
      return;
    }
    const estudiantes = result.data;
    const estudiante = estudiantes.find((estudiante) => estudiante.id === id);

    if (!estudiante) {
      dispatch(onLogout("No se encontró el estudiante"));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
      return;
    }

    if (password !== "123456" || estudiante.id !== id) {
      dispatch(onLogout("Contraseña incorrecta"));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
      return;
    }

    localStorage.setItem("userId", id.toString());
    dispatch(onLogin(estudiante));
  };

  const checkAuthSession = async () => {
    dispatch(onChecking());
    await new Promise((resolve) => setTimeout(resolve, 100));
    const userId = localStorage.getItem("userId");
    if (!userId) {
      dispatch(onLogout());
      return;
    }

    const backend = localStorage.getItem("estudiantes");

    if (!backend) {
      dispatch(onLogout("No hay conexión a internet"));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
      localStorage.removeItem("userId");
      return;
    }

    const result = EstudianteAuthSchemaArray.safeParse(JSON.parse(backend));
    if (result.error) {
      dispatch(onLogout("No hay conexión a internet"));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
      localStorage.removeItem("userId");
      return;
    }
    const estudiantes = result.data;

    const estudiante = estudiantes.find(
      (estudiante) => estudiante.id === Number(userId)
    );
    if (!estudiante) {
      dispatch(onLogout());
      localStorage.removeItem("userId");
      return;
    }

    dispatch(onLogin(estudiante));
  };

  const startLogout = () => {
    dispatch(onLogout());
    dispatch(onCleanLogout());
    localStorage.removeItem("userId");
  };

  return {
    // Properties
    status,
    user,
    errorMessage,
    // Methods
    startLogin,
    checkAuthSession,
    startLogout,
  };
};
