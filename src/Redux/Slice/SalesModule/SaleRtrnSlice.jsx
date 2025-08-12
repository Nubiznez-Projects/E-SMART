import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSalesReturn,
  filterSalesRtn,
  searchSalesRtn,
} from "./SaleRtrnThunk";

const SalesReturn = createSlice({
  name: "salesReturn",
  initialState: {
    sales_Return: [], // data
    sales_loading: false, // loading state
    sales_error: null, // error state
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesReturn.pending, (state) => {
        state.sales_loading = true;
        state.sales_error = null; // reset error on new request
      })
      .addCase(fetchSalesReturn.fulfilled, (state, action) => {
        state.sales_loading = false;
        state.sales_Return = action.payload;
      })
      .addCase(fetchSalesReturn.rejected, (state, action) => {
        state.sales_loading = false;
        state.sales_error =
          action.error.message || "Failed to fetch sales Return";
      })
      .addCase(searchSalesRtn.fulfilled, (state, action) => {
        (state.return_loading = false), (state.sales_Return = action.payload);
      })
      .addCase(filterSalesRtn.fulfilled, (state, action) => {
        (state.return_loading = false), (state.sales_Return = action.payload);
      });
  },
});

export default SalesReturn.reducer;
