import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  filterClient,
  getClientDetails,
  SearchClientData,
} from "../../../API/UserManagement/Client/ClientDetails";

export const fetchClient = createAsyncThunk(
  "client/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getClientDetails();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Error fetching Client list");
    }
  }
);

export const searchClient = createAsyncThunk(
  "client/search",
  async (term, { rejectWithValue }) => {
    try {
      const response = await SearchClientData(term);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Error Searching Client");
    }
  }
);

export const fetchFilterClient = createAsyncThunk(
  "client/filter",
  async (term, { rejectWithValue }) => {
    try {
      const response = await filterClient(term);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Error Filtereing Client");
    }
  }
);
