import { createSlice } from "@reduxjs/toolkit";
import { fetchReceipt } from "./ReceiptThunk";

const SalesReceipt = createSlice({
  name: "salesReceipt",
  initialState: {
    sales_Receipt: [], // data
    sales_loading: false, // loading state
    sales_error: null, // error state
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReceipt.pending, (state) => {
        state.sales_loading = true;
        state.sales_error = null; // reset error on new request
      })
      .addCase(fetchReceipt.fulfilled, (state, action) => {
        state.sales_loading = false;
        state.sales_Receipt = action.payload;
      })
      .addCase(fetchReceipt.rejected, (state, action) => {
        state.sales_loading = false;
        state.sales_error = action.error.message || "Failed to fetch sales Receipt";
      })
  },
});

export default SalesReceipt.reducer;
