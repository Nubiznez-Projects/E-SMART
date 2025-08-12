import { ErrorMessage, Field, FieldArray, Formik, Form } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { PurchaseOrderTable } from "./PurchaseOrderTable";
import {
  createPurchasePO,
  getPurchasePOID,
} from "../../../API/Purchase/PurchasePO";
// import { fetchSuppliers } from "../../../Redux/Slice/Features/Suppliers/SupplierThunks";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { message } from "antd";
import { fetchPurchasePo } from "../../../Redux/Slice/PurchaseModule/PurchasePOThunk";
import { fetchSuppliers } from "../../../Redux/Slice/MasterModule/Suppliers/SupplierThunks";

const validationSchema = Yup.object().shape({
  billFrom: Yup.string().required("Bill From is required"),
  issuedDate: Yup.date().typeError("Invalid date").required("Date is required"),
  deliveryDate: Yup.date()
    .typeError("Invalid date")
    .required("Date is required"),
  orderTo: Yup.string().required("Order To is required"),
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

export const CreatePurchasePO = ({
  purchasePOID,
  purchasePOData,
  setPurchasePoData,
  PurchaseStatus,
  setOpenAddModal,
}) => {
  const dispatch = useDispatch();
  const billFromOptions = ["Company A", "Company B", "CompanyC"]; // Example options
  const deliveryToOptions = ["Warehouse A", "Warehouse B", "Warehouse C"]; // Example options
  const today = dayjs(); // Get current date using dayjs
  const todayFormattedForInput = today.format("YYYY-MM-DD"); // YYYY-MM-DD for HTML input max attribute
  // `totalNetAmount` still needs to be a state here as it's a derived value
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

  useEffect(() => {
    if (purchasePOID) {
      fetchPurchasePOById();
    }
  }, [purchasePOID]);

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const handleSubmit = async (values) => {
    try {
      const { items, ...otherValues } = values;
      const getSupplierDetails = orderToOptions?.filter(
        (suppliers) => suppliers?.SupplierID === values?.orderTo
      );
      const response = await createPurchasePO(
        dispatch,
        purchasePOID,
        PurchaseStatus,
        otherValues,
        items,
        getSupplierDetails[0]
      );
      console.log(response, "API Response");
      setOpenAddModal(false);
      dispatch(fetchPurchasePo());
      // Handle success (e.g., show message, navigate)
    } catch (error) {
      console.error("Error submitting purchase order:", error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          billFrom: purchasePOData?.BillFrom || "",
          issuedDate:
            purchasePOData?.CreatedDate &&
            dayjs(purchasePOData.CreatedDate).isValid()
              ? dayjs(purchasePOData.CreatedDate).format("YYYY-MM-DD")
              : todayFormattedForInput,
          deliveryDate:
            purchasePOData?.DeliveryDate &&
            dayjs(purchasePOData.DeliveryDate).isValid()
              ? dayjs(purchasePOData.DeliveryDate).format("YYYY-MM-DD")
              : "",
          orderTo: purchasePOData?.SupplierID || "",
          deliveryTo: purchasePOData?.DeliveryAddress || "",
          createdBy: purchasePOData?.CreatedBy || "",
          updatedBy: purchasePOData?.UpdatedBy || "",
          items:
            purchasePOData?.Items && purchasePOData.Items.length > 0
              ? purchasePOData.Items.map((item) => ({
                  itemCode: item.ItemCode || "",
                  itemName: item.ItemName || item.Description || "",
                  hsn: item.HSN || "",
                  quantity: item.Quantity || "",
                  rate: item.Rate || "",
                  netAmount: item.Amount || item.Total || "",
                }))
              : [
                  {
                    hsn: "",
                    itemCode: "",
                    itemName: "",
                    quantity: "",
                    rate: "",
                    netAmount: "",
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
        }) => (
          <Form onSubmit={handleSubmit}>
            <>
              <div className="text-xl font-bold text-center my-[1vw]">
                CREATE PURCHASE ORDER
              </div>

              <div className="h-[90vh] overflow-y-scroll scrollbar-hide">
                <div className="px-[2vw] flex flex-col gap-y-[1vw]">
                  <div className="grid grid-cols-4 gap-x-[2vw]">
                    <div className="col-span-2">
                      <div className="flex">
                        <label
                          htmlFor="billFrom"
                          className="block text-[0.9vw] text-[#323232] font-semibold"
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
                          onKeyDown={(e) => handleKeyDown(e, "alphanumeric")}
                          placeholder="Enter Billing Address"
                          className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white "
                        />

                        <ErrorMessage
                          name="billFrom"
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
                          max={todayFormattedForInput} // format: 'YYYY-MM-DD'
                          className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw]"
                        />
                        <ErrorMessage
                          name="issuedDate"
                          component="div"
                          className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <div className="flex">
                        <label
                          htmlFor="deliveryDate"
                          className="block text-[0.9vw] text-[#323232] font-semibold"
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
                        min={new Date().toISOString().split("T")[0]} // This sets today's date as the minimum
                        className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw]"
                      />
                      <ErrorMessage
                        name="deliveryDate"
                        component="div"
                        className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-[2vw]">
                    {" "}
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
                        className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                      >
                        <option value="">Select a client</option>
                        {orderToOptions.map((option, index) => (
                          <option
                            key={option.id || index}
                            // value={`${option?.SupplierID}#${option?.SupplierName}#${option?.Address}#${option?.State}`}
                            value={option?.SupplierID}
                            className="text-[0.9vw]"
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
                  </div>
                  <div className="grid grid-cols-4 gap-x-[2vw]">
                    <div className="relative col-span-2">
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
                        className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
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
                        onKeyDown={(e) => handleKeyDown(e, "alphanumeric")}
                        className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw]"
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
                        onKeyDown={(e) => handleKeyDown(e, "alphanumeric")}
                        className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw]"
                      />
                      <ErrorMessage
                        name="updatedBy"
                        component="div"
                        className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw]"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-[2vw] text-[#32323233] border-dashed border-0 border-t-[0.2vw]"></div>
                <PurchaseOrderTable
                  totalNetAmount={totalNetAmount}
                  setTotalNetAmount={setTotalNetAmount}
                  // No need to pass tableData and setTableData as props anymore
                  // because PurchaseOrderTable will access values.items directly from Formik context
                />

                {/* Display total Net Amount */}
                <div className="mt-[1vw] text-right border-t-[0.2vw] border-dashed border-gray-300 text-[1.25vw] "></div>
                <div className="mt-[1vw] font-bold text-[#03B34D] p-[0.5vw] text-right text-[1.25vw] ">
                  <span className=" font-bold">Gross Amount:</span>{" "}
                  <span className="">₹ {totalNetAmount.toFixed(2)}</span>
                </div>

                {/* Error message for the items array from the parent Formik */}
                {/* {touched.items && typeof errors.items === "string" && (
                  <div className="text-red-500 text-[0.8vw] text-center mt-[1vw]">
                    {errors.items}
                  </div>
                )} */}

                <div className="flex justify-end items-end w-full gap-[2vw] my-[1vw] px-[0.5vw]">
                  <button
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
              </div>
            </>
          </Form>
        )}
      </Formik>
    </>
  );
};
