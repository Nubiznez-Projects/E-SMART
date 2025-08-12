import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCustomers,
  fetchSearchedCustomers,
  fetchFilteredCustomers,
} from "./CustomerThunks";

// Thunk for async API call

const customersSlice = createSlice({
  name: "customers",
  initialState: {
    customer: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
     .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSearchedCustomers.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchFilteredCustomers.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default customersSlice.reducer;