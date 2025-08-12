import React from "react";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  filterSupplier,
  getSuppliers,
  searchSuppliers,
} from "../../../../API/MasterModule/Supplier";

export const fetchSuppliers = createAsyncThunk("suppliers/fetch", async () => {
  return await getSuppliers();
});


export const fetchSearchedSupplier = createAsyncThunk(
  "suppliers/search",
  async (term) => {
    return await searchSuppliers(term);
  }
);


export const fetchFilteredSupplier = createAsyncThunk(
  'suppliers/filter',
  async (filterParams) => {
    const response = await filterSupplier(filterParams);
    return response;
  }
);
