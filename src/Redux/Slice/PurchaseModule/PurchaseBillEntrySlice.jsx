import { createSlice } from "@reduxjs/toolkit";
import {
  fetchBillEntry,
  fetchfilterBillEntry,
  fetchSearchedBillEntry,
} from "./PurchaseBillEntryThunk";

const GetPurchaseBillEntry = createSlice({
  name: "BillEntry",
  initialState: {
    billEntry: [],
    billEntry_Loading: false,
    billEntry_Error: null,
  },
  reducers: {},
  extraReducers: (builders) => {
    builders
      .addCase(fetchBillEntry.pending, (state) => {
        state.billEntry_Loading = true;
      })
      .addCase(fetchBillEntry.fulfilled, (state, action) => {
        state.billEntry_Loading = false;
        state.billEntry = action.payload;
      })
      .addCase(fetchBillEntry.rejected, (state, action) => {
        state.billEntry_Loading = false;
        state.billEntry_Error = action.payload;
      })
      .addCase(fetchSearchedBillEntry.fulfilled, (state, action) => {
        state.billEntry_Loading = false;
        state.billEntry = action.payload;
      })
      .addCase(fetchSearchedBillEntry.rejected, (state, action) => {
        state.billEntry_Loading = false;
        state.billEntry_Error = action.payload;
      })
      .addCase(fetchfilterBillEntry.fulfilled, (state, action) => {
        state.billEntry_Loading = false;
        state.billEntry = action.payload;
      })
      .addCase(fetchfilterBillEntry.rejected, (state, action) => {
        state.billEntry_Loading = false;
        state.billEntry_Error = action.payload;
      });
  },
});
export default GetPurchaseBillEntry.reducer;
