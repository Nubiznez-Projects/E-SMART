import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
  createPurchasePayment,
  getPaymentByID,
} from "../../../API/Purchase/PurchasePayment";
import * as Yup from "yup";
import { getPurchaseGrnByID } from "../../../API/Purchase/PurchaseGRN";
import dayjs from "dayjs";

const validationSchema = Yup.object().shape({
  grnNum: Yup.string().required("GRN Number is required"),
  ledger: Yup.string("Ledger is required"),
  groupLedger: Yup.string().required("Group Ledger is required"),
  createdBy: Yup.string().required("Created By is required"),
  // totalAmount: Yup.number().required("Total Amount is required"),
  invoiceNum: Yup.string() // Corrected from invoiceNuma to invoiceNum
    .required("Invoice Number is required")
    .matches(
      /^[A-Za-z0-9-]+$/,
      "Invoice Number can only contain letters, numbers, and hyphens"
    ),

  // --- New Field: PO Number ---
  poNum: Yup.string().required("PO Number is required"), // Assuming PO Number is mandatory
  // --- End New Field: PO Number ---

  transactionDate: Yup.date().required("Transaction Date is required"),

  // --- New Field: Payment Date ---
  paymentDate: Yup.date().required("Payment Date is required"), // Example: Payment date cannot be in the future
  // --- End New Field: Payment Date ---

  paymentMode: Yup.string().required("Payment Mode is required"),

  bankName: Yup.string().when("paymentMode", {
    is: (val) => ["Bank Transfer", "Card"].includes(val),
    then: (schema) =>
      schema.required("Bank Name is required for selected payment mode"),
    otherwise: (schema) => schema.notRequired(),
  }),
  senderAccNum: Yup.string().when("paymentMode", {
    is: (val) => ["Bank Transfer", "Card"].includes(val),
    then: (schema) =>
      schema
        .required("Sender Account Number is required")
        .matches(/^\d{9,18}$/, "Invalid Sender Account Number (9-18 digits)"),
    otherwise: (schema) => schema.notRequired(),
  }),
  receiverAccNum: Yup.string().when("paymentMode", {
    is: (val) => ["Bank Transfer", "Card"].includes(val),
    then: (schema) =>
      schema
        .required("Receiver Account Number is required")
        .matches(/^\d{9,18}$/, "Invalid Receiver Account Number (9-18 digits)"),
    otherwise: (schema) => schema.notRequired(),
  }),
  senderIfsc: Yup.string().when("paymentMode", {
    is: (val) => ["Bank Transfer", "Card"].includes(val),
    then: (schema) =>
      schema
        .required("Sender IFSC is required")
        .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid Sender IFSC Code"),
    otherwise: (schema) => schema.notRequired(),
  }),
  receiverIfsc: Yup.string().when("paymentMode", {
    is: (val) => ["Bank Transfer", "Card"].includes(val),
    then: (schema) =>
      schema
        .required("Receiver IFSC is required")
        .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid Receiver IFSC Code"),
    otherwise: (schema) => schema.notRequired(),
  }),
  transactionAmnt: Yup.number().when("paymentMode", {
    is: (val) => ["Bank Transfer", "Card", "Cash"].includes(val),
    then: (schema) =>
      schema
        .typeError("Transaction Amount must be a number")
        .required("Transaction Amount is required")
        .positive("Transaction Amount must be positive"),
    otherwise: (schema) => schema.notRequired(),
  }),
  transactionId: Yup.string().when("paymentMode", {
    is: (val) => ["Bank Transfer", "Card"].includes(val),
    then: (schema) =>
      schema
        .required("Transaction ID is required")
        .matches(
          /^[A-Za-z0-9]+$/,
          "Transaction ID can only contain letters and numbers"
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
  balanceDue: Yup.number()
    .typeError("Balance Due must be a number")
    .notRequired()
    .min(0, "Balance Due cannot be negative"),
  cardHolderName: Yup.string().when("paymentMode", {
    is: "Card",
    then: (schema) =>
      schema.required("Card Holder Name is required for Card payment"),
    otherwise: (schema) => schema.notRequired(),
  }),
  cardNum: Yup.string().when("paymentMode", {
    is: "Card",
    then: (schema) =>
      schema
        .required("Card Number is required for Card payment")
        .matches(/^\d{16}$/, "Card Number must be 16 digits"),
    otherwise: (schema) => schema.notRequired(),
  }),
  cashRecivedBy: Yup.string().when("paymentMode", {
    is: "Cash",
    then: (schema) =>
      schema.required("Cash Received By is required for Cash payment"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const CreatePurchasePayment = ({
  setAddPayment,
  captureId,
  setGrnData,
  grnData,
  paymentID,
  setPaymentID,
  fetchPaymentByGrn,
}) => {
  const [dataById, setDataById] = useState();
  const groupLedgerOptions = [
    "Purchase Accounts",
    "Sales Accounts",
    "Direct Expenses",
    "Indirect Expenses",
    "Assets",
    "Liabilities",
    "Receivables",
    "Payables",
  ];

  const fetchGrnById = async () => {
    try {
      const response = await getPurchaseGrnByID(captureId);
      // setGrnData(response);
      setGrnData(response[0]);
      console.log("Grn Fetched Successfully :", response);
      return response?.data;
    } catch (err) {
      console.error("Getting Error in GRN :", err);
    }
  };

  const fetchPaymentByID = async () => {
    try {
      const response = await getPaymentByID(paymentID);
      setDataById(response[0]);
      return response;
    } catch (error) {
      console.error("Error in Fetching Bill :", error);
    }
  };

  useEffect(() => {
    fetchGrnById();
    if (paymentID) {
      fetchPaymentByID();
    }
  }, [paymentID]);

  const handleSubmit = async (values) => {
    console.log("GRN Form Values:", values);
    try {
      const response = await createPurchasePayment(values, paymentID);
      setAddPayment(false);
      setPaymentID(null);
      fetchPaymentByGrn();
      console.log("API Called Successfully:", response);
    } catch (error) {
      console.error("Error submitting Good Receipt Note:", error);
    }
  };

  const handleKeyDown = (e, type = "alphanumeric") => {
    const key = e.key;

    const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
    ];

    const isAlpha = /^[a-zA-Z ]$/.test(key);
    const isAlphaNumeric = /^[a-zA-Z0-9 ]$/.test(key);
    const isNumeric = /^[0-9]$/.test(key);

    let allowed = false;

    if (type === "alpha") {
      allowed = isAlpha;
    } else if (type === "alphanumeric") {
      allowed = isAlphaNumeric;
    } else if (type === "numeric") {
      allowed = isNumeric;
    }

    if (!allowed && !allowedKeys.includes(key)) {
      e.preventDefault();
    }
  };

  console.log("Data By ID:", dataById);
  return (
    <>
      <div>
        <Formik
          initialValues={{
            poNum: grnData?.PurchasePONum || "",
            grnNum: grnData?.GRNNum || "",
            ledger: grnData?.TotalValue || dataById?.Ledger || "",
            groupLedger: dataById?.GroupLedger || "",
            createdBy: dataById?.CreatedBy || "",
            invoiceNum: grnData?.InvoiceNum || "",
            transactionDate:
              dayjs(dataById?.transactionDate).format("YYYY-MM-DD") || "",
            paymentDate:
              dayjs(dataById?.PaymentDate).format("YYYY-MM-DD") || "",
            paymentMode: dataById?.PaymentMode || "",
            bankName: dataById?.BankName || "",
            senderAccNum: dataById?.senderAccNum || "",
            receiverAccNum: dataById?.receiverAccNum || "",
            senderIfsc: dataById?.senderIFSC || "",
            receiverIfsc: dataById?.receiverIFSC || "",
            transactionAmnt: dataById?.Amount || "",
            transactionId: dataById?.transactionId || "",
            balanceDue: dataById?.balDue || "",
            cardHolderName: dataById?.cardHolderName || "",
            cardNum: dataById?.cardNumber || "",
            cashRecivedBy: dataById?.cashReceivedBy || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ handleSubmit, values, errors, touched, setFieldValue }) => {
            // Calculate balanceDue whenever ledger or transactionAmnt changes
            useEffect(() => {
              const ledgerValue = parseFloat(values.ledger) || 0;
              const transactionAmountValue =
                parseFloat(values.transactionAmnt) || 0;
              const calculatedBalanceDue =
                Number(ledgerValue) - transactionAmountValue;
              setFieldValue("balanceDue", calculatedBalanceDue.toFixed(2)); // Format to 2 decimal places
            }, [values.ledger, values.transactionAmnt, setFieldValue]);

            return (
              <Form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-[1vw] overflow-y-scroll h-[71.5vh] scrollbar-hide">
                  {/* --- PO Number and GRN Number Row --- */}
                  <div className="grid grid-cols-2 gap-[2vw]">
                    <div>
                      <div className="flex">
                        <label
                          htmlFor="poNum"
                          className="block text-[0.9vw] text-[#323232] font-semibold"
                        >
                          PO Number:
                        </label>
                        <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                          *
                        </span>
                      </div>
                      <div className="relative">
                        <Field
                          type="text"
                          id="poNum"
                          name="poNum"
                          className="w-full h-[2vw] disabled:cursor-not-allowed border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                          disabled
                        />
                        <ErrorMessage
                          name="poNum"
                          component="div"
                          className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex">
                        <label
                          htmlFor="grnNum"
                          className="block text-[0.9vw] text-[#323232] font-semibold"
                        >
                          GRN Number:
                        </label>
                        <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                          *
                        </span>
                      </div>
                      <div className="relative">
                        <Field
                          type="text"
                          id="grnNum"
                          name="grnNum"
                          className="w-full h-[2vw] disabled:cursor-not-allowed border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                          disabled
                        />
                        <ErrorMessage
                          name="grnNum"
                          component="div"
                          className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* --- Ledger and Group Ledger Row --- */}
                  <div className="grid grid-cols-2 gap-[2vw]">
                    <div>
                      <div className="flex">
                        <label
                          htmlFor="ledger"
                          className="block text-[0.9vw] text-[#323232] font-semibold"
                        >
                          Ledger Expenses :
                        </label>
                        <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                          *
                        </span>
                      </div>
                      <div className="relative">
                        <Field
                          type="number" // Changed to type="number" for calculations
                          id="ledger"
                          name="ledger"
                          disabled
                          className="w-full h-[2vw] disabled:cursor-not-allowed border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                        />
                        <ErrorMessage
                          name="ledger"
                          component="div"
                          className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex">
                        <label
                          htmlFor="groupLedger"
                          className="block text-[0.9vw] text-[#323232] font-semibold"
                        >
                          Group Ledger:
                        </label>
                        <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                          *
                        </span>
                      </div>
                      <div className="relative">
                        <Field
                          as="select"
                          id="groupLedger"
                          name="groupLedger"
                          className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                        >
                          <option value="">Select Group Ledger</option>
                          {groupLedgerOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="groupLedger"
                          component="div"
                          className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* --- Created By and Invoice Number Row --- */}
                  <div className="grid grid-cols-2 gap-[2vw]">
                    <div>
                      <div className="flex">
                        <label
                          htmlFor="createdBy"
                          className="block text-[0.9vw] text-[#323232] font-semibold"
                        >
                          Created By:
                        </label>
                        <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                          *
                        </span>
                      </div>
                      <div className="relative">
                        <Field
                          type="text"
                          id="createdBy"
                          onKeyDown={(e) => handleKeyDown(e, "alphanumeric")}
                          name="createdBy"
                          className="w-full h-[2vw] disabled:cursor-not-allowed border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                        />
                        <ErrorMessage
                          name="createdBy"
                          component="div"
                          className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex">
                        <label
                          htmlFor="invoiceNum"
                          className="block text-[0.9vw] text-[#323232] font-semibold"
                        >
                          Invoice Number:
                        </label>
                        <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                          *
                        </span>
                      </div>
                      <div className="relative">
                        <Field
                          type="text"
                          id="invoiceNum"
                          name="invoiceNum"
                          className="w-full h-[2vw] disabled:cursor-not-allowed border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                          disabled
                        />
                        <ErrorMessage
                          name="invoiceNum"
                          component="div"
                          className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Remaining fields in their original order */}
                  <div className="grid grid-cols-2 gap-[2vw]">
                    <div>
                      <div className="flex">
                        <label
                          htmlFor="transactionDate"
                          className="block text-[0.9vw] text-[#323232] font-semibold"
                        >
                          Transaction Date:
                        </label>
                        <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                          *
                        </span>
                      </div>
                      <div className="relative">
                        <Field
                          type="date"
                          id="transactionDate"
                          name="transactionDate"
                          className="w-full h-[2vw] disabled:cursor-not-allowed border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                        />
                        <ErrorMessage
                          name="transactionDate"
                          component="div"
                          className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex">
                        <label
                          htmlFor="paymentDate"
                          className="block text-[0.9vw] text-[#323232] font-semibold"
                        >
                          Payment Date:
                        </label>
                        <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                          *
                        </span>
                      </div>
                      <div className="relative">
                        <Field
                          type="date"
                          id="paymentDate"
                          name="paymentDate"
                          className="w-full h-[2vw] disabled:cursor-not-allowed border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                        />
                        <ErrorMessage
                          name="paymentDate"
                          component="div"
                          className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-[2vw]">
                    <div>
                      <div className="flex">
                        <label
                          htmlFor="paymentMode"
                          className="block text-[0.9vw] text-[#323232] font-semibold"
                        >
                          Payment Mode:
                        </label>
                        <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                          *
                        </span>
                      </div>
                      <div className="relative">
                        <Field
                          as="select"
                          id="paymentMode"
                          name="paymentMode"
                          className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                        >
                          <option value="">Select Payment Mode</option>
                          <option value="Cash">Cash</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="Card">Card</option>
                          {/* Add other payment modes as needed */}
                        </Field>
                        <ErrorMessage
                          name="paymentMode"
                          component="div"
                          className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex">
                        <label
                          htmlFor="balanceDue"
                          className="block text-[0.9vw] text-[#323232] font-semibold"
                        >
                          Balance Due:
                        </label>
                        <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                          *
                        </span>
                      </div>
                      <div className="relative">
                        <Field
                          type="number"
                          id="balanceDue"
                          name="balanceDue"
                          className="w-full h-[2vw] disabled:cursor-not-allowed border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                          disabled // This field is now disabled
                        />
                        <ErrorMessage
                          name="balanceDue"
                          component="div"
                          className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* --- Conditional rendering for Bank Transfer fields --- */}
                  {values.paymentMode === "Bank Transfer" && (
                    <>
                      <div className="grid grid-cols-2 gap-[2vw]">
                        <div>
                          <div className="flex">
                            <label
                              htmlFor="bankName"
                              className="block text-[0.9vw] text-[#323232] font-semibold"
                            >
                              Bank Name:
                            </label>
                            <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                              *
                            </span>
                          </div>
                          <div className="relative">
                            <Field
                              type="text"
                              id="bankName"
                              name="bankName"
                              onKeyDown={(e) =>
                                handleKeyDown(e, "alphanumeric")
                              }
                              className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                            />
                            <ErrorMessage
                              name="bankName"
                              component="div"
                              className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex">
                            <label
                              htmlFor="senderAccNum"
                              className="block text-[0.9vw] text-[#323232] font-semibold"
                            >
                              Sender Account Number:
                            </label>
                            <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                              *
                            </span>
                          </div>
                          <div className="relative">
                            <Field
                              type="text"
                              id="senderAccNum"
                              name="senderAccNum"
                              onKeyDown={(e) =>
                                handleKeyDown(e, "alphanumeric")
                              }
                              className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                            />
                            <ErrorMessage
                              name="senderAccNum"
                              component="div"
                              className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-[2vw]">
                        <div>
                          <div className="flex">
                            <label
                              htmlFor="receiverAccNum"
                              className="block text-[0.9vw] text-[#323232] font-semibold"
                            >
                              Receiver Account Number:
                            </label>
                            <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                              *
                            </span>
                          </div>
                          <div className="relative">
                            <Field
                              type="text"
                              id="receiverAccNum"
                              name="receiverAccNum"
                              onKeyDown={(e) =>
                                handleKeyDown(e, "alphanumeric")
                              }
                              className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                            />
                            <ErrorMessage
                              name="receiverAccNum"
                              component="div"
                              className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex">
                            <label
                              htmlFor="senderIfsc"
                              className="block text-[0.9vw] text-[#323232] font-semibold"
                            >
                              Sender IFSC:
                            </label>
                            <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                              *
                            </span>
                          </div>
                          <div className="relative">
                            <Field
                              type="text"
                              id="senderIfsc"
                              onKeyDown={(e) =>
                                handleKeyDown(e, "alphanumeric")
                              }
                              name="senderIfsc"
                              className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                            />
                            <ErrorMessage
                              name="senderIfsc"
                              component="div"
                              className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-[2vw]">
                        <div>
                          <div className="flex">
                            <label
                              htmlFor="receiverIfsc"
                              className="block text-[0.9vw] text-[#323232] font-semibold"
                            >
                              Receiver IFSC:
                            </label>
                            <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                              *
                            </span>
                          </div>
                          <div className="relative">
                            <Field
                              type="text"
                              id="receiverIfsc"
                              name="receiverIfsc"
                              onKeyDown={(e) =>
                                handleKeyDown(e, "alphanumeric")
                              }
                              className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                            />
                            <ErrorMessage
                              name="receiverIfsc"
                              component="div"
                              className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex">
                            <label
                              htmlFor="transactionId"
                              className="block text-[0.9vw] text-[#323232] font-semibold"
                            >
                              Transaction ID:
                            </label>
                            <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                              *
                            </span>
                          </div>
                          <div className="relative">
                            <Field
                              type="text"
                              id="transactionId"
                              onKeyDown={(e) =>
                                handleKeyDown(e, "alphanumeric")
                              }
                              name="transactionId"
                              className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                            />
                            <ErrorMessage
                              name="transactionId"
                              component="div"
                              className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* --- Conditional rendering for Card fields specifically --- */}
                  {values.paymentMode === "Card" && (
                    <>
                      <div className="grid grid-cols-2 gap-[2vw]">
                        <div>
                          <div className="flex">
                            <label
                              htmlFor="cardHolderName"
                              className="block text-[0.9vw] text-[#323232] font-semibold"
                            >
                              Card Holder Name:
                            </label>
                            <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                              *
                            </span>
                          </div>
                          <div className="relative">
                            <Field
                              type="text"
                              id="cardHolderName"
                              name="cardHolderName"
                              onKeyDown={(e) => handleKeyDown(e, "alpha")}
                              className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                            />
                            <ErrorMessage
                              name="cardHolderName"
                              component="div"
                              className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex">
                            <label
                              htmlFor="cardNum"
                              className="block text-[0.9vw] text-[#323232] font-semibold"
                            >
                              Card Number:
                            </label>
                            <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                              *
                            </span>
                          </div>
                          <div className="relative">
                            <Field
                              type="text"
                              id="cardNum"
                              name="cardNum"
                              onKeyDown={(e) => handleKeyDown(e, "numeric")}
                              className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                            />
                            <ErrorMessage
                              name="cardNum"
                              component="div"
                              className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                            />
                          </div>
                        </div>
                      </div>
                      {/* Transaction ID for Card payments */}
                      <div className="grid grid-cols-2 gap-[2vw]">
                        <div>
                          <div className="flex">
                            <label
                              htmlFor="transactionId"
                              className="block text-[0.9vw] text-[#323232] font-semibold"
                            >
                              Transaction ID:
                            </label>
                            <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                              *
                            </span>
                          </div>
                          <div className="relative">
                            <Field
                              type="text"
                              id="transactionId"
                              onKeyDown={(e) =>
                                handleKeyDown(e, "alphanumeric")
                              }
                              name="transactionId"
                              className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                            />
                            <ErrorMessage
                              name="transactionId"
                              component="div"
                              className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                            />
                          </div>
                        </div>
                        {/* Empty div to maintain grid layout, or remove if not needed */}
                        <div></div>
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-2 gap-[2vw]">
                    {/* Conditional rendering for Cash fields */}
                    {values.paymentMode === "Cash" && (
                      <div>
                        <div className="flex">
                          <label
                            htmlFor="cashRecivedBy"
                            className="block text-[0.9vw] text-[#323232] font-semibold"
                          >
                            Cash Received By:
                          </label>
                          <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                            *
                          </span>
                        </div>
                        <div className="relative">
                          <Field
                            type="text"
                            id="cashRecivedBy"
                            onKeyDown={(e) => handleKeyDown(e, "alpha")}
                            name="cashRecivedBy"
                            className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                          />
                          <ErrorMessage
                            name="cashRecivedBy"
                            component="div"
                            className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                          />
                        </div>
                      </div>
                    )}

                    {/* Transaction Amount is always relevant if any payment mode is selected that requires an amount */}
                    {values.paymentMode && (
                      <div>
                        <div className="flex">
                          <label
                            htmlFor="transactionAmnt"
                            className="block text-[0.9vw] text-[#323232] font-semibold"
                          >
                            Transaction Amount:
                          </label>
                          <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                            *
                          </span>
                        </div>
                        <div className="relative">
                          <Field
                            type="number" // Changed to type="number" for calculations
                            id="transactionAmnt"
                            onKeyDown={(e) => handleKeyDown(e, "numeric")}
                            name="transactionAmnt"
                            className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                          />
                          <ErrorMessage
                            name="transactionAmnt"
                            component="div"
                            className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-[2vw]"></div>
                </div>
                <div className="flex gap-[1vw] mt-[1vw] items-center justify-end">
                  <button
                    type="button"
                    className="h-[2.5vw] w-[6vw] rounded-[0.3vw] font-medium border-[0.1vw] border-[#4C67ED] text-[#4C67ED]"
                    onClick={() => setAddPayment(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`h-[2.5vw] w-[6vw] text-[0.95vw] rounded-[0.3vw] font-medium border-[0.1vw] border-[#4C67ED] bg-[#4C67ED] text-white cursor-pointer hover:bg-[#3b50c2]`}
                  >
                    Submit
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
};
