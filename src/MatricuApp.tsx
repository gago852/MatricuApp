import { Provider } from "react-redux";
import { store } from "./store/store";
import { useEffect } from "react";
import { loadBackend } from "./helpers/loadBackend";
import { Toaster } from "./components/ui/sonner";
import { AppRouter } from "./router/AppRouter";

export const MatricuApp = () => {
  useEffect(() => {
    loadBackend();
  }, []);

  return (
    <Provider store={store}>
      <Toaster />
      {/* <LoginPage /> */}
      {/* <DashboardPage /> */}
      <AppRouter />
    </Provider>
  );
};
