import { createAsyncThunk } from "@reduxjs/toolkit";
import { getReceiptByPoNum } from "../../../API/Sales/Receipt";

export const fetchReceipt = createAsyncThunk(
  "salesReceipt/fetch",
  async () => {
    return await getReceiptByPoNum();
  }
);
