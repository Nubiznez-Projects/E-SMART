import { createSlice } from "@reduxjs/toolkit";
import { fetchInvoice, fetchSearchInvoice, fetchFilterInvoice } from "./InvoiceThunk";

const SalesInvoice = createSlice({
  name: "salesInvoice",
  initialState: {
    sales_Invoice: [], // data
    sales_loading: false, // loading state
    sales_error: null, // error state
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoice.pending, (state) => {
        state.sales_loading = true;
        state.sales_error = null; // reset error on new request
      })
      .addCase(fetchInvoice.fulfilled, (state, action) => {
        state.sales_loading = false;
        state.sales_Invoice = action.payload;
      })
      .addCase(fetchInvoice.rejected, (state, action) => {
        state.sales_loading = false;
        state.sales_error = action.error.message || "Failed to fetch sales PO";
      })
       .addCase(fetchSearchInvoice.fulfilled, (state, action) => {
        state.sales_Invoice = action.payload;
      })
        .addCase(fetchFilterInvoice.fulfilled, (state, action) => {
              state.sales_Invoice = action.payload;
      })
  },
});

export default SalesInvoice.reducer;
