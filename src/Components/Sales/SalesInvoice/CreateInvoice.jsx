import { ErrorMessage, Field, Formik, Form } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { CreateSalesInvoice, getInvoiceByID } from "../../../API/Sales/Invoice";
import { useDispatch } from "react-redux";
import { fetchInvoice } from "../../../Redux/Slice/SalesModule/InvoiceThunk";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { getSalesDCByID } from "../../../API/Sales/SalesDC";
import { getCustomersByID } from "../../../API/MasterModule/Customer";
import { getSalePOByID } from "../../../API/Sales/SalesPO";

const validationSchema = Yup.object().shape({
  billTo: Yup.string()
    .required("Bill To is required")
    .min(3, "Bill To must be at least 3 characters"),

  shipTo: Yup.string()
    .required("Ship To is required")
    .min(3, "Ship To must be at least 3 characters"),

  bankName: Yup.string()
    .required("Bank Name is required")
    .min(3, "Bank Name must be at least 3 characters"),

  branch: Yup.string()
    .required("Branch is required")
    .min(3, "Branch must be at least 3 characters"),

  accountNo: Yup.string()
    .required("Account Number is required")
    .matches(/^[0-9]{9,18}$/, "Account Number must be 9-18 digits"),

  ifsc: Yup.string()
    .required("IFSC code is required")
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"),

  status: Yup.string().required("Status is required"),
  creditDys: Yup.string().required("Credit Days are required")
});

export default function CreateInvoice({
  dcID,
  poID,
  setAddInvoice,
  setOpenAddModal,
  invoiceId,
  poData,
}) {
  const [salesDCData, setSalesDCData] = useState();
  const dispatch = useDispatch();
  const [customerList, setCustomerList] = useState();
  const [salesPOData, setSalesPOData] = useState();
  const [invoiceData, setInvoiceData] = useState();

  const status = [
    { label: "Partially", value: "Partially" },
    { label: "Fully", value: "Fully" },
  ];

    const creditDays = [
    { label: "0-30 days", value: 30 },
    { label: "30-60 days", value: 60 },
    { label: "60-90 days", value: 90 },
  ];
  
  const grossAmount = salesDCData?.Items.reduce(
    (sum, item) => sum + item.Amount,
    0
  );

  const fetchCustomer = async (customerID) => {
    try {
      const response = await getCustomersByID(customerID);
      setCustomerList(response);
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSalesPOByID = async (poID) => {
    try {
      const response = await getSalePOByID(poID);
      console.log("Sales PO data By ID", response);
      setSalesPOData(response);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  console.log(invoiceId, "invoiceId")

  const getFullAddress = (addressRef, customer) => {
    if (!addressRef || !customer?.BillingAddress) return "";

    const [, indexStr] = addressRef.split("__");
    const index = parseInt(indexStr);

    let addresses = [];

    try {
      // Parse if it's a string
      addresses =
        typeof customer.BillingAddress === "string"
          ? JSON.parse(customer.BillingAddress)
          : customer.BillingAddress;

      const addr = addresses[index];

      return addr
        ? `${customer?.CustomerName} - ${addr.doorNo}, ${addr.floor}, ${addr.street}, ${addr.area}, ${addr.district}, ${addr.pincode}`
        : "";
    } catch (err) {
      console.error("Error parsing BillingAddress:", err);
      return "";
    }
  };

  const handleSubmit = async (values) => {
    try {
      const response = await CreateSalesInvoice(
        invoiceId,
        values,
        salesDCData,
        // totalAmount,
        // taxValue,
        grossAmount,
        invoiceData
      );
      setAddInvoice(false);
      dispatch(fetchInvoice());
      toast.success(response.message);
      console.log("Form data submitted:", customer);
    } catch (error) {
      console.error("Error submitting purchase order:", error);
    }
  };

  const fetchSalesDCByID = async () => {
    try {
      const response = await getSalesDCByID(dcID);
      console.log("Sales PO data By ID", response[0]);
      fetchCustomer(response[0]?.CustomerID);
      fetchSalesPOByID(response[0]?.SPoNum);
      setSalesDCData(response[0]);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const fetchInvoiceByID = async () => {
    try {
      const response = await getInvoiceByID(invoiceId);
      console.log(response, "invoiceData");
      setInvoiceData(response[0]);
    } catch (error) {
      console.error("Error fetching invoice", error);
    }
  };

  useEffect(() => {
    if (dcID) {
      fetchSalesDCByID();
    }
  }, [dcID]);

  useEffect(() => {
    if (invoiceId) {
      fetchInvoiceByID();
    }
  }, [invoiceId]);

  return (
    <>
      {/* <div className="flex w-full justify-center items-center p-[1vw] text-[1.2vw] font-bold bg-[#BDCAE9]">
        {invoiceId ? " UPDATE INVOICE" : "CREATE INVOICE"}
      </div> */}
      <div className="">
        <Formik
          initialValues={{
            poNum: salesDCData?.SPoNum || "",
            dcNum: salesDCData?.DCNum || "",
            billTo: salesPOData?.OrderTo || "",
            shipTo: salesPOData?.DeliveryAddress || "",
            bankName: invoiceData?.BankName || "",
            branch: invoiceData?.Branch || "",
            status: invoiceData?.InvoiceStatus || "",
            accountNo: invoiceData?.AccountNum || "",
            ifsc: invoiceData?.IFSC_Code || "",
            creditDys: invoiceData?.CreditDays || ""
          }}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className="h-[67vh] overflow-auto scrollbar-hide w-full"> 
              <div className="grid grid-cols-2 gap-y-[1vw] gap-x-[2vw] p-[1.5vw]">
                <div className="flex flex-col gap-[0.6vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">PO Number</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    type="text"
                    id="poNum"
                    value={values.poNum}
                    disabled
                    name="poNum"
                    placeholder="Enter PO Number"
                    className="w-full cursor-not-allowed px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw]  focus:border-blue-500 focus:outline-none
                             transition-colors duration-200 "
                  />
                  <ErrorMessage
                    name="poNum"
                    component="div"
                    className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.6vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">DC Number</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    type="text"
                    id="dcNum"
                    name="dcNum"
                    disabled
                    value={values.dcNum}
                    placeholder="Enter DC Number"
                    className="w-full cursor-not-allowed px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw]  focus:border-blue-500 focus:outline-none
                             transition-colors duration-200 "
                  />
                  <ErrorMessage
                    name="dcNum"
                    component="div"
                    className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.6vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Bill To</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    type="text"
                    name="billTo"
                    value={getFullAddress(salesPOData?.OrderTo, customerList)}
                    disabled
                    placeholder="Enter Bill TO"
                    className="w-full cursor-not-allowed px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw]  focus:border-blue-500 focus:outline-none
                             transition-colors duration-200 "
                  />
                  <ErrorMessage
                    name="billTo"
                    component="div"
                    className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.6vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Ship To</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    type="text"
                    name="shipTo"
                    value={getFullAddress(
                      salesPOData?.DeliveryAddress,
                      customerList
                    )}
                    disabled
                    placeholder="Enter Ship To"
                    className="w-full cursor-not-allowed px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw]  focus:border-blue-500 focus:outline-none
                             transition-colors duration-200 "
                  />
                  <ErrorMessage
                    name="shipTo"
                    component="div"
                    className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.6vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Bank Name</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    type="text"
                    name="bankName"
                    onKeyPress={(e) => {
                      if (!/^[a-zA-Z ]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter Bank Name"
                    className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="bankName"
                    component="div"
                    className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.6vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Branch</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    type="text"
                    name="branch"
                    onKeyPress={(e) => {
                      if (!/^[a-zA-Z ]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter Branch"
                    className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  />

                  <ErrorMessage
                    name="branch"
                    component="div"
                    className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.6vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Account Number</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    type="text"
                    name="accountNo"
                    onKeyPress={(e) => {
                      if (!/^[0-9]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter Account number"
                    className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="accountNo"
                    component="div"
                    className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.6vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">IFSC Code</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    type="text"
                    name="ifsc"
                    value={values?.ifsc}
                    onKeyPress={(e) => {
                      if (!/^[a-zA-Z0-9]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter IFSC code"
                    className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw]  focus:border-blue-500 focus:outline-none
                             transition-colors duration-200 "
                  />
                  <ErrorMessage
                    name="ifsc"
                    component="div"
                    className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.6vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw] font-medium">Credit Days</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    as="select"
                    id="creditDys"
                    name="creditDys"
                    onKeyPress={(e) => {
                      if (!/^[a-zA-Z ]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className={`w-full h-[2vw] px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
                              transition-colors duration-200`}
                  >
                    <option value="" disabled>
                      Select credit days
                    </option>
                    {creditDays?.map((item) => (
                      <option key={item?.value} value={item?.value}>
                        {item.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="creditDys"
                    component="div"
                    className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.6vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw] font-medium">Status</label>
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
                    <option value="" disabled>
                      Select Status
                    </option>
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
              </div>
              <div className="flex flex-col w-full px-[1vw] mt-[1vw]">
                <label className="text-[1vw] font-bold">ITEMS DETAILS</label>
                <table className="min-w-full text-sm border-separate border-spacing-y-2">
                  <thead>
                    <tr className="border-b border-t flex border-gray-600 bg-[#eef3fd4d] text-left text-[0.8vw]">
                      <th className="flex justify-center items-center py-2 w-[4vw]">
                        S.No
                      </th>
                      <th className="flex justify-center items-center py-2 w-[7vw]">
                        HSN
                      </th>
                      <th className="flex justify-center items-center py-2 w-[9vw]">
                        Item Code
                      </th>
                      <th className="flex justify-center items-center py-2 w-[9vw]">
                        Item Name
                      </th>
                      <th className="flex justify-center items-center py-2 w-[6vw]">
                        Qty
                      </th>
                      <th className="flex justify-center items-center py-2 w-[6vw]">
                        Rate
                      </th>
                      <th className="flex justify-center items-center py-2 w-[7vw]">
                        Amount
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {salesDCData?.Items?.map((item, index) => {
                      return (
                        <tr
                          key={index}
                          className="bg-white flex gap-x-[1vw] border-b border-gray-600"
                        >
                          {/* Sr No */}
                          <td className="flex justify-center items-left py-2 text-center w-[4vw]">
                            {index + 1}
                          </td>

                          {/* HSN - Placeholder */}
                          <td className="flex justify-left items-left py-2 w-[7vw]">
                            <input
                              disabled
                              className="w-full px-2 py-1 bg-white border rounded text-gray-600"
                              value={item.HSN || ""}
                            />
                          </td>

                          {/* Item Code - Placeholder */}
                          <td className="flex justify-left items-left py-2 w-[8vw]">
                            <input
                              disabled
                              className="w-full px-2 py-1 bg-white border rounded text-gray-600"
                              value={item.ItemCode || ""}
                            />
                          </td>

                          {/* Item Name */}
                          <td className="flex justify-center items-left py-2 w-[8vw]">
                            <input
                              disabled
                              className="w-full px-2 py-1 bg-white border rounded text-gray-600"
                              value={item.ItemName || ""}
                            />
                          </td>

                          {/* Quantity */}
                          <td className="flex justify-center items-left py-2 w-[4vw]">
                            <input
                              type="number"
                              disabled
                              className="w-full px-2 py-1 bg-white border rounded text-gray-600"
                              value={item.Quantity || 0}
                            />
                          </td>

                          {/* Rate */}
                          <td className="flex justify-center items-left py-2 w-[5vw]">
                            <input
                              disabled
                              className="w-full px-2 py-1 bg-white border rounded text-gray-600"
                              value={item.Rate || 0}
                            />
                          </td>

                          {/* Net Amount */}
                          <td className="flex justify-center items-left py-2 w-[7vw]">
                            <input
                              disabled
                              className="w-full px-2 py-1 bg-white border rounded text-gray-600"
                              value={item.Amount?.toFixed(2) || "0.00"}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex w-full justify-end items-end mt-[2vw] mb-[1vw]">
                <div className="grid grid-cols-2 gap-x-[0.8vw] gap-y-[0.5vw] px-[1vw]">
                  <label className="text-[0.85vw] font-bold">
                    Gross Amount:{" "}
                  </label>
                  <label className="text-[0.85vw] font-bold text-end">
                    ₹{" "}
                    {grossAmount?.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}{" "}
                  </label>
                  <label className="text-[0.85vw] font-bold">Tax(%): </label>
                  <label className="text-[0.85vw] font-bold text-end">
                    {salesDCData?.TaxPer} %{" "}
                  </label>
                  <label className="text-[0.85vw] font-bold">Tax value: </label>
                  <label className="text-[0.85vw] font-bold text-end">
                    ₹{" "}
                    {salesDCData?.TaxValue.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}{" "}
                  </label>
                  <label className="text-[0.85vw] font-bold">
                    Taxable Amount:{" "}
                  </label>
                  <label className="text-[0.85vw] font-bold text-end">
                    ₹{" "}
                    {salesDCData?.TaxableValue.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}{" "}
                  </label>
                  <div className="col-span-2 border-[0.01vw] border-b-[#b9b7b7bd]"></div>
                  <label className="text-[0.95vw] font-semibold text-[#03B34D]">
                    Total Amount:{" "}
                  </label>
                  <label className="text-[0.95vw] font-semibold text-[#03B34D] text-end">
                    ₹{" "}
                    {salesDCData?.TotalValue.toLocaleString("en-IN", {
                      maximumFractionDigits: 0,
                    })}{" "}
                  </label>
                  <div className="col-span-2 border-[0.01vw] border-b-[#b9b7b7bd]"></div>
                 
                </div>
              </div>
              </div>
              <div className="flex flex-col w-full justify-end items-end bottom-[0.5vw]">
                 <div className="grid grid-cols-2 gap-x-[0.8vw] gap-y-[0.5vw] px-[1vw]">
                 <button
                    type="button"
                    onClick={() => setAddInvoice(false)}
                    className={`mt-[2vw] h-[2vw] w-[6.5vw] text-[0.95vw] rounded-[0.3vw] font-semibold border-[0.1vw] border-[#4C67ED] cursor-pointer`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`mt-[2vw] h-[2vw] w-[6.5vw] text-[0.95vw] rounded-[0.3vw] font-medium border-[0.1vw] border-[#4C67ED] bg-[#4C67ED] text-white cursor-pointer hover:bg-[#3b50c2]`}
                  >
                    Save
                  </button>
                  </div>l
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}
