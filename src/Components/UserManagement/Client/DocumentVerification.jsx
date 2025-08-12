import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Formik, Form } from "formik";
import DocumentsView from "./DocumentsView";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  getClientDetailsById,
  SubmitClientDoc,
} from "../../../API/UserManagement/Client/ClientDetails";
import * as Yup from "yup";
import { TbUpload } from "react-icons/tb";
import PendingApproval from "./PendingApproval";

const FILE_SIZE = 1024 * 1024 * 5; // 5MB
const SUPPORTED_FORMATS = [
  "application/pdf",
  "image/jpg",
  "image/jpeg",
  "image/png",
];

const validationSchema = Yup.object({
  aadhar_number: Yup.string()
    .required("Aadhaar number is required")
    .length(12, "Aadhaar number must be exactly 12 digits")
    .matches(/^\d{12}$/, "Aadhaar must be a valid 12-digit number"),
  pan_number: Yup.string()
    .required("PAN number is required")
    .length(10, "PAN number must be exactly 10 characters")
    .matches(
      /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
      "PAN must be in the format ABCDE1234F"
    ),
  aadhar_doc: Yup.mixed()
    .required("Aadhaar front page is required")
    .test("fileSize", "File too large max 5mb", (value) =>
      typeof value === "string" ? true : value && value.size <= FILE_SIZE
    )
    .test("fileFormat", "Unsupported format", (value) =>
      typeof value === "string"
        ? true
        : value && SUPPORTED_FORMATS.includes(value.type)
    ),
  pan_doc: Yup.mixed()
    .required("PAN front page is required")
    .test("fileSize", "File too large max 5mb", (value) =>
      typeof value === "string" ? true : value && value.size <= FILE_SIZE
    )
    .test("fileFormat", "Unsupported format", (value) =>
      typeof value === "string"
        ? true
        : value && SUPPORTED_FORMATS.includes(value.type)
    ),
});

export default function DocumentVerification({ clientData, userId }) {
  const [isDocView, setIsDocView] = useState(false);
  const navigation = useNavigate();
  const [isWait, setIsWait] = useState(false);

  const apiImgUrl = import.meta.env.VITE_IMAGE_URL;
  const [inputPreview, setInputPreview] = useState({
    aadharfr: null,
    panfr: null,
  });

  const handleFileChange = (event, key) => {
    const file = event?.currentTarget?.files[0];

    // Check if the file is selected and it's a valid file
    if (file) {
      // Validate if the selected file is an actual file object
      if (file instanceof File) {
        setInputPreview((prevState) => ({
          ...prevState,
          [key]: URL.createObjectURL(file), // Create object URL for valid file
        }));
      } else {
        console.error("Selected item is not a valid file.");
      }
    } else {
      console.error("No file selected.");
    }
  };

  const handleSubmit = async (values) => {
    console.log(values, "Submit employee personal");
    try {
      const response = await SubmitClientDoc(userId, values);
      console.log(response, "Submitting emp professional");
      toast.success(response.message);
      setIsWait(true);
    } catch (error) {
      console.error("Error Submitting EMP professional", error);
    }
  };

  useEffect(() => {
    setInputPreview({
      aadharfr: clientData?.Document?.aadhar_img,
      panfr: clientData?.Document?.pan_img,
    });
    console.log("clientData");
  }, [clientData]);

  return (
    <>
      <div className="flex w-full items-center justify-center">
        {!isWait ? (
          isDocView ? (
            <>
              <div className="flex flex-col w-[50vw] bg-white h-[100vh] p-[1.5vw]">
                <div>
                  <h1 className="text-[1.3vw] font-bold my-[2vw]">DOCUMENTS</h1>
                </div>
                <div>
                  <Formik
                    initialValues={{
                      aadhar_number: clientData?.Document?.aadhar_no || "",
                      pan_number: clientData?.Document?.pan_no || "",
                      aadhar_doc: clientData?.Document?.aadhar_img || null,
                      pan_doc: clientData?.Document?.pan_img || null,
                    }}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ setFieldValue, values }) => (
                      <Form>
                        <div className="grid grid-cols-2 gap-y-[1.2vw] gap-x-[4vw] mb-[1vw]">
                          <div className="flex flex-col gap-[0.5vw] relative">
                            <label className="text-[0.9vw]">
                              Aadhaar Card Number
                            </label>
                            <Field
                              type="text"
                              name="aadhar_number"
                              // onKeyPress={(e) => {
                              //   const regex = /^[a-zA-Z\s]+$/;
                              //   if (!regex.test(e.key)) {
                              //     e.preventDefault(); // Block non-letter and non-space characters
                              //   }
                              // }}
                              placeholder="Enter Aadhar Number"
                              className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                            />
                            <ErrorMessage
                              name="aadhar_number"
                              component="div"
                              className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                            />
                          </div>
                          <div className="flex flex-col gap-[0.5vw] relative">
                            <label className="text-[0.9vw]">
                              Aadhaar Card Doc
                            </label>
                            <input
                              id="aadhar_doc"
                              name="aadhar_doc"
                              type="file"
                              accept=".jpg, .jpeg, .png"
                              style={{ display: "none" }}
                              onChange={(event) => {
                                const files = Array.from(event.target.files);
                                console.log(files, "filesfiles");
                                setFieldValue(
                                  "aadhar_doc",
                                  event.currentTarget.files[0]
                                );
                                // handlePreview(files[0]);
                                handleFileChange(event, "aadharfr");
                              }}
                            />
                            <div className="relative">
                              <button
                                type="button"
                                className={`w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200`}
                                onClick={(event) => {
                                  event.preventDefault();
                                  document.getElementById("aadhar_doc").click();
                                }}
                              >
                                <span className="font-sans text-[#9ba6bbe3] text-[0.7vw]">
                                  Upload Aadhaar Doc
                                </span>
                              </button>
                              {inputPreview?.aadharfr ? (
                                inputPreview?.aadharfr?.startsWith("blob") ? (
                                  <img
                                    src={inputPreview.aadharfr}
                                    className="h-[1.5vw] w-[1.5vw] absolute cursor-zoom-in top-[.2vw] right-[.3vw]"
                                    alt="Aadhar Front"
                                    //onClick={openModal}
                                  />
                                ) : (
                                  <img
                                    src={`${apiImgUrl}${inputPreview.aadharfr}`}
                                    className="h-[1.5vw] w-[1.5vw] absolute top-[.2vw] cursor-zoom-in right-[.3vw]"
                                    alt="Aadhar Front"
                                    // onClick={openModal}
                                  />
                                )
                              ) : (
                                <TbUpload
                                  size="1.2vw"
                                  className="absolute right-[0.5vw] top-[.4vw] pointer-events-none"
                                />
                              )}
                            </div>
                            <ErrorMessage
                              name="aadhar_doc"
                              component="div"
                              className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                            />
                          </div>
                          <div className="flex flex-col gap-[0.5vw] relative">
                            <label className="text-[0.9vw]">
                              PAN Card Number
                            </label>
                            <Field
                              type="text"
                              name="pan_number"
                              onKeyPress={(e) => {
                                const regex = /^[a-zA-Z\s]+$/;
                                if (!regex.test(e.key)) {
                                  e.preventDefault(); // Block non-letter and non-space characters
                                }
                              }}
                              placeholder="Enter PAN"
                              className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                            />
                            <ErrorMessage
                              name="pan_number"
                              component="div"
                              className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                            />
                          </div>
                          <div className="flex flex-col gap-[0.5vw] relative">
                            <label className="text-[0.9vw]">
                              {" "}
                              PAN Document
                            </label>
                            <div>
                              <input
                                id="pan_doc"
                                name="pan_doc"
                                type="file"
                                accept=".jpg, .jpeg, .png"
                                style={{ display: "none" }}
                                onChange={(event) => {
                                  const files = Array.from(event.target.files);
                                  setFieldValue(
                                    "pan_doc",
                                    event.currentTarget.files[0]
                                  );
                                  handleFileChange(event, "panfr");
                                }}
                              />
                              <div className="relative">
                                <button
                                  type="button"
                                  className={`w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200`}
                                  onClick={(event) => {
                                    event.preventDefault();
                                    document.getElementById("pan_doc").click();
                                  }}
                                >
                                  <span className="font-sans text-[#9ba6bbe3] text-[0.7vw]">
                                    Upload PAN Doc
                                  </span>
                                </button>
                                {inputPreview?.panfr ? (
                                  inputPreview?.panfr?.startsWith("blob") ? (
                                    <img
                                      src={inputPreview.panfr}
                                      className="h-[1.5vw] w-[1.5vw] absolute cursor-zoom-in top-[.2vw] right-[.3vw]"
                                      alt="pan doc"
                                      //onClick={openModal}
                                    />
                                  ) : (
                                    <img
                                      src={`${apiImgUrl}${inputPreview.panfr}`}
                                      className="h-[1.5vw] w-[1.5vw] absolute cursor-zoom-in top-[.2vw] right-[.3vw]"
                                      alt="pan doc"
                                      //onClick={openModal}
                                    />
                                  )
                                ) : (
                                  <TbUpload
                                    size="1.2vw"
                                    className="absolute right-[0.5vw] top-[.4vw] pointer-events-none"
                                  />
                                )}
                              </div>
                            </div>
                            <ErrorMessage
                              name="pan_doc"
                              component="div"
                              className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                            />
                          </div>
                        </div>
                        <div className="flex col-span-2 justify-end items-end gap-[1vw] mt-[6vw]">
                          <button
                            type="submit"
                            className="bg-blue-500 text-[0.9vw] w-[6vw] h-[2vw] text-white rounded mt-2 border-[0.01vw] border-[#4C67ED] cursor-pointer"
                          >
                            SAVE
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex w-[50vw] bg-white h-[100vh]">
                <DocumentsView
                  clientData={clientData}
                  setIsDocView={setIsDocView}
                />
              </div>
            </>
          )
        ) : (
          <div className="flex w-full items-center justify-center h-[100vh]">
          <PendingApproval />
          </div>
        )}
      </div>
    </>
  );
}
