import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSuppliers, fetchSearchedSupplier, fetchFilteredSupplier } from "./SupplierThunks";

const supplierSlice = createSlice({
  name: "suppliers",
  initialState: {
    supplier: [],
    supplier_loading: false,
    supplier_error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.supplier_loading = true;
        state.supplier_error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.supplier_loading = false;
        state.supplier = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.supplier_loading = false;
        state.supplier_error = action.payload;
      })
       .addCase(fetchFilteredSupplier.fulfilled, (state, action) => {
        state.supplier = action.payload;
      })
      .addCase(fetchSearchedSupplier.fulfilled, (state, action) => {
        state.supplier = action.payload;
      })
    // .addCase(fetchSuppliers.fulfilled, (state, action) => {
    //   state.list = action.payload;
    // });
  },
});

export default supplierSlice.reducer;
