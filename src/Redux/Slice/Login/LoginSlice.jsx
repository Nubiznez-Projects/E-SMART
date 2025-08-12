// src/store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { loginUser } from './LoginThunk'; // adjust path as needed

const initialState = {
  token: null,
  userName: null,
  LoginUserId:null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // setCredentials: (state, action) => {
    //   state.token = action.payload.token;
    //   state.userName = action.payload.userName;
    //   state.LoginUserId = action.payload.LoginUserId;
    // },
    // logout: (state) => {
    //   state.token = null;
    //   state.userName = null;
    //   state.LoginUserId = null;
    //   state.loading = false;
    //   state.error = null;
    //   sessionStorage.removeItem('token');
    //   sessionStorage.removeItem('userName');
    // },
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
