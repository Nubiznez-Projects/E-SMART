import { createSlice } from "@reduxjs/toolkit";
import {
  fetchReturnPO,
  filterPurchaseRtn,
  searchPurchaseRtn,
} from "./ReturnPurchaseThunk";

const ReturnPurcase = createSlice({
  name: "returnpurchase",
  initialState: {
    returnPurchase: [],
    return_loading: false,
    return_error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReturnPO.pending, (state) => {
        state.return_loading = true;
      })
      .addCase(fetchReturnPO.fulfilled, (state, action) => {
        (state.return_loading = false), (state.returnPurchase = action.payload);
      })
      .addCase(fetchReturnPO.rejected, (state, action) => {
        (state.return_loading = false), (state.return_error = action.payload);
      })
      .addCase(searchPurchaseRtn.fulfilled, (state, action) => {
        (state.return_loading = false), (state.returnPurchase = action.payload);
      })
      .addCase(filterPurchaseRtn.fulfilled, (state, action) => {
        (state.return_loading = false), (state.returnPurchase = action.payload);
      });
  },
});
export default ReturnPurcase.reducer;
