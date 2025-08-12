import { createSlice } from "@reduxjs/toolkit";
import { fetchFilteredDC, fetchSalesDC, fetchSearchDC } from "./SalesDCThunk";

const SalesDC = createSlice({
  name: "salesDC",
  initialState: {
    sales_DC: [], // data
    sales_loading: false, // loading state
    sales_error: null, // error state
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesDC.pending, (state) => {
        state.sales_loading = true;
        state.sales_error = null; // reset error on new request
      })
      .addCase(fetchSalesDC.fulfilled, (state, action) => {
        state.sales_loading = false;
        state.sales_DC = action.payload;
      })
      .addCase(fetchSalesDC.rejected, (state, action) => {
        state.sales_loading = false;
        state.sales_error = action.error.message || "Failed to fetch sales DC";
      })
      .addCase(fetchFilteredDC.fulfilled, (state, action) => {
        state.sales_DC = action.payload;
      })
      .addCase(fetchSearchDC.fulfilled, (state, action) => {
        state.sales_DC = action.payload;
      });
  },
});

export default SalesDC.reducer;
