import { createAsyncThunk } from "@reduxjs/toolkit";
import { filterSalesReturn, getSaleReturn, searchReturnSales } from "../../../API/Sales/SalesReturn";

export const fetchSalesReturn = createAsyncThunk(
  "salesReturn/fetch",
  async () => {
    return await getSaleReturn();
  }
);

export const searchSalesRtn = createAsyncThunk(
  "salesReturn/searching",
  async (term) => {
    return await searchReturnSales(term);
  }
);

export const filterSalesRtn = createAsyncThunk(
  "salesReturn/filtering",
  async (term) => {
    return await filterSalesReturn(term);
  }
);
