import { createAsyncThunk } from "@reduxjs/toolkit";
import { filterSubscription, getSubscriptionList, SearchSubData } from "../../../API/Subscription/Subscription";

export const fetchSubscription = createAsyncThunk(
  "subscription/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSubscriptionList();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Error fetching Request list");
    }
  }
);


export const searchSub = createAsyncThunk(
  "subscription/search",
  async (term, { rejectWithValue }) => {
    try {
      const response = await SearchSubData(term);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Error Searching Client");
    }
  }
);

export const fetchFilterSub = createAsyncThunk(
  "subscription/filter",
  async (term, { rejectWithValue }) => {
    try {
      const response = await filterSubscription(term);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Error Filtereing Client");
    }
  }
);
