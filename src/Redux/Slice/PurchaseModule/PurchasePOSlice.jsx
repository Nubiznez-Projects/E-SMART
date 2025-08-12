import { createSlice } from "@reduxjs/toolkit";
import { fetchFilterPurchasPo, fetchPurchasePo, fetchSearchPurchasePo } from "./PurchasePOThunk";

const PurchasePo = createSlice({
  name: "purchasePo",
  initialState: {
    purchase_PO: [],
    purchase_loading: false,
    purchase_error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchasePo.pending, (state) => {
        state.purchase_loading = true;
      })
      .addCase(fetchPurchasePo.fulfilled, (state, action) => {
        state.purchase_loading = false;
        state.purchase_PO = action.payload;
      })
      .addCase(fetchPurchasePo.rejected, (state, action) => {
        state.purchase_loading = false;
        state.purchase_error = action.payload;
      })
      .addCase(fetchSearchPurchasePo.fulfilled, (state, action) => {
        state.purchase_loading = false;
        state.purchase_PO = action.payload;
      })
      .addCase(fetchSearchPurchasePo.rejected, (state, action) => {
        state.purchase_loading = false;
        state.purchase_error = action.payload;
      })
      .addCase(fetchFilterPurchasPo.fulfilled, (state, action) => {
        state.purchase_loading = false;
        state.purchase_PO = action.payload;
      })
      .addCase(fetchFilterPurchasPo.rejected, (state, action) => {
        state.purchase_loading = false;
        state.purchase_error = action.payload;
      });
  },
});

export default PurchasePo.reducer;
