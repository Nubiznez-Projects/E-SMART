import React, { useState, useEffect, useMemo } from "react";
import { Field, FieldArray, useFormikContext } from "formik"; // Import useFormikContext
import * as Yup from "yup"; // Ensure Yup is imported for validation in handleSave
import { Table, Input, Tooltip, ConfigProvider, message } from "antd"; // Import message for Ant Design toast
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
// import { RiDeleteBin6Line } from "react-icons/ri";

// Define a schema for a single item for row-level validation
const itemValidationSchema = Yup.object().shape({
  hsn: Yup.string().required("HSN is required"),
  itemCode: Yup.string().required("Item Code is required"),
  itemName: Yup.string().required("Item Name is required"),
  quantity: Yup.number()
    .typeError("Quantity must be a number")
    .required("Quantity is required")
    .min(0.01, "Quantity must be greater than 0"),
  rate: Yup.number()
    .typeError("Rate must be a number")
    .required("Rate is required")
    .min(0.01, "Rate must be greater than 0"),
});

export default function DCTable({
  totalNetAmount,
  setTotalNetAmount,
  setGross,
  setTax,
  setTotal,
  setTotalQty,
}) {
  const [editableRowIndex, setEditableRowIndex] = useState(null);

  const {
    values,
    setFieldValue,
    errors,
    touched,
    validateForm,
    setFieldTouched,
    setErrors,
  } = useFormikContext();

  // Ensure items array exists
  useEffect(() => {
    if (!Array.isArray(values.items)) {
      setFieldValue("items", []);
    }
  }, [values.items, setFieldValue]);

  // Update total on change
  useEffect(() => {
    const total = values.items?.reduce(
      (sum, item) => sum + (parseFloat(item.netAmount) || 0),
      0
    );
    setTotalNetAmount(total);
  }, [values.items]);

  const handleSave = async (index) => {
    let rowErrors = {};
    try {
      await itemValidationSchema.validate(values.items[index], {
        abortEarly: false,
      });
    } catch (err) {
      err.inner.forEach((error) => {
        const field = error.path.split(".").pop();
        rowErrors[field] = error.message;
      });
    }

    ["hsn", "itemCode", "itemName", "quantity", "rate"].forEach((field) => {
      setFieldTouched(`items[${index}].${field}`, true, false);
    });

    if (Object.keys(rowErrors).length > 0) {
      message.error("Please correct the row before saving.");
      return;
    }

    const formErrors = await validateForm();
    if (typeof formErrors.items === "string") {
      message.error(formErrors.items);
      return;
    }

    setEditableRowIndex(null);
    message.success("Row saved!");
  };

  const handleEdit = (index) => {
    setEditableRowIndex(index);
    const newErrors = { ...errors };
    if (Array.isArray(newErrors.items) && newErrors.items[index]) {
      newErrors.items[index] = {};
      setErrors(newErrors);
    }
  };

  // Function to calculate total net amount
  const calculateTotalNetAmount = (items) => {
    const total = items?.reduce(
      (sum, item) => sum + (parseFloat(item.netAmount) || 0),
      0
    );
    setTotalNetAmount(total);
  };

  // Calculate total net amount whenever Formik's values.items changes
  useEffect(() => {
    calculateTotalNetAmount(values.items || []); // Use values.items from Formik context
  }, [values.items, setTotalNetAmount]);

  const isEditable = (index) => editableRowIndex === index;

  useEffect(() => {
    const grossAmount = values.items.reduce((acc, item) => {
      const q = parseFloat(item.quantity) || 0;
      const r = parseFloat(item.rate) || 0;
      return acc + q * r;
    }, 0);

    const totalQty = values.items.reduce((acc, item) => {
      return acc + (parseFloat(item.quantity) || 0);
    }, 0);

    const taxVal = (grossAmount * 5) / 100;
    const totalVal = grossAmount + taxVal;

    setGross(grossAmount);
    setTax(taxVal);
    setTotal(totalVal);
    //setTotalQty(totalQty);
  }, [values.items]);

  useEffect(() => {
    const totalQty = values?.items?.reduce((acc, item) => {
      const qty = parseFloat(item?.quantity);
      return acc + (isNaN(qty) ? 0 : qty); // Safely handles empty or invalid
    }, 0); // <-- start with 0 (a number)

    setFieldValue("totalQty", totalQty);
  }, [values.items, setFieldValue]);

  return (
    // <Formik> and <Form> wrappers are REMOVED from here
    <div className="px-[1vw]">
      <FieldArray name="items">
        {({ push, remove }) => (
          <>
            <div className="">
              <table className="min-w-full text-sm border-separate border-spacing-y-2">
                <thead>
                  <tr className="border-b border-t flex border-gray-600 bg-[#eaeffa4d] text-left text-[0.8vw]">
                    <th className="flex justify-center items-center py-2 w-[3vw]">
                      S.No
                    </th>
                    <th className="flex justify-center items-center py-2 w-[6vw]">
                      HSN
                    </th>
                    <th className="flex justify-center items-center py-2 w-[9vw]">
                      Item Code
                    </th>
                    <th className="flex justify-center items-center py-2 w-[9vw]">
                      Item Name
                    </th>
                    <th className="flex justify-center items-center py-2 w-[5vw]">
                      Qty
                    </th>
                    <th className="flex justify-center items-center py-2 w-[6vw]">
                      Rate
                    </th>
                    <th className="flex justify-center items-center py-2 w-[7vw]">
                      Amount
                    </th>
                    <th className="flex justify-center items-center py-2 w-[4vw]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {values.items?.map((item, index) => {
                    const isEditing = editableRowIndex === index;

                    return (
                      <tr
                        key={index}
                        className="bg-white flex gap-x-[1vw] border-b border-gray-600"
                      >
                        <td className="flex disabled:cursor-not-allowed justify-center bg-white items-left py-2 text-center w-[3vw]">
                          {index + 1}
                        </td>

                        {/* HSN */}
                        <td className="flex justify-left items-left py-2 w-[5vw]">
                          <Field
                            name={`items[${index}].hsn`}
                            disabled
                            className="w-full disabled:cursor-not-allowed px-[0.6vw] py-[0.1vw] bg-white border rounded text-gray-600"
                          />
                        </td>

                        {/* Item Code */}
                        <td className="flex justify-left items-left py-2 w-[8vw]">
                          <Field
                            name={`items[${index}].itemCode`}
                            disabled
                            className="w-full disabled:cursor-not-allowed px-[0.6vw] py-[0.1vw] bg-white border rounded text-gray-600"
                          />
                        </td>

                        {/* Item Name */}
                        <td className="flex justify-center items-left py-2 w-[8vw]">
                          <Field
                            name={`items[${index}].itemName`}
                            disabled
                            className="w-full disabled:cursor-not-allowed px-[0.6vw] py-[0.1vw] bg-white border rounded text-gray-600"
                          />
                        </td>

                        {/* Quantity - Editable */}
                        <td className="flex justify-center items-left py-2 w-[4vw]">
                          <Field
                            name={`items[${index}].quantity`}
                            //type="number"
                            disabled={!isEditable(index)}
                            className="w-full disabled:cursor-not-allowed px-[0.6vw] py-[0.1vw] bg-white border rounded text-gray-600"
                            onChange={(e) => {
                              const quantity = parseFloat(e.target.value) || 0;
                              const rate =
                                parseFloat(values.items[index].rate) || 0;
                              setFieldValue(
                                `items[${index}].quantity`,
                                quantity
                              );
                              setFieldValue(
                                `items[${index}].netAmount`,
                                quantity * rate
                              );
                            }}
                            value={values.items[index].quantity}
                          />

                          {touched.items?.[index]?.quantity &&
                            errors.items?.[index]?.quantity && (
                              <div className="text-xs text-red-500 mt-1">
                                {errors.items[index].quantity}
                              </div>
                            )}
                        </td>

                        {/* Rate */}
                        <td className="flex justify-center items-left py-2 w-[5vw]">
                          <Field
                            name={`items[${index}].rate`}
                            disabled
                            className="w-full px-[0.6vw] disabled:cursor-not-allowed py-[0.1vw] bg-white border rounded text-gray-600"
                          />
                        </td>

                        {/* Net Amount */}
                        <td className="flex justify-center items-left py-2 w-[6vw]">
                          <Field
                            name={`items[${index}].netAmount`}
                            disabled
                            className="w-full disabled:cursor-not-allowed px-[0.6vw] py-[0.1vw] bg-white border rounded text-gray-600"
                            value={Number(item.netAmount || 0).toFixed(2)}
                          />
                        </td>

                        {/* Actions */}
                        <td className="py-2 text-center w-[2vw]">
                          {isEditing ? (
                            <Tooltip title="Save Row">
                              <button
                                type="button"
                                onClick={() => handleSave(index)}
                                className="p-2 border-none bg-transparent cursor-pointer"
                              >
                                <IoMdCheckmarkCircleOutline
                                  style={{ color: "green", fontSize: "1.2em" }}
                                />
                              </button>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Edit Row">
                              <button
                                type="button"
                                onClick={() => handleEdit(index)}
                                className="p-2 border-none bg-transparent cursor-pointer"
                              >
                                <MdOutlineEdit
                                  style={{ color: "blue", fontSize: "1.2em" }}
                                />
                              </button>
                            </Tooltip>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table-level error */}
            {touched.items && typeof errors.items === "string" && (
              <div className="text-center text-red-500 text-sm mt-2">
                {errors.items}
              </div>
            )}
          </>
        )}
      </FieldArray>
    </div>
  );
}
