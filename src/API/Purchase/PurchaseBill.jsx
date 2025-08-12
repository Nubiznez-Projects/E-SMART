import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";
const BASE_URL = import.meta.env.VITE_API_URL;

export const getPurchaseBill = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/billentry`);
    console.log("Get purchase Bill response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting Suppliers", error);
    throw error;
  }
};

export const getBillByPONum = async (PoNum) => {
  try {
    const response = await axios.get(`${BASE_URL}/billentry?term=${PoNum}`);
    console.log("Get purchase Bill By PO response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting Bill By PO", error);
    throw error;
  }
};

export const getBillEntryByID = async (purchaseBillID) => {
  try {
    const response = await axios.get(`${BASE_URL}/billentry/${purchaseBillID}`);
    console.log("Get purchase Bill by GRN response", response.data);
    return response.data;
  } catch (err) {
    console.error("Error in Fetching Bill by GRN Data:", err);
  }
};

export const getBillByGrn = async (grnId, setBilldata) => {
  try {
    const response = await axios.get(`${BASE_URL}/billentry/${grnId}`);
    setBilldata(response.data);
    console.log("Get purchase Bill by GRN response :", response);
  } catch (err) {
    console.error("Error in Getting GRN Data", err);
    throw err;
  }
};

export const searchPurchaseBill = async (term) => {
  try {
    const url =
      term?.length === 0
        ? `${BASE_URL}/billentry`
        : `${BASE_URL}/billentry?term=${term}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in searchedPurchasePO:", error);
    throw error;
  }
};

export const CreatePurchaseBill = async (
  purchaseBillId,
  billData,
  supplierDetails
) => {
  try {
    const formData = new FormData();

    formData.append("PONumber", billData?.PONumber || "");
    formData.append("GRNNumber", billData?.GRNNumber || "");
    formData.append("CreatedBy", billData?.CreatedBy || "");
    formData.append("LedgerExpense", billData?.LedgerExpenses || "");
    formData.append("UpdatedBy", billData?.updatedBy || "");
    formData.append("GroupLedger", billData?.GroupLedger || "");
    formData.append("ItemCategory", billData?.ItemCategory || "");
    formData.append("Amount", Number(billData?.Amount || 0));
    if (billData?.BillImage) {
      formData.append("BillImage", billData.BillImage);
    }

    let response;
    if (purchaseBillId) {
      response = await axios.put(
        `${BASE_URL}/billentry/${purchaseBillId}`,
        formData
      );
      console.log("Update Bill Entry", response.data);
      toast.success(
        response.data.message || "Bill Entry updated successfully!"
      );
    } else {
      response = await axios.post(`${BASE_URL}/billentry`, formData);
      console.log("Create Bill Entry", response.data);
      toast.success(
        response.data.message || "Bill Entry created successfully!"
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error in creating/updating the Purchase Bill:", error);
    toast.error(error.response?.data?.message || "An error occurred!");
    throw error;
  }
};

export const filterPurchaseBill = async ({ fromDate, toDate, status }) => {
  try {
    const params = {};

    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    if (status === 1) params.billStatusId = 1;
    else if (status === 2) params.billStatusId = 2;
    else if (status === 3) params.billStatusId = 3;

    console.log("Final params sent to API:", params);
    const response = await axios.get(`${BASE_URL}/billentry`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error filtering suppliers", error);
    return [];
  }
};

export const changePurchaseBillStatus = async (purchaseBill, status_id) => {
  console.log("status_api_called");
  const payload = {
    BillStatus:
      status_id === 1 ? "Approved" : status_id === 2 ? "Cancelled" : "Pending",
    BillStatusId: status_id,
  };
  try {
    const response = await axios.put(
      `${BASE_URL}/billentry/status/${purchaseBill}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
