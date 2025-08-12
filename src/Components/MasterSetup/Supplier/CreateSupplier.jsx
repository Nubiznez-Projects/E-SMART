import { ErrorMessage, Field, Formik, Form } from "formik";
import supplierAdd from "../../../assets/Supplier/supplierAdd.png";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import {
  CreateSuppliers,
  getSupplierByID,
} from "../../../API/MasterModule/Supplier";
import { useDispatch, useSelector } from "react-redux";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .max(50, "Supplier name must be at most 50 characters.")
    .required("Supplier name is required."),
  type: Yup.string().required("Supplier type is required."),
  contactPerson: Yup.string()
    .trim()
    .max(50, "Contact person name must be at most 50 characters.")
    .required("Contact person name is required."),
  mobile: Yup.string()
    .matches(/^[0-9]{10,15}$/, "Enter a valid mobile number.")
    .required("Mobile number is required."),
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address format."
    )
    .required("Email is required"),
  gstin: Yup.string()
    .matches(/^[0-9A-Z]{15}$/, "Invalid GSTIN.")
    .required("GSTIN is required."),
  pan: Yup.string()
    .required("PAN is required.")
    .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, "Invalid PAN format."),

  // billingAddress: Yup.string().trim().required("Billing address is required."),

  address: Yup.object().test(
    "billingAddress-required",
    "All Address fields are required!",
    function (value) {
      console.log("Running billingAddress test:", value); // <-- Add this
      const requiredFields = [
        "doorNo",
        "street",
        "area",
        "district",
        "pincode",
      ];
      return requiredFields.every((field) => {
        const val = value?.[field];
        return typeof val === "string" && val.trim() !== "";
      });
    }
  ),

  // shippingAddress: Yup.string()
  //   .nullable()
  //   .required("Shipping Address is required.")
  //   .transform((val) => (val === "" ? null : val?.trim())),
  // shippingAddress: Yup.object().test(
  //   "shippingAddress-required",
  //   "All Address fields are required!",
  //   function (value) {
  //     console.log("Running shippingAddress test:", value); // <-- Add this
  //     const requiredFields = [
  //       "doorNo",
  //       "street",
  //       "area",
  //       "district",
  //       "pincode",
  //     ];
  //     return requiredFields.every((field) => {
  //       const val = value?.[field];
  //       return typeof val === "string" && val.trim() !== "";
  //     });
  //   }
  // ),
  state: Yup.string().trim().required("State is required."),
  country: Yup.string().trim().required("Country is required."),
  status: Yup.boolean().required("Status is required."),
  currency: Yup.string().required("Currency is required."),
  mode: Yup.string().required("Payment mode is required."),
  createdBy: Yup.string().required("Created by is required."),
  updatedBy: Yup.string().nullable(), // Optional
});

export default function CreateSupplier({ closeModal, supplierId, isView }) {
  const {
    Supplier_ById = [],
    SupplierById_loading = false,
    SupplierById_error = null,
  } = useSelector((state) => state.supplierById || {});

  console.log(Supplier_ById, "Supplier_ById");
  const supplierTypeList = [
    { label: "Individual", value: "individual" },
    { label: "Business", value: "business" },
    { label: "Retailer", value: "retailer" },
    { label: "Wholesaler", value: "wholesaler" },
    { label: "Distributor", value: "distributor" },
    { label: "Government", value: "government" },
  ];

  const currencyOptions = [
    { label: "INR - Indian Rupee", value: "INR" },
    { label: "USD - United States Dollar", value: "USD" },
    { label: "EUR - Euro", value: "EUR" },
    { label: "GBP - British Pound Sterling", value: "GBP" },
    { label: "JPY - Japanese Yen", value: "JPY" },
    { label: "CNY - Chinese Yuan Renminbi", value: "CNY" },
    { label: "AUD - Australian Dollar", value: "AUD" },
    { label: "CAD - Canadian Dollar", value: "CAD" },
    { label: "AED - United Arab Emirates Dirham", value: "AED" },
    { label: "SGD - Singapore Dollar", value: "SGD" },
  ];

  const paymentModeOptions = [
    { label: "Cash", value: "Cash" },
    { label: "Cheque", value: "Cheque" },
    { label: "Bank Transfer", value: "Bank Transfer" },
    { label: "UPI", value: "UPI" },
    { label: "Credit Card", value: "Credit Card" },
    { label: "Debit Card", value: "Debit Card" },
    { label: "Wallet", value: "Wallet" },
    { label: "Others", value: "Others" },
  ];

  const [supplierDetails, setSupplierDetails] = useState();

  console.log(supplierDetails, "get_supplier_id");

  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
     console.log(values, "data");
    try {
      const response = await CreateSuppliers(values, supplierId, dispatch);
      console.log(response, "data");
      // dispatch(fetchSuppliers());
      closeModal();
    } catch (error) {
      console.log("Error creating customer", error);
    }
  };

  const handleInputKeyDown = (event, type) => {
    const key = event.key;

    const controlKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Delete",
      "Home",
      "End",
    ];

    let isValid = false;

    switch (type) {
      case "alpha":
        isValid = /^[a-zA-Z]$/.test(key);
        break;
      case "alphanumeric":
        isValid = /^[a-zA-Z0-9]$/.test(key);
        break;
      case "email":
        isValid = /^[a-zA-Z0-9@._\-+]$/.test(key);
        break;
      case "numeric":
        isValid = /^[0-9]$/.test(key);
        break;
      case "address":
        isValid = /^[a-zA-Z0-9\s.,\-#/&()]$/.test(key);
        break;
      case "mobile":
        const inputValue = event.target.value;
        if (inputValue.length === 0) {
          isValid = /^[6-9]$/.test(key); // Only 6–9 allowed at start
        } else {
          isValid = /^[0-9]$/.test(key);
        }
        break;
      default:
        isValid = true; // allow everything by default
    }

    if (!isValid && !controlKeys.includes(key)) {
      event.preventDefault();
    }
  };

  const fetchSupplier = async () => {
    try {
      const response = await getSupplierByID(supplierId);
      setSupplierDetails(response);
    } catch (error) {
      console.error("Error Fetching Suppliers", error);
    }
  };

  useEffect(() => {
    if (supplierId) {
      fetchSupplier();
    }
  }, [supplierId]);

  const billingAddress = supplierDetails?.Address || "";

  const billing_parts =
    typeof billingAddress === "string"
      ? billingAddress.split(",").map((p) => p.trim())
      : [];

  const [
    billing_doorNo = "",
    billing_floor = "",
    billing_street = "",
    billing_area = "",
    billing_district = "",
    billing_pincode = "",
  ] = billing_parts;

  const shippingAddress = supplierDetails?.ShippingAddress || "";

  const shipping_parts =
    typeof shippingAddress === "string"
      ? shippingAddress.split(",").map((p) => p.trim())
      : [];

  const [
    shipping_doorNo = "",
    shipping_floor = "",
    shipping_street = "",
    shipping_area = "",
    shipping_district = "",
    shipping_pincode = "",
  ] = shipping_parts;

  return (
    <>
      <div className="flex flex-col h-[100vh] w-full">
        <div className="h-[28vh] w-full bg-[#BDCAE9]">
          <div className="flex flex-nowrap">
            <div className="flex flex-wrap w-[20vw] my-auto">
              <label className="text-[2.4vw] font-bold justify-center text-center">
                {isView === true || supplierId?.length > 0
                  ? "SUPPLIER DETAILS"
                  : "SUPPLIER REGISTRATION"}
              </label>
            </div>
            <div className="flex-1">
              <img
                className="h-[28vh] w-[25vw]"
                src={supplierAdd}
                alt="supplier"
                draggable={false}
              />
            </div>
          </div>
        </div>
        <div className="flex-1 px-[2vw]">
          <Formik
            initialValues={{
              name: supplierDetails?.SupplierName || "",
              type: supplierDetails?.SupplierType || "",
              contactPerson: supplierDetails?.ContactPersonName || "",
              mobile: supplierDetails?.MobileNumber || "",
              email: supplierDetails?.Email || "",
              gstin: supplierDetails?.GSTIN || "",
              pan: supplierDetails?.PANNumber || "",
              address: {
                doorNo: billing_doorNo || "",
                floor: billing_floor || "",
                street: billing_street || "",
                area: billing_area || "",
                district: billing_district || "",
                pincode: billing_pincode || "",
              },
              state: supplierDetails?.State || "",
              country: supplierDetails?.Country || "",
              status:
                supplierDetails?.IsActive !== undefined
                  ? String(supplierDetails?.IsActive)
                  : "true",
              // status: supplierDetails?.IsActive || "",
              currency: supplierDetails?.Currency || "",
              mode: supplierDetails?.PrePaymentMode || "",
              createdBy: supplierDetails?.CreatedBy || "",
              updatedBy: supplierDetails?.UpdatedBy || "",
            }}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={(values) => handleSubmit(values)}
          >
            {({
              isSubmitting,
              resetForm,
              setFieldValue,
              values,
              handleSubmit,
              touched,
              errors,
            }) => (
              <Form onSubmit={handleSubmit}>
                <div className={`overflow-auto scrollbar-hide w-full ${isView ? " h-[72vh]" : " h-[63vh]"}`}>
                <div className="grid grid-cols-2 gap-x-[1vw] gap-y-[0.5vw] my-[2vh]">
                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <div className="flex">
                      <label
                        htmlFor="name"
                        className="text-[0.9vw] font-semibold mb-[0.5vh]"
                      >
                        Supplier Name
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <div className="relative">
                      <Field
                        id="name"
                        type="text"
                        name="name"
                        onKeyPress={(e) => {
                        const regex = /^[A-Za-z\s]$/;
                        if (!regex.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                        disabled={isView}
                        placeholder="Enter Supplier Name"
                        className="h-[4vh] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none transition-colors duration-200 text-[0.9vw]"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="absolute text-red-600 text-[0.7vw] bottom-[-1.2vw]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <div className="flex">
                      <label
                        htmlFor="type"
                        className="text-[0.9vw] font-semibold mb-[0.5vh]"
                      >
                        Supplier Type
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <div className="relative">
                      <Field
                        as="select"
                        id="type"
                        name="type"
                         onKeyPress={(e) => {
                        const regex = /^[A-Za-z\s]$/;
                        if (!regex.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                        disabled={isView}
                        className="h-[4vh] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
                     transition-colors duration-200 text-[0.9vw]"
                      >
                        <option value="" disabled>
                          Select Supplier Type
                        </option>
                        {supplierTypeList?.map((item) => (
                          <option key={item?.value} value={item?.value}>
                            {item.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="type"
                        component="div"
                        className="absolute text-red-600 text-[0.7vw] bottom-[-1.2vw]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <div className="flex">
                      <label
                        htmlFor="contactPerson"
                        className="text-[0.9vw] font-semibold mb-[0.5vh]"
                      >
                        Contact Person Name
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <div className="relative">
                      <Field
                        id="contactPerson"
                        type="text"
                        name="contactPerson"
                         onKeyPress={(e) => {
                        const regex = /^[A-Za-z\s]$/;
                        if (!regex.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                        placeholder="Enter Contact Person Name"
                        disabled={isView}
                        className="h-[4vh] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
                     transition-colors duration-200 text-[0.9vw]"
                      />
                      <ErrorMessage
                        name="contactPerson"
                        component="div"
                        className="absolute text-red-600 text-[0.7vw] bottom-[-1.2vw]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <div className="flex">
                      <label
                        htmlFor="email"
                        className="text-[0.9vw] font-semibold mb-[0.5vh]"
                      >
                        Email
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <div className="relative">
                      <Field
                        id="email"
                        type="text"
                        name="email"
                        onKeyPress={(e) => {
                        const allowedChars = /^[a-z0-9@.]$/;
                        if (!allowedChars?.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                        placeholder="Enter Email Address"
                        disabled={isView}
                        className="h-[4vh] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
                     transition-colors duration-200 text-[0.9vw]"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="absolute text-red-600 text-[0.7vw] bottom-[-1.2vw]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <div className="flex">
                      <label
                        htmlFor="mobile"
                        className="text-[0.9vw] font-semibold mb-[0.5vh]"
                      >
                        Mobile Number
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <div className="relative">
                      <Field
                        id="mobile"
                        type="text"
                        name="mobile"
                        maxlength={10}
                        disabled={isView}
                         onKeyPress={(e) => {
                        const isNumber = /^[0-9]$/;
                        if (!isNumber?.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                        placeholder="Enter Mobile Number"
                        className="h-[4vh] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
                     transition-colors duration-200 text-[0.9vw]"
                      />
                      <ErrorMessage
                        name="mobile"
                        component="div"
                        className="absolute text-red-600 text-[0.7vw] bottom-[-1.2vw]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <div className="flex">
                      <label
                        htmlFor="status"
                        className="text-[0.9vw] font-semibold mb-[0.5vh]"
                      >
                        Status
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <div className="relative">
                      <div
                        role="group"
                        className="flex items-center gap-x-[2vw]"
                        aria-labelledby="status"
                      >
                        <label className="mr-4">
                          <div className="flex items-center gap-x-[0.5vw]">
                            <Field
                              type="radio"
                              disabled={isView}
                              name="status"
                              value="true"
                            />
                            <span className="text-[0.9vw]">Active</span>
                          </div>
                        </label>
                        <label>
                          <div className="flex items-center gap-x-[0.5vw] ">
                            <Field
                              type="radio"
                              disabled={isView}
                              name="status"
                              value="false"
                            />
                            <span className="text-[0.9vw]">Inactive</span>
                          </div>
                        </label>
                      </div>

                      <ErrorMessage
                        name="status"
                        component="div"
                        className="text-red-600 text-[0.7vw] mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-[39vw] relative">
                    <div className="flex">
                      <label
                        htmlFor="address"
                        className="text-[0.9vw] font-semibold mb-[0.5vh]"
                      >
                        Address
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <div className="relative">
                      <div className="flex gap-[1vw] w-full">
                        <div>
                          <Field
                            name="address.doorNo"
                            type="text"
                            placeholder="Door No:"
                            onKeyPress={(e) => {
                              const allowedChars = /^[A-Za-z0-9\/\-\.\s]$/;
                              if (!allowedChars.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            disabled={isView}
                            className="h-[4vh] text-[0.80vw] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200"
                          />
                        </div>
                        <div>
                          <Field
                            name="address.floor"
                            type="text"
                            placeholder="Floor:"
                            onKeyPress={(e) => {
                              const allowedChars = /^[A-Za-z0-9\/\-\.\s]$/;
                              if (!allowedChars.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            className="h-[4vh] text-[0.80vw] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200"
                          />
                        </div>
                        <div>
                          <Field
                            name="address.street"
                            type="text"
                            placeholder="Street:"
                            onKeyPress={(e) => {
                              const regex = /^[A-Za-z\s]$/;
                              if (!regex.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            disabled={isView}
                            className="h-[4vh] text-[0.80vw] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200"
                          />
                        </div>

                        <div>
                          <Field
                            name="address.area"
                            type="text"
                            placeholder="Area:"
                            disabled={isView}
                            onKeyPress={(e) => {
                              const regex = /^[A-Za-z\s]$/;
                              if (!regex.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            className="h-[4vh] text-[0.80vw] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200"
                          />
                        </div>
                        <div>
                          <Field
                            name="address.district"
                            type="text"
                            placeholder="District:"
                            disabled={isView}
                            onKeyPress={(e) => {
                              const regex = /^[A-Za-z\s]$/;
                              if (!regex.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            className="h-[4vh] text-[0.80vw] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200"
                          />
                        </div>
                        <div>
                          <Field
                            name="address.pincode"
                            type="text"
                            placeholder="Pincode:"
                            maxlength={6}
                            disabled={isView}
                            onKeyPress={(e) => {
                              if (!/^[0-9]$/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            className="h-[4vh] text-[0.80vw] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200"
                          />
                        </div>
                      </div>
                      {/* <ErrorMessage
                        name="billingAddress"
                        component="div"
                        className="absolute text-red-600 text-[0.7vw] bottom-[-1.2vw]"
                      /> */}
                      <div className="absolute text-red-600 text-[0.7vw] bottom-[-1.2vw]">
                        {touched.billingAddress &&
                          typeof errors.billingAddress === "string" && (
                            <div className="error">{errors.billingAddress}</div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="flex flex-col w-[50vw] mb-[1vh] relative">
                  <div className="flex">
                    <label
                      htmlFor="shippingAddress"
                      className="text-[0.9vw] font-semibold mb-[0.5vh]"
                    >
                      Shipping Address
                    </label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <div className="relative">
                    <div className="flex gap-[2vw] w-full">
                      <div>
                        <Field
                          name="shippingAddress.doorNo"
                          type="text"
                          placeholder="Door No:"
                          disabled={isView}
                          onKeyDown={(e) => handleInputKeyDown(e, "address")}
                          className="h-[4vh] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
                     transition-colors duration-200 text-[0.9vw]"
                        />
                      </div>
                      <div>
                        <Field
                          name="shippingAddress.floor"
                          type="text"
                          placeholder="Floor:"
                          disabled={isView}
                          onKeyDown={(e) => handleInputKeyDown(e, "address")}
                          className="h-[4vh] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
                     transition-colors duration-200 text-[0.9vw]"
                        />
                      </div>
                      <div>
                        <Field
                          name="shippingAddress.street"
                          type="text"
                          placeholder="Street:"
                          disabled={isView}
                          onKeyDown={(e) => handleInputKeyDown(e, "address")}
                          className="h-[4vh] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
                     transition-colors duration-200 text-[0.9vw]"
                        />
                      </div>

                      <div>
                        <Field
                          name="shippingAddress.area"
                          type="text"
                          placeholder="Area:"
                          disabled={isView}
                          onKeyDown={(e) => handleInputKeyDown(e, "address")}
                          className="h-[4vh] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
                     transition-colors duration-200 text-[0.9vw]"
                        />
                      </div>
                      <div>
                        <Field
                          name="shippingAddress.district"
                          type="text"
                          placeholder="District:"
                          disabled={isView}
                          onKeyDown={(e) => handleInputKeyDown(e, "alpha")}
                          className="h-[4vh] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
                     transition-colors duration-200 text-[0.9vw]"
                        />
                      </div>
                      <div>
                        <Field
                          name="shippingAddress.pincode"
                          type="text"
                          placeholder="Pincode:"
                          disabled={isView}
                          onKeyDown={(e) => handleInputKeyDown(e, "numeric")}
                          className="h-[4vh] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
                     transition-colors duration-200 text-[0.9vw]"
                        />
                      </div>
                    </div>
                    <div className="absolute text-red-600 text-[0.7vw] bottom-[-1.2vw]">
                      {touched.shippingAddress &&
                        typeof errors.shippingAddress === "string" && (
                          <div className="error">{errors.shippingAddress}</div>
                        )}
                    </div>
                  </div>
                </div> */}
                <div className="grid grid-cols-2 gap-x-[1vw] gap-y-[0.5vw] mt-[1vw]">
                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <div className="flex">
                      <label
                        htmlFor="state"
                        className="text-[0.9vw] font-semibold mb-[0.5vh]"
                      >
                        State
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <div className="relative">
                      <Field
                        id="state"
                        type="text"
                        name="state"
                        disabled={isView}
                        onKeyDown={(e) => handleInputKeyDown(e, "alpha")}
                        placeholder="Enter State"
                        className="h-[4vh] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
                     transition-colors duration-200 text-[0.9vw]"
                      />
                      <ErrorMessage
                        name="state"
                        component="div"
                        className="absolute text-red-600 text-[0.7vw] bottom-[-1.2vw]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <div className="flex">
                      <label
                        htmlFor="country"
                        className="text-[0.9vw] font-semibold mb-[0.5vh]"
                      >
                        Country
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <div className="relative">
                      <Field
                        id="country"
                        type="text"
                        name="country"
                        onKeyDown={(e) => handleInputKeyDown(e, "alpha")}
                        placeholder="Enter Country"
                        disabled={isView}
                        className="h-[4vh] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
                     transition-colors duration-200 text-[0.9vw]"
                      />
                      <ErrorMessage
                        name="country"
                        component="div"
                        className="absolute text-red-600 text-[0.7vw] bottom-[-1.2vw]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <div className="flex">
                      <label
                        htmlFor="currency"
                        className="text-[0.9vw] font-semibold mb-[0.5vh]"
                      >
                        Currency
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <div className="relative">
                      <Field
                        as="select"
                        id="currency"
                        name="currency"
                        disabled={isView}
                        className="h-[4vh] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
                     transition-colors duration-200 text-[0.9vw]"
                      >
                        <option value="" disabled>
                          Select Currency
                        </option>
                        {currencyOptions?.map((item) => (
                          <option key={item?.value} value={item?.value}>
                            {item.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="currency"
                        component="div"
                        className="absolute text-red-600 text-[0.7vw] bottom-[-1.2vw]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <div className="flex">
                      <label
                        htmlFor="mode"
                        className="text-[0.9vw] font-semibold mb-[0.5vh]"
                      >
                        Pre-Payment Mode
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <div className="relative">
                      <Field
                        as="select"
                        id="mode"
                        name="mode"
                        disabled={isView}
                        className="h-[4vh] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
                     transition-colors duration-200 text-[0.9vw]"
                      >
                        <option value="" disabled>
                          Select Currency
                        </option>
                        {paymentModeOptions?.map((item) => (
                          <option key={item?.value} value={item?.value}>
                            {item.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="mode"
                        component="div"
                        className="absolute text-red-600 text-[0.7vw] bottom-[-1.2vw]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <div className="flex">
                      <label
                        htmlFor="gstin"
                        className="text-[0.9vw] font-semibold mb-[0.5vh]"
                      >
                        GSTIN
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <div className="relative">
                      <Field
                        id="gstin"
                        type="text"
                        name="gstin"
                        disabled={isView}
                        onKeyDown={(e) => handleInputKeyDown(e, "alphanumeric")}
                        placeholder="Enter the GSTIN"
                        className="h-[4vh] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
                     transition-colors duration-200 text-[0.9vw]"
                      />
                      <ErrorMessage
                        name="gstin"
                        component="div"
                        className="absolute text-red-600 text-[0.7vw] bottom-[-1.2vw]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <div className="flex">
                      <label
                        htmlFor="pan"
                        className="text-[0.9vw] font-semibold mb-[0.5vh]"
                      >
                        PAN Number
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <div className="relative">
                      <Field
                        id="pan"
                        type="text"
                        name="pan"
                        disabled={isView}
                        onKeyDown={(e) => handleInputKeyDown(e, "alphanumeric")}
                        placeholder="Enter PAN Number"
                        className="h-[4vh] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
                     transition-colors duration-200 text-[0.9vw]"
                      />
                      <ErrorMessage
                        name="pan"
                        component="div"
                        className="absolute text-red-600 text-[0.7vw] bottom-[-1.2vw]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <div className="flex">
                      <label
                        htmlFor="createdBy"
                        className="text-[0.9vw] font-semibold mb-[0.5vh]"
                      >
                        Created By
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <div className="relative">
                      <Field
                        id="createdBy"
                        type="text"
                        name="createdBy"
                        disabled={isView}
                        onKeyDown={(e) => handleInputKeyDown(e, "alphanumeric")}
                        placeholder="Created By"
                        className="h-[4vh] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none transition-colors duration-200 text-[0.9vw]"
                      />
                      <ErrorMessage
                        name="createdBy"
                        component="div"
                        className="absolute text-red-600 text-[0.7vw] bottom-[-1.2vw]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <div className="flex">
                      <label
                        htmlFor="updatedBy"
                        className="text-[0.9vw] font-semibold mb-[0.5vh]"
                      >
                        Updated By
                      </label>
                    </div>
                    <div className="relative">
                      <Field
                        id="updatedBy"
                        type="text"
                        name="updatedBy"
                        placeholder="Updated By"
                        disabled={isView}
                        onKeyDown={(e) => handleInputKeyDown(e, "alphanumeric")}
                        className="h-[4vh] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
                     transition-colors duration-200 text-[0.9vw]"
                      />
                      <ErrorMessage
                        name="updatedBy"
                        component="div"
                        className="absolute text-red-600 text-[0.7vw] bottom-[-1.2vw]"
                      />
                    </div>
                  </div>
                </div>
                </div>
                <div className="flex bottom fixed justify-center items-end w-[65vw] gap-[1vw] my-[1vw]">
                  <button
                    onClick={closeModal}
                    type="button"
                    className={`h-[2vw] w-[6vw] text-[0.95vw] rounded-[0.3vw] font-semibold border-[0.1vw] border-[#4C67ED] cursor-pointer hover:bg-[#e8edfc42]`}
                  >
                    {isView ? "CLOSE" : "CANCEL"}
                  </button>
                  {isView ? (
                    ""
                  ) : (
                    <button
                      type="submit"
                      className={`h-[2vw] w-[6vw] text-[0.95vw] rounded-[0.3vw] font-medium border-[0.1vw] border-[#4C67ED] bg-[#4C67ED] text-white cursor-pointer hover:bg-[#3b50c2]`}
                    >
                      SAVE
                    </button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
