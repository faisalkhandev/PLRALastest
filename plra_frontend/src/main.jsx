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
import { Termination } from "./Features/API/Termination.js";
import { AnnualAssessment } from './Features/API/AnnualAssessment.js'
import { ElevationApi } from "./Features/API/ElevationApi.js"; 
import { ProgressionApi } from "./Features/API/ProgressionApi.js"; 
import { ResignationApi } from "./Features/API/ResignationApi.js";
import disciplinaryProceedingReducer from "./Features/Counter/DPCounterSlice.js";
import { TransferApi } from "./Features/API/Transfer.js";
import { DisciplinaryProceedingApi } from "./Features/API/DisciplinaryProceedings.js";
import { AuthApi } from './Features/API/AuthApi';
import { DashboardApi } from "./Features/API/DashboardApi.js";
import  AuthMiddleware  from "./Middleware/AuthMiddleware.js"
const store = configureStore({
  reducer: {
    disciplinaryProceeding: disciplinaryProceedingReducer,
    counter: counterSlice,
    [api.reducerPath]: api.reducer,
    [leaveApi.reducerPath]: leaveApi.reducer,
    [EmployeeMasterDataAPI.reducerPath]: EmployeeMasterDataAPI.reducer,
    [RoleManagement.reducerPath]: RoleManagement.reducer,
    [Authentication.reducerPath]: Authentication.reducer,
    [SetupApi.reducerPath]: SetupApi.reducer,
    [NocAPI.reducerPath]: NocAPI.reducer,
    [Termination.reducerPath]: Termination.reducer,
    [AnnualAssessment.reducerPath]: AnnualAssessment.reducer,
    [ElevationApi.reducerPath]: ElevationApi.reducer,
    [ProgressionApi.reducerPath]: ProgressionApi.reducer,
    [TransferApi.reducerPath]: TransferApi.reducer,
    [ResignationApi.reducerPath]: ResignationApi.reducer,
    [DisciplinaryProceedingApi.reducerPath]: DisciplinaryProceedingApi.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [DashboardApi.reducerPath] : DashboardApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      api.middleware,
      leaveApi.middleware,
      EmployeeMasterDataAPI.middleware,
      RoleManagement.middleware,
      SetupApi.middleware,
      NocAPI.middleware,
      Termination.middleware,
      AnnualAssessment.middleware,
      ElevationApi.middleware,
      ProgressionApi.middleware,
      TransferApi.middleware,
      ResignationApi.middleware,
      DisciplinaryProceedingApi.middleware,
      AuthApi.middleware,
      DashboardApi.middleware,
      AuthMiddleware
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
