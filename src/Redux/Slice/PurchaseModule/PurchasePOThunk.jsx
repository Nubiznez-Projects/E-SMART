import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  filterPurchasePO,
  getPurchase,
  searchPurchasePo,
} from "../../../API/Purchase/PurchasePO";

export const fetchPurchasePo = createAsyncThunk(
  "purchasePo/fetch",
  async () => {
    return await getPurchase();
  }
);

export const fetchSearchPurchasePo = createAsyncThunk(
  "pruchasePo/searchPo",
  async (term) => {
    return await searchPurchasePo(term);
  }
);

export const fetchFilterPurchasPo = createAsyncThunk(
  "purchasePo/filterPO",
  async (term) => {
    return await filterPurchasePO(term);
  }
);
