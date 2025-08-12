import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getInvoiceList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/invoice`);
    console.log(response.data, "Response from Invoice List");
    return response.data;
  } catch (error) {
    console.error("Error fetching invoice List", error);
  }
};

export const CreateSalesInvoice = async (
  invoiceId,
  values,
  salesDCData,
  // totalAmount,
  // taxValue,
  grossAmount,
  invoiceData
) => {
  try {
    const payload = {
      SPoNum: values?.poNum,
      DCNum: values?.dcNum,
      CustomerID: salesDCData?.CustomerID,
      CustomerName: salesDCData?.CustomerName,
      CustomerState: salesDCData?.CustomerState,
      Year: new Date().getFullYear().toString(),
      BankName: values?.bankName,
      Branch: values?.branch,
      AccountNum: values?.accountNo,
      IFSC_Code: values?.ifsc,
      LedgerIncome: "", // no need
      GroupLedger: "",  // no need
      TaxableaValue: salesDCData?.TaxableValue,
      TaxPer: salesDCData?.TaxPer,
      TaxValue: salesDCData?.TaxValue,
      Cess: 0,
      RoundOff: 0,
      InvoiceStatusId: values?.status === "Partially" ? 1 : 2,
      InvoiceStatus: values?.status,
      RecStatusId: invoiceData?.RecStatusId || 1,
      RecStatus: invoiceData?.RecStatus || "Partially",
      TotalValue: salesDCData?.TotalValue,
      HsnCode: "343434",  // no need
      VoucherType: "Sales", // no need
      VoucherNum: "VCH-003", // no need
      Narration: "", // no need
      InvoiceApprovalDate: "2025-07-05T05:24:34.573Z", // no need
      UpdatedBy: values?.updatedBy || "",
      CreatedBy: "Ashika Y R",
      CreditDays: values?.creditDys
    };

    let response;

    if (invoiceId) {
      response = await axios.put(`${BASE_URL}/invoice/${invoiceId}`, payload);
    } else {
      response = await axios.post(`${BASE_URL}/invoice`, payload);
    }
    console.log(payload, "Response from Create Sales DC", response.data);
    return response.data;
  } catch (error) {
    console.error("Error Creating Sales Dc", error);
    throw error;
  }
};


export const getInvoiceByID = async (invoiceId) =>{
  try{
  const response = await axios.get(`${BASE_URL}/invoice/${invoiceId}`);
  console.log(response.data, "Response from get By Id invoice");
  return response.data;
  }catch(error){
    console.error("Error fetching invoice By Id", error);
    throw error;
  }
}

export const getInvoiceByPoNum = async (dcID) => {
  try {
    const response = await axios.get(`${BASE_URL}/invoice/${dcID}`);
    console.log("Getting DC Data :", response);
    return response.data; 
  } catch (err) {
    console.error("Error in Getting DC Data", err);
    throw err;
  }
};


export const searchInvoice = async (term) => {
  try {
    const url =
      term?.length === 0
        ? `${BASE_URL}/invoice` // fallback to full list
        : `${BASE_URL}/invoice?term=${term}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in search DC:", error);
    throw error; // Optional: let the calling thunk handle rejection
  }
};

export const filterInvoice = async ({ fromDate, toDate, Status }) => {
  try {
    const params = {};

    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    if (Status === "Pending") params.Status = "Pending";
    else if (Status === "Delivered") params.Status = "Delivered";
    else if (Status === "Cancelled") params.Status = "Cancelled";

    console.log("Final params sent to API:", params);

    const response = await axios.get(`${BASE_URL}/invoice`, {
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
  const statusId =
  status === "Cancelled"
      ? 3
      : status === "Delivered"
      ? 1
      : 2;
  try {
    const payload = {
      Status: status,
      StatusId: statusId,
    };

    const response = await axios.put(`${BASE_URL}/invoice/status/${rowId}`, payload);
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("Error updating PO status", error);
    throw error;
  }
};
