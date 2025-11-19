import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthStatus = "authenticated" | "not-authenticated" | "checking";

export interface AuthStudent {
  id: number;
  nombre: string;
  carrera: string;
  semestre: number;
  matriculado: boolean;
}
// Define a type for the slice state
interface AuthState {
  status: AuthStatus;
  user: AuthStudent | null;
  errorMessage: string | undefined;
}

// Define the initial state using that type
const initialState: AuthState = {
  status: "checking",
  user: null,
  errorMessage: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    onChecking: (state) => {
      state.status = "checking";
      state.user = null;
      state.errorMessage = undefined;
    },
    onLogin: (state, { payload }: PayloadAction<AuthStudent>) => {
      state.status = "authenticated";
      state.user = payload;
      state.errorMessage = undefined;
    },
    onLogout: (state, { payload }: PayloadAction<string | undefined>) => {
      state.status = "not-authenticated";
      state.user = null;
      state.errorMessage = payload;
    },
    clearErrorMessage: (state) => {
      state.errorMessage = undefined;
    },
  },
});

// Action creators are generated for each case reducer function
export const { onChecking, onLogin, onLogout, clearErrorMessage } =
  authSlice.actions;
