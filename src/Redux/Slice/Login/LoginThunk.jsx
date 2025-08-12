// src/store/thunks/authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { login } from "../../../API/Login/Login"; // adjust the import to your API
import { setCredentials } from "./LoginSlice";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ userType, values }, { dispatch, rejectWithValue }) => {
    try {
      const data = await login(userType, values); // API call
      // const userName = data?.owner_name || data?.full_name;
      // const LoginUserId = data?.emp_id || data?.pro_id || data?.client_id;
      // Save token and userName in redux via dispatch
      // dispatch(
      //   setCredentials({
      //     token: data.token,
      //     userName,
      //     LoginUserId,
      //   })
      // );

      // Optional: Save to sessionStorage
    //   sessionStorage.setItem("token", data.token);
    //   sessionStorage.setItem("userName", data.userName);

      return data;
    } catch (error) {
      console.error("Login failed:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
