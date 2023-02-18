import { configureStore } from "@reduxjs/toolkit";
import appStateSlice from "./features/appStateSlice";
import appNameSlice from "./features/appNameSlice";

export const store = configureStore({
  reducer: {
    appState: appStateSlice,
    appName: appNameSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;