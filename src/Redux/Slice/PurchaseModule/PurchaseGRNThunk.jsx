import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  filterPurchaseGrn,
  getPurchaseGRN,
  searchPurchaseGRN,
} from "../../../API/Purchase/PurchaseGRN";

export const fetchPurchaseGRN = createAsyncThunk(
  "purchasegrn/fetch",
  async () => {
    return await getPurchaseGRN();
  }
);

export const fetchSearchPurchaseGRN = createAsyncThunk(
  "purchasegrn/search",
  async (term) => {
    return await searchPurchaseGRN(term);
  }
);

export const fetchFilterPurchasGrn = createAsyncThunk(
  "purchasegrn/filter",
  async (term) => {
    return await filterPurchaseGrn(term);
  }
);
