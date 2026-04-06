import { Provider } from "react-redux";
import { store } from "./store/store";
import { Toaster } from "./components/ui/sonner";
import { AppRouter } from "./router/AppRouter";

export const MatricuApp = () => {
  return (
    <Provider store={store}>
      <Toaster />
      <AppRouter />
    </Provider>
  );
};
