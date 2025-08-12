import { ErrorMessage, Field, FieldArray, Formik, Form } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { SalePOTable } from "./SalesPOTable";
import { fetchCustomers } from "../../../Redux/Slice/MasterModule/Customers/CustomerThunks";
import { useSelector, useDispatch } from "react-redux";
import { createSalesPO, getSalePOByID } from "../../../API/Sales/SalesPO";
import { fetchSalesPo } from "../../../Redux/Slice/SalesModule/SalePOThunk";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const validationSchema = Yup.object().shape({
  billFrom: Yup.string().required("Bill From is required"),
  issuedDate: Yup.date().typeError("Invalid date").required("Date is required"),
  deliveryDate: Yup.date()
    .typeError("Invalid date")
    .required("Date is required"),
  billTo: Yup.string().required("Order To is required"),
  deliveryTo: Yup.string().required("Delivery To is required"),
  createdBy: Yup.string().required("Created By is required"),
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
            "rate",
          ];
          const isItemValid = requiredFields.every((field) => {
            const val = item[field];
            if (typeof val === "string" && val.trim() === "") return false;
            if (val === null || val === undefined) return false;
            if (field === "quantity" || field === "rate") {
              const numVal = parseFloat(val);
              if (isNaN(numVal) || numVal <= 0) return false;
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

export default function CreateSalePO({
  poID,
  PurchaseStatus,
  setOpenAddModal,
}) {
  const [totalNetAmount, setTotalNetAmount] = useState(0);
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.customers);
  const [salesPOData, setSalesPOData] = useState();

  const billFromOptions = Array.isArray(list)
    ? list.filter((s) => s.Status === true)
    : [];

  const handleKeyDown = (e, type = "alphanumeric") => {
    const key = e.key;

    const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
    ];
  };

  const getParsedAddresses = (billingAddress) => {
    try {
      if (Array.isArray(billingAddress)) {
        return billingAddress;
      } else if (
        typeof billingAddress === "object" &&
        billingAddress !== null
      ) {
        return [billingAddress];
      } else if (typeof billingAddress === "string") {
        const parsed = JSON.parse(billingAddress);
        return Array.isArray(parsed) ? parsed : [parsed];
      }
    } catch (e) {
      console.warn("Error parsing BillingAddress:", billingAddress, e);
    }

    return []; // fallback
  };

  const formatAddressLabel = (address) => {
    return [
      address?.doorNo,
      address?.street,
      address?.floor,
      address?.area,
      address?.district,
      address?.pincode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const handleSubmit = async (values) => {
    try {
      const { items, ...otherValues } = values;
      // ✅ Split safely
      const [customerID] = (values?.billTo || "").split("__");
      // ✅ Find the full customer data from the list
      const customer = billFromOptions.find((c) => c.CustomerID === customerID);
      const response = await createSalesPO(
        dispatch,
        poID,
        values,
        PurchaseStatus,
        //otherValues,
        items,
        customer,
        salesPOData
      );
      setOpenAddModal(false);
      dispatch(fetchSalesPo());
      toast.success(response.message);
      console.log("Form data submitted:", customer);
    } catch (error) {
      console.error("Error submitting purchase order:", error);
      // Handle error (e.g., show error message)
    }
  };

  const fetchSalesPOByID = async () => {
    try {
      const response = await getSalePOByID(poID);
      console.log("Sales PO data By ID", response);
      setSalesPOData(response);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  console.log(list, "data", billFromOptions);

  useEffect(() => {
    if (poID) {
      fetchSalesPOByID();
    }
  }, [poID]);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  return (
    <>
      <div className="flex w-full justify-center text-center py-[1vw]">
        <label className="text-[1.4vw] font-bold justify-center text-center">
          {" "}
          {poID ? " UPDATE PURCHASE ORDER" : "CREATE PURCHASE ORDER"}
        </label>
      </div>
      <div className="overflow-auto scrollbar-hide h-[91vh] p-[1vw]">
        <Formik
          initialValues={{
            billFrom: salesPOData?.BillFrom || "",
            issuedDate: salesPOData?.IssuedDate
              ? new Date(salesPOData.IssuedDate).toISOString().split("T")[0]
              : "",
            deliveryDate: salesPOData?.DeliveryDate
              ? new Date(salesPOData.DeliveryDate).toISOString().split("T")[0]
              : "",
            billTo: salesPOData?.OrderTo || "",
            deliveryTo: salesPOData?.DeliveryAddress || "",
            createdBy: salesPOData?.CreatedBy || "",
            updatedBy: salesPOData?.UpdatedBy || "",
            // Initialize the 'items' array here for the PurchaseOrderTable
            items:
              salesPOData?.Items && salesPOData.Items.length > 0
                ? salesPOData.Items.map((item) => ({
                    itemCode: item.ItemCode || "",
                    itemName: item.ItemName || "",
                    hsn: item.HSN || "",
                    quantity: item.Quantity,
                    rate: item.Rate,
                    netAmount: item.Amount,
                  }))
                : [
                    {
                      itemCode: "",
                      itemName: "",
                      hsn: "",
                      quantity: "",
                      rate: "",
                      netAmount: 0,
                    },
                  ],
          }}
          validationSchema={validationSchema}
          enableReinitialize
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
          }) => (
            <Form onSubmit={handleSubmit}>
              <div className="px-[2vw] flex flex-col gap-y-[1vw]">
                <div className="grid grid-cols-4 gap-x-[2vw]">
                  <div className="col-span-2">
                    <div className="flex">
                      <label
                        htmlFor="billFrom"
                        className="block text-[1vw] font-medium"
                      >
                        Bill From
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <div className="relative">
                      <Field
                        type="text"
                        name="billFrom"
                        placeholder="Enter Bill From"
                        className="w-full px-3 py-2 text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw]  focus:border-blue-500 focus:outline-none
             transition-colors duration-200 "
                      />
                      <ErrorMessage
                        name="billFrom"
                        component="div"
                        className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex">
                      <label
                        htmlFor="issuedDate"
                        className="block text-[1vw] font-medium"
                      >
                        Issued Date
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <div className="relative">
                      <Field
                        name="issuedDate"
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw]  focus:border-blue-500 focus:outline-none
             transition-colors duration-200"
                      />

                      <ErrorMessage
                        name="issuedDate"
                        component="div"
                        className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <div className="flex">
                      <label
                        htmlFor="deliveryDate"
                        className="block text-[1vw] font-medium"
                      >
                        Delivery Date
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <Field
                      name="deliveryDate"
                      type="date"
                      className="w-full px-3 py-2 text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw]  focus:border-blue-500 focus:outline-none
             transition-colors duration-200"
                    />
                    <ErrorMessage
                      name="deliveryDate"
                      component="div"
                      className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-[2vw]">
                  {" "}
                  <div className="relative">
                    <div className="flex">
                      <label
                        htmlFor="billTo"
                        className="block text-[1vw] font-medium"
                      >
                        Bill To
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <Field
                      as="select"
                      name="billTo"
                      className="w-full px-3 py-3 text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                    >
                      <option value="">Select Delivery Address</option>

                      {billFromOptions.flatMap((option) => {
                        const addresses = getParsedAddresses(
                          option.BillingAddress
                        );

                        return addresses.map((address, index) => (
                          <option
                            key={`${option.CustomerID}-${index}`}
                            value={`${option.CustomerID}__${index}`}
                          >
                            {option.CustomerName} -{" "}
                            {formatAddressLabel(address)}
                          </option>
                        ));
                      })}
                    </Field>

                    <ErrorMessage
                      name="billTo"
                      component="div"
                      className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-x-[2vw]">
                  <div className="relative col-span-2">
                    <div className="flex">
                      <label
                        htmlFor="deliveryTo"
                        className="block text-[1vw] font-medium"
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
                      className="w-full px-3 py-3 text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                    >
                      <option value="">Select Delivery Address</option>

                      {billFromOptions.flatMap((option) => {
                        const addresses = getParsedAddresses(
                          option.BillingAddress
                        );

                        return addresses.map((address, index) => (
                          <option
                            key={`${option.CustomerID}-${index}`}
                            value={`${option.CustomerID}__${index}`}
                          >
                            {option.CustomerName} -{" "}
                            {formatAddressLabel(address)}
                          </option>
                        ));
                      })}
                    </Field>
                    <ErrorMessage
                      name="deliveryTo"
                      component="div"
                      className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                    />
                  </div>
                  <div className="relative">
                    <div className="flex">
                      <label
                        htmlFor="createdBy"
                        className="block text-[1vw] font-medium"
                      >
                        Created By
                      </label>
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </div>
                    <Field
                      name="createdBy"
                      onKeyDown={(e) => handleKeyDown(e, "alphanumeric")}
                      className="w-full px-3 py-2 text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw]  focus:border-blue-500 focus:outline-none
             transition-colors duration-200"
                    />
                    <ErrorMessage
                      name="createdBy"
                      component="div"
                      className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                    />
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="updatedBy"
                      className="block text-[1vw] font-medium"
                    >
                      Updated By
                    </label>
                    <Field
                      name="updatedBy"
                      onKeyDown={(e) => handleKeyDown(e, "alphanumeric")}
                      className="w-full px-3 py-2 text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw]  focus:border-blue-500 focus:outline-none
             transition-colors duration-200"
                    />
                    <ErrorMessage
                      name="updatedBy"
                      component="div"
                      className="text-red-500 text-[0.75vw] absolute bottom-[-1.2vw]"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-[2vw] text-[#32323233] border-dashed border-0 border-t-[0.2vw]"></div>
              <SalePOTable
                totalNetAmount={totalNetAmount}
                setTotalNetAmount={setTotalNetAmount}
                // No need to pass tableData and setTableData as props anymore
                // because PurchaseOrderTable will access values.items directly from Formik context
              />

              {/* Display total Net Amount */}
              <div className="mt-[1vw] font-bold text-[#03B34D] p-[0.5vw] text-right border-t-[0.2vw] border-dashed border-gray-300 text-[1.25vw] ">
                <span className=" font-bold">Gross Amount:</span>{" "}
                <span className="">₹ {totalNetAmount.toFixed(2)}</span>
              </div>

              {/* Error message for the items array from the parent Formik */}
              {/* {touched.items && typeof errors.items === "string" && (
                <div className="text-red-500 text-[0.8vw] text-center mt-[1vw]">
                  {errors.items}
                </div>
              )} */}

              <div className="flex justify-end items-end w-full gap-[2vw] my-[1vw] bottom-[1vw]">
                <button
                onClick={()=> setOpenAddModal(false)}
                  type="button"
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
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}
