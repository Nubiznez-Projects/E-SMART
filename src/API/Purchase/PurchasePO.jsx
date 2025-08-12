import axios from "axios";
import { toast } from "react-toastify";
// import { fetchPurchasePo } from "../../Redux/Slice/Features/PurchaseModule/PurchasePOThunk";

// const BASE_URL = "http://192.168.6.52:8092/api";
const BASE_URL = import.meta.env.VITE_API_URL;

export const getPurchase = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/purchasepo`);
    console.log("Get purchase PO response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting Suppliers", error);
    throw error;
  }
};

export const getPurchasePOID = async (purchasePOId) => {
  try {
    const response = await axios.get(`${BASE_URL}/purchasepo/${purchasePOId}`);
    console.log("Getting purchasePOID by ID", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting customer byId", error);
    throw error;
  }
};

export const SubmitPurchasePOExcel = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const excelEndpoint = `${BASE_URL}/purchasepo/import-excel`;

  try {
    const response = await axios.post(excelEndpoint, formData);
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

export const searchPurchasePo = async (term) => {
  try {
    const url =
      term?.length === 0
        ? `${BASE_URL}/purchasepo`
        : `${BASE_URL}/purchasepo?term=${term}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in searchedPurchasePO:", error);
    throw error;
  }
};

export const changePurchasePOStatus = async (purchasePoId, status_id) => {
  console.log("status_api_called");
  const payload = {
    Status:
      status_id === 1 ? "Approved" : status_id === 2 ? "Cancelled" : "Pending",
    StatusId: status_id,
  };

  try {
    const response = await axios.put(
      `${BASE_URL}/purchasepo/updatestatus/${purchasePoId}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const createPurchasePO = async (
  dispatch,
  purchasePoId,
  PurchasePOStatus,
  PoData,
  tableData,
  supplierDetails
) => {
  try {
    const payload = {
      BillFrom: PoData?.billFrom,
      SupplierAddress: supplierDetails?.Address,
      SupplierName: supplierDetails?.SupplierName,
      SupplierID: supplierDetails?.SupplierID,
      SupplierState: supplierDetails?.State,
      DeliveryDate: PoData?.deliveryDate,
      DeliveryAddress: PoData?.deliveryTo,
      Ledger: "0",
      GroupLedger: "0",
      Narration: "PoData",
      UpdatedBy: PoData?.updatedBy || "",
      CreatedBy: PoData?.createdBy || "",
      Status: PurchasePOStatus ? PurchasePOStatus : "Pending",
      // GRNStatus: "",
      Items: (tableData || []).map((item) => ({
        ItemCode: item.itemCode || "",
        ItemName: item.itemName || "",
        Quantity: item.quantity || "",
        Unit: "Pcs",
        Rate: item.rate || "",
        Total: item.netAmount || "",
        HSN: item.hsn || "",
      })),
    };
    console.log(payload, purchasePoId, supplierDetails, "create_po_payload");
    if (purchasePoId) {
      const response = await axios.put(
        `${BASE_URL}/purchasepo/${purchasePoId}`,
        payload
      );
      console.log("Update Purchase PO", response.data);
    } else {
      const response = await axios.post(`${BASE_URL}/purchasepo`, payload);
      console.log("Create Purchase PO response", response.data);
    }
    toast.success(response.message);
    // dispatch(fetchPurchasePo());
    return response.data;
  } catch (error) {
    console.error(error, "Error in creating the Purchase PO:");
  }
};

// ✅ Accept a single object as parameter
export const filterPurchasePO = async ({ fromDate, toDate, status }) => {
  console.log(status, "po_statuis_update");
  try {
    const params = {};

    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    if (status === 1) params.StatusId = 1;
    else if (status === 2) params.StatusId = 2;
    else if (status === 3) params.StatusId = 3;

    console.log("Final params sent to API:", params);
    const response = await axios.get(`${BASE_URL}/purchasepo`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error filtering suppliers", error);
    return [];
  }
};
