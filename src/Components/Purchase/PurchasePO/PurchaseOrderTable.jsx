import React, { useState, useEffect } from "react";
import { Field, FieldArray, useFormikContext } from "formik"; // Import useFormikContext
import * as Yup from "yup"; // Ensure Yup is imported for validation in handleSave
import { Table, Input, Tooltip, ConfigProvider, message } from "antd"; // Import message for Ant Design toast
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";

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

export const PurchaseOrderTable = ({
  totalNetAmount,
  setTotalNetAmount,
  // tableData and setTableData props are REMOVED as data is managed by parent Formik
}) => {
  const [editableRowIndex, setEditableRowIndex] = useState(null);

  // Use useFormikContext to access the parent Formik's state and methods
  // This is the key change to avoid nested forms
  const {
    values,
    setFieldValue,
    errors,
    touched,
    validateForm,
    setErrors,
    setFieldTouched,
  } = useFormikContext();

  // Ensure values.items is initialized within the parent Formik's scope
  // This useEffect ensures the items array exists, even if empty, preventing potential errors
  useEffect(() => {
    if (!values.items) {
      setFieldValue("items", []);
    }
  }, [values.items, setFieldValue]); // Depend on values.items and setFieldValue

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

  const handleEdit = (index) => {
    setEditableRowIndex(index);
    // Optional: when starting edit, clear specific errors for this row if they exist
    // This makes sure error messages don't persist visually after user starts editing again.
    const newErrors = { ...errors };
    if (
      newErrors.items &&
      Array.isArray(newErrors.items) &&
      newErrors.items[index]
    ) {
      newErrors.items[index] = {}; // Clear errors for this specific item object
      setErrors(newErrors);
    }
  };

  const handleSave = async (index) => {
    // Validate the specific row using Yup.reach and the itemValidationSchema
    let rowErrors = {};
    try {
      await itemValidationSchema.validate(values.items[index], {
        abortEarly: false,
      });
    } catch (err) {
      if (err.inner) {
        err.inner.forEach((error) => {
          // Adjust path to only get the field name within the item
          const fieldName = error.path.split(".").pop();
          rowErrors[fieldName] = error.message;
        });
      }
    }

    // Manually mark all fields in the current row as touched to trigger Ant Design's error styles
    const fieldNamesToTouch = [
      `items[${index}].hsn`,
      `items[${index}].itemCode`,
      `items[${index}].itemName`,
      `items[${index}].quantity`,
      `items[${index}].rate`,
    ];

    for (const fieldName of fieldNamesToTouch) {
      // setFieldTouched will now be available from useFormikContext
      setFieldTouched(fieldName, true, false);
    }

    if (Object.keys(rowErrors).length > 0) {
      // If there are row-specific errors, display a general message and prevent saving
      message.error("Please fill all required fields in the current row.");
      // Formik will automatically update `errors` object based on touched fields and validation.
      // No explicit `setErrors` here needed for individual field errors if they are handled by Yup schema.
      return; // Stop function execution if there are errors
    }

    // Trigger validation for the entire form to ensure overall table validation is re-checked
    // validateForm will now be available from useFormikContext
    const formErrors = await validateForm();

    if (formErrors.items && typeof formErrors.items === "string") {
      // This case handles the top-level 'items' array validation error (e.g., min(1) not met)
      message.error(formErrors.items);
    } else {
      // If no validation errors (either row-specific or overall array), exit edit mode
      setEditableRowIndex(null);
      message.success(`Row ${index + 1} saved successfully!`);
    }
  };

  return (
    // <Formik> and <Form> wrappers are REMOVED from here
    <div className="px-[2vw]">
      <ConfigProvider
        theme={{
          components: {
            Table: {
              rowHoverBg: "rgb(255, 255, 255, 0)",
              rowSelectedBg: "rgb(255, 255, 255, 0)",
              rowSelectedHoverBg: "rgb(255, 255, 255, 0)",
              shadowHover: "0 0.5vw 1vw rgba(0, 0, 0, 0.15)",
              headerSplitColor: "#000000",
            },
          },
        }}
      >
        {/* FieldArray should be here to manage the 'items' array directly from parent Formik's state */}
        <FieldArray name="items">
          {({ push, remove }) => (
            <>
              <div className="relative">
                <Table
                  // dataSource uses values.items from useFormikContext
                  dataSource={values?.items?.map((item, index) => ({
                    ...item,
                    key: index,
                  }))}
                  pagination={false}
                  rowKey="key"
                  className="custom-table"
                  scroll={{ x: "10vw" }}
                  columns={[
                    {
                      title: (
                        <div className="text-[0.8vw] text-[#323232]">S.No</div>
                      ),
                      render: (_, __, index) => index + 1,
                      width: "1vw",
                    },
                    {
                      title: (
                        <div className="text-[0.8vw] text-[#323232]">HSN</div>
                      ),
                      render: (_, item, index) => (
                        <div className="relative">
                          <Field
                            name={`items[${index}].hsn`}
                            as={Input}
                            disabled={!isEditable(index)}
                            onChange={(e) =>
                              setFieldValue(
                                `items[${index}].hsn`,
                                e.target.value
                              )
                            }
                            value={item.hsn}
                            // Ant Design's status prop for error styling
                            status={
                              touched.items?.[index]?.hsn &&
                              errors.items?.[index]?.hsn
                                ? "error"
                                : ""
                            }
                          />
                          {/* Display specific error message for this field */}
                          {touched.items?.[index]?.hsn &&
                            errors.items?.[index]?.hsn && (
                              <div className="text-red-500 text-[0.7vw] absolute bottom-[-1vw] left-0">
                                {errors.items[index].hsn}
                              </div>
                            )}
                        </div>
                      ),
                      width: "6vw",
                    },
                    {
                      title: (
                        <div className="text-[0.8vw] text-[#323232]">
                          Item Code
                        </div>
                      ),
                      render: (_, item, index) => (
                        <div className="relative">
                          <Field
                            name={`items[${index}].itemCode`}
                            as={Input}
                            disabled={!isEditable(index)}
                            onChange={(e) =>
                              setFieldValue(
                                `items[${index}].itemCode`,
                                e.target.value
                              )
                            }
                            value={item.itemCode}
                            status={
                              touched.items?.[index]?.itemCode &&
                              errors.items?.[index]?.itemCode
                                ? "error"
                                : ""
                            }
                          />
                          {touched.items?.[index]?.itemCode &&
                            errors.items?.[index]?.itemCode && (
                              <div className="text-red-500 text-[0.7vw] absolute bottom-[-1vw] left-0">
                                {errors.items[index].itemCode}
                              </div>
                            )}
                        </div>
                      ),
                      width: "6vw",
                    },
                    {
                      title: (
                        <div className="text-[0.8vw] text-[#323232]">
                          Item Name
                        </div>
                      ),
                      render: (_, item, index) => (
                        <div className="relative">
                          <Field
                            name={`items[${index}].itemName`}
                            as={Input}
                            disabled={!isEditable(index)}
                            onChange={(e) =>
                              setFieldValue(
                                `items[${index}].itemName`,
                                e.target.value
                              )
                            }
                            value={item.itemName}
                            status={
                              touched.items?.[index]?.itemName &&
                              errors.items?.[index]?.itemName
                                ? "error"
                                : ""
                            }
                          />
                          {touched.items?.[index]?.itemName &&
                            errors.items?.[index]?.itemName && (
                              <div className="text-red-500 text-[0.7vw] absolute bottom-[-1vw] left-0">
                                {errors.items[index].itemName}
                              </div>
                            )}
                        </div>
                      ),
                      width: "6vw",
                    },
                    {
                      title: (
                        <div className="text-[0.8vw] text-[#323232]">
                          Quantity
                        </div>
                      ),
                      render: (_, item, index) => (
                        <div className="relative">
                          <Field
                            name={`items[${index}].quantity`}
                            as={Input}
                            type="number" // Use type number for quantity for better UX
                            disabled={!isEditable(index)}
                            onChange={(e) => {
                              const quantity = parseFloat(e.target.value) || ""; // Keep as string for empty state
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
                            value={item.quantity}
                            status={
                              touched.items?.[index]?.quantity &&
                              errors.items?.[index]?.quantity
                                ? "error"
                                : ""
                            }
                          />
                          {touched.items?.[index]?.quantity &&
                            errors.items?.[index]?.quantity && (
                              <div className="text-red-500 text-[0.7vw] absolute bottom-[-1vw] left-0">
                                {errors.items[index].quantity}
                              </div>
                            )}
                        </div>
                      ),
                      width: "6vw",
                    },
                    {
                      title: (
                        <div className="text-[0.8vw] text-[#323232]">Rate</div>
                      ),
                      render: (_, item, index) => (
                        <div className="relative">
                          <Field
                            name={`items[${index}].rate`}
                            as={Input}
                            type="number" // Use type number for rate for better UX
                            disabled={!isEditable(index)}
                            onChange={(e) => {
                              const rate = parseFloat(e.target.value) || ""; // Keep as string for empty state
                              const quantity =
                                parseFloat(values.items[index].quantity) || 0;
                              setFieldValue(`items[${index}].rate`, rate);
                              setFieldValue(
                                `items[${index}].netAmount`,
                                quantity * rate
                              );
                            }}
                            value={item.rate}
                            status={
                              touched.items?.[index]?.rate &&
                              errors.items?.[index]?.rate
                                ? "error"
                                : ""
                            }
                          />
                          {touched.items?.[index]?.rate &&
                            errors.items?.[index]?.rate && (
                              <div className="text-red-500 text-[0.7vw] absolute bottom-[-1vw] left-0">
                                {errors.items[index].rate}
                              </div>
                            )}
                        </div>
                      ),
                      width: "6vw",
                    },
                    {
                      title: (
                        <div className="text-[0.8vw] text-[#323232]">
                          Net Amount
                        </div>
                      ),
                      render: (_, item, index) => (
                        <Field
                          name={`items[${index}].netAmount`}
                          as={Input}
                          disabled={true}
                          value={item?.netAmount && item?.netAmount?.toFixed(2)} // Format netAmount for display
                        />
                      ),
                      width: "6vw",
                    },
                    {
                      title: (
                        <div className="text-[0.8vw] text-[#323232]">
                          Actions
                        </div>
                      ),
                      render: (_, __, index) => {
                        const editable = isEditable(index);
                        return (
                          <div className="flex gap-2">
                            {editable ? (
                              <Tooltip title="Save Row">
                                <button
                                  type="button"
                                  onClick={() => handleSave(index)}
                                  className="p-2 border-none bg-transparent cursor-pointer"
                                >
                                  <IoMdCheckmarkCircleOutline
                                    style={{
                                      color: "green",
                                      fontSize: "1.2em",
                                    }}
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
                                    style={{
                                      color: "blue",
                                      fontSize: "1vw  ",
                                    }}
                                  />
                                </button>
                              </Tooltip>
                            )}
                            <Tooltip title="Delete Row">
                              <button
                                type="button"
                                onClick={() => {
                                  remove(index); // Remove from Formik's internal state
                                  setEditableRowIndex(null); // Exit edit mode if the deleted row was editable
                                }}
                                className="p-2 border-none bg-transparent cursor-pointer"
                              >
                                <RiDeleteBin6Line
                                  style={{
                                    color: "red",
                                    fontSize: "1vw",
                                  }}
                                />
                              </button>
                            </Tooltip>
                          </div>
                        );
                      },
                      width: "2vw",
                    },
                  ]}
                />
                {/* Display the common error message for the items array from the parent Formik's state */}
                <div className="text-red-500 text-[0.7vw] mt-2 text-center absolute bottom-[-0.7vw]">
                  {touched.items && typeof errors.items === "string" && (
                    <div className="error">{errors.items}</div>
                  )}
                </div>
              </div>
              <div className="">
                <button
                  type="button"
                  onClick={() => {
                    // If there are no items, allow adding the first row without validation checks.
                    // values.items will be an empty array if there are no rows.
                    if (!values?.items || values?.items?.length === 0) {
                      const newRow = {
                        hsn: "",
                        itemCode: "",
                        itemName: "",
                        quantity: "",
                        rate: "",
                        netAmount: 0,
                      };
                      push(newRow);
                      setEditableRowIndex(0); // Set the first (and only) row to be editable
                      return; // Exit the function after adding the row
                    }

                    // Prevent adding a new row if the currently editable row has validation errors.
                    if (
                      editableRowIndex !== null &&
                      Object.values(
                        errors.items?.[editableRowIndex] || {}
                      ).some(Boolean)
                    ) {
                      toast?.warn(
                        "Please save or fix the current editable row before adding a new one."
                      );
                      return;
                    }
                    // Only check for string errors on `errors.items` if there are existing rows.
                    // This prevents the error when the table is legitimately empty.
                    if (typeof errors.items === "string") {
                      toast?.warn(
                        "Please save or fix the existing rows before adding a new one."
                      );
                      return;
                    }

                    const newRow = {
                      hsn: "",
                      itemCode: "",
                      itemName: "",
                      quantity: "",
                      rate: "",
                      netAmount: 0,
                    };
                    push(newRow); // Add to Formik's internal state
                    setEditableRowIndex(values?.items?.length); // Set the newly added row to be editable
                  }}
                  className="w-full h-[3vw] border-dashed border-[0.1vw] border-neutral-400 rounded-[0.5vw] mt-4 text-gray-600 hover:bg-gray-50 transition-colors text-[1vw]"
                >
                  + Add Row
                </button>
              </div>
            </>
          )}
        </FieldArray>
      </ConfigProvider>
    </div>
  );
};
