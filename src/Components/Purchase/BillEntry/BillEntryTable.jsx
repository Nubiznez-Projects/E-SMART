import {
  ConfigProvider,
  Input,
  Table,
  Tooltip,
  DatePicker,
  message,
  Modal,
} from "antd";
import { Field, FieldArray, useFormikContext } from "formik";
import React, { useEffect, useState, useCallback } from "react"; // Import useCallback
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdDelete, MdOutlineEdit } from "react-icons/md";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { toast } from "react-toastify";

export const BillEntryTable = ({ setTotalNetAmount }) => {
  const [editableRowIndex, setEditableRowIndex] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImagePreview, setCurrentImagePreview] = useState(null);

  const {
    values,
    setFieldValue,
    errors,
    touched,
    validateForm,
    setFieldTouched,
  } = useFormikContext();

  // Helper function to create a new empty item
  const createEmptyItem = () => ({
    ItemCategory: "",
    Date: "",
    Amount: "",
    UploadBill: "",
  });

  // Initialize items array and set initial row as editable
  useEffect(() => {
    if (!values.items || values.items.length === 0) {
      setFieldValue("items", [createEmptyItem()]);
      setEditableRowIndex(0); // Set the first row as editable
    }
  }, [values.items, setFieldValue]);

  const calculateTotalNetAmount = useCallback(
    (items) => {
      const total = items?.reduce(
        (sum, item) => sum + (parseFloat(item.Amount) || 0),
        0
      );
      setTotalNetAmount(total);
    },
    [setTotalNetAmount]
  );

  // Recalculate total net amount whenever items change
  useEffect(() => {
    calculateTotalNetAmount(values.items || []);
  }, [values.items, calculateTotalNetAmount]);

  const isEditable = (index) => editableRowIndex === index;

  const handleEdit = (index) => {
    // Only allow editing if no other row is currently being edited
    if (editableRowIndex === null) {
      setEditableRowIndex(index);
    } else {
      message.warning("Please save the current editable row first.");
    }
  };

  const handleSave = async (index) => {
    const formErrors = await validateForm();

    const currentRowErrors =
      formErrors.items && Array.isArray(formErrors.items)
        ? formErrors.items[index]
        : null;

    const fieldNamesToTouch = [
      `items[${index}].ItemCategory`,
      `items[${index}].Date`,
      `items[${index}].Amount`,
      `items[${index}].UploadBill`,
    ];

    for (const fieldName of fieldNamesToTouch) {
      setFieldTouched(fieldName, true, false);
    }

    if (currentRowErrors && Object.keys(currentRowErrors).length > 0) {
      message.error("Please fill all required fields in the current row.");
      return;
    }

    setEditableRowIndex(null);
    message.success(`Row ${index + 1} saved successfully!`);
  };

  const handleImageUpload = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFieldValue(`items[${index}].UploadBill`, e.target.result); // Store base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const showImageModal = (imageUrl) => {
    setCurrentImagePreview(imageUrl);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setCurrentImagePreview(null);
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
                  scroll={{ x: "100%" }}
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
                          Item Category
                        </div>
                      ),
                      render: (_, item, index) => (
                        <div className="relative">
                          <Field
                            name={`items[${index}].ItemCategory`}
                            type="text"
                            disabled={!isEditable(index)}
                            onChange={(e) =>
                              setFieldValue(
                                `items[${index}].ItemCategory`,
                                e.target.value
                              )
                            }
                            value={item.ItemCategory}
                            className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw]"
                          />
                          {touched.items?.[index]?.ItemCategory &&
                            errors.items?.[index]?.ItemCategory && (
                              <div className="text-red-500 text-[0.7vw] absolute top-[calc(100%+0.2vw)] left-0 w-full z-10">
                                {errors.items[index].ItemCategory}
                              </div>
                            )}
                        </div>
                      ),
                      width: "8vw",
                    },
                    {
                      title: (
                        <div className="text-[0.8vw] text-[#323232] font-semibold">
                          Date
                        </div>
                      ),
                      render: (_, item, index) => (
                        <div className="relative">
                          <Field
                            name={`items[${index}].Date`}
                            type="date"
                            disabled={!isEditable(index)}
                            onChange={(e) =>
                              setFieldValue(
                                `items[${index}].Date`,
                                e.target.value
                              )
                            }
                            value={item.Date}
                            className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw]"
                          />
                          {touched.items?.[index]?.Date &&
                            errors.items?.[index]?.Date && (
                              <div className="text-red-500 text-[0.7vw] absolute top-[calc(100%+0.2vw)] left-0 w-full z-10">
                                {errors.items[index].Date}
                              </div>
                            )}
                        </div>
                      ),
                      width: "8vw",
                    },
                    {
                      title: (
                        <div className="text-[0.8vw] text-[#323232] font-semibold">
                          Amount
                        </div>
                      ),
                      render: (_, item, index) => (
                        <div className="relative">
                          <Field
                            name={`items[${index}].Amount`}
                            type="number"
                            disabled={!isEditable(index)}
                            onChange={(e) => {
                              const amount = parseFloat(e.target.value) || "";
                              setFieldValue(`items[${index}].Amount`, amount);
                            }}
                            value={item.Amount}
                            className={`w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] ${
                              touched.items?.[index]?.Amount &&
                              errors.items?.[index]?.Amount
                                ? "border-red-500"
                                : ""
                            }`}
                          />
                          {touched.items?.[index]?.Amount &&
                            errors.items?.[index]?.Amount && (
                              <div className="text-red-500 text-[0.7vw] absolute top-[calc(100%+0.2vw)] left-0 w-full z-10">
                                {errors.items[index].Amount}
                              </div>
                            )}
                        </div>
                      ),
                      width: "6vw",
                    },
                    {
                      title: (
                        <div className="text-[0.8vw] text-[#323232] font-semibold">
                          Upload Bill
                        </div>
                      ),
                      render: (_, item, index) => (
                        <div className="relative flex items-center justify-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, index)}
                            disabled={!isEditable(index)}
                            style={{ display: "none" }}
                            id={`upload-bill-${index}`}
                          />
                          <label
                            htmlFor={`upload-bill-${index}`}
                            className={`cursor-pointer text-[0.8vw] ${
                              isEditable(index)
                                ? "text-blue-600 underline"
                                : "text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            {item.UploadBill ? "Change Bill" : "Upload Bill"}
                          </label>
                          {item.UploadBill && (
                            <Tooltip title="View Bill">
                              <img
                                src={item.UploadBill}
                                alt="Bill Preview"
                                className="w-8 h-8 object-cover border border-gray-300 cursor-pointer"
                                onClick={() => showImageModal(item.UploadBill)}
                              />
                            </Tooltip>
                          )}
                          {touched.items?.[index]?.UploadBill &&
                            errors.items?.[index]?.UploadBill && (
                              <div className="text-red-500 text-[0.7vw] absolute top-[calc(100%+0.2vw)] left-0 w-full z-10">
                                {errors.items[index].UploadBill}
                              </div>
                            )}
                        </div>
                      ),
                      width: "10vw",
                    },
                    {
                      title: (
                        <div className="text-[0.8vw] text-[#323232] font-semibold">
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
                                      fontSize: "1.2em",
                                    }}
                                  />
                                </button>
                              </Tooltip>
                            )}
                            <Tooltip title="Delete Row">
                              <button
                                type="button"
                                onClick={() => {
                                  remove(index);
                                  // If the last row was deleted, add a new one and make it editable
                                  if (values.items.length === 1 && index === 0) {
                                    setFieldValue("items", [createEmptyItem()]);
                                    setEditableRowIndex(0);
                                  } else if (editableRowIndex === index) {
                                    setEditableRowIndex(null); // Deselect if deleted row was active
                                  } else if (editableRowIndex > index) {
                                      setEditableRowIndex(prev => prev -1); // Adjust index if row before it was deleted
                                  }
                                }}
                                className="p-2 border-none bg-transparent cursor-pointer"
                              >
                                <MdDelete
                                  style={{
                                    color: "red",
                                    fontSize: "1.2em",
                                  }}
                                />
                              </button>
                            </Tooltip>
                          </div>
                        );
                      },
                      width: "4vw",
                    },
                  ]}
                />

                {touched.items && typeof errors.items === "string" && (
                  <div className="text-red-500 text-[0.7vw] mt-2 text-center w-full">
                    {errors.items}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  // Validate the last row before adding a new one
                  const lastRowIndex = values.items.length - 1;
                  if (lastRowIndex >= 0 && editableRowIndex === lastRowIndex) {
                    toast.warning("Please save the current row before adding a new one.");
                    return;
                  }
                  
                  push(createEmptyItem());
                  setEditableRowIndex(values.items.length); // Set the newly added row as editable
                }}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-gray-400 rounded-md text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors duration-200"
              >
                <PlusOutlined />
                Add New Row
              </button>
            </>
          )}
        </FieldArray>
      </ConfigProvider>

      <Modal
        open={isModalVisible}
        title="Bill Preview"
        onCancel={handleModalClose}
        footer={null}
        width={"60vw"}
        centered
      >
        {currentImagePreview && (
          <img
            src={currentImagePreview}
            alt="Bill Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "80vh",
              display: "block",
              margin: "auto",
            }}
          />
        )}
      </Modal>
    </div>
  );
};