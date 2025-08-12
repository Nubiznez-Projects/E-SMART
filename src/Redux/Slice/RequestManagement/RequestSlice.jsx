import { createSlice } from "@reduxjs/toolkit";
import { fetchRequestList, searchReq, fetchFilterReq } from "./RequestThunk";

const ClientSlice = createSlice({
  name: "request",
  initialState: {
    request: [],
    request_loading: false,
    request_error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequestList.pending, (state) => {
        state.request_loading = true;
        state.request_error = null; // ✅ fix typo from sales_error
      })
      .addCase(fetchRequestList.fulfilled, (state, action) => {
        state.request_loading = false;
        state.request = action.payload || []; // safe fallback
      })
      .addCase(fetchRequestList.rejected, (state, action) => {
        state.request_loading = false;
        state.request_error = action.payload || "Failed to fetch employee data";
      })
      .addCase(searchReq.fulfilled, (state, action) => {
        state.request_loading = false;
        state.request = action.payload;
      })
      .addCase(fetchFilterReq.fulfilled, (state, action) => {
        state.request_loading = false;
        state.request = action.payload;
      });
  },
});

export default ClientSlice.reducer;
