// src/features/customers/customerThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCustomers,
  searchCustomers,
  filterCustomers,
} from "../../../../API/MasterModule/Customer";

export const fetchCustomers = createAsyncThunk("customers/fetch", async () => {
  return await getCustomers();
});

export const fetchSearchedCustomers = createAsyncThunk(
  "customers/search",
  async (term) => {
    return await searchCustomers(term);
  }
);


export const fetchFilteredCustomers = createAsyncThunk(
  'customers/filter',
  async (filterParams) => {
    const response = await filterCustomers(filterParams);
    return response;
  }
);

