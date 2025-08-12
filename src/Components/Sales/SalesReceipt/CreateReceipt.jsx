import { Formik, Form, Field, ErrorMessage } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { getReceiptByID, CreateSalesReceipt } from "../../../API/Sales/Receipt";

const validationSchema = Yup.object().shape({
  receiptBy: Yup.string().required("Receipt By is required"),
  invoiceNo: Yup.string().required("Invoice No is required"),
  customer: Yup.string().required("Customer is required"),
  //ledger: Yup.string().required("Ledger is required"),
  groupLedger: Yup.string().required("Group Ledger is required"),
  total: Yup.number()
    .typeError("Total must be a number")
    .positive("Total must be greater than zero")
    .required("Total is required"),
  refNo: Yup.string().required("Ref No is required"),
  paymentMode: Yup.string().required("Payment Mode is required"),
  status: Yup.string().required("Status is required"),
});

export default function CreateReceipt({
  setAddReceipt,
  RcptID,
  invoiceID,
  poData,
}) {
  const [receiptData, setReceiptData] = useState();

  const status = [
    { label: "Partially Paid", value: "Partially" },
    { label: "Fully Paid", value: "Fully" },
  ];

  const paymentMode = [
    { label: "Cash", value: "Cash" },
    { label: "Credit Card", value: "Credit Card" },
    { label: "Debit Card", value: "Debit Card" },
    { label: "Bank Transfer", value: "Bank Transfer" },
    { label: "Cheque", value: "Cheque" },
    { label: "UPI ", value: "UPI " },
    { label: "Others", value: "Others" },
  ];

    const groupLedger = [
    { label: "Sundry Debtors", value: "Sundry Debtors" },
    { label: "Sales Accounts", value:  "Sales Accounts" },
    { label:  "Direct Expenses", value:  "Direct Expenses" },
    { label: "Indirect Expenses", value: "Indirect Expenses" },
    { label:  "Assets", value:  "Assets" },
    { label: "Liabilities", value: "Liabilities" },
    { label: "Receivables", value: "Receivables" },
     { label: "Payables", value: "Payables" },
  ];

  const fetchReceiptById = async () => {
    try {
      const response = await getReceiptByID(RcptID);
      setReceiptData(response[0]);
    } catch (error) {
      console.error("error getting receipt By ID", error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const response = await CreateSalesReceipt(invoiceID, values, RcptID);
      console.log(response, "submitting receipt data");
      setAddReceipt(false);
    } catch (error) {
      console.error("Error submitting receipt", error);
    }
  };

  useEffect(() => {
    if (RcptID) {
      fetchReceiptById();
    }
  }, [RcptID]);

  return (
    <>
      <div className="h-[75vh] overflow-auto scrollbar-hide w-full ">
        <Formik
          initialValues={{
            receiptBy: receiptData?.ByTo || "",
            invoiceNo: receiptData?.InvoiceNo || invoiceID,
            customer: receiptData?.CustomerName || poData?.CustomerName,
            //ledger: receiptData?.Ledger || "",
            groupLedger: receiptData?.GroupLedger || "",
            total: receiptData?.Amount || "",
            refNo: receiptData?.RefNum || "",
            paymentMode: receiptData?.PaymentMode || "",
            status: receiptData?.RecStatus || "",
          }}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-y-[1vw] gap-x-[2vw] p-[1.5vw]">
                <div className="flex flex-col gap-[0.6vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Receipt By</label>
                     <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                  </div>
                  <Field
                    id="receiptBy"
                    name="receiptBy"
                    onKeyPress={(e) => {
                      if (!/^[a-zA-Z ]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter Receipt By"
                    className="w-full h-[2vw] px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
                              transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="receiptBy"
                    component="div"
                    className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                  />
                </div>
                {/* <div className="flex flex-col gap-[0.6vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Voucher Number</label>
                  </div>
                  <Field
                    id="voucherNo"
                    name="voucherNo"
                    placeholder="Enter Voucher Number"
                    className="w-full h-[2vw] px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
                              transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="voucherNo"
                    component="div"
                    className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                  />
                </div> */}
                <div className="flex flex-col gap-[0.6vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Invoice Number</label>
                     <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                  </div>
                  <Field
                    id="invoiceNo"
                    name="invoiceNo"
                    onKeyPress={(e) => {
                      if (!/^[a-zA-Z0-9]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter Invoice Number"
                    className="w-full h-[2vw] px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
                              transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="invoiceNo"
                    component="div"
                    className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.6vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Customer</label>
                     <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                  </div>
                  <Field
                    id="customer"
                    name="customer"
                    onKeyPress={(e) => {
                      if (!/^[a-zA-Z ]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter Customer"
                    className="w-full h-[2vw] px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
                              transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="customer"
                    component="div"
                    className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                  />
                </div>
                {/* <div className="flex flex-col gap-[0.6vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Ledger</label>
                  </div>
                  <Field
                    id="ledger"
                    name="ledger"
                    placeholder="Enter Ledger"
                    className="w-full h-[2vw] px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
                              transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="ledger"
                    component="div"
                    className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                  />
                </div> */}
                <div className="flex flex-col gap-[0.6vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Group Ledger</label>
                     <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                  </div>
                  <Field
                    as="select"
                    id="groupLedger"
                    name="groupLedger"
                    onKeyPress={(e) => {
                      if (!/^[a-zA-Z ]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Select payment mode"
                    className="w-full h-[2vw] px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
                              transition-colors duration-200"
                  >
                    <option value="" disabled>
                      Select group ledger
                    </option>
                    {groupLedger?.map((item) => (
                      <option key={item?.value} value={item?.value}>
                        {item.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="groupLedger"
                    component="div"
                    className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.6vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Total Amount</label>
                     <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                  </div>
                  <Field
                    id="total"
                    name="total"
                    onKeyPress={(e) => {
                      const char = e.key;
                      const isValid = /^[0-9.]$/.test(char);
                      const hasDecimal = e.currentTarget.value.includes(".");

                      // Block invalid keys, and prevent multiple decimals
                      if (!isValid || (char === "." && hasDecimal)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter total amount"
                    className="w-full h-[2vw] px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
                              transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="total"
                    component="div"
                    className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.6vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Reference Number</label>
                  </div>
                  <Field
                    id="refNo"
                    name="refNo"
                    onKeyPress={(e) => {
                      if (!/^[a-zA-Z0-9-_]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter reference number"
                    className="w-full h-[2vw] px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
                              transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="refNo"
                    component="div"
                    className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.6vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Mode of Payment</label>
                     <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                  </div>
                  <Field
                    as="select"
                    id="paymentMode"
                    name="paymentMode"
                    onKeyPress={(e) => {
                      if (!/^[a-zA-Z ]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Select payment mode"
                    className="w-full h-[2vw] px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
                              transition-colors duration-200"
                  >
                    <option value="" disabled>
                      Select Mode of Payment
                    </option>
                    {paymentMode?.map((item) => (
                      <option key={item?.value} value={item?.value}>
                        {item.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="paymentMode"
                    component="div"
                    className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.6vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Status</label>
                     <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                  </div>
                  <Field
                    as="select"
                    id="status"
                    name="status"
                    onKeyPress={(e) => {
                      if (!/^[a-zA-Z ]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className={`w-full h-[2vw] px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
                                               transition-colors duration-200`}
                  >
                    <option value="">Select Status</option>
                    {status?.map((item) => (
                      <option key={item?.value} value={item?.value}>
                        {item.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                  />
                </div>
                <div className="flex gap-[1vw] col-span-2 justify-end items-end mt-[5vw]">
                  <button
                    type="button"
                    onClick={() => setAddReceipt(false)}
                    className={`mt-[2vw] h-[2vw] w-[6.5vw] text-[0.95vw] rounded-[0.3vw] font-semibold border-[0.1vw] border-[#4C67ED] cursor-pointer hover:bg-[#e8edfc42]`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`mt-[2vw] h-[2vw] w-[6.5vw] text-[0.95vw] rounded-[0.3vw] font-medium border-[0.1vw] border-[#4C67ED] bg-[#4C67ED] text-white cursor-pointer hover:bg-[#3b50c2]`}
                  >
                    Save
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}
