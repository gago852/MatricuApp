import { configureStore } from "@reduxjs/toolkit";
import { dashboardSlice } from "./dashboard/dashboardSlice";
import { authSlice } from "./auth/authSlice";
import { cursoPanelSlice } from "./dashboard/addCursosSlice";

export const store = configureStore({
  reducer: {
    dashboard: dashboardSlice.reducer,
    auth: authSlice.reducer,
    cursoPanel: cursoPanelSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
