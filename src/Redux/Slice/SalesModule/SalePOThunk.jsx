import { createAsyncThunk } from "@reduxjs/toolkit";
import { filterSalesPO, getSalePO, searchSalesPO } from "../../../API/Sales/SalesPO";

export const fetchSalesPo = createAsyncThunk(
  "salesPo/fetch",
  async () => {
    return await getSalePO();
  }
);

export const fetchSearchPO = createAsyncThunk(
  "salesPo/search",
  async (term) => {
    return await searchSalesPO(term);
  }
)


export const fetchFilteredPO = createAsyncThunk(
  "salesPo/filter",
  async (filterParams) => {
    const response = await filterSalesPO(filterParams);
    return response;
  }
)