import { Modal } from "antd";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { SubmitGstDetails } from "../../../API/UserManagement/Client/ClientDetails";
import { useUserContext } from "../../../Context/UserContext";

const IMG_URL = import.meta.env.VITE_IMAGE_URL;

const validationSchema = Yup.object().shape({
  gstin: Yup.string().required("GSTIN is required"),
  stateCode: Yup.string().required("State Code is required"),
  state: Yup.string().required("State is required"),
  HeadOffice: Yup.string().required("Head Office is required"),
  aggregate_turnover_exceeded: Yup.string().required("Please select an option"),
  gstfile: Yup.mixed()
    .test("required", "A file is required", function (value) {
      return (
        (this.originalValue && typeof this.originalValue === "string") || value
      );
    })
    .test("fileType", "Unsupported File Format", (value) => {
      // Only validate file type if a file object is present (not a URL string)
      if (value && typeof value !== "string") {
        return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
      }
      return true; // If it's a URL or no file, don't apply this test
    })
    .test("fileSize", "File too large (max 2MB)", (value) => {
      // Only validate file size if a file object is present (not a URL string)
      if (value && typeof value !== "string") {
        return value.size <= 2000000;
      }
      return true; // If it's a URL or no file, don't apply this test
    }),
});

export const AddGstDetails = ({
  clientId,
  setClientID,
  clientData,
  setClientData,
  setOpenModal,
  fetchClientID,
}) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");
  const { action } = useUserContext();

  console.log(previewImage, "imagae_url");
  const handleSubmit = async (values) => {
    try {
      const response = await SubmitGstDetails(values, clientId);
      setOpenModal(false);
      console.log("Submitted:", response);
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  const handleFileChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    setFieldValue("gstfile", file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const showModal = (imageSrc) => {
    setModalImageSrc(imageSrc);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setModalImageSrc("");
  };

  useEffect(() => {
    if (clientId) {
      fetchClientID();
    }
  }, [clientId]);

  // Initialize previewImage with existing URL if available
  useEffect(() => {
    if (clientData?.gst?.upload_gst) {
      setPreviewImage(`${IMG_URL}${clientData.gst.upload_gst}`);
    } else {
      setPreviewImage(null); // Clear preview if no existing image
    }
  }, [clientData?.gst?.upload_gst]);

  return (
    <div className="w-full px-[2vw]">
      <Formik
        initialValues={{
          gstin: clientData?.gst?.gstin || "",
          stateCode: clientData?.gst?.state_code_number || "",
          state: clientData?.gst?.state_name || "",
          HeadOffice: clientData?.gst?.head_office || "",
          gstfile: clientData?.gst?.upload_gst || "",
          aggregate_turnover_exceeded:
            clientData?.gst?.aggregate_turnover_exceeded === true
              ? "yes"
              : clientData?.gst?.aggregate_turnover_exceeded === false
              ? "no"
              : "",
        }}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-[2vw] mt-[2vw]">
              {/* GSTIN */}
              <div>
                <label className="block text-[0.9vw] text-[#323232] font-semibold">
                  GSTIN<span className="text-red-600 pl-[0.2vw]">*</span>
                </label>
                <div className="relative">
                  <Field
                    type="text"
                    name="gstin"
                    disabled={action === "view"}
                    placeholder="Enter GSTIN"
                    className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                  />
                  <ErrorMessage
                    name="gstin"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                  />
                </div>
              </div>

              {/* State Code */}
              <div>
                <label className="block text-[0.9vw] text-[#323232] font-semibold">
                  State Code<span className="text-red-600 pl-[0.2vw]">*</span>
                </label>
                <div className="relative">
                  <Field
                    type="text"
                    name="stateCode"
                    placeholder="Enter State Code"
                    disabled={action === "view"}
                    className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                  />
                  <ErrorMessage
                    name="stateCode"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                  />
                </div>
              </div>

              {/* Head Office */}
              <div>
                <label className="block text-[0.9vw] text-[#323232] font-semibold">
                  Head Office<span className="text-red-600 pl-[0.2vw]">*</span>
                </label>
                <div className="relative">
                  <Field
                    type="text"
                    name="HeadOffice"
                    disabled={action === "view"}
                    placeholder="Enter Head Office Location"
                    className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                  />
                  <ErrorMessage
                    name="HeadOffice"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                  />
                </div>
              </div>

              {/* State */}
              <div>
                <label className="block text-[0.9vw] text-[#323232] font-semibold">
                  State<span className="text-red-600 pl-[0.2vw]">*</span>
                </label>
                <div className="relative">
                  <Field
                    type="text"
                    name="state"
                    disabled={action === "view"}
                    placeholder="Enter State"
                    className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                  />
                  <ErrorMessage
                    name="state"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                  />
                </div>
              </div>

              {/* Aggregate Turnover */}
              <div className="col-span-2">
                <label className="block text-[0.9vw] text-[#323232] font-semibold mb-[0.5vw]">
                  Aggregate Turnover (PAN India Total)
                  <span className="text-red-600 pl-[0.2vw]">*</span>
                </label>
                <div className="flex flex-col gap-[0.5vw] pl-[0.5vw]">
                  <label className="text-[0.9vw] flex items-center gap-[0.5vw]">
                    <Field
                      type="radio"
                      name="aggregate_turnover_exceeded"
                      value="yes"
                      disabled={action === "view"}
                      className="w-[1vw] h-[1vw]"
                    />
                    My Aggregate Turnover has Exceeded 40 lakhs
                  </label>
                  <label className="text-[0.9vw] flex items-center gap-[0.5vw]">
                    <Field
                      type="radio"
                      name="aggregate_turnover_exceeded"
                      value="no"
                      disabled={action === "view"}
                      className="w-[1vw] h-[1vw]"
                    />
                    My Aggregate Turnover has not Exceeded 40 lakhs
                  </label>
                </div>
                <ErrorMessage
                  name="aggregate_turnover_exceeded"
                  component="div"
                  className="text-red-500 text-[0.7vw] pl-[0.5vw] mt-[0.2vw]"
                />
              </div>

              {/* GST File Upload */}
              <div>
                <label className="block text-[0.9vw] text-[#323232] font-semibold">
                  GST File<span className="text-red-600 pl-[0.2vw]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="gstfile"
                    disabled={action === "view"}
                    onChange={(event) => handleFileChange(event, setFieldValue)}
                    className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                  />
                  <ErrorMessage
                    name="gstfile"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                  />
                </div>

                {previewImage && (
                  <div className="mt-4">
                    <p className="text-[0.9vw] mb-2">Image Preview:</p>
                    <img
                      src={
                        `${IMG_URL}${clientData?.gst?.upload_gst}` ||
                        previewImage
                      }
                      alt="Preview"
                      className="max-w-full h-auto max-h-[10vw] border border-gray-300 rounded cursor-pointer"
                      onClick={() => showModal(previewImage)}
                    />
                  </div>
                )}
              </div>
            </div>

            {action === "view" ? null : (
              <div className="flex justify-end w-full gap-[1vw] mt-[2vw]">
                <button
                  type="button"
                  className="h-[2.5vw] w-[6vw] text-[0.95vw] rounded-[0.3vw] font-semibold border-[0.1vw] border-[#4C67ED] cursor-pointer hover:bg-[#e8edfc42]"
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-[2.5vw] w-[6vw] text-[0.95vw] rounded-[0.3vw] font-medium border-[0.1vw] border-[#4C67ED] bg-[#4C67ED] text-white cursor-pointer hover:bg-[#3b50c2]"
                >
                  {action === "edit" ? "Save" : "Next"}
                </button>
              </div>
            )}
          </Form>
        )}
      </Formik>

      {/* Image Modal */}
      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        centered
        width="50%"
      >
        <img src={modalImageSrc} alt="Full Size" style={{ width: "100%" }} />
      </Modal>
    </div>
  );
};
