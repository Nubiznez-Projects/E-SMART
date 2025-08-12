import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const CreateSalesReceipt = async (invoiceId, values, receiptId) => {
  try {
    const payload = {
      InvoiceNo: invoiceId,
      CustomerID: "CUST-009",
      CustomerName: values?.customer,
      Year: "2025",
      Ledger: values?.customer,
      GroupLedger: values?.groupLedger,
      ByTo: values?.receiptBy,
      Amount: values?.total,
      RefNum: "INV-2025-00001-B",
      RefType: "Receipt",
      RefAmount: 28084,
      PaymentMode: values?.paymentMode,
      Createdby: values?.createdBy || "",
      UpdatedBy: values?.updatedBy || "",
      RecStatus: values?.status,
      RecStatusId: values?.status === "Partially" ? 1 : 2,
    };

    let response;

    if (receiptId) {
      response = await axios.put(`${BASE_URL}/receipt/${receiptId}`, payload);
    } else {
      response = await axios.post(`${BASE_URL}/receipt`, payload);
    }
    console.log(payload, "Response from Create Sales Receipt", response.data);
    return response.data;
  } catch (error) {
    console.error("Error Creating Sales Receipt", error);
    throw error;
  }
};

export const getReceiptByID = async (RcptID) =>{
  try{
  const response = await axios.get(`${BASE_URL}/receipt/${RcptID}`);
  console.log(response.data, "Response from get By Id receipt");
  return response.data;
  }catch(error){
    console.error("Error fetching receipt By Id", error);
    throw error;
  }
}


export const getReceiptByPoNum = async (invoiceID) => {
  try {
    const response = await axios.get(`${BASE_URL}/receipt/${invoiceID}`);
    console.log("Getting Receipt Data :", response);
    return response.data;
  } catch (err) {
    console.error("Error in Getting Receipt Data", err);
    throw err;
  }
};
