import type { Curso, ViewMode } from "@/types/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface DashboardState {
  isLoading: boolean;
  cursos: Curso[];
  viewMode: ViewMode;
  creditosMatriculados: number;
  creditosPermitidos: number;
  cursosMatriculados: number[];
  errorMessage: string | undefined;
}

// Define the initial state using that type
const initialState: DashboardState = {
  isLoading: false,
  cursos: [],
  viewMode: "list",
  creditosMatriculados: 0,
  creditosPermitidos: 0,
  cursosMatriculados: [],
  errorMessage: undefined,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setCreditosPermitidosUsuario: (state, action: PayloadAction<number>) => {
      state.creditosPermitidos = action.payload;
    },
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    setCursos: (state, action: PayloadAction<Curso[]>) => {
      state.cursos = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    onAddCursosMatriculados: (state, action: PayloadAction<Curso[]>) => {
      if (action.payload.length === 0) return;

      state.cursos = state.cursos.map((curso) => {
        if (
          action.payload.some(
            (cursoMatriculado) => cursoMatriculado.id === curso.id
          )
        ) {
          return {
            ...curso,
            matriculados: curso.matriculados + 1,
          };
        }
        return {
          ...curso,
        };
      });

      const nuevosIds = action.payload.map((curso) => curso.id);
      state.cursosMatriculados = Array.from(
        new Set([...state.cursosMatriculados, ...nuevosIds])
      );

      const creditosAgregados = action.payload.reduce(
        (total, curso) => total + curso.creditos,
        0
      );
      state.creditosMatriculados += creditosAgregados;
    },
    onRemoveCursoMatriculados: (state, action: PayloadAction<Curso>) => {
      const nuevaLista = state.cursosMatriculados.filter(
        (curso) => curso !== action.payload.id
      );

      state.cursos = state.cursos.map((curso) => {
        if (curso.id === action.payload.id) {
          return {
            ...action.payload,
          };
        }
        return {
          ...curso,
        };
      });

      state.cursosMatriculados = nuevaLista;
      state.creditosMatriculados = Math.max(
        state.creditosMatriculados - action.payload.creditos,
        0
      );
    },
    onHydrateCursosMatriculados: (state, action: PayloadAction<Curso[]>) => {
      const idsUnicos = Array.from(
        new Set(action.payload.map((curso) => curso.id))
      );
      state.cursosMatriculados = idsUnicos;
      state.creditosMatriculados = action.payload.reduce(
        (total, curso) => total + curso.creditos,
        0
      );
    },
    onSetErrorMessage: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
    },
    onCleanLogout: (state) => {
      state.cursosMatriculados = [];
      state.creditosMatriculados = 0;
      state.creditosPermitidos = 0;
      state.cursos = [];
      state.viewMode = "list";
      state.isLoading = false;
      state.errorMessage = undefined;
    },
  },
});

export const {
  onAddCursosMatriculados,
  onRemoveCursoMatriculados,
  onHydrateCursosMatriculados,
  onSetErrorMessage,
  setCreditosPermitidosUsuario,
  setCursos,
  setIsLoading,
  setViewMode,
  onCleanLogout,
} = dashboardSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

// export default counterSlice.reducer
