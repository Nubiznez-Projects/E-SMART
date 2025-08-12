import { createAsyncThunk } from "@reduxjs/toolkit";
import { filterSalesDC, getSalesDC, searchSalesDC } from "../../../API/Sales/SalesDC";

export const fetchSalesDC = createAsyncThunk(
  "salesDC/fetch",
  async () => {
    return await getSalesDC();
  }
);

export const fetchSearchDC = createAsyncThunk(
  "salesPo/search",
  async (term) => {
    return await searchSalesDC(term);
  }
)


export const fetchFilteredDC = createAsyncThunk(
  "salesPo/filter",
  async (filterParams) => {
    const response = await filterSalesDC(filterParams);
    return response;
  }
)