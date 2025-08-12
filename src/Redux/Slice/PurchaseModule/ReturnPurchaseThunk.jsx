import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  filterPurchaseReturn,
  getPurchaseReturn,
  searchReturnPurchase,
} from "../../../API/Purchase/ReturnPurchase";

export const fetchReturnPO = createAsyncThunk("return/fetching", async () => {
  return await getPurchaseReturn();
});

export const searchPurchaseRtn = createAsyncThunk(
  "returnPruchase/searching",
  async (term) => {
    return await searchReturnPurchase(term);
  }
);

export const filterPurchaseRtn = createAsyncThunk(
  "returnPruchase/filtering",
  async (term) => {
    return await filterPurchaseReturn(term);
  }
);
