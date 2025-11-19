import { LoginPage } from "@/auth/LoginPage";
import { DashboardPage } from "@/dashboard/DashboardPage";
import { useAuthStore } from "@/hook/useAuthStore";
import { useEffect } from "react";

export const AppRouter = () => {
  const { checkAuthSession, status } = useAuthStore();

  useEffect(() => {
    checkAuthSession();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {status === "checking" && <div>Cargando...</div>}
      {status === "not-authenticated" && <LoginPage />}
      {status === "authenticated" && <DashboardPage />}
    </>
  );
};
