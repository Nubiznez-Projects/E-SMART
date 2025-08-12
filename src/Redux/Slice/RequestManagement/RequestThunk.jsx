import { createAsyncThunk } from "@reduxjs/toolkit";
import { filterRequest, getReqList, SearchReqData } from "../../../API/RequestManagement/RequestManagement";

export const fetchRequestList = createAsyncThunk(
  "request/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getReqList();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Error fetching Request list");
    }
  }
);


export const searchReq = createAsyncThunk(
  "request/search",
  async (term, { rejectWithValue }) => {
    try {
      const response = await SearchReqData(term);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Error Searching Client");
    }
  }
);

export const fetchFilterReq = createAsyncThunk(
  "request/filter",
  async (term, { rejectWithValue }) => {
    try {
      const response = await filterRequest(term);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Error Filtereing Client");
    }
  }
);

