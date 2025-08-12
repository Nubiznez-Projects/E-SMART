import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  filterPurchaseBill,
  getPurchaseBill,
  searchPurchaseBill,
} from "../../../API/Purchase/PurchaseBill";

export const fetchBillEntry = createAsyncThunk("BillEntry/fetch", async () => {
  return await getPurchaseBill();
});

export const fetchSearchedBillEntry = createAsyncThunk(
  "BillEntry/search",
  async (terms) => {
    return await searchPurchaseBill(terms);
  }
);

export const fetchfilterBillEntry = createAsyncThunk(
  "BillEntry/Filter",
  async (term) => {
    return await filterPurchaseBill(term);
  }
);
