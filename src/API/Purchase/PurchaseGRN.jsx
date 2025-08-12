import axios from "axios";
// import { fetchPurchasePo } from "../../Redux/Slice/Features/PurchaseModule/PurchasePOThunk";

// const BASE_URL = "http://192.168.6.77:8092/api";
const BASE_URL = import.meta.env.VITE_API_URL;

export const getPurchaseGRN = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/purchasegrn`);
    console.log("Get purchase GRN response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting Suppliers", error);
    throw error;
  }
};

export const getPurchaseGrnByID = async (purchaseGrnID) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/purchasegrn/${purchaseGrnID}`
    );
    console.log("Getting pruchaseGRN by ID", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting customer byId", error);
    throw error;
  }
};

export const getGrnByPoNum = async (purchasePOID, setGrnData) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/purchasegrn?term=${purchasePOID}`
    );
    setGrnData(response.data);
    console.log("Getting GRN Data :", response);
  } catch (err) {
    console.error("Error in Getting GRN Data", err);
    throw err;
  }
};
export const changePurchaseGrnStatus = async (purchaseGrnID, status_id) => {
  console.log("status_api_called");
  const payload = {
    Status: status_id === 1 ? "Partially Received" : "Fully Received",
    StatusId: status_id,
  };

  try {
    const response = await axios.put(
      `${BASE_URL}/purchasegrn/updatestatus/${purchaseGrnID}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const searchPurchaseGRN = async (term) => {
  try {
    const url =
      term?.length === 0
        ? `${BASE_URL}/purchasegrn`
        : `${BASE_URL}/purchasegrn?term=${term}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in searchedPurchasePO:", error);
    throw error;
  }
};

export const createPurchaseGRN = async (
  dispatch,
  purchaseGrnID, // If you're editing an existing GRN, pass its ID
  grnData,
  items,
  SupplierDetails
) => {
  try {
    const payload = {
      ReceivedDate: grnData?.receiveddate,
      PurchasePONum: grnData?.poNumber,
      PurchasePODate: grnData?.issuedDate,
      SupplierName: SupplierDetails?.SupplierName,
      SupplierID: SupplierDetails?.SupplierID,
      State: SupplierDetails?.State,
      InvoiceNum: grnData?.invoiceno,
      InvoiceDate: grnData?.invoicedate,
      DeliveryLoc: grnData?.deliveryTo,
      ReceivedBy: grnData?.receivedby,
      CreatedBy: grnData?.createdBy,
      UpdatedBy: grnData?.updatedBy,
      Narration: grnData?.description,
      Status: grnData?.Status,
      AcceptedQty: grnData?.acceptedQuantity,
      ReceivedQty: grnData?.receivedQuantity,
      BillStatus: "0",
      Items: (items || []).map((item) => ({
        ItemCode: item?.itemCode || "",
        ItemName: item?.itemName || "",
        Quantity: item?.quantity || "",
        Unit: "Pcs",
        Rate: item?.rate || "",
        Total: item?.netAmount || "",
        HSN: item?.hsn || "",
        a_quantity: item?.a_quantity || "",
      })),
      TaxableValue: Number(grnData?.taxableValue) || "",
      TaxPer: Number(grnData?.taxPer) || "",
      TaxValue: Number(grnData?.taxValue) || "",
      TotalValue: Number(grnData?.totalValue) || "",
      CreditDays: grnData?.CreditDays || "",
    };
    if (purchaseGrnID) {
      const response = await axios.put(
        `${BASE_URL}/purchasegrn/${purchaseGrnID}`,
        payload
      );
      console.log("Update grn", response.data);
    } else {
      const response = await axios.post(`${BASE_URL}/purchasegrn`, payload);
      console.log("Create grn", response.data);
    }
    toast.success(response.message);
    // dispatch(fetchPurchasePo());
    return response.data;
  } catch (error) {
    console.error(error, "Error in creating the Purchase PO:");
  }
};

// ✅ Accept a single object as parameter
export const filterPurchaseGrn = async ({ fromDate, toDate, status }) => {
  try {
    const params = {};

    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    if (status === 1) params.StatusId = 1;
    else if (status === 2) params.StatusId = 2;
    else if (status === 3) params.StatusId = 3;

    console.log("Final params sent to API:", params);
    const response = await axios.get(`${BASE_URL}/purchasegrn`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error filtering suppliers", error);
    return [];
  }
};
