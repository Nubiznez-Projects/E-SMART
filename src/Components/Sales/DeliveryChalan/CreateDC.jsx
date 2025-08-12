import { Field, Formik, Form, ErrorMessage } from "formik";
import React, { useEffect, useState } from "react";
import DCTable from "./DCTable";
// import { getSalePOByID } from "../../../API/Sales/SalesPO";
// import { fetchCustomers } from "../../../Redux/Slice/MasterModule/Customers/CustomerThunks";
import { getCustomersByID } from "../../../API/MasterModule/Customer";
import dayjs from "dayjs";
import * as Yup from "yup";
import { CreateSalesDC, getSalesDCByID } from "../../../API/Sales/SalesDC";
import { useDispatch } from "react-redux";
import { fetchSalesDC } from "../../../Redux/Slice/SalesModule/SalesDCThunk";
import { toast } from "react-toastify";
import { getSalePOByID } from "../../../API/Sales/SalesPO";

const validationSchema = Yup.object().shape({
  transporterName: Yup.string()
    .required("Transporter name is required")
    .max(50, "Must be 50 characters or less"),

  vehicleNum: Yup.string()
    .required("Vehicle number is required")
    .max(20, "Must be 20 characters or less"),

  modeOfTransport: Yup.string()
    .required("Mode of transport is required")
    .max(30, "Must be 30 characters or less"),

  package: Yup.string()
    .required("Package info is required")
    .max(100, "Must be 100 characters or less"),

  totalQty: Yup.number()
    .typeError("Total quantity must be a number")
    .required("Total quantity is required")
    .positive("Must be greater than 0"),

  totalWgt: Yup.number()
    .typeError("Total weight must be a number")
    .required("Total weight is required")
    .positive("Must be greater than 0"),

  createdBy: Yup.string()
    .required("Created by is required")
    .max(50, "Must be 50 characters or less"),

  status: Yup.string().required("Status is required"),
  taxPer: Yup.string().required("Tax percentage is required"),
  taxableValue: Yup.string().required("Taxable Amount is required"),
  totalValue: Yup.string().required("Total value is required"),
  taxValue: Yup.string().required("Tax value is required"),
});

export default function CreateDC({ dcID, poID, poData, setAddDC }) {
  const [totalNetAmount, setTotalNetAmount] = useState(0);
  const [customerList, setCustomerList] = useState();
  const [taxPercent] = useState(5);
  const [gross, setGross] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalQty, setTotalQty] = useState();
  const [salesDCData, setSalesDCData] = useState();
  const [salesPOData, setSalesPOData] = useState();
  const dispatch = useDispatch();

  const parseItems = (raw) => {
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  //   setGrossAmount(gross);
  //   setTaxValue(tax);
  //   setTotalAmount(total);
  // }, [poData.Items, taxPercent]);

  const fetchCustomer = async (customerID) => {
    try {
      const response = await getCustomersByID(customerID);
      setCustomerList(response);
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSalesDCByID = async () => {
    try {
      const response = await getSalesDCByID(dcID);
      console.log("Sales PO data By ID", response);
      setSalesDCData(response[0]);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const fetchSalesPOByID = async () => {
    try {
      const response = await getSalePOByID(poID);
      console.log("Sales PO data By ID", response);
      setSalesPOData(response);
      fetchCustomer(response.CustomerID);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

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

  const modeOfTransportList = [
    { label: "Road", value: "road" },
    { label: "Rail", value: "rail" },
    { label: "Air", value: "air" },
    { label: "Sea", value: "sea" },
  ];

  const status = [
    { label: "Partially", value: "Partially" },
    { label: "Fully", value: "Fully" },
  ];

  const handleSubmit = async (values) => {
    try {
      const { items, ...otherValues } = values;

      const response = await CreateSalesDC(
        dcID,
        poData,
        values,
        items,
        salesDCData
      );
      console.log(response, "response from submit DC");
      dispatch(fetchSalesDC());
      //setTabName("DC");
      setAddDC(false);
      toast.success(response.message);
    } catch (error) {
      console.error("Error submitting Records", error);
    }
  };

  useEffect(() => {
    if (dcID) {
      fetchSalesDCByID();
    }
  }, [dcID]);

  useEffect(() => {
    if (poID) {
      fetchSalesPOByID();
    }
  }, [poID]);

  return (
    <>
      <Formik
        initialValues={{
          transporterName: salesDCData?.TransporterName || "",
          vehicleNum: salesDCData?.VehicleNum || "",
          modeOfTransport: salesDCData?.ModeOfTransport || "",
          package: salesDCData?.NoOfPackage || "",
          totalQty: totalQty || salesDCData?.TotalQty,
          totalWgt: salesDCData?.TotalWgt || "",
          createdBy: salesDCData?.CreatedBy || "",
          updatedBy: salesDCData?.UpdatedBy || "",
          taxPer: salesDCData?.TaxPer || "",
          taxValue: salesDCData?.TaxValue || "",
          taxableValue: salesDCData?.TaxableValue || "",
          totalValue: salesDCData?.TotalValue || "",
          status: salesDCData?.Status || "",
          items: parseItems(
            salesDCData?.Items?.length ? salesDCData.Items : poData?.Items
          ).map((item) => ({
            hsn: item.HSN || "",
            itemCode: item.ItemCode || "",
            itemName: item.ItemName || "",
            quantity: Number(item.Quantity) || "",
            rate: item.Rate || "",
            netAmount:
              item.Quantity && item.Rate
                ? Number(item.Quantity) * Number(item.Rate)
                : 0,
          })),
        }}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, handleSubmit }) => {
          const handleTaxOrValueChange = (e, field) => {
            const newValue = e.target.value;
            setFieldValue(field, newValue);

            // Parse as float
            const taxable =
              parseFloat(
                field === "taxableValue" ? newValue : values.taxableValue
              ) || 0;
            const taxPer =
              parseFloat(field === "taxPer" ? newValue : values.taxPer) || 0;

            // Calculate tax and total
            const tax = (taxable * taxPer) / 100;
            const total = taxable + tax;

            // Update dependent fields
            setFieldValue("taxValue", tax.toFixed(2));
            setFieldValue("totalValue", Math.round(total));
          };

          return (
            <Form onSubmit={handleSubmit}>
              <div className="h-[68vh] overflow-auto scrollbar-hide w-full">
                <div className="grid grid-cols-2 w-full gap-y-[1vw] gap-x-[1.3vw] p-[1.5vw]">
                  <div className="flex flex-wrap gap-y-[0.3vw]">
                    <div className="flex">
                      <label className="text-[0.9vw] font-medium">
                        Bill From
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <Field
                      value={salesPOData?.BillFrom}
                      disabled
                      className="w-full h-[2vw] disabled:cursor-not-allowed px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200"
                    />
                  </div>
                  <div className="flex flex-wrap gap-y-[0.3vw]">
                    <div className="flex">
                      <label className="text-[0.9vw] font-medium">
                        Delivery To
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <Field
                      disabled
                      value={getFullAddress(
                        salesPOData?.DeliveryAddress,
                        customerList
                      )}
                      className="w-full h-[2vw] disabled:cursor-not-allowed px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200"
                    />
                  </div>
                  <div className="flex flex-wrap gap-y-[0.3vw]">
                    <div className="flex">
                      <label className="text-[0.9vw] font-medium">
                        PO Number
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <Field
                      disabled
                      value={salesPOData?.SPoNum}
                      className="w-full h-[2vw] disabled:cursor-not-allowed px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200"
                    />
                  </div>
                  <div className="flex flex-wrap gap-y-[0.3vw]">
                    <div className="flex">
                      <label className="text-[0.9vw] font-medium">
                        PO Received Date
                      </label>
                    </div>
                    <Field
                      disabled
                      id="poNumber"
                      value={dayjs(
                        salesDCData?.IssuedDate || poData?.IssuedDate
                      ).format("DD-MM-YYYY")}
                      className="w-full h-[2vw] disabled:cursor-not-allowed px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200"
                    />
                  </div>
                  <div className="flex flex-wrap gap-y-[0.3vw] relative">
                    <div className="flex">
                      <label className="text-[0.9vw] font-medium">
                        Transport Name
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <Field
                      id="transporterName"
                      name="transporterName"
                      onKeyPress={(e) => {
                        const regex = /^[a-zA-Z\s]*$/;
                        if (!regex.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      className="w-full h-[2vw] px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200"
                    />
                    <ErrorMessage
                      name="transporterName"
                      component="div"
                      className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                    />
                  </div>
                  <div className="flex flex-wrap gap-y-[0.3vw] relative">
                    <div className="flex">
                      <label className="text-[0.9vw] font-medium">
                        Vehicle Number
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <Field
                      id="vehicleNum"
                      name="vehicleNum"
                      onKeyPress={(e) => {
                        const regex = /^[A-Z0-9-\s]*$/;
                        if (!regex.test(e.key.toUpperCase())) {
                          e.preventDefault();
                        }
                      }}
                      className="w-full h-[2vw] px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200"
                    />
                    <ErrorMessage
                      name="vehicleNum"
                      component="div"
                      className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                    />
                  </div>
                  <div className="flex flex-wrap gap-y-[0.3vw] relative">
                    <div className="flex">
                      <label className="text-[0.9vw] font-medium">
                        Mode of Transport
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <Field
                      as="select"
                      id="modeOfTransport"
                      name="modeOfTransport"
                      className={`w-full h-[2vw] px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200`}
                    >
                      <option value="" disabled>
                        Select Mode of Transport
                      </option>
                      {modeOfTransportList?.map((item) => (
                        <option key={item?.value} value={item?.value}>
                          {item.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="modeOfTransport"
                      component="div"
                      className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                    />
                  </div>
                  <div className="flex flex-wrap gap-y-[0.3vw] relative">
                    <div className="flex">
                      <label className="text-[0.9vw] font-medium">
                        No. of Packages
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <Field
                      id="package"
                      name="package"
                      onKeyPress={(e) => {
                        if (!/^[0-9]$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => e.preventDefault()}
                      className="w-full h-[2vw] px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200"
                    />
                    <ErrorMessage
                      name="package"
                      component="div"
                      className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                    />
                  </div>
                  <div className="flex flex-wrap gap-y-[0.3vw] relative">
                    <div className="flex">
                      <label className="text-[0.9vw] font-medium">
                        Total Quantity
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <Field
                      id="totalQty"
                      name="totalQty"
                      disabled
                      className="w-full h-[2vw] px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                    />

                    <ErrorMessage
                      name="totalQty"
                      component="div"
                      className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                    />
                  </div>
                  <div className="flex flex-wrap gap-y-[0.3vw] relative">
                    <div className="flex">
                      <label className="text-[0.9vw] font-medium">
                        Total Weight
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <Field
                      id="totalWgt"
                      name="totalWgt"
                      onKeyPress={(e) => {
                        const key = e.key;
                        const value = e.currentTarget.value;

                        // Allow digits
                        if (/^[0-9]$/.test(key)) return;

                        // Allow only one dot, not as first character
                        if (key === "." && value !== "" && !value.includes("."))
                          return;

                        // Block everything else
                        e.preventDefault();
                      }}
                      className="w-full h-[2vw] px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200"
                    />
                    <ErrorMessage
                      name="totalWgt"
                      component="div"
                      className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                    />
                  </div>
                  <div className="flex flex-wrap gap-y-[0.3vw] relative">
                    <div className="flex">
                      <label className="text-[0.9vw] font-medium">
                        Created By
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <Field
                      id="createdBy"
                      name="createdBy"
                      onKeyPress={(e) => {
                        const key = e.key;
                        const regex = /^[a-zA-Z.\s]$/;

                        if (!regex.test(key)) {
                          e.preventDefault();
                        }
                      }}
                      className="w-full h-[2vw] px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200"
                    />
                    <ErrorMessage
                      name="createdBy"
                      component="div"
                      className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                    />
                  </div>
                  <div className="flex flex-wrap gap-y-[0.3vw]">
                    <label className="text-[0.9vw] font-medium">
                      Updated By
                    </label>
                    <Field
                      id="updatedBy"
                      name="updatedBy"
                      onKeyPress={(e) => {
                        const key = e.key;
                        const regex = /^[a-zA-Z.\s]$/;

                        if (!regex.test(key)) {
                          e.preventDefault();
                        }
                      }}
                      className="w-full h-[2vw] px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200"
                    />
                  </div>
                </div>
                <div className="">
                  <label className="text-[1vw] font-bold px-[1vw]">
                    ITEM DETAILS
                  </label>
                  <DCTable
                    totalNetAmount={totalNetAmount}
                    setTotalNetAmount={setTotalNetAmount}
                    setGross={setGross}
                    setTax={setTax}
                    setTotal={setTotal}
                    setTotalQty={setTotalQty}
                  />
                </div>
                <div className="grid grid-cols-3 w-full gap-y-[1vw] gap-x-[1.3vw] p-[1.5vw]">
                  <div className="flex flex-wrap gap-y-[0.3vw] relative">
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
                  <div className="flex flex-wrap gap-y-[0.3vw]">
                    <div className="flex">
                      <label className="text-[0.9vw] font-medium">Amount</label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <Field
                      disabled
                      id="amount"
                      name="amount"
                      value={gross.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                      className="w-full h-[2vw] disabled:cursor-not-allowed px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200"
                    />
                  </div>
                  <div className="flex flex-wrap gap-y-[0.3vw] relative">
                    <div className="flex">
                      <label className="text-[0.9vw] font-medium">
                        Taxable Amount
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <Field
                      id="taxableValue"
                      name="taxableValue"
                      type="number"
                      onChange={(e) =>
                        handleTaxOrValueChange(e, "taxableValue")
                      }
                      className="w-full h-[2vw] disabled:cursor-not-allowed px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200"
                    />
                    <ErrorMessage
                      name="taxableValue"
                      component="div"
                      className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                    />
                  </div>
                  <div className="flex flex-wrap gap-y-[0.3vw] relative">
                    <div className="flex">
                      <label className="text-[0.9vw] font-medium">
                        Tax Percentage
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <Field
                      id="taxPer"
                      name="taxPer"
                      onKeyPress={(e) => {
                        if (!/^[0-9]$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => handleTaxOrValueChange(e, "taxPer")}
                      className="w-full h-[2vw] disabled:cursor-not-allowed px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200"
                    />
                    <ErrorMessage
                      name="taxPer"
                      component="div"
                      className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                    />
                  </div>
                  <div className="flex flex-wrap gap-y-[0.3vw] relative">
                    <div className="flex">
                      <label className="text-[0.9vw] font-medium">
                        Tax Value
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <Field
                      disabled
                      id="taxValue"
                      name="taxValue"
                      //value={tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      className="w-full h-[2vw] disabled:cursor-not-allowed px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200"
                    />
                    <ErrorMessage
                      name="taxValue"
                      component="div"
                      className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                    />
                  </div>
                  <div className="flex flex-wrap gap-y-[0.3vw] relative">
                    <div className="flex">
                      <label className="text-[0.9vw] font-medium">
                        Net Worth
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <Field
                      disabled
                      id="totalValue"
                      name="totalValue"
                      // value={total.toLocaleString("en-IN", {
                      //   maximumFractionDigits: 0,
                      // })}
                      className="w-full h-[2vw] disabled:cursor-not-allowed px-[0.6vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none
             transition-colors duration-200"
                    />
                    <ErrorMessage
                      name="totalValue"
                      component="div"
                      className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full justify-end items-end bottom-[3vw]">
                <div className="grid grid-cols-2 gap-x-[0.8vw] gap-y-[0.5vw] px-[1vw]">
                  <button
                    type="button"
                    onClick={() => setAddDC(false)}
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
          );
        }}
      </Formik>
    </>
  );
}
