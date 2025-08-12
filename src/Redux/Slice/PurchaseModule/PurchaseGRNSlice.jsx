import { createSlice } from "@reduxjs/toolkit";
import { fetchFilterPurchasGrn, fetchPurchaseGRN, fetchSearchPurchaseGRN } from "./PurchaseGRNThunk";

const PurchaseGrn = createSlice({
  name: "pruchasegrn",
  initialState: {
    purchaseGrn: [],
    purchaseGrn_loading: false,
    purchaseGrn_error: null,
  },
  reducers: {},
  extraReducers: (builders) => {
    builders
      .addCase(fetchPurchaseGRN.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPurchaseGRN.fulfilled, (state, action) => {
        (state.purchaseGrn_loading = false),
          (state.purchaseGrn = action.payload);
      })
      .addCase(fetchPurchaseGRN.rejected, (state, action) => {
        (state.loading = true), (state.purchaseGrn_error = action.payload);
      })
      .addCase(fetchSearchPurchaseGRN.fulfilled, (state, action) => {
        (state.purchaseGrn_loading = false),
          (state.purchaseGrn = action.payload);
      })
      .addCase(fetchSearchPurchaseGRN.rejected, (state, action) => {
        (state.purchaseGrn_loading = false),
          (state.purchaseGrn_error = action.payload);
      })
      .addCase(fetchFilterPurchasGrn.fulfilled, (state, action) => {
        (state.purchaseGrn_loading = false),
          (state.purchaseGrn = action.payload);
      })
      .addCase(fetchFilterPurchasGrn.rejected, (state, action) => {
        (state.purchaseGrn_loading = false),
          (state.purchaseGrn_error = action.payload);
      });
  },
});
export default PurchaseGrn.reducer;
