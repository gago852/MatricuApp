import type { Curso } from "@/types/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface DashboardState {
  cursos: Curso[];
}

// Define the initial state using that type
const initialState: DashboardState = {
  cursos: [],
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    getCursos: (state) => {
      state.cursos = [];
    },
  },
});

export const { getCursos } = dashboardSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

// export default counterSlice.reducer
