import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import LightTheme from "./Theme/Light__Theme.js";
import { Provider } from "react-redux";
import { configureStore } from '@reduxjs/toolkit'
import counterSlice from './Features/Counter/CounterSlice.js'
import { api } from './Features/API/API.js'
import { leaveApi } from './Features/API/LeavesAPI';
import { EmployeeMasterDataAPI } from './Features/API/EmployeeMasterDataAPI';
import { RoleManagement } from './Features/API/RoleManagement';
import { Authentication } from './Features/API/Authentication';
import { SetupApi } from './Features/API/SetupApi';
import { NocAPI } from './Features/API/NocAPI'



const store = configureStore({
  reducer: {
    counter: counterSlice,
    [api.reducerPath]: api.reducer,
    [leaveApi.reducerPath]: leaveApi.reducer,
    [EmployeeMasterDataAPI.reducerPath]: EmployeeMasterDataAPI.reducer,
    [RoleManagement.reducerPath]: RoleManagement.reducer,
    [Authentication.reducerPath]: Authentication.reducer,
    [SetupApi.reducerPath]: SetupApi.reducer,
    [NocAPI.reducerPath]: NocAPI.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      api.middleware,
      leaveApi.middleware,
      EmployeeMasterDataAPI.middleware,
      RoleManagement.middleware,
      Authentication.middleware,
      SetupApi.middleware,
      NocAPI.middleware
    ),
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <ThemeProvider theme={LightTheme}>
      <CssBaseline>
        <Provider store={store}>
          <App />
        </Provider>
      </CssBaseline>
    </ThemeProvider>
);
