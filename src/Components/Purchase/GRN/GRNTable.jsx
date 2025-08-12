import { ConfigProvider, Input, Table, Tooltip } from "antd";
import { Field, FieldArray, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
// Removed: import { RiDeleteBin6Line } from "react-icons/ri";

export const GRNTable = ({ setTotalNetAmount }) => {
  const [editableRowIndex, setEditableRowIndex] = useState(null);

  const {
    values,
    setFieldValue,
    errors,
    touched,
    validateForm,
    setErrors,
    setFieldTouched,
  } = useFormikContext();

  useEffect(() => {
    if (!values?.items) {
      setFieldValue("items", []);
    }
  }, [values.items, setFieldValue]);

  const calculateTotalNetAmount = (items) => {
    const total = items?.reduce(
      (sum, item) => sum + (parseFloat(item.netAmount) || 0),
      0
    );
    setTotalNetAmount(total);
  };

  useEffect(() => {
    calculateTotalNetAmount(values.items || []);
  }, [values.items]);

  const isEditable = (index) => editableRowIndex === index;

  const handleEdit = (index) => {
    setEditableRowIndex(index);
    const newErrors = { ...errors };
    if (
      newErrors.items &&
      Array.isArray(newErrors.items) &&
      newErrors.items[index]
    ) {
      newErrors.items[index] = {};
      setErrors(newErrors);
    }
  };

  const handleSave = async (index) => {
    let rowErrors = {};
    try {
      // Assuming itemValidationSchema is defined elsewhere and imported/accessible
      // You'll need to ensure itemValidationSchema is available in this scope.
      await itemValidationSchema.validate(values.items[index], {
        abortEarly: false,
      });
    } catch (err) {
      if (err.inner) {
        err.inner.forEach((error) => {
          const fieldName = error.path.split(".").pop();
          rowErrors[fieldName] = error.message;
        });
      }
    }

    const fieldNamesToTouch = [
      `items[${index}].hsn`,
      `items[${index}].itemCode`,
      `items[${index}].itemName`,
      `items[${index}].quantity`,
      `items[${index}].rate`,
    ];

    for (const fieldName of fieldNamesToTouch) {
      setFieldTouched(fieldName, true, false);
    }

    if (Object.keys(rowErrors).length > 0) {
      // Assuming 'message' is an Ant Design message component imported elsewhere
      message.error("Please fill all required fields in the current row.");
      return;
    }

    const formErrors = await validateForm();

    if (formErrors.items && typeof formErrors.items === "string") {
      message.error(formErrors.items);
    } else {
      setEditableRowIndex(null);
      // Assuming 'message' is an Ant Design message component imported elsewhere
      message.success(`Row ${index + 1} saved successfully!`);
    }
  };

  return (
    <div className="">
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
        <FieldArray name="items">
          {({ push, remove }) => (
            <>
              <div className="relative">
                <Table
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
                        <div className="text-[0.8vw] text-[#323232] font-semibold">
                          S.No
                        </div>
                      ),
                      render: (_, __, index) => index + 1,
                      width: "1vw",
                    },
                    {
                      title: (
                        <div className="text-[0.8vw] text-[#323232] font-semibold">
                          HSN
                        </div>
                      ),
                      render: (_, item, index) => (
                        <div className="">
                          <Field
                            name={`items[${index}].hsn`}
                            as={Input}
                            // disabled={!isEditable(index)}
                            disabled={true}
                            onChange={(e) =>
                              setFieldValue(
                                `items[${index}].hsn`,
                                e.target.value
                              )
                            }
                            value={item.hsn}
                            className="text-[0.8vw]"
                            status={
                              touched.items?.[index]?.hsn &&
                              errors.items?.[index]?.hsn
                                ? "error"
                                : ""
                            }
                          />
                          {/* {touched.items?.[index]?.hsn &&
                            errors.items?.[index]?.hsn && (
                              <div className="text-red-500 text-[0.7vw] absolute bottom-[-1vw] left-0">
                                {errors.items[index].hsn}
                              </div>
                            )} */}
                        </div>
                      ),
                      width: "4vw",
                    },
                    {
                      title: (
                        <div className="text-[0.8vw] text-[#323232] font-semibold">
                          Item Code
                        </div>
                      ),
                      render: (_, item, index) => (
                        <div className="">
                          <Field
                            name={`items[${index}].itemCode`}
                            as={Input}
                            // disabled={!isEditable(index)}
                            disabled={true}
                            onChange={(e) =>
                              setFieldValue(
                                `items[${index}].itemCode`,
                                e.target.value
                              )
                            }
                            value={item.itemCode}
                            className="text-[0.8vw]"
                            status={
                              touched.items?.[index]?.itemCode &&
                              errors.items?.[index]?.itemCode
                                ? "error"
                                : ""
                            }
                          />
                          {/* {touched.items?.[index]?.itemCode &&
                            errors.items?.[index]?.itemCode && (
                              <div className="text-red-500 text-[0.7vw] absolute bottom-[-1vw] left-0">
                                {errors.items[index].itemCode}
                              </div>
                            )} */}
                        </div>
                      ),
                      width: "5vw",
                    },
                    {
                      title: (
                        <div className="text-[0.8vw] text-[#323232] font-semibold">
                          Item Name
                        </div>
                      ),
                      render: (_, item, index) => (
                        <div className="">
                          <Field
                            name={`items[${index}].itemName`}
                            as={Input}
                            // disabled={!isEditable(index)}
                            disabled={true}
                            onChange={(e) =>
                              setFieldValue(
                                `items[${index}].itemName`,
                                e.target.value
                              )
                            }
                            value={item.itemName}
                            className="text-[0.8vw]"
                            status={
                              touched.items?.[index]?.itemName &&
                              errors.items?.[index]?.itemName
                                ? "error"
                                : ""
                            }
                          />
                          {/* {touched.items?.[index]?.itemName &&
                            errors.items?.[index]?.itemName && (
                              <div className="text-red-500 text-[0.7vw] absolute bottom-[-1vw] left-0">
                                {errors.items[index].itemName}
                              </div>
                            )} */}
                        </div>
                      ),
                      width: "5vw",
                    },
                    {
                      title: (
                        <div className="text-[0.8vw] text-[#323232] font-semibold">
                          Quantity
                        </div>
                      ),
                      render: (_, item, index) => (
                        <div className="">
                          <Field
                            name={`items[${index}].quantity`}
                            as={Input}
                            type="number"
                            // disabled={!isEditable(index)}
                            disabled={true}
                            onChange={(e) => {
                              const quantity = parseFloat(e.target.value) || "";
                              const rate =
                                parseFloat(values.items[index].rate) || 0;
                              setFieldValue(
                                `items[${index}].quantity`,
                                quantity
                              );
                              // setFieldValue(
                              //   `items[${index}].netAmount`,
                              //   quantity * rate
                              // );
                            }}
                            value={item.quantity}
                            className="text-[0.8vw]"
                            status={
                              touched.items?.[index]?.quantity &&
                              errors.items?.[index]?.quantity
                                ? "error"
                                : ""
                            }
                          />
                          {/* {touched.items?.[index]?.quantity &&
                            errors.items?.[index]?.quantity && (
                              <div className="text-red-500 text-[0.7vw] absolute bottom-[-1vw] left-0">
                                {errors.items[index].quantity}
                              </div>
                            )} */}
                        </div>
                      ),
                      width: "5vw",
                    },
                    {
                      title: (
                        <div className="text-[0.8vw] text-[#323232] font-semibold">
                          Accepted(Qty)
                        </div>
                      ),
                      render: (_, item, index) => (
                        <div className="">
                          <Field
                            name={`items[${index}].a_quantity`}
                            as={Input}
                            type="number"
                            disabled={!isEditable(index)}
                            onChange={(e) => {
                              const a_quantity =
                                parseFloat(e.target.value) || "";
                              const rate =
                                parseFloat(values.items[index].rate) || 0;
                              setFieldValue(
                                `items[${index}].a_quantity`,
                                a_quantity
                              );
                              setFieldValue(
                                `items[${index}].netAmount`,
                                a_quantity * rate
                              );
                            }}
                            value={item.a_quantity}
                            className="text-[0.8vw]"
                            status={
                              touched.items?.[index]?.a_quantity &&
                              errors.items?.[index]?.a_quantity
                                ? "error"
                                : ""
                            }
                          />
                          {/* {touched.items?.[index]?.a_quantity &&
                            errors.items?.[index]?.a_quantity && (
                              <div className="text-red-500 text-[0.7vw] absolute bottom-[-1.5vw] left-0 w-[15vw]">
                                {errors.items[index].a_quantity}
                              </div>
                            )} */}
                        </div>
                      ),
                      width: "5vw",
                    },
                    {
                      title: (
                        <div className="text-[0.8vw] text-[#323232] font-semibold">
                          Rate
                        </div>
                      ),
                      render: (_, item, index) => (
                        <div className="">
                          <Field
                            name={`items[${index}].rate`}
                            as={Input}
                            type="number"
                            // disabled={!isEditable(index)}
                            disabled={true}
                            onChange={(e) => {
                              const rate = parseFloat(e.target.value) || "";
                              const a_quantity =
                                parseFloat(values.items[index].a_quantity) || 0;
                              setFieldValue(`items[${index}].rate`, rate);
                              setFieldValue(
                                `items[${index}].netAmount`,
                                a_quantity * rate
                              );
                            }}
                            value={item.rate}
                            className="text-[0.8vw]"
                            status={
                              touched.items?.[index]?.rate &&
                              errors.items?.[index]?.rate
                                ? "error"
                                : ""
                            }
                          />
                          {/* {touched.items?.[index]?.rate &&
                            errors.items?.[index]?.rate && (
                              <div className="text-red-500 text-[0.7vw] absolute bottom-[-1vw] left-0">
                                {errors.items[index].rate}
                              </div>
                            )} */}
                        </div>
                      ),
                      width: "4vw",
                    },
                    {
                      title: (
                        <div className="text-[0.8vw] text-[#323232] font-semibold">
                          Net Amount
                        </div>
                      ),
                      render: (_, item, index) => (
                        <Field
                          name={`items[${index}].netAmount`}
                          as={Input}
                          disabled={true}
                          value={item?.netAmount?.toFixed(2)}
                          className="text-[0.8vw]"
                        />
                      ),
                      width: "6vw",
                    },
                    {
                      title: (
                        <div className="text-[0.8vw] text-[#323232] font-semibold">
                          Actions
                        </div>
                      ),
                      align: "center",
                      render: (_, __, index) => {
                        const editable = isEditable(index);
                        return (
                          <div className="flex gap-2 items-center justify-center">
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
                                      fontSize: "1.2em",
                                    }}
                                  />
                                </button>
                              </Tooltip>
                            )}
                            {/* Removed Delete Button */}
                          </div>
                        );
                      },
                      width: "1vw",
                    },
                  ]}
                />
                {/* <div className="text-red-500 text-[0.7vw] mt-2 text-center absolute bottom-[-0.7vw] ">
                  {touched.items && typeof errors.items === "string" && (
                    <div className="error ">{errors.items}</div>
                  )}
                </div> */}

                <div
                  className="text-red-500 text-[0.7vw] text-center absolute bottom-[
                5vw] bg-[#FF0000 ]"
                >
                  {touched.items && typeof errors.items === "string" && (
                    <div className="error ">{errors.items}</div>
                  )}
                </div>
              </div>

              {/* Removed Add Row Button */}
            </>
          )}
        </FieldArray>
      </ConfigProvider>
    </div>
  );
};
