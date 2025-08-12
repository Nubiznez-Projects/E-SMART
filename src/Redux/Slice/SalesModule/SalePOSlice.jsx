import { createSlice } from "@reduxjs/toolkit";
import { fetchFilteredPO, fetchSalesPo, fetchSearchPO } from "./SalePOThunk";

const SalesPo = createSlice({
  name: "salesPo",
  initialState: {
    sales_PO: [], // data
    sales_loading: false, // loading state
    sales_error: null, // error state
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesPo.pending, (state) => {
        state.sales_loading = true;
        state.sales_error = null; // reset error on new request
      })
      .addCase(fetchSalesPo.fulfilled, (state, action) => {
        state.sales_loading = false;
        state.sales_PO = action.payload;
      })
      .addCase(fetchSalesPo.rejected, (state, action) => {
        state.sales_loading = false;
        state.sales_error = action.error.message || "Failed to fetch sales PO";
      })
      .addCase(fetchFilteredPO.fulfilled, (state, action) => {
        state.sales_PO = action.payload;
      })
      .addCase(fetchSearchPO.fulfilled, (state, action) => {
        state.sales_PO = action.payload;
      });
  },
});

export default SalesPo.reducer;
