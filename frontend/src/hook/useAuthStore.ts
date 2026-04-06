import {
  clearErrorMessage,
  onChecking,
  onLogin,
  onLogout,
} from "@/store/auth/authSlice";
import { onCleanLogout } from "@/store/dashboard/dashboardSlice";
import { useAppDispatch, useAppSelector } from "./hooks";
import { matricuApi, toAuthStudent } from "@/api/matricuApi";

export const useAuthStore = () => {
  const { status, user, errorMessage } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const startLogin = async (id: number, password: string) => {
    dispatch(onChecking());
    try {
      const response = await matricuApi.login(id, password);
      localStorage.setItem("token", response.token);
      localStorage.setItem("userId", response.id.toString());
      dispatch(onLogin(toAuthStudent(response)));
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Credenciales incorrectas";
      dispatch(onLogout(message));
      setTimeout(() => dispatch(clearErrorMessage()), 10);
    }
  };

  const checkAuthSession = async () => {
    dispatch(onChecking());
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      dispatch(onLogout());
      return;
    }

    try {
      const response = await matricuApi.renewToken();
      localStorage.setItem("token", response.token);
      dispatch(onLogin(toAuthStudent(response)));
    } catch {
      // El interceptor de axios ya despacha el logout en caso de 401
    }
  };

  const startLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    dispatch(onLogout());
    dispatch(onCleanLogout());
  };

  return {
    status,
    user,
    errorMessage,
    startLogin,
    checkAuthSession,
    startLogout,
  };
};
