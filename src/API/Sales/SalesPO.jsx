import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getSalePO = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/piPo`);
    console.log("Response from get SalesPO", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting Sale PO", error);
    throw error;
  }
};

export const searchSalesPO = async (term) => {
  try {
    const url =
      term?.length === 0
        ? `${BASE_URL}/piPo` // fallback to full list
        : `${BASE_URL}/piPo/search?term=${term}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in searchCustomers:", error);
    throw error; // Optional: let the calling thunk handle rejection
  }
};

export const SubmitSalePOExcel = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const excelEndpoint = `${BASE_URL}/piPo/import-excel`;

  try {
    const response = await axios.post(excelEndpoint, formData);
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

export const getSalePOByID = async (SalePoID) => {
  try {
    const response = await axios.get(`${BASE_URL}/piPo/${SalePoID}`);
    console.log("Response from salePO by ID", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting Sales PO by ID", error);
    throw error;
  }
};

export const getSalesPOAll = async (SalePoID) => {
  try {
    const response = await axios.get(`${BASE_URL}/piPo/view/${SalePoID}`);
    console.log("Response from salePO by ID", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting Sales PO by ID", error);
    throw error;
  }
};

export const createSalesPO = async (
  dispatch,
  poID,
  SalePOData,
  PurchaseStatus,
  tableData,
  customerDetails,
  salesPOData
) => {
  try {
    const payload = {
      CustomerID: customerDetails?.CustomerID,
      CustomerName: customerDetails?.CustomerName,
      BillFrom: SalePOData?.billFrom,
      OrderTo: SalePOData?.billTo,
      IssuedDate: SalePOData?.issuedDate,
      CustomerState: customerDetails?.State,
      DeliveryDate: SalePOData?.deliveryDate,
      DeliveryAddress: SalePOData?.deliveryTo,
      DeliveryState: "Tamil Nadu",
      Ledger: "Sales Ledger",
      GroupLedger: "Main Ledger",
      Narration: "Sales PO",
      CreatedBy: SalePOData?.createdBy,
      UpdatedBy: SalePOData?.updatedBy || "",
      year: new Date().getFullYear(),
      Items: Array.isArray(tableData)
        ? tableData.map((item) => ({
            ItemCode: item.itemCode || "",
            ItemName: item.itemName || "",
            Quantity: item.quantity || "",
            Rate: item.rate || "",
            Amount: item.netAmount || "",
            HSN: item.hsn || "",
          }))
        : [],
      DCStatus: "Generate",
      DCStatusId: 1,
      Status: salesPOData?.Status || "Pending",
      StatusId: salesPOData?.StatusId || 3
    };

    console.log(payload, "www", customerDetails, "create_po_payload");

    let response;

    if (poID) {
      response = await axios.put(`${BASE_URL}/piPo/${poID}`, payload);
      console.log("Update Sales PO", response.data);
    } else {
      response = await axios.post(`${BASE_URL}/piPo`, payload);
      console.log("Create sales PO response", response.data);
    }

    return response.data;
  } catch (error) {
    console.error("Error in creating the Sales PO:", error?.message || error);
    throw error; // optionally rethrow to handle in parent
  }
};

export const filterSalesPO = async ({ fromDate, toDate, Status }) => {
  try {
    const params = {};

    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    if (Status === "Approved") params.Status = "Approved";
    else if (Status === "Pending") params.Status = "Pending";
    else if (Status === "Cancelled") params.Status = "Cancelled";

    console.log("Final params sent to API:", params);

    const response = await axios.get(`${BASE_URL}/piPo`, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error filtering customers", error);
    return [];
  }
};

export const UpdateStatus = async (rowId, status) => {
  console.log(rowId, "PoId");
  const statusId = status === "Approved" ? 2 : status === "Pending" ? 1 : 3;
  try {
    const payload = {
      Status: status,
      StatusId: statusId,
    };

    const response = await axios.put(
      `${BASE_URL}/piPo/updatestatus/${rowId}`,
      payload
    );
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("Error updating PO status", error);
    throw error;
  }
};
