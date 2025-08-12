import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { GRNTable } from "./GRNTable";
import {
  createPurchaseGRN,
  getPurchaseGrnByID,
} from "../../../API/Purchase/PurchaseGRN";
import dayjs from "dayjs";
import { getPurchasePOID } from "../../../API/Purchase/PurchasePO";
import { fetchPurchaseGRN } from "../../../Redux/Slice/PurchaseModule/PurchaseGRNThunk";
import { fetchSuppliers } from "../../../Redux/Slice/MasterModule/Suppliers/SupplierThunks";

const validationSchema = Yup.object().shape({
  poNumber: Yup.string().required("PO Number is required"),
  issuedDate: Yup.date()
    .nullable()
    .typeError("Issued Date must be a valid date")
    .required("Issued Date is required"),
  orderTo: Yup.string().required("Order To (Supplier) is required"),
  deliveryTo: Yup.string().required("Delivery Address is required"),
  createdBy: Yup.string().required("Created By is required"),
  updatedBy: Yup.string(),
  invoiceno: Yup.string().required("Invoice Number is required"),
  invoicedate: Yup.date()
    .nullable()
    .typeError(" Date must be a valid date")
    .required(" Date is required"),
  receiveddate: Yup.date()
    .nullable()
    .typeError(" Date must be a valid date")
    .required(" Date is required"),
  receivedby: Yup.string().required("Received By is required"),
  receivedQuantity: Yup.number()
    .min(0, "Received Quantity cannot be negative")
    .required("Received Quantity is required"),
  acceptedQuantity: Yup.number()
    .min(0, "Accepted Quantity cannot be negative")
    .required("Accepted Quantity is required"),
  Status: Yup.string().required("Status is required"),
  description: Yup.string().required("Description is required"),
  taxableValue: Yup.number()
    .required("Taxable Value is required")
    .min(0, "Taxable Value cannot be negative"), // Can be zero
  taxPer: Yup.string().required("Tax Per is required"),
  taxValue: Yup.number()
    .required("Tax Value is required")
    .min(0, "Tax Value cannot be negative"), // Can be zero
  totalValue: Yup.number()
    .required("Total Value is required")
    .min(0, "Total Value cannot be negative"), // Can be zero
  items: Yup.array()
    .min(1, "At least one item is required in the table.")
    .test(
      "items-required",
      "Please check and fill all the required fields in the table properly.",
      function (value) {
        if (!value || value.length === 0) {
          return true; // Let .min(1) handle the "no items" case
        }

        const allItemsValid = value.every((item) => {
          const requiredFields = [
            "hsn",
            "itemCode",
            "itemName",
            "quantity",
            "a_quantity",
            "rate",
          ];
          const isItemValid = requiredFields.every((field) => {
            const val = item[field];
            if (typeof val === "string" && val.trim() === "") return false;
            if (val === null || val === undefined) return false;
            if (
              field === "quantity" ||
              field === "rate" ||
              field === "a_quantity"
            ) {
              const numVal = parseFloat(val);
              if (isNaN(numVal) || numVal <= 0) return false; // This check applies to all three fields now
            }
            return true;
          });
          return isItemValid;
        });

        if (!allItemsValid) {
          return this.createError({
            path: "items", // This ensures the error is associated with the 'items' array
            message:
              "Please check and fill all the required fields in the table properly.",
          });
        }
        return true;
      }
    ),
});

export const CreatePurchaseGrn = ({
  closeModal,
  isView,
  purchaseGrnID,
  purchaseGrnData,
  setPurchaseGrnData,
  purchasePOData,
  purchasePOID,
  setPurchasePoData,
  setAddGrn,
  captureId,
}) => {
  const dispatch = useDispatch();

  // Place this outside the component or at the top of your component
  const creditDaysOptions = [
    { label: "0-30", value: "0-30" },
    { label: "30-60", value: "30-60" },
    { label: "60-90", value: "60-90" },
    { label: "90-120", value: "90-120" },
    { label: "120-180", value: "120-180" },
  ];

  const deliveryToOptions = ["Warehouse A", "Warehouse B", "Warehouse C"]; // Example options

  const [totalNetAmount, setTotalNetAmount] = useState(0);

  const {
    supplier = [],
    supplier_loading = false,
    supplier_error = null,
  } = useSelector((state) => state?.supplier || {});
  const orderToOptions = supplier.filter((s) => s.IsActive === true);

  const handleKeyDown = (e, type = "alphanumeric") => {
    const key = e.key;

    const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
      ".", // Allow decimal for numeric fields
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

  const fetchPurchasePOById = async () => {
    try {
      const response = await getPurchasePOID(purchasePOID);
      setPurchasePoData(response);
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPurchaseGrnByID = async () => {
    try {
      const response = await getPurchaseGrnByID(captureId);
      setPurchaseGrnData(response[0]);
      return response;
    } catch (error) {
      console.error(error);
    }
  };
  console.log(captureId, "setPurchaseGrnData");
  useEffect(() => {
    if (captureId) {
      fetchPurchasePOById();
    }
  }, [captureId]);

  useEffect(() => {
    if (captureId) {
      fetchPurchaseGrnByID();
    }
  }, [captureId]);

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const handleSubmit = async (values) => {
    console.log("GRN Form Values:", values);
    try {
      const { items, ...otherValues } = values;
      const getSupplierDetails = orderToOptions?.filter(
        (suppliers) => suppliers?.SupplierID === values?.orderTo
      );
      const response = await createPurchaseGRN(
        dispatch,
        captureId,
        otherValues,
        items,
        getSupplierDetails[0]
      );
      console.log(response, "API Response");
      // setTabName("GRN");
      setAddGrn(false);
      // closeModal();
      dispatch(fetchPurchaseGRN());
    } catch (error) {
      console.error("Error submitting Good Receipt Note:", error);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          poNumber:
            purchasePOData?.PONum || purchaseGrnData?.PurchasePONum || "",
          issuedDate: purchasePOData?.CreatedDate
            ? dayjs(purchasePOData.CreatedDate).format("YYYY-MM-DD")
            : purchaseGrnData?.PurchasePODate
            ? dayjs(purchaseGrnData.PurchasePODate).format("YYYY-MM-DD")
            : "",
          deliveryDate:
            purchasePOData?.DeliveryDate &&
            dayjs(purchasePOData.DeliveryDate).isValid()
              ? dayjs(purchasePOData.DeliveryDate).format("YYYY-MM-DD")
              : purchaseGrnData?.DeliveryDate &&
                dayjs(purchaseGrnData.DeliveryDate).isValid()
              ? dayjs(purchaseGrnData.DeliveryDate).format("YYYY-MM-DD")
              : "",
          orderTo:
            purchasePOData?.SupplierID || purchaseGrnData?.SupplierID || "",
          deliveryTo:
            purchasePOData?.DeliveryAddress ||
            purchaseGrnData?.DeliveryLoc ||
            "",
          createdBy: purchaseGrnData?.CreatedBy || "",
          updatedBy: purchaseGrnData?.UpdatedBy || "",

          // GRN specific
          invoiceno:
            purchaseGrnData?.InvoiceNo || purchaseGrnData?.InvoiceNum || "",
          invoicedate:
            purchaseGrnData?.InvoiceDate &&
            dayjs(purchaseGrnData.InvoiceDate).isValid()
              ? dayjs(purchaseGrnData.InvoiceDate).format("YYYY-MM-DD")
              : "",
          receiveddate:
            purchaseGrnData?.ReceivedDate &&
            dayjs(purchaseGrnData.ReceivedDate).isValid()
              ? dayjs(purchaseGrnData.ReceivedDate).format("YYYY-MM-DD")
              : "",
          receivedby: purchaseGrnData?.ReceivedBy || "",
          receivedQuantity: purchaseGrnData?.ReceivedQty || 0,
          acceptedQuantity: purchaseGrnData?.AcceptedQty || 0,
          Status: purchaseGrnData?.Status || "",
          description:
            purchaseGrnData?.Description || purchaseGrnData?.Narration || "",
          taxableValue: purchaseGrnData?.TaxableValue || "",
          taxPer: purchaseGrnData?.TaxPer || "",
          taxValue: purchaseGrnData?.TaxValue || "",
          totalValue: purchaseGrnData?.TotalValue || "",
          // Amount: totalNetAmount||  "",
          Amount: "",
          CreditDays: purchaseGrnData?.CreditDays || "",
          items:
            purchaseGrnData?.Items?.length > 0
              ? purchaseGrnData.Items.map((item) => ({
                  itemCode: item?.ItemCode || "",
                  itemName: item?.ItemName || item?.Description || "",
                  hsn: item?.HSN || "",
                  quantity: item?.Quantity || 0,
                  rate: item?.Rate || 0,
                  netAmount: item?.Amount || item?.Total || 0,
                  a_quantity: item?.a_quantity || 0,
                }))
              : purchasePOData?.Items?.length > 0
              ? purchasePOData.Items.map((item) => ({
                  itemCode: item?.ItemCode || "",
                  itemName: item?.ItemName || item?.Description || "",
                  hsn: item?.HSN || "",
                  quantity: item?.Quantity || 0,
                  rate: item?.Rate || 0,
                  netAmount: item?.Amount || item?.Total || 0,
                  a_quantity: item?.a_quantity || 0,
                }))
              : [
                  {
                    hsn: "",
                    itemCode: "",
                    itemName: "",
                    quantity: 0,
                    a_quantity: 0,
                    rate: 0,
                    netAmount: 0,
                  },
                ],
        }}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {({
          isSubmitting,
          resetForm,
          setFieldValue,
          values,
          handleSubmit,
          touched,
          errors,
        }) => {
          useEffect(() => {
            const taxable = parseFloat(values.taxableValue);
            const taxPercentage = parseFloat(values.taxPer);

            if (!isNaN(taxable) && !isNaN(taxPercentage)) {
              const calculatedTax = (taxable * taxPercentage) / 100;
              const total = taxable + calculatedTax;

              setFieldValue("taxValue", calculatedTax.toFixed(2));
              setFieldValue("totalValue", total.toFixed(2));
            } else {
              setFieldValue("taxValue", "");
              setFieldValue("totalValue", "");
            }
          }, [values.taxableValue, values.taxPer, setFieldValue]);

          return (
            <Form onSubmit={handleSubmit}>
              <>
                {/* <div className="text-xl font-bold text-center py-[1vw] bg-[#EADFBC80] rounded-t-[0.6vw] shadow-md">
                GOOD RECEIVE NOTE
              </div> */}

                <div className="overflow-auto">
                  <div className="px-[2vw] flex flex-col gap-y-[1vw]">
                    <div className="grid grid-cols-2 gap-x-[2vw]">
                      <div className="">
                        <div className="flex">
                          <label
                            htmlFor="poNumber"
                            className="block text-[0.9vw] text-[#323232] font-semibold"
                          >
                            PO Number
                          </label>
                          <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                            *
                          </span>
                        </div>
                        <div className="relative">
                          <Field
                            type="text"
                            name="poNumber"
                            placeholder="Enter PO Num"
                            className="w-full  h-[2vw] disabled:cursor-not-allowed border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                            disabled={true} // Disable if in view mode
                          />

                          <ErrorMessage
                            name="poNumber"
                            component="div"
                            className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex">
                          <label
                            htmlFor="issuedDate"
                            className="block text-[0.9vw] text-[#323232] font-semibold"
                          >
                            PO Issued Date
                          </label>
                          <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                            *
                          </span>
                        </div>
                        <div className="relative">
                          {/* <Field
                          name="issuedDate"
                          type="date"
                          min={dayjs().format("YYYY-MM-DD")}
                          className="w-full border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw]"
                          disabled={true}
                        /> */}
                          <Field name="issuedDate">
                            {({ field, form }) => (
                              <input
                                {...field}
                                type="date"
                                min={dayjs().format("YYYY-MM-DD")}
                                value={
                                  field.value
                                    ? dayjs(field.value).format("YYYY-MM-DD")
                                    : ""
                                }
                                onChange={(e) => {
                                  const value = e.target.value;
                                  form.setFieldValue("issuedDate", value);
                                }}
                                disabled={true}
                                className="w-full disabled:cursor-not-allowed h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw]"
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="issuedDate"
                            component="div"
                            className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-[2vw]">
                      <div className="relative">
                        <div className="flex">
                          <label
                            htmlFor="orderTo"
                            className="block text-[0.9vw] text-[#323232] font-semibold"
                          >
                            Order To
                          </label>
                          <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                            *
                          </span>
                        </div>
                        <Field
                          as="select"
                          name="orderTo"
                          className="w-full h-[2vw] disabled:cursor-not-allowed border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                          disabled={true}
                        >
                          <option value="">Select a client</option>
                          {orderToOptions.map((option, index) => (
                            <option
                              key={option.id || index}
                              value={option?.SupplierID}
                            >
                              {option.SupplierName}, {option.Address}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="orderTo"
                          component="div"
                          className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                        />
                      </div>
                      <div className="relative">
                        <div className="flex">
                          <label
                            htmlFor="deliveryTo"
                            className="block text-[0.9vw] text-[#323232] font-semibold"
                          >
                            Delivery To
                          </label>
                          <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                            *
                          </span>
                        </div>
                        <Field
                          as="select"
                          name="deliveryTo"
                          className="w-full disabled:cursor-not-allowed h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                          disabled={true}
                        >
                          <option value="">Select a location</option>
                          {deliveryToOptions.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="deliveryTo"
                          component="div"
                          className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-x-[2vw]">
                      <div className="relative">
                        <div className="flex">
                          <label
                            htmlFor="createdBy"
                            className="block text-[0.9vw] text-[#323232] font-semibold"
                          >
                            Created By
                          </label>
                          <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                            *
                          </span>
                        </div>
                        <Field
                          name="createdBy"
                          placeholder="Created By"
                          onKeyDown={(e) => handleKeyDown(e, "alphanumeric")}
                          className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw]"
                          // disabled={true}
                        />
                        <ErrorMessage
                          name="createdBy"
                          component="div"
                          className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                        />
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="updatedBy"
                          className="block text-[0.9vw] text-[#323232] font-semibold"
                        >
                          Updated By
                        </label>
                        <Field
                          name="updatedBy"
                          placeholder="Updated By"
                          onKeyDown={(e) => handleKeyDown(e, "alphanumeric")}
                          className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw]"
                          // disabled={true}
                        />
                        <ErrorMessage
                          name="updatedBy"
                          component="div"
                          className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                        />
                      </div>
                      <div className="col-span-2 relative">
                        <div className="flex">
                          <label
                            htmlFor="invoiceno"
                            className="block text-[0.9vw] text-[#323232] font-semibold"
                          >
                            Invoice No:
                          </label>
                          <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                            *
                          </span>
                        </div>
                        <Field
                          type="text"
                          name="invoiceno"
                          placeholder="Enter Invoice No"
                          className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                          disabled={isView}
                        />

                        <ErrorMessage
                          name="invoiceno"
                          component="div"
                          className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-x-[2vw]">
                      <div className="relative">
                        <div className="flex">
                          <label
                            htmlFor="invoicedate"
                            className="block text-[0.9vw] text-[#323232] font-semibold"
                          >
                            Invoice Date
                          </label>
                          <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                            *
                          </span>
                        </div>
                        {/* <Field
                        name="invoicedate"
                        type="date"
                        min={dayjs().format("YYYY-MM-DD")}
                        className="w-full border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw]"
                        disabled={isView}
                      /> */}

                        <Field name="invoicedate">
                          {({ field, form }) => {
                            const today = dayjs().format("YYYY-MM-DD");
                            const value = field.value
                              ? dayjs(field.value).format("YYYY-MM-DD")
                              : "";

                            return (
                              <input
                                type="date"
                                max={today} // ⛔️ Disallow dates after today
                                {...field}
                                value={value}
                                onChange={(e) => {
                                  form.setFieldValue(
                                    "invoicedate",
                                    e.target.value
                                  );
                                }}
                                className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw]"
                              />
                            );
                          }}
                        </Field>
                        <ErrorMessage
                          name="invoicedate"
                          component="div"
                          className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                        />
                      </div>
                      <div className="relative">
                        <div className="flex">
                          <label
                            htmlFor="receiveddate"
                            className="block text-[0.9vw] text-[#323232] font-semibold"
                          >
                            Received Date
                          </label>
                          <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                            *
                          </span>
                        </div>
                        {/* <Field
                        name="receiveddate"
                        type="date"
                        min={dayjs().format("YYYY-MM-DD")}
                        className="w-full border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw]"
                        disabled={isView}
                      /> */}
                        <Field name="receiveddate">
                          {({ field, form }) => {
                            const today = dayjs().format("YYYY-MM-DD");
                            const value = field.value
                              ? dayjs(field.value).format("YYYY-MM-DD")
                              : "";

                            return (
                              <input
                                type="date"
                                max={today} // Disallow future dates
                                {...field}
                                value={value}
                                onChange={(e) => {
                                  form.setFieldValue(
                                    "receiveddate",
                                    e.target.value
                                  );
                                }}
                                className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw]"
                              />
                            );
                          }}
                        </Field>
                        <ErrorMessage
                          name="receiveddate"
                          component="div"
                          className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                        />
                      </div>

                      <div className=" col-span-2 relative">
                        <div className="flex">
                          <label
                            htmlFor="receivedby"
                            className="block text-[0.9vw] text-[#323232] font-semibold"
                          >
                            Received by
                          </label>
                          <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                            *
                          </span>
                        </div>
                        <Field
                          type="text"
                          name="receivedby"
                          placeholder="Enter Received by"
                          onKeyDown={(e) => handleKeyDown(e, "alpha")}
                          className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                          disabled={isView}
                        />

                        <ErrorMessage
                          name="receivedby"
                          component="div"
                          className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-[2vw]">
                      <div className="relative">
                        <div className="flex">
                          <label
                            htmlFor="receivedQuantity"
                            className="block text-[0.9vw] text-[#323232] font-semibold"
                          >
                            Received Quantity
                          </label>
                          <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                            *
                          </span>
                        </div>
                        <Field
                          type="text" // Keep as text to allow for onKeyDown
                          name="receivedQuantity"
                          placeholder="Enter Received Quantity"
                          onKeyDown={(e) => handleKeyDown(e, "numeric")}
                          className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                          disabled={isView}
                          onChange={(e) => {
                            // Manually update field value to ensure only numbers are stored
                            const val = e.target.value;
                            if (!isNaN(val) || val === "") {
                              setFieldValue("receivedQuantity", val);
                            }
                          }}
                        />

                        <ErrorMessage
                          name="receivedQuantity"
                          component="div"
                          className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                        />
                      </div>
                      <div className="relative">
                        <div className="relative">
                          <div className="flex">
                            <label
                              htmlFor="acceptedQuantity"
                              className="block text-[0.9vw] text-[#323232] font-semibold"
                            >
                              Accepted Quantity
                            </label>
                            <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                              *
                            </span>
                          </div>
                          <Field
                            type="text" // Keep as text to allow for onKeyDown
                            name="acceptedQuantity"
                            placeholder="Enter Accepted Quantity"
                            onKeyDown={(e) => handleKeyDown(e, "numeric")}
                            className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                            disabled={isView}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (!isNaN(val) || val === "") {
                                setFieldValue("acceptedQuantity", val);
                              }
                            }}
                          />

                          <ErrorMessage
                            name="acceptedQuantity"
                            component="div"
                            className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-[2vw]"></div>
                    <div className="grid grid-cols-2 gap-x-[2vw]">
                      <div className="relative">
                        <div className="flex">
                          <label
                            htmlFor="Status"
                            className="block text-[0.9vw] text-[#323232] font-semibold"
                          >
                            Status
                          </label>
                          <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                            *
                          </span>
                        </div>
                        <Field
                          as="select"
                          name="Status"
                          className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                          disabled={isView}
                        >
                          <option value="">Select Status</option>

                          <option value="Partially Received">
                            Partially Received
                          </option>
                          <option value="Fully Received">Fully Received</option>
                        </Field>

                        <ErrorMessage
                          name="Status"
                          component="div"
                          className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                        />
                      </div>
                      <div className="relative">
                        <div className="flex">
                          <label
                            htmlFor="description"
                            className="block text-[0.9vw] text-[#323232] font-semibold"
                          >
                            Received Condition :
                          </label>
                          {/* Description is optional, so no '*' */}
                        </div>
                        <Field
                          type="text"
                          name="description"
                          placeholder="Enter description"
                          className="w-full h-[2vw] border mt-[0.15vw] border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                          disabled={isView}
                        />

                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-[2vw] text-[#32323233] border-dashed border-0 border-t-[0.2vw]"></div>
                  <GRNTable
                    totalNetAmount={totalNetAmount}
                    setTotalNetAmount={setTotalNetAmount}
                    // GRNTable will access values.items directly from Formik context
                    isView={isView} // Pass isView to GRNTable
                  />

                  {/* <div className="mt-[1vw] font-bold text-[#03B34D] p-[0.5vw] text-right border-t-[0.2vw] border-dashed border-gray-300 text-[1.25vw] ">
                  <span className=" font-bold">Gross Amount:</span>{" "}
                  <span className="">₹ {totalNetAmount.toFixed(2)}</span>
                </div> */}

                  <div>
                    <div className="grid grid-cols-3 gap-[2vw] mt-[1vw]">
                      <div className="">
                        <div className="flex">
                          <label
                            htmlFor="Amount"
                            className="block text-[0.9vw] text-[#323232] font-semibold"
                          >
                            Amount
                          </label>
                          <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                            *
                          </span>
                        </div>
                        <div className="relative">
                          <Field
                            type="text"
                            name="Amount"
                            value={totalNetAmount}
                            placeholder="Enter PO Num"
                            className="w-full  h-[2vw] disabled:cursor-not-allowed border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                            disabled={true}
                          />

                          <ErrorMessage
                            name="Amount"
                            component="div"
                            className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex">
                          <label
                            htmlFor="taxableValue"
                            className="block text-[0.9vw] text-[#323232] font-semibold"
                          >
                            Taxable Value
                          </label>
                          <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                            *
                          </span>
                        </div>
                        <div className="relative">
                          <div className="relative">
                            <Field
                              type="text"
                              name="taxableValue"
                              onKeyDown={(e) => handleKeyDown(e, "numeric")}
                              placeholder="Enter Taxable Value"
                              className="w-full  h-[2vw] disabled:cursor-not-allowed border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                            />

                            <ErrorMessage
                              name="taxableValue"
                              component="div"
                              className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex">
                          <label
                            htmlFor="taxPer"
                            className="block text-[0.9vw] text-[#323232] font-semibold"
                          >
                            Tax Percentage
                          </label>
                          <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                            *
                          </span>
                        </div>
                        <div className="relative">
                          <div className="relative">
                            <Field
                              type="text"
                              name="taxPer"
                              onKeyDown={(e) => handleKeyDown(e, "numeric")}
                              placeholder="Enter Tax Percentage"
                              className="w-full  h-[2vw] disabled:cursor-not-allowed border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                            />

                            <ErrorMessage
                              name="taxPer"
                              component="div"
                              className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                            />
                          </div>
                        </div>
                      </div>{" "}
                      <div>
                        <div className="flex">
                          <label
                            htmlFor="taxValue"
                            className="block text-[0.9vw] text-[#323232] font-semibold"
                          >
                            Tax Value
                          </label>
                          <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                            *
                          </span>
                        </div>
                        <div className="relative">
                          <div className="relative">
                            <Field
                              type="text"
                              name="taxValue"
                              onKeyDown={(e) => handleKeyDown(e, "numeric")}
                              placeholder="Enter Tax Value"
                              className="w-full  h-[2vw] disabled:cursor-not-allowed border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                              disabled={true} // Disable if in view mode
                            />

                            <ErrorMessage
                              name="taxValue"
                              component="div"
                              className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        {/* CreditDays */}
                        <div className="flex">
                          <label
                            htmlFor="totalValue"
                            className="block text-[0.9vw] text-[#323232] font-semibold"
                          >
                            Net Worth{" "}
                          </label>
                          <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                            *
                          </span>
                        </div>
                        <div className="relative">
                          <div className="relative">
                            <Field
                              type="text"
                              name="totalValue"
                              placeholder="Enter Total Value"
                              className="w-full  h-[2vw] disabled:cursor-not-allowed border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                              disabled={true} // Disable if in view mode
                            />

                            <ErrorMessage
                              name="totalValue"
                              component="div"
                              className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        {/* Credit Days */}
                        <div className="flex">
                          <label
                            htmlFor="creditDays"
                            className="block text-[0.9vw] text-[#323232] font-semibold"
                          >
                            Credit Days{" "}
                          </label>
                          <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                            *
                          </span>
                        </div>

                        <div className="relative">
                          <div className="relative">
                            <Field
                              as="select"
                              name="creditDays"
                              className="w-full h-[2vw] disabled:cursor-not-allowed border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                              disabled={false}
                            >
                              <option value="" disabled>
                                Select Credit Days
                              </option>
                              {creditDaysOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Field>

                            <ErrorMessage
                              name="creditDays"
                              component="div"
                              className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {!isView && ( // Only show buttons if not in view mode
                  <div className="flex justify-end items-end w-full gap-[2vw] my-[1vw]">
                    <button
                      type="button"
                      onClick={() => setAddGrn(false)} // Assuming closeModal is passed to close the modal
                      className={`h-[2.5vw] w-[6vw] text-[0.95vw] rounded-[0.3vw] font-semibold border-[0.1vw] border-[#4C67ED] cursor-pointer hover:bg-[#e8edfc42]`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`h-[2.5vw] w-[6vw] text-[0.95vw] rounded-[0.3vw] font-medium border-[0.1vw] border-[#4C67ED] bg-[#4C67ED] text-white cursor-pointer hover:bg-[#3b50c2]`}
                    >
                      Save
                    </button>
                  </div>
                )}
              </>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
