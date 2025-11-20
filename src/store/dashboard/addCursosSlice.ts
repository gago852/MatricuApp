import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface CursoPanelState {
  isOpen: boolean;
}

// Define the initial state using that type
const initialState: CursoPanelState = {
  isOpen: false,
};

export const cursoPanelSlice = createSlice({
  name: "cursoPanel",
  initialState,
  reducers: {
    openCursoPanel: (state /* action: PayloadAction<number> */) => {
      state.isOpen = true;
    },
    closeCursoPanel: (state /* action: PayloadAction<number> */) => {
      state.isOpen = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { openCursoPanel, closeCursoPanel } = cursoPanelSlice.actions;
