import { createAsyncThunk } from "@reduxjs/toolkit";
import { filterInvoice, getInvoiceList, searchInvoice } from "../../../API/Sales/Invoice";

export const fetchInvoice = createAsyncThunk(
  "salesInvoice/fetch",
  async () => {
    return await getInvoiceList();
  }
);

export const fetchSearchInvoice = createAsyncThunk(
  "salesInvoice/search",
  async (term) => {
    return await searchInvoice(term);
  }
)


export const fetchFilterInvoice = createAsyncThunk(
  "salesInvoice/filter",
  async (filterParams) => {
    const response = await filterInvoice(filterParams);
    return response;
  }
)