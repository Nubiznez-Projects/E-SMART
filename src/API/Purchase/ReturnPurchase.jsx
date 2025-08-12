import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getPurchaseReturn = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/poReturn`);
    console.log("Purchase Return success :", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in Getting Purchase Return :", error);
  }
};

export const getPurchaseReturnById = async (returnID) => {
  try {
    const response = await axios.get(`${BASE_URL}/poReturn/${returnID}`);
    console.log("Purchase Return By ID :", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in Getting Purchase Return :", error);
  }
};

export const SubmitPurchaseRtnExcel = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const excelEndpoint = `${BASE_URL}/poReturn/import-excel`;

  try {
    const response = await axios.post(excelEndpoint, formData);
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

export const searchReturnPurchase = async (term) => {
  try {
    const url =
      term?.length === 0
        ? `${BASE_URL}/poReturn`
        : `${BASE_URL}/poReturn/search?term=${term}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in searchedPurchasePO:", error);
    throw error;
  }
};

export const submitPurchaseReturn = async (rtnItems, purchaseReturnId) => {
  const ReturnItems = rtnItems.returnItems.map((rtnitm) => ({
    ItemName: rtnitm?.ItemName,
    ItemCode: rtnitm?.ItemCode,
    hsnCode: rtnitm?.hsnCode,
    ReturnQty: rtnitm?.ReturnQty,
    Rate: rtnitm?.unitPrice,
    Total: rtnitm?.itemTotal,
  }));

  const formData = new FormData();

  formData.append("GRNNum", rtnItems?.grnNumber);
  formData.append("Items", JSON.stringify(ReturnItems));
  formData.append("Comments", rtnItems?.additionalNotes);
  formData.append("SupplierName", rtnItems?.supplierName);
  formData.append("ContactPersonName", rtnItems?.contactPerson);
  formData.append("Email", rtnItems?.email);
  formData.append("MobileNumber", rtnItems?.phone);
  formData.append("ReturnDate", rtnItems?.returnDate);
  formData.append("ReturnType", "Purchase Return");
  formData.append("TotalQuantity", rtnItems?.totalQuantity);
  formData.append("TotalItems", rtnItems?.totalItems);
  formData.append("TotalAmount", rtnItems?.totalAmount);
  formData.append("Image", null);

  try {
    if (purchaseReturnId) {
      const response = await axios.put(
        `${BASE_URL}/poReturn/${purchaseReturnId}`,
        formData
      );
      toast.success(
        response.data.message || "Return PO Entry updated successfully!"
      );
    } else {
      const response = await axios.post(`${BASE_URL}/poReturn`, formData);
      toast.success(
        response.data.message || "Return PO Entry created successfully!"
      );
    }
  } catch (error) {
    console.error("Error in Submitting Return Items(API) :", error);
  }
};

export const filterPurchaseReturn = async ({ fromDate, toDate, status }) => {
  try {
    const params = {};

    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    console.log("Final params sent to API:", params);
    const response = await axios.get(`${BASE_URL}/poReturn/search`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error filtering suppliers", error);
    return [];
  }
};
