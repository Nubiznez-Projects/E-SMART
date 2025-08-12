import { createSlice } from "@reduxjs/toolkit";
import { fetchClient, fetchFilterClient, searchClient } from "./ClientThunk";

const ClientSlice = createSlice({
  name: "client",
  initialState: {
    client: [],
    client_loading: false,
    client_error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClient.pending, (state) => {
        state.client_loading = true;
        state.client_error = null; // ✅ fix typo from sales_error
      })
      .addCase(fetchClient.fulfilled, (state, action) => {
        state.client_loading = false;
        state.client = action.payload || []; // safe fallback
      })
      .addCase(fetchClient.rejected, (state, action) => {
        state.client_loading = false;
        state.client_error = action.payload || "Failed to fetch employee data";
      })
      .addCase(searchClient.fulfilled, (state, action) => {
        state.client_loading = false;
        state.client = action.payload;
      })
      .addCase(fetchFilterClient.fulfilled, (state, action) => {
        state.client_loading = false;
        state.client = action.payload;
      });
  },
});

export default ClientSlice.reducer;
