import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
  CreatePurchaseBill,
  getBillByGrn,
  getBillEntryByID,
} from "../../../API/Purchase/PurchaseBill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { Input, message } from "antd";
// import { BillEntryTable } from "./BillEntryTable";
import {
  getGrnByPoNum,
  getPurchaseGrnByID,
} from "../../../API/Purchase/PurchaseGRN";
import * as Yup from "yup";

const purchaseBillEntrySchema = Yup.object().shape({
  PONumber: Yup.string().required("PO Number is required"),
  GRNNumber: Yup.string().required("GRN Number is required"),
  LedgerExpenses: Yup.string().required("Ledger Expenses is required"),
  GroupLedger: Yup.string().required("Group Ledger is required"),
  CreatedBy: Yup.string().required("Created By is required"),
  // UpdatedBy: Yup.string().required("Updated By is required"),
  ItemCategory: Yup.string().required("Item Category is required"),
  Amount: Yup.number()
    .typeError("Amount must be a number")
    .required("Amount is required"),
  BillImage: Yup.mixed()
    .required("Bill Image is required")
    .test("fileType", "Only image files are allowed", (value) => {
      if (!value) return false;

      if (typeof value === "string") return true; // valid existing image path

      return ["image/jpeg", "image/png", "image/jpg"].includes(value.type); // File object
    }),
});

const IMAGE_URL = import.meta.env.VITE_API_IMAGE_URL;

export const CreateBillEntry = ({
  setAddBill,
  captureId,
  billNumber,
  billById,
  setBillById,
  fetchBillByGrn,
  grnData,
  setGrnData,
}) => {
  console.log(captureId, billNumber, billById, "consolelog");
  const [totalNetAmount, setTotalNetAmount] = useState(0);

  const itemCategories = [
    "Food",
    "Petrol",
    "Courier",
    "Transport",
    "Loading/Unloading",
    "Labour Charges",
    "Miscellaneous",
  ];

  const groupLedgerOptions = [
    "Sundry Creditors",
    "Purchase Accounts",
    "Duties & Taxes",
    "Direct Expenses",
    "Indirect Expenses",
    "Advance to Suppliers",
    "Freight Inward",
    "Fixed Assets",
  ];

  const handleSubmit = (values, { setSubmitting }) => {
    try {
      console.log(values, setSubmitting, "values_setSubmitting");
      const response = CreatePurchaseBill(billNumber, values);
      console.log(response, "Post Action Done successfully");
      fetchBillByGrn();
      setAddBill(false);
    } catch (error) {
      console.error(error, "Error in Posting Bill Entries :");
    }
  };
  console.log("Bill No:", billNumber);
  // const fetchGrnById = async () => {
  //   try {
  //     const response = await getPurchaseGrnByID(captureId);
  //     // setGrnData(response);
  //     setGrnData(response[0]);
  //     console.log("Grn Fetched Successfully :", response);
  //     return response?.data;
  //   } catch (err) {
  //     console.error("Getting Error in GRN :", err);
  //   }
  // };

  const fetchBillById = async () => {
    try {
      const response = await getBillEntryByID(billNumber);
      setBillById(response[0]);
      return response;
    } catch (error) {
      console.error("Error in Fetching Bill :", error);
    }
  };

  useEffect(() => {
    if (billNumber) {
      fetchBillById();
    }
  }, [billNumber]);

  console.log(billById, "Data Fetched SuccessFully :");

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

  return (
    <>
      <div className="mt-[1vw]">
        <Formik
          initialValues={{
            PONumber: billById?.PONumber
              ? billById?.PONumber
              : grnData?.PurchasePONum,
            GRNNumber: billById?.GRNNumber
              ? billById?.GRNNumber
              : grnData?.GRNNum,
            LedgerExpenses: billById?.LedgerExpense
              ? billById?.LedgerExpense
              : grnData?.TotalValue,
            GroupLedger: billById?.GroupLedger ? billById?.GroupLedger : "",
            CreatedBy: billById?.CreatedBy
              ? billById?.CreatedBy
              : grnData?.CreatedBy,
            UpdatedBy: billById?.UpdatedBy
              ? billById?.UpdatedBy
              : grnData?.UpdatedBy,
            ItemCategory: billById?.ItemCategory ? billById?.ItemCategory : "",
            Amount: billById?.Amount ? billById?.Amount : "",
            BillImage: billById?.BillImage ? billById?.BillImage : null,
          }}
          validationSchema={purchaseBillEntrySchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ handleSubmit, setFieldValue, values, errors, touched }) => (
            <Form onSubmit={handleSubmit}>
              <div className="w-full flex flex-col gap-[1vw]">
                {/* PO & GRN Numbers */}
                <div className="grid grid-cols-2 gap-x-[2vw]">
                  {/* PO Number */}
                  <div>
                    <label className="block text-[0.9vw] text-[#323232] font-semibold">
                      PO Number
                    </label>
                    <div className="relative">
                      <Field
                        type="text"
                        name="PONumber"
                        disabled
                        className="w-full h-[2vw] disabled:cursor-not-allowed border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                      />
                      <ErrorMessage
                        name="PONumber"
                        component="div"
                        className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                      />
                    </div>
                  </div>

                  {/* GRN Number */}
                  <div>
                    <label className="block text-[0.9vw] text-[#323232] font-semibold">
                      GRN Number
                    </label>
                    <div className="relative">
                      <Field
                        type="text"
                        name="GRNNumber"
                        disabled
                        className="w-full h-[2vw] disabled:cursor-not-allowed border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                      />
                      <ErrorMessage
                        name="GRNNumber"
                        component="div"
                        className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                      />
                    </div>
                  </div>
                </div>

                {/* Ledger Expenses & Group Ledger */}
                <div className="grid grid-cols-2 gap-x-[2vw]">
                  {/* Ledger Expenses */}
                  <div>
                    <label className="block text-[0.9vw] text-[#323232] font-semibold">
                      Ledger Expenses
                    </label>
                    <div className="relative">
                      <Field
                        type="text"
                        name="LedgerExpenses"
                        placeholder="Enter Ledger Expenses"
                        className="w-full h-[2vw] disabled:cursor-not-allowed border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                        disabled
                      />
                      <ErrorMessage
                        name="LedgerExpenses"
                        component="div"
                        className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                      />
                    </div>
                  </div>

                  {/* Group Ledger */}
                  <div>
                    <label className="block text-[0.9vw] text-[#323232] font-semibold">
                      Group Ledger
                    </label>
                    <div className="relative">
                      <Field
                        as="select"
                        name="GroupLedger"
                        className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] text-[0.9vw] bg-white"
                      >
                        <option value="">Select Item Category</option>
                        {groupLedgerOptions.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="GroupLedger"
                        component="div"
                        className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                      />
                    </div>
                  </div>
                </div>

                {/* Created & Updated By */}
                <div className="grid grid-cols-2 gap-x-[2vw]">
                  <div>
                    <label className="block text-[0.9vw] text-[#323232] font-semibold">
                      Created By
                    </label>
                    <Field
                      type="text"
                      onKeyDown={(e) => handleKeyDown(e, "alphanumeric")}
                      name="CreatedBy"
                      className="w-full h-[2vw] disabled:cursor-not-allowed border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.9vw] text-[#323232] font-semibold">
                      Updated By
                    </label>
                    <Field
                      type="text"
                      name="UpdatedBy"
                      onKeyDown={(e) => handleKeyDown(e, "alphanumeric")}
                      className="w-full h-[2vw] disabled:cursor-not-allowed border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                    />
                  </div>
                </div>

                {/* Item Category & Amount */}
                <div className="grid grid-cols-2 gap-x-[2vw]">
                  {/* Item Category */}
                  <div>
                    <label className="block text-[0.9vw] text-[#323232] font-semibold">
                      Item Category
                    </label>
                    <div className="relative">
                      <Field
                        as="select"
                        name="ItemCategory"
                        className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] text-[0.9vw] bg-white"
                      >
                        <option value="">Select Item Category</option>
                        {itemCategories.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="ItemCategory"
                        component="div"
                        className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                      />
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-[0.9vw] text-[#323232] font-semibold">
                      Amount
                    </label>
                    <div className="relative">
                      <Field
                        type="number"
                        name="Amount"
                        onKeyDown={(e) => handleKeyDown(e, "numeric")}
                        placeholder="Enter Amount"
                        className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw]"
                      />
                      <ErrorMessage
                        name="Amount"
                        component="div"
                        className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                      />
                    </div>
                  </div>
                </div>

                {/* Bill Image */}
                <div className="flex flex-col">
                  <label className="block text-[0.9vw] text-[#323232] font-semibold">
                    Bill Image
                  </label>
                  {/* Hidden file input */}
                  <input
                    id="bill_image_input"
                    name="BillImage"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      if (file) {
                        setFieldValue("BillImage", file);
                      }
                    }}
                  />

                  {/* Custom styled button to trigger file input */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById("bill_image_input").click();
                      }}
                      className="border flex items-center justify-between px-[1vw] mt-[0.2vw] border-gray-300 text-[1vw] h-[2vw] w-full rounded-[0.5vw] outline-none"
                    >
                      <span className="text-[1vw] font-sans text-[#9ba6bbe3]">
                        {values?.BillImage?.name
                          ? values?.BillImage?.name
                          : " Upload Bill Image"}
                      </span>
                    </button>
                  </div>

                  {/* Show existing image preview if editing */}
                  {typeof values.BillImage === "string" && (
                    <img
                      src={
                        billById
                          ? `${IMAGE_URL}${billById?.BillImage}`
                          : values.BillImage
                      }
                      alt="Existing Bill"
                      className="w-[10vw] mt-[1vw] rounded"
                    />
                  )}

                  {/* Show validation error */}
                  {errors.BillImage && touched.BillImage && (
                    <div className="text-red-500 text-[0.8vw] mt-[0.3vw]">
                      {errors.BillImage}
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-[2vw] mt-[2vw]">
                  <button
                    type="button"
                    className="h-[2.5vw] w-[6vw] rounded-[0.3vw] font-medium border-[0.1vw] border-[#4C67ED] text-[#4C67ED]"
                    onClick={() => setAddBill(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-[2.5vw] w-[6vw] text-[0.95vw] rounded-[0.3vw] font-medium border-[0.1vw] border-[#4C67ED] bg-[#4C67ED] text-white cursor-pointer hover:bg-[#3b50c2]"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};
