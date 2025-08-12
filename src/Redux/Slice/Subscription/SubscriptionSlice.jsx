import { createSlice } from "@reduxjs/toolkit";
import { fetchSubscription, searchSub, fetchFilterSub } from "./SubscriptionThunk";

const ClientSlice = createSlice({
  name: "subscription",
  initialState: {
    subscription: [],
    sub_loading: false,
    sub_error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscription.pending, (state) => {
        state.sub_loading = true;
        state.sub_error = null; // ✅ fix typo from sales_error
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.sub_loading = false;
        state.subscription = action.payload || []; // safe fallback
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.sub_loading = false;
        state.sub_error = action.payload || "Failed to fetch employee data";
      })
      .addCase(searchSub.fulfilled, (state, action) => {
        state.sub_loading = false;
        state.subscription = action.payload;
      })
      .addCase(fetchFilterSub.fulfilled, (state, action) => {
        state.sub_loading = false;
        state.subscription = action.payload;
      });
  },
});

export default ClientSlice.reducer;
