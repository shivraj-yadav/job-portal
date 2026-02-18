import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import jobReducer from "./jobSlice"; // ✅ Import job slice

const store = configureStore({
  reducer: {
    auth: authReducer,
    job: jobReducer // ✅ Add job slice
  }
});

export default store;
