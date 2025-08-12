import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getPaymentByGrn = async (grnId, setPaymentData) => {
  try {
    const response = await axios.get(`${BASE_URL}/payment/${grnId}`);
    setPaymentData(response.data);
    console.log("Getting GRN Data :", response);
  } catch (err) {
    console.error("Error in Getting GRN Data", err);
    throw err;
  }
};

export const getPaymentByPOID = async (POID, setPaymentData) => {
  try {
    const response = await axios.get(`${BASE_URL}/payment/${POID}`);
    setPaymentData(response.data);
    console.log("Getting GRN Data :", response);
  } catch (err) {
    console.error("Error in Getting GRN Data", err);
    throw err;
  }
};

export const getPaymentByID = async (paymentID) => {
  try {
    const response = await axios.get(`${BASE_URL}/payment/${paymentID}`);
    // setPaymentData(response.data);
    console.log("Getting GRN Data :", response.data);
    return response.data;
  } catch (err) {
    console.error("Error in Getting GRN Data", err);
    throw err;
  }
};

export const createPurchasePayment = async (paymentData, paymentId) => {
  try {
    const payload = {
      PONum: paymentData?.poNum,
      GRNNum: paymentData?.grnNum,
      PaymentDate: paymentData?.paymentDate,
      transactionDate: paymentData?.transactionDate,
      PaymentMode: paymentData?.paymentMode,
      BankName: paymentData?.bankName,
      senderIFSC: paymentData?.senderIfsc,
      receiverIFSC: paymentData?.receiverIfsc,
      receiverAccNum: paymentData?.receiverAccNum,
      senderAccNum: paymentData?.senderAccNum,
      balDue: Number(paymentData?.balanceDue),
      cardNumber: paymentData?.cardNum,
      cashReceivedBy: paymentData?.cashRecivedBy,
      transactionId: paymentData?.transactionId,
      cardHolderName: paymentData?.cardHolderName,
      Ledger: paymentData?.ledger.toString(),
      GroupLedger: paymentData?.groupLedger,
      ByTo: "0",
      Amount: Number(paymentData?.transactionAmnt),
      UpdatedBy: "null",
      CreatedBy: paymentData?.createdBy,
    };
    if (paymentId) {
      const response = await axios.put(
        `${BASE_URL}/payment/${paymentId}`,
        payload
      );
      toast.success(response.message);
      console.log("Update Purchase PO", response.data);
      return response.data;
    } else {
      const response = await axios.post(`${BASE_URL}/payment`, payload);
      console.log("Create Purchase PO response", response.data);
      toast.success(response.message);
      return response.data;
    }

    // dispatch(fetchPurchasePo());
  } catch (error) {
    console.error(error, "Error in creating the Purchase PO:");
  }
};
