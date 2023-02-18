import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type appName = {
  appName: string;
};

const initialState: appName = {
  appName: ""
};

export const appNameSlice = createSlice({
  name: "appName",
  initialState,
  reducers: {
    setAppName: (state, action: PayloadAction<string>) => {
      state.appName = action.payload;
    }
  }
});
export const { setAppName} = appNameSlice.actions;
export default appNameSlice.reducer;