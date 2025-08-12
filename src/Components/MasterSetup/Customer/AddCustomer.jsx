import React, { useEffect, useState } from "react";
import supplierAdd from "../../../assets/Supplier/supplierAdd.png";
import {
  createCustomer,
  getCustomersByID,
} from "../../../API/MasterModule/Customer";
import { ErrorMessage, Field, Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { fetchCustomers } from "../../../Redux/Slice/MasterModule/Customers/CustomerThunks";
import { toast } from "react-toastify";
import { IoAddCircle } from "react-icons/io5";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Only letters are allowed")
    .max(50, "Too Long!")
    .required("Customer Name is required"),

  type: Yup.string().required("Customer type is required"),

  contactPerson: Yup.string()
    .max(30, "Too Long!")
    .required("Contact person name is required."),

  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Enter a valid mobile number.")
    .required("Mobile number is required."),

  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address format."
    )
    .required("Email is required"),

  gstin: Yup.string()
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Enter a valid 15-character GSTIN"
    )
    .length(15, "GSTIN must be 15 characters")
    .required("GSTIN is required"),
  pan: Yup.string()
    .matches(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      "Enter a valid PAN in format AAAAA9999A"
    )
    .length(10, "PAN must be exactly 10 characters")
    .required("PAN is required"),
  billingAddress: Yup.array()
    .of(
      Yup.object().shape({
        doorNo: Yup.string().trim(),
        floor: Yup.string().trim(), // optional
        street: Yup.string().trim(),
        area: Yup.string().trim(),
        district: Yup.string().trim(),
        pincode: Yup.string().trim(),
      })
    )
    .test("billingAddress-required", function (value) {
      const requiredFields = [
        "doorNo",
        "street",
        "area",
        "district",
        "pincode",
      ];

      if (!Array.isArray(value)) {
        return this.createError({
          message: "Billing address must be an array",
        });
      }

      for (let i = 0; i < value.length; i++) {
        const address = value[i];
        const isInvalid = requiredFields.some(
          (field) => !address?.[field] || address[field].trim() === ""
        );

        if (isInvalid) {
          return this.createError({
            message: `All fields are required for Address ${i + 1}`,
            path: "billingAddress", // attach error to the array itself
          });
        }
      }

      return true;
    }),

  state: Yup.string().required("State is required."),

  country: Yup.string().required("Country is required."),

  status: Yup.boolean().required("Status is required."),

  currency: Yup.string().required("Currency is required."),

  mode: Yup.string().required("Payment mode is required."),

  createdBy: Yup.string().required("Created by is required."),
});

export const AddCustomer = ({ closeModal, customerID, isView }) => {
  const dispatch = useDispatch();
  const [customerData, setCustomerData] = useState("");
  const customerTypeList = [
    { label: "Individual", value: "individual" },
    { label: "Business", value: "business" },
    { label: "Retailer", value: "retailer" },
    { label: "Wholesaler", value: "wholesaler" },
    { label: "Distributor", value: "distributor" },
    { label: "Exporter", value: "exporter" },
    { label: "Importer", value: "importer" },
    { label: "Government", value: "government" },
    { label: "Non-Profit", value: "non_profit" },
    { label: "Local", value: "local" },
    { label: "Online", value: "online" },
  ];

  const currencyOptions = [
    { label: "INR - Indian Rupee", value: "INR" },
    { label: "USD - US Dollar", value: "USD" },
    { label: "EUR - Euro", value: "EUR" },
    { label: "GBP - British Pound", value: "GBP" },
    { label: "JPY - Japanese Yen", value: "JPY" },
    { label: "CNY - Chinese Yuan", value: "CNY" },
    { label: "AUD - Australian Dollar", value: "AUD" },
    { label: "CAD - Canadian Dollar", value: "CAD" },
    { label: "AED - UAE Dirham", value: "AED" },
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

  const parseAddress = (addressString = "") => {
    const [doorNo, street, floor, area, district, pincode] =
      addressString?.split(",");
    return {
      doorNo: doorNo?.trim() || "",
      street: street?.trim() || "",
      floor: floor?.trim() || "",
      area: area?.trim() || "",
      district: district?.trim() || "", // optional
      pincode: pincode?.trim() || "",
    };
  };

  const fetchCustomer = async () => {
    try {
      const response = await getCustomersByID(customerID);
      setCustomerData(response);
    } catch (error) {
      console.error("Error Fetching Customers", error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const response = await createCustomer(values, customerID);
      // Show success message
      toast.success(response.message);
      console.log(response, "data");
      dispatch(fetchCustomers());
      closeModal();
    } catch (error) {
      console.log("Error creating customer", error);
      toast.error(error.message);
    }
  };
  console.log(customerID, "id");

  useEffect(() => {
    if (customerID) {
      fetchCustomer();
    }
  }, [customerID]);

  return (
    <>
      <div className="h-[28vh] w-full bg-[#BDCAE9]">
        <div className="flex flex-nowrap">
          <div className="flex flex-wrap w-[20vw] my-auto">
            <label className="text-[2.4vw] font-bold justify-center text-center">
              {" "}
              {customerID ? " CUSTOMER DETAILS" : " CUSTOMER REGISTRATION"}
            </label>
          </div>
          <div className="flex-1">
            <img
              className="h-[28vh] w-[25vw]"
              src={supplierAdd}
              alt="supplier"
            />
          </div>
        </div>
      </div>
      <div className=" px-[2vw]">
        <Formik
          initialValues={{
            name: customerData?.CustomerName || "",
            type: customerData?.CustomerType || "",
            contactPerson: customerData?.ContactPerson || "",
            mobile: customerData?.MobileNumber || "",
            email: customerData?.EmailAddress || "",
            gstin: customerData?.GSTIN || "",
            pan: customerData?.PANNumber || "",
            billingAddress: Array.isArray(customerData?.BillingAddress)
              ? customerData.BillingAddress
              : typeof customerData?.BillingAddress === "string"
              ? JSON.parse(customerData.BillingAddress)
              : [
                  {
                    doorNo: "",
                    floor: "",
                    street: "",
                    area: "",
                    district: "",
                    pincode: "",
                  },
                ],
            // shippingAddress: parseAddress(customerData?.ShippingAddress) || {
            //   doorNo: "",
            //   street: "",
            //   floor: "",
            //   area: "",
            //   district: "",
            //   pincode: "",
            // },
            state: customerData?.State || "",
            country: customerData?.Country || "",
            status:
              customerData?.Status !== undefined
                ? String(customerData.Status)
                : "true",
            currency: customerData?.Currency || "",
            mode: customerData?.PaymentMode || "",
            createdBy: customerData?.CreatedBy || "",
            updatedBy: customerData?.UpdatedBy || "",
          }}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({
            isSubmitting,
            setFieldError,
            values,
            handleSubmit,
            touched,
            errors,
          }) => (
            <Form onSubmit={handleSubmit}>
              <div
                className={`overflow-auto scrollbar-hide w-full ${
                  isView ? " h-[72vh]" : " h-[63vh]"
                }`}
              >
                <div className="grid grid-cols-2 gap-x-[1vw] gap-y-[0.7vw] my-[2vh]">
                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <label
                      htmlFor="name"
                      className="text-[0.9vw] font-bold mb-[0.5vh] relative"
                    >
                      Customer Name{" "}
                      <span className="absolute text-[#FF1818] text-[1.1vw] pl-[0.2vw]">
                        *
                      </span>
                    </label>
                    <Field
                      id="name"
                      type="text"
                      name="name"
                      disabled={isView}
                      onKeyPress={(e) => {
                        const regex = /^[A-Za-z\s]$/;
                        if (!regex.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      placeholder="Enter Customer Name"
                      className={`h-[4vh] text-[0.80vw] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200 ${isView && "cursor-not-allowed"}`}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="absolute text-red-600 text-[0.7vw] top-[3.65vw]"
                    />
                  </div>

                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <label
                      htmlFor="type"
                      className="text-[0.9vw] font-bold mb-[0.5vh] relative"
                    >
                      Customer Type{" "}
                      <span className="absolute text-[#FF1818] text-[1.1vw] pl-[0.2vw]">
                        *
                      </span>
                    </label>
                    <Field
                      as="select"
                      id="type"
                      name="type"
                      disabled={isView}
                      className={`h-[4vh] text-[0.80vw] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200 ${isView && "cursor-not-allowed"}`}
                    >
                      <option value="" disabled>
                        Select Customer Type
                      </option>
                      {customerTypeList?.map((item) => (
                        <option key={item?.value} value={item?.value}>
                          {item?.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="type"
                      component="div"
                      className="absolute text-red-600 text-[0.7vw] top-[3.65vw]"
                    />
                  </div>
                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <label
                      htmlFor="contactPerson"
                      className="text-[0.9vw] font-bold mb-[0.5vh] relative"
                    >
                      Contact Person Name{" "}
                      <span className="absolute text-[#FF1818] text-[1.1vw] pl-[0.2vw]">
                        *
                      </span>
                    </label>
                    <Field
                      id="contactPerson"
                      type="text"
                      name="contactPerson"
                      disabled={isView}
                      onKeyPress={(e) => {
                        const regex = /^[A-Za-z\s]$/;
                        if (!regex.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      placeholder="Enter Contact Person Name"
                      className={`h-[4vh] text-[0.80vw] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200 ${isView && "cursor-not-allowed"}`}
                    />
                    <ErrorMessage
                      name="contactPerson"
                      component="div"
                      className="absolute text-red-600 text-[0.7vw] top-[3.65vw]"
                    />
                  </div>
                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <label
                      htmlFor="email"
                      className="text-[0.9vw] font-bold mb-[0.5vh] relative"
                    >
                      Email{" "}
                      <span className="absolute text-[#FF1818] text-[1.1vw] pl-[0.2vw]">
                        *
                      </span>
                    </label>
                    <Field
                      id="email"
                      type="text"
                      name="email"
                      disabled={isView}
                      onKeyPress={(e) => {
                        const allowedChars = /^[a-z0-9@.]$/;
                        if (!allowedChars?.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      placeholder="Enter Email Address"
                      className={`h-[4vh] text-[0.80vw] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200 ${isView && "cursor-not-allowed"}`}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="absolute text-red-600 text-[0.7vw] top-[3.65vw]"
                    />
                  </div>
                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <label
                      htmlFor="mobile"
                      className="text-[0.9vw] font-bold mb-[0.5vh] relative"
                    >
                      Mobile Number{" "}
                      <span className="absolute text-[#FF1818] text-[1.1vw] pl-[0.2vw]">
                        *
                      </span>
                    </label>
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
                      className={`h-[4vh] text-[0.80vw] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200 ${isView && "cursor-not-allowed"}`}
                    />
                    <ErrorMessage
                      name="mobile"
                      component="div"
                      className="absolute text-red-600 text-[0.7vw] top-[3.65vw]"
                    />
                  </div>

                  <div className="flex gap-x-[2vw] w-[20vw] mb-[1.6vh] relative">
                    <label
                      htmlFor="status"
                      className="text-[0.9vw] font-bold pt-[1.9vw] relative"
                    >
                      Status{" "}
                      <span className="absolute text-[#FF1818] text-[1.1vw] pl-[0.2vw]">
                        *
                      </span>
                    </label>
                    <div className="flex items-center pt-[1.9vw] gap-4">
                      <label className="flex items-center gap-2 text-[0.80vw]">
                        <Field
                          type="radio"
                          name="status"
                          disabled={isView}
                          value="true"
                          className={`form-radio text-blue-500  ${
                            isView ? "cursor-not-allowed" : "cursor-pointer"
                          }`}
                        />
                        Active
                      </label>

                      <label className="flex items-center gap-2 text-[0.80vw]">
                        <Field
                          type="radio"
                          name="status"
                          value="false"
                          disabled={isView}
                          className={`form-radio text-[0.80vw] text-blue-500  ${
                            isView ? "cursor-not-allowed" : "cursor-pointer"
                          }`}
                        />
                        Inactive
                      </label>
                    </div>

                    <ErrorMessage
                      name="status"
                      component="div"
                      className="absolute text-red-600 text-[0.7vw] top-[3.65vw]"
                    />
                  </div>
                </div>
                <div className="w-[39vw]">
                  <FieldArray name="billingAddress">
                    {({ push, remove, errors }) => (
                      <>
                        {values?.billingAddress?.map((_, index) => (
                          <div
                            key={index}
                            className="flex flex-col w-full mb-[1vw]"
                          >
                            {/* Title: Address 1, Address 2, etc. */}
                            <div className="flex justify-between items-center mb-[0.5vw]">
                              <label className="text-[0.9vw] font-bold">
                                Address {index + 1}
                                <span className="text-[#FF1818] text-[1.1vw] pl-[0.2vw]">
                                  *
                                </span>
                              </label>

                              {/* Only show Add New on Address 1 */}
                              {index === 0 && (
                                !isView && 
                                <span
                                  className="cursor-pointer text-[#4C67ED] flex items-center text-[0.8vw]"
                                  onClick={() => {
                                    const lastIndex =
                                      values.billingAddress.length - 1;
                                    const last =
                                      values.billingAddress[lastIndex];

                                    const requiredFields = [
                                      "doorNo",
                                      "street",
                                      "area",
                                      "district",
                                      "pincode",
                                    ];

                                    const isValid = requiredFields.every(
                                      (field) => last?.[field]?.trim()
                                    );

                                    if (!isValid) {
                                      setFieldError(
                                        "billingAddress",
                                        `Please fill all fields in Address ${
                                          lastIndex + 1
                                        }`
                                      );
                                      return;
                                    }

                                    // Clear previous error if any
                                    setFieldError("billingAddress", undefined);

                                    push({
                                      doorNo: "",
                                      floor: "",
                                      street: "",
                                      area: "",
                                      district: "",
                                      pincode: "",
                                    });
                                  }}
                                >
                                  <IoAddCircle size={"1vw"} />
                                  <label className="ml-[0.3vw] cursor-pointer">
                                    Add New
                                  </label>
                                </span>
                              )}
                            </div>

                            {/* Inputs Row */}
                            <div className="flex gap-[1vw] w-full">
                              <Field
                                name={`billingAddress.${index}.doorNo`}
                                placeholder="Door No"
                                disabled={isView}
                                className={`h-[4vh] text-[0.8vw] w-full border border-[#BDCAE9] rounded px-[0.5vw] focus:border-blue-500 focus:outline-none ${
                                  isView
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                              />
                              <Field
                                name={`billingAddress.${index}.floor`}
                                placeholder="Floor"
                                disabled={isView}
                                className={`h-[4vh] text-[0.8vw] w-full border border-[#BDCAE9] rounded px-[0.5vw] focus:border-blue-500 focus:outline-none ${
                                  isView
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                              />
                              <Field
                                name={`billingAddress.${index}.street`}
                                placeholder="Street"
                                disabled={isView}
                                className={`h-[4vh] text-[0.8vw] w-full border border-[#BDCAE9] rounded px-[0.5vw] focus:border-blue-500 focus:outline-none ${
                                  isView
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                              />
                              <Field
                                name={`billingAddress.${index}.area`}
                                placeholder="Area"
                                disabled={isView}
                                className={`h-[4vh] text-[0.8vw] w-full border border-[#BDCAE9] rounded px-[0.5vw] focus:border-blue-500 focus:outline-none ${
                                  isView
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                              />
                              <Field
                                name={`billingAddress.${index}.district`}
                                placeholder="District"
                                disabled={isView}
                                className={`h-[4vh] text-[0.8vw] w-full border border-[#BDCAE9] rounded px-[0.5vw] focus:border-blue-500 focus:outline-none ${
                                  isView
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                              />
                              <Field
                                name={`billingAddress.${index}.pincode`}
                                placeholder="Pincode"
                                disabled={isView}
                                className={`h-[4vh] text-[0.8vw] w-full border border-[#BDCAE9] rounded px-[0.5vw] focus:border-blue-500 focus:outline-none ${
                                  isView
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                              />
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </FieldArray>
                  {errors.billingAddress && touched.billingAddress && (
                    <div className=" text-red-600 text-[0.7vw] top-[4.4vw]">
                      {errors.billingAddress}
                    </div>
                  )}
                </div>
                {/* <div className="flex flex-col w-[39vw] mb-[2vh] relative">
                <label
                  htmlFor="shippingAddress"
                  className="text-[0.9vw] font-bold mb-[0.5vh]"
                >
                  Shipping Address
                </label>
                <div className="flex gap-[1vw]">
                  <Field
                    disabled={isView}
                    id="shippingAddress.doorNo"
                    onKeyPress={(e) => {
                      const allowedChars = /^[A-Za-z0-9\/\-\.\s]$/;
                      if (!allowedChars.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className={`h-[4vh] text-[0.80vw] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200 ${isView && "cursor-not-allowed"}`}
                    type="text"
                    name="shippingAddress.doorNo"
                    placeholder="Door No"
                  />
                  <Field
                    disabled={isView}
                    id="shippingAddress.floor"
                    onKeyPress={(e) => {
                      const allowedChars = /^[A-Za-z0-9\/\-\.\s]$/;
                      if (!allowedChars.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className={`h-[4vh] text-[0.80vw] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200 ${isView && "cursor-not-allowed"}`}
                    type="text"
                    name="shippingAddress.floor"
                    placeholder="Floor No"
                  />
                  <Field
                    disabled={isView}
                    id="shippingAddress.street"
                    onKeyPress={(e) => {
                      const regex = /^[A-Za-z\s]$/;
                      if (!regex.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className={`h-[4vh] text-[0.80vw] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200 ${isView && "cursor-not-allowed"}`}
                    name="shippingAddress.street"
                    type="text"
                    placeholder="Street"
                  />
                  <Field
                    disabled={isView}
                    id="shippingAddress.area"
                    onKeyPress={(e) => {
                      const regex = /^[A-Za-z\s]$/;
                      if (!regex.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className={`h-[4vh] text-[0.80vw] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200 ${isView && "cursor-not-allowed"}`}
                    type="text"
                    name="shippingAddress.area"
                    placeholder="Area"
                  />
                  <Field
                    disabled={isView}
                    id="shippingAddress.district"
                    onKeyPress={(e) => {
                      const regex = /^[A-Za-z\s]$/;
                      if (!regex.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className={`h-[4vh] text-[0.80vw] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200 ${isView && "cursor-not-allowed"}`}
                    type="text"
                    name="shippingAddress.district"
                    placeholder="District"
                  />
                  <Field
                    disabled={isView}
                    onKeyPress={(e) => {
                      if (!/^[0-9]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    id="shippingAddress.pincode"
                    className={`h-[4vh] text-[0.80vw] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200 ${isView && "cursor-not-allowed"}`}
                    type="text"
                    name="shippingAddress.pincode"
                    placeholder="Pincode"
                  />
                </div>
              </div> */}
                <div className="grid grid-cols-2 gap-x-[1vw] gap-y-[0.7vw]">
                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <label
                      htmlFor="state"
                      className="text-[0.9vw] font-bold mb-[0.5vh] relative"
                    >
                      State{" "}
                      <span className="absolute text-[#FF1818] text-[1.1vw] pl-[0.2vw]">
                        *
                      </span>
                    </label>
                    <Field
                      id="state"
                      type="text"
                      name="state"
                      disabled={isView}
                      onKeyPress={(e) => {
                        const regex = /^[A-Za-z\s]$/;
                        if (!regex?.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      placeholder="Enter State"
                      className={`h-[4vh] text-[0.80vw] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200 ${isView && "cursor-not-allowed"}`}
                    />
                    <ErrorMessage
                      name="state"
                      component="div"
                      className="absolute text-red-600 text-[0.7vw] top-[3.65vw]"
                    />
                  </div>

                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <label
                      htmlFor="country"
                      className="text-[0.9vw] font-bold mb-[0.5vh] relative"
                    >
                      Country{" "}
                      <span className="absolute text-[#FF1818] text-[1.1vw] pl-[0.2vw]">
                        *
                      </span>
                    </label>
                    <Field
                      id="country"
                      type="text"
                      disabled={isView}
                      onKeyPress={(e) => {
                        const regex = /^[A-Za-z\s]$/;
                        if (!regex.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      name="country"
                      placeholder="Enter Country"
                      className={`h-[4vh] text-[0.80vw] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200 ${isView && "cursor-not-allowed"}`}
                    />
                    <ErrorMessage
                      name="country"
                      component="div"
                      className="absolute text-red-600 text-[0.7vw] top-[3.65vw]"
                    />
                  </div>
                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <label
                      htmlFor="currency"
                      className="text-[0.9vw] font-bold mb-[0.5vh] relative"
                    >
                      Currency{" "}
                      <span className="absolute text-[#FF1818] text-[1.1vw] pl-[0.2vw]">
                        *
                      </span>
                    </label>
                    <Field
                      as="select"
                      id="currency"
                      disabled={isView}
                      name="currency"
                      className={`h-[4vh] text-[0.80vw] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200  ${isView && "cursor-not-allowed"}`}
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
                      className="absolute text-red-600 text-[0.7vw] top-[3.65vw]"
                    />
                  </div>
                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <label
                      htmlFor="mode"
                      className="text-[0.9vw] font-bold mb-[0.5vh] relative"
                    >
                      Pre-Payment Mode{" "}
                      <span className="absolute text-[#FF1818] text-[1.1vw] pl-[0.2vw]">
                        *
                      </span>
                    </label>
                    <Field
                      as="select"
                      id="mode"
                      disabled={isView}
                      name="mode"
                      className={`h-[4vh] text-[0.80vw] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200  ${isView && "cursor-not-allowed"}`}
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
                      className="absolute text-red-600 text-[0.7vw] top-[3.65vw]"
                    />
                  </div>
                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <label
                      htmlFor="gstin"
                      className="text-[0.9vw] font-bold mb-[0.5vh] relative"
                    >
                      GSTIN{" "}
                      <span className="absolute text-[#FF1818] text-[1.1vw] pl-[0.2vw]">
                        *
                      </span>
                    </label>
                    <Field
                      id="gstin"
                      type="text"
                      disabled={isView}
                      onKeyPress={(e) => {
                        const regex = /^[A-Za-z0-9]$/;
                        if (!regex.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      maxLength={15}
                      name="gstin"
                      placeholder="Enter the GSTIN"
                      className={`h-[4vh] text-[0.80vw] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200  ${isView && "cursor-not-allowed"}`}
                    />
                    <ErrorMessage
                      name="gstin"
                      component="div"
                      className="absolute text-red-600 text-[0.7vw] top-[3.65vw]"
                    />
                  </div>
                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <label
                      htmlFor="pan"
                      className="text-[0.9vw] font-bold mb-[0.5vh] relative"
                    >
                      PAN Number{" "}
                      <span className="absolute text-[#FF1818] text-[1.1vw] pl-[0.2vw]">
                        *
                      </span>
                    </label>
                    <Field
                      id="pan"
                      type="text"
                      disable={isView}
                      onKeyPress={(e) => {
                        const regex = /^[A-Za-z0-9]$/;
                        if (!regex.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      name="pan"
                      placeholder="Enter PAN Number"
                      className={`h-[4vh] text-[0.80vw] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200  ${isView && "cursor-not-allowed"}`}
                    />
                    <ErrorMessage
                      name="pan"
                      component="div"
                      className="absolute text-red-600 text-[0.7vw] top-[3.65vw]"
                    />
                  </div>
                  <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                    <label
                      htmlFor="createdBy"
                      className="text-[0.9vw] font-bold mb-[0.5vh] relative"
                    >
                      Created By{" "}
                      <span className="absolute text-[#FF1818] text-[1.1vw] pl-[0.2vw]">
                        *
                      </span>
                    </label>
                    <Field
                      id="createdBy"
                      type="text"
                      name="createdBy"
                      onKeyPress={(e) => {
                        const regex = /^[A-Za-z\s]$/;
                        if (!regex.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      placeholder="Enter created By"
                      disabled={isView}
                      className={`h-[4vh] text-[0.80vw] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200 ${isView && "cursor-not-allowed"}`}
                    />
                    <ErrorMessage
                      name="createdBy"
                      component="div"
                      className="absolute text-red-600 text-[0.7vw] top-[3.65vw]"
                    />
                  </div>
                  {customerID && (
                    <div className="flex flex-col w-[19vw] mb-[1vh] relative">
                      <label
                        htmlFor="createdBy"
                        className="text-[0.9vw] font-bold mb-[0.5vh] relative"
                      >
                        Updated By{" "}
                      </label>
                      <Field
                        id="updatedBy"
                        type="text"
                        name="updateddBy"
                        onKeyPress={(e) => {
                          const regex = /^[A-Za-z\s]$/;
                          if (!regex.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        placeholder="Enter updated By"
                        disabled={isView}
                        className={`h-[4vh] text-[0.80vw] w-full border-[0.1vw] border-[#BDCAE9] rounded-[0.3vw] px-[0.5vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200 ${isView && "cursor-not-allowed"}`}
                      />
                    </div>
                  )}
                </div>
              </div>
              {!isView && (
                <div className="flex bottom fixed justify-center items-end w-[65vw] gap-[1vw] my-[1vw]">
                  <button
                    type="button"
                    onClick={closeModal}
                    className={`h-[2vw] w-[6vw] text-[0.95vw] rounded-[0.3vw] font-medium border-[0.1vw] border-[#4C67ED] cursor-pointer hover:bg-[#e8edfc42]`}
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className={`h-[2vw] w-[6vw] text-[0.95vw] rounded-[0.3vw] font-medium border-[0.1vw] border-[#4C67ED] bg-[#4C67ED] text-white cursor-pointer hover:bg-[#3b50c2]`}
                  >
                    SAVE
                  </button>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};
