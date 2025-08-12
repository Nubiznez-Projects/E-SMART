import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import { MdDelete } from "react-icons/md";
import {
  getSalesReturnById,
  submitSalesReturn,
} from "../../../API/Sales/SalesReturn";
import { fetchSalesReturn } from "../../../Redux/Slice/SalesModule/SaleRtrnThunk";

const validationSchema = Yup.object({
  customerName: Yup.string().required("Customer Name is required"),
  contactPerson: Yup.string().required("Contact Person is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  invoiceNo: Yup.string().required("Invoice Number is required"),
  returnDate: Yup.string().required("Return Date is required"),
  returnItems: Yup.array().of(
    Yup.object({
      ItemName: Yup.string().required("Product Name is required"),
      ItemCode: Yup.string().required("Item Code is required"),
      hsnCode: Yup.string().required("HSN Code is required"),
      ReturnQty: Yup.number()
        .typeError("Quantity must be a number")
        .min(1, "Quantity must be at least 1")
        .required("Quantity is required"),
      unitPrice: Yup.number()
        .typeError("Unit Price must be a number")
        .min(0.01, "Price must be at least 0.01")
        .required("Unit Price is required"),
    })
  ),
});

const returnReasons = [
  "Damaged goods",
  "Incorrect item received",
  "Wrong size/color",
  "Defective product",
  "Late delivery",
  "Other",
];

export const AddSalesReturn = ({
  setOpenAddModal,
  salesReturnId,
  setSalesReturnID,
  salesReturnData,
  setSalesReturnData,
}) => {
  console.log(salesReturnData, salesReturnId, "salesReturnData");
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    try {
      console.log(values, "return_Items");
      const response = await submitSalesReturn(values, salesReturnId);
      dispatch(fetchSalesReturn());
      setOpenAddModal(false);
    } catch (error) {
      console.error("Error in Submitting Return Items :", error);
    }
  };

  return (
    <div className="p-[2vw] bg-gray-100 overflow-y-scroll min-h-screen max-h-screen scrollbar-hide">
      <h1 className="text-2xl font-semibold mb-[1vw]">Sales Return</h1>
      <Formik
        initialValues={{
          customerName: salesReturnData?.CustomerName,
          contactPerson: salesReturnData?.ContactPersonName,
          email: salesReturnData?.Email,
          phone: salesReturnData?.MobileNumber,
          invoiceNo: salesReturnData?.InvoiceNo,
          additionalNotes: salesReturnData?.Comments,
          // returnDate: salesReturnData?.ReturnDate,
          returnDate: dayjs(salesReturnData?.ReturnDate).format("YYYY-MM-DD"),
          returnItems:
            Array.isArray(salesReturnData?.Items) &&
            salesReturnData.Items.length > 0
              ? salesReturnData.Items.map((rntitems) => ({
                  ItemName: rntitems?.ItemName,
                  ItemCode: rntitems?.ItemCode,
                  hsnCode: rntitems?.hsnCode,
                  ReturnQty: rntitems?.ReturnQty,
                  unitPrice: rntitems?.Rate,
                  itemTotal: rntitems?.Total,
                }))
              : [
                  {
                    ItemName: "",
                    ItemCode: "",
                    hsnCode: "",
                    ReturnQty: "",
                    unitPrice: "",
                    itemTotal: "",
                  },
                ],

          totalItems: salesReturnData?.TotalItems,
          totalQuantity: salesReturnData?.TotalQuantity,
          totalAmount: salesReturnData?.TotalAmount,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, setFieldValue, handleSubmit, setFieldError }) => {
          const totalItems = values.returnItems.length;
          const totalQuantity = values.returnItems.reduce(
            (acc, item) => acc + item.ReturnQty,
            0
          );
          const totalAmount = values.returnItems.reduce(
            (acc, item) => acc + item.ReturnQty * item.unitPrice,
            0
          );

          useEffect(() => {
            setFieldValue("totalItems", totalItems);
            setFieldValue("totalQuantity", totalQuantity);
            setFieldValue("totalAmount", totalAmount);
          }, [totalAmount, totalQuantity, totalAmount]);

          const handleImageChange = (event) => {
            const file = event.currentTarget.files[0];
            // Set the File object directly to the form field
            setFieldValue("returnImage", file);
          };

          return (
            <Form onSubmit={handleSubmit}>
              <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-[1.5vw] font-medium mb-[1vw]">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[2vw]">
                  <div>
                    <label
                      htmlFor="customerName"
                      className="block text-[0.95vw] font-medium text-gray-700"
                    >
                      Customer Name
                    </label>
                    <div className="relative">
                      <Field
                        name="customerName"
                        onBeforeInput={(e) => {
                          // Allow only letters (uppercase/lowercase) and space
                          const validChars = /^[a-zA-Z\s]*$/;
                          if (e.data && !validChars.test(e.data)) {
                            e.preventDefault();
                          }
                        }}
                        type="text"
                        className="mt-[0.5vw] block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-[0.95vw] h-[2vw] placeholder:text-[0.8vw] pl-[0.5vw] "
                        placeholder="Enter customer name"
                      />
                      <ErrorMessage
                        name="customerName"
                        component="div"
                        className="absolute bottom-[-1.2vw] text-red-500 text-[0.8vw]"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="contactPerson"
                      className="block text-[0.95vw] font-medium text-gray-700"
                    >
                      Contact Person
                    </label>
                    <div className="relative">
                      <Field
                        name="contactPerson"
                        onBeforeInput={(e) => {
                          // Allow only letters (uppercase/lowercase) and space
                          const validChars = /^[a-zA-Z\s]*$/;
                          if (e.data && !validChars.test(e.data)) {
                            e.preventDefault();
                          }
                        }}
                        type="text"
                        className="mt-[0.5vw] block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-[0.95vw] h-[2vw] placeholder:text-[0.8vw] pl-[0.5vw]"
                        placeholder="Enter contact person name"
                      />
                      <ErrorMessage
                        name="contactPerson"
                        component="div"
                        className="text-red-500 absolute bottom-[-1.2vw] text-[0.8vw]"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[0.95vw] font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <Field
                        name="email"
                        onBeforeInput={(e) => {
                          const validEmailChars = /^[a-zA-Z0-9@._%+-]*$/;
                          if (e.data && !validEmailChars.test(e.data)) {
                            e.preventDefault();
                          }
                        }}
                        type="email"
                        className="mt-[0.5vw] block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-[0.95vw] h-[2vw] placeholder:text-[0.8vw] pl-[0.5vw]"
                        placeholder="Enter email address"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 absolute bottom-[-1.2vw] text-[0.8vw]"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-[0.95vw] font-medium text-gray-700"
                    >
                      Phone
                    </label>
                    <div className="relative">
                      <Field
                        name="phone"
                        onBeforeInput={(e) => {
                          const validPhoneChars = /^[0-9]*$/;
                          if (e.data && !validPhoneChars.test(e.data)) {
                            e.preventDefault();
                          }
                        }}
                        type="text"
                        className="mt-[0.5vw] block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-[0.95vw] h-[2vw] placeholder:text-[0.8vw] pl-[0.5vw]"
                        placeholder="Enter phone number"
                      />
                      <ErrorMessage
                        name="phone"
                        component="div"
                        className="text-red-500 absolute bottom-[-1.2vw] text-[0.8vw]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="invoiceNo"
                      className="block text-[0.95vw] font-medium text-gray-700"
                    >
                      Invoice Number
                    </label>
                    <div className="relative">
                      {" "}
                      <Field
                        name="invoiceNo"
                        onBeforeInput={(e) => {
                          const validChars = /^[A-Z0-9\-]*$/;
                          if (e.data && !validChars.test(e.data)) {
                            e.preventDefault();
                          }
                        }}
                        type="text"
                        className="mt-[0.5vw] block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-[0.95vw] h-[2vw] placeholder:text-[0.8vw] pl-[0.5vw]"
                        placeholder="Enter Invoice number"
                      />
                      <ErrorMessage
                        name="invoiceNo"
                        component="div"
                        className="absolute bottom-[-1.2vw] text-red-500 text-[0.8vw]"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="returnDate"
                      className="block  text-[0.95vw] font-medium text-gray-700"
                    >
                      Return Date
                    </label>
                    <Field
                      name="returnDate"
                      type="date"
                      className="mt-[0.5vw] block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-[0.95vw] h-[2vw] placeholder:text-[0.8vw] pl-[0.5vw]"
                    />
                  </div>
                </div>
                <div className="mt-[2vw]">
                  <label
                    htmlFor="additionalNotes"
                    className="block text-[0.95vw] font-medium text-gray-700"
                  >
                    Additional Notes
                  </label>
                  <Field
                    name="additionalNotes"
                    as="textarea"
                    rows="3"
                    className="mt-[0.5vw] block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-[0.95vw] h-[4vw] placeholder:text-[0.8vw] pl-[0.5vw] pt-[0.5vw]"
                    placeholder="Enter any additional notes"
                  />
                </div>
              </div>

              <div className="flex-1 mt-[2vw]">
                <FieldArray name="returnItems">
                  {({ push, remove }) => (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-[2vw]">
                      <div className="flex justify-between items-center mb-[1vw]">
                        <h2 className="text-[1.5vw] font-medium mb-[1vw]">
                          Return Items
                        </h2>
                        <button
                          type="button"
                          onClick={() => {
                            const lastIndex = values.returnItems.length - 1;
                            const lastItem = values.returnItems[lastIndex];

                            const requiredFields = [
                              "ItemName",
                              "ItemCode",
                              "hsnCode",
                              "ReturnQty",
                              "unitPrice",
                            ];

                            const isValid = requiredFields.every((field) => {
                              const val = lastItem?.[field];
                              return (
                                val !== "" && val !== undefined && val !== null
                              );
                            });

                            if (!isValid) {
                              setFieldError(
                                "returnItems",
                                `Please fill all fields in Item ${
                                  lastIndex + 1
                                }`
                              );
                              return;
                            }

                            setFieldError("returnItems", undefined); // clear error

                            push({
                              ItemName: "",
                              ItemCode: "",
                              hsnCode: "",
                              ReturnQty: "",
                              unitPrice: "",
                              itemTotal: "",
                            });
                          }}
                          className="bg-[#323232] text-[1vw] text-white px-[0.5vw] py-[0.25vw] rounded-md hover:bg-[#494949] focus:outline-none focus:ring-2 focus:ring-offset-2"
                        >
                          + Add Item
                        </button>
                      </div>

                      {values.returnItems.length > 0 &&
                        values.returnItems.map((item, index) => (
                          <div
                            key={index}
                            className="border-t border-gray-200 pt-[0.5vw] mt-[0.5vw]"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-[1.1vw] font-medium">
                                Item {index + 1}
                              </h3>
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-500 hover:text-red-700 rounded-[0.2vw] cursor-pointer"
                              >
                                <MdDelete size="1.25vw" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[2vw]">
                              <div>
                                <label
                                  htmlFor={`returnItems[${index}].ItemName`}
                                  className="block text-[0.95vw] font-medium text-gray-700"
                                >
                                  Product Name
                                </label>
                                <div className="relative">
                                  <Field
                                    name={`returnItems[${index}].ItemName`}
                                    onBeforeInput={(e) => {
                                      // Allow only letters (uppercase/lowercase) and space
                                      const validChars = /^[a-zA-Z\s]*$/;
                                      if (e.data && !validChars.test(e.data)) {
                                        e.preventDefault();
                                      }
                                    }}
                                    type="text"
                                    className="mt-[0.5vw] block w-full border-gray-300 rounded-md shadow-sm sm:text-[0.95vw] h-[2vw] placeholder:text-[0.8vw] pl-[0.5vw]"
                                    placeholder="Enter product name"
                                  />
                                  <ErrorMessage
                                    name={`returnItems[${index}].ItemName`}
                                    component="div"
                                    className="text-red-500 absolute bottom-[-1.2vw] text-[0.7vw]"
                                  />
                                </div>
                              </div>
                              <div>
                                <label
                                  htmlFor={`returnItems[${index}].ItemCode`}
                                  className="block text-[0.95vw] font-medium text-gray-700"
                                >
                                  Item Code
                                </label>
                                <div className="relative">
                                  <Field
                                    name={`returnItems[${index}].ItemCode`}
                                    onBeforeInput={(e) => {
                                      const validChars = /^[a-zA-Z0-9]*$/;
                                      if (e.data && !validChars.test(e.data)) {
                                        e.preventDefault();
                                      }
                                    }}
                                    type="text"
                                    className="mt-[0.5vw] block w-full border-gray-300 rounded-md shadow-sm sm:text-[0.95vw] h-[2vw] placeholder:text-[0.8vw] pl-[0.5vw]"
                                    placeholder="Enter Item Code"
                                  />
                                  <ErrorMessage
                                    name={`returnItems[${index}].ItemCode`}
                                    component="div"
                                    className="text-red-500 absolute bottom-[-1.2vw] text-[0.7vw]"
                                  />
                                </div>
                              </div>
                              <div>
                                <label
                                  htmlFor={`returnItems[${index}].hsnCode`}
                                  className="block text-[0.95vw] font-medium text-gray-700"
                                >
                                  HSN Code
                                </label>
                                <div className="relative">
                                  <Field
                                    name={`returnItems[${index}].hsnCode`}
                                    type="text"
                                    onBeforeInput={(e) => {
                                      const validDigits = /^[0-9]*$/;
                                      if (e.data && !validDigits.test(e.data)) {
                                        e.preventDefault();
                                      }
                                    }}
                                    className="mt-[0.5vw] block w-full border-gray-300 rounded-md shadow-sm sm:text-[0.95vw] h-[2vw] placeholder:text-[0.8vw] pl-[0.5vw]"
                                    placeholder="Enter HSN Code"
                                  />
                                  <ErrorMessage
                                    name={`returnItems[${index}].hsnCode`}
                                    component="div"
                                    className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                                  />
                                </div>
                              </div>
                              <div>
                                <label
                                  htmlFor={`returnItems[${index}].ReturnQty`}
                                  className="block text-[0.95vw] font-medium text-gray-700"
                                >
                                  Quantity
                                </label>
                                <div className="relative">
                                  <Field
                                    onBeforeInput={(e) => {
                                      const validDigits = /^[0-9]*$/;
                                      if (e.data && !validDigits.test(e.data)) {
                                        e.preventDefault();
                                      }
                                    }}
                                    name={`returnItems[${index}].ReturnQty`}
                                  >
                                    {({ field, form }) => {
                                      const value =
                                        form.values.returnItems[index]
                                          .ReturnQty;
                                      const unitPrice = parseFloat(
                                        form.values.returnItems[index]
                                          .unitPrice || 0
                                      );

                                      const handleChange = (e) => {
                                        let input = e.target.value;

                                        if (input === "") {
                                          form.setFieldValue(
                                            `returnItems[${index}].ReturnQty`,
                                            0
                                          );
                                          form.setFieldValue(
                                            `returnItems[${index}].itemTotal`,
                                            0
                                          );
                                          return;
                                        }

                                        const quantity = parseFloat(input);

                                        if (!isNaN(quantity) && quantity >= 0) {
                                          form.setFieldValue(
                                            `returnItems[${index}].ReturnQty`,
                                            quantity
                                          );
                                          const itemTotal =
                                            quantity * unitPrice;
                                          form.setFieldValue(
                                            `returnItems[${index}].itemTotal`,
                                            itemTotal
                                          );
                                        }
                                      };

                                      return (
                                        <input
                                          {...field}
                                          type="number"
                                          min="0"
                                          className="mt-[0.5vw] block w-full border-gray-300 rounded-md shadow-sm sm:text-[0.95vw] h-[2vw] placeholder:text-[0.8vw] pl-[0.5vw]"
                                          placeholder="Enter Quantity"
                                          value={value === 0 ? "" : value}
                                          onChange={handleChange}
                                        />
                                      );
                                    }}
                                  </Field>

                                  <ErrorMessage
                                    name={`returnItems[${index}].ReturnQty`}
                                    component="div"
                                    className="text-red-500 absolute bottom-[-1.2vw] text-[0.7vw]"
                                  />
                                </div>{" "}
                              </div>
                              <div>
                                <label
                                  htmlFor={`returnItems[${index}].unitPrice`}
                                  className="block text-[0.95vw] font-medium text-gray-700"
                                >
                                  Unit Price
                                </label>
                                <div className="relative">
                                  <Field
                                    onBeforeInput={(e) => {
                                      const input = e.target.value;
                                      const char = e.data;

                                      // Allow digits and one decimal point
                                      const isValid =
                                        /^[0-9]$/.test(char) ||
                                        (char === "." && !input.includes("."));

                                      if (!isValid) {
                                        e.preventDefault();
                                      }
                                    }}
                                    name={`returnItems[${index}].unitPrice`}
                                  >
                                    {({ field, form }) => {
                                      const value =
                                        form.values.returnItems[index]
                                          .unitPrice;
                                      const quantity =
                                        form.values.returnItems[index]
                                          .ReturnQty;

                                      const handleChange = (e) => {
                                        let input = e.target.value;

                                        if (input === "") {
                                          form.setFieldValue(
                                            `returnItems[${index}].unitPrice`,
                                            0
                                          );
                                          form.setFieldValue(
                                            `returnItems[${index}].itemTotal`,
                                            0
                                          );
                                          return;
                                        }

                                        const unitPrice = parseFloat(input);
                                        const quantity = parseFloat(
                                          form.values.returnItems[index]
                                            .ReturnQty || 0
                                        );

                                        if (
                                          !isNaN(unitPrice) &&
                                          unitPrice >= 0
                                        ) {
                                          form.setFieldValue(
                                            `returnItems[${index}].unitPrice`,
                                            unitPrice
                                          );
                                          const itemTotal =
                                            unitPrice * quantity;
                                          form.setFieldValue(
                                            `returnItems[${index}].itemTotal`,
                                            itemTotal
                                          );
                                        }
                                      };

                                      return (
                                        <input
                                          {...field}
                                          type="number"
                                          min="0"
                                          className="mt-[0.5vw] block w-full border-gray-300 rounded-md shadow-sm sm:text-[0.95vw] h-[2vw] placeholder:text-[0.8vw] pl-[0.5vw]"
                                          placeholder="Enter Unit Price"
                                          value={value === 0 ? "" : value}
                                          onChange={handleChange}
                                        />
                                      );
                                    }}
                                  </Field>

                                  <ErrorMessage
                                    name={`returnItems[${index}].unitPrice`}
                                    component="div"
                                    className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </FieldArray>

                <div className="bg-white p-[1vw] rounded-lg shadow-md">
                  <h2 className="text-[1.5vw] font-medium mb-[1vw]">
                    Return Summary
                  </h2>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[0.95vw]">
                      <span className="text-gray-600">Total Items:</span>
                      <span className="font-medium">{totalItems}</span>
                    </div>
                    <div className="flex justify-between text-[0.95vw]">
                      <span className="text-gray-600">Total Quantity:</span>
                      <span className="font-medium">{totalQuantity}</span>
                    </div>
                    <div className="flex justify-between text-[1vw] font-bold py-[1vw] border-t border-gray-200">
                      <span>Total Amount:</span>
                      <span>INR {totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-[#323232] text-[1vw] text-white px-[0.5vw] py-[0.25vw] rounded-md hover:bg-[#494949] focus:outline-none focus:ring-2 focus:ring-offset-2 w-full"
                  >
                    Save Return
                  </button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
