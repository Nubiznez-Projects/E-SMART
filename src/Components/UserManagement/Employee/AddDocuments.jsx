import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Formik, Form } from "formik";
import { Checkbox } from "antd";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { TbUpload } from "react-icons/tb";
import Modal from "../../Common/Modal/Modal";
import { CreateEmployeeDoc } from "../../../API/UserManagement/Employee/Employee";
import { useUserContext } from "../../../Context/UserContext";
import { useDispatch } from "react-redux";
import { fetchEmployee } from "../../../Redux/Slice/UserManagement/EmployeeThunk";

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
  aadhar_bk_doc: Yup.mixed()
    .required("Aadhaar back page is required")
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
  pan_bk_doc: Yup.mixed()
    .required("PAN back page is required")
    .test("fileSize", "File too large max 5mb", (value) =>
      typeof value === "string" ? true : value && value.size <= FILE_SIZE
    )
    .test("fileFormat", "Unsupported format", (value) =>
      typeof value === "string"
        ? true
        : value && SUPPORTED_FORMATS.includes(value.type)
    ),
  qualification: Yup.mixed()
    .required("Qualification doc is required")
    .test("fileSize", "File too large max 5mb", (value) =>
      typeof value === "string" ? true : value && value.size <= FILE_SIZE
    )
    .test("fileFormat", "Unsupported format", (value) =>
      typeof value === "string"
        ? true
        : value && SUPPORTED_FORMATS.includes(value.type)
    ),
  offerletter: Yup.mixed()
    .required("Offer letter doc is required")
    .test("fileSize", "File too large max 5mb", (value) =>
      typeof value === "string" ? true : value && value.size <= FILE_SIZE
    )
    .test("fileFormat", "Unsupported format", (value) =>
      typeof value === "string"
        ? true
        : value && SUPPORTED_FORMATS.includes(value.type)
    ),
});

export default function AddDocuments({ handleTab }) {
  const { empId, empData, action } = useUserContext();
  const [showNextButton, setShowNextButton] = useState(false);
  const [inputPreview, setInputPreview] = useState({
    aadharfr: null,
    aadharbk: null,
    panfr: null,
    panbk: null,
    qualification: null,
    offerletter: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const dispatch = useDispatch();
  const apiImgUrl = import.meta.env.VITE_IMAGE_URL;

  const openModal = (event) => {
    // Get the image source (src) using `getElementById`
    const imageSrc = event.target.getAttribute("src");

    // Set the modal image source
    setModalImage(imageSrc);

    // Open the modal
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

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
      const response = await CreateEmployeeDoc(empId, values);
      console.log(response, "Submitting emp professional");
      setShowNextButton(true);
      dispatch(fetchEmployee());
      toast.success(response.message);
    } catch (error) {
      console.error("Error Submitting EMP professional", error);
    }
  };

  useEffect(() => {
    setInputPreview({
      aadharfr: empData?.professional?.aadhar_card_front_doc,
      aadharbk: empData?.professional?.aadhar_card_back_doc,
      panfr: empData?.professional?.pan_card_front_doc,
      panbk: empData?.professional?.pan_card_back_doc,
      qualification: empData?.professional?.qualification_doc,
      offerletter: empData?.professional?.offer_letter_doc,
    });
    console.log("empData");
  }, [empData]);

  return (
    <>
      <div className="flex w-full justify-center items-center mt-[4vw] mx-[4vw]">
        <Formik
          initialValues={{
            aadhar_number: empData?.professional?.aadhar_card_number || "",
            pan_number: empData?.professional?.pan_card_number || "",
            aadhar_doc: empData?.professional?.aadhar_card_front_doc || null,
            aadhar_bk_doc: empData?.professional?.aadhar_card_back_doc || null,
            pan_doc: empData?.professional?.pan_card_front_doc || null,
            pan_bk_doc: empData?.professional?.pan_card_back_doc || null,
            qualification: empData?.professional?.qualification_doc || null,
            offerletter: empData?.professional?.offer_letter_doc || null,
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form className="w-full">
              <div className="grid grid-cols-2 gap-y-[1.2vw] gap-x-[4vw] mb-[1vw]">
                <div className="flex flex-col gap-[0.5vw] relative">
                  <label className="text-[0.9vw]">Aadhaar Card Number</label>
                  <Field
                    type="text"
                    disabled={action === "view"}
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
                  <label className="text-[0.9vw]">PAN Card Number</label>
                  <Field
                    type="text"
                    disabled={action === "view"}
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
                  <label className="text-[0.9vw]">Aadhaar Card Front Doc</label>
                  <input
                    disabled={action === "view"}
                    id="aadhar_doc"
                    name="aadhar_doc"
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    style={{ display: "none" }}
                    onChange={(event) => {
                      const files = Array.from(event.target.files);
                      console.log(files, "filesfiles");
                      setFieldValue("aadhar_doc", event.currentTarget.files[0]);
                      // handlePreview(files[0]);
                      handleFileChange(event, "aadharfr");
                    }}
                  />
                  <div className="relative">
                    <button
                      disabled={action === "view"}
                      type="button"
                      className={`w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200`}
                      onClick={(event) => {
                        event.preventDefault();
                        document.getElementById("aadhar_doc").click();
                      }}
                    >
                      <span className="font-sans text-[#9ba6bbe3] text-[0.7vw]">
                        Upload Aadhaar Front Doc
                      </span>
                    </button>
                    {inputPreview?.aadharfr ? (
                      inputPreview?.aadharfr?.startsWith("blob") ? (
                        <img
                          src={inputPreview.aadharfr}
                          className="h-[1.5vw] w-[1.5vw] absolute cursor-zoom-in top-[.2vw] right-[.3vw]"
                          alt="Aadhar Front"
                          onClick={openModal}
                        />
                      ) : (
                        <img
                          src={`${apiImgUrl}${inputPreview.aadharfr}`}
                          className="h-[1.5vw] w-[1.5vw] absolute top-[.2vw] cursor-zoom-in right-[.3vw]"
                          alt="Aadhar Front"
                          onClick={openModal}
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
                  <label className="text-[0.9vw]">Aadhaar Card Back Doc</label>
                  <input
                    id="aadhar_bk_doc"
                    disabled={action === "view"}
                    name="aadhar_bk_doc"
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    style={{ display: "none" }}
                    onChange={(event) => {
                      const files = Array.from(event.target.files);
                      console.log(files, "filesfiles");
                      setFieldValue(
                        "aadhar_bk_doc",
                        event.currentTarget.files[0]
                      );
                      // handlePreview(files[0]);
                      handleFileChange(event, "aadharbk");
                    }}
                  />
                  <div className="relative">
                    <button
                      disabled={action === "view"}
                      type="button"
                      className={`w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200`}
                      onClick={(event) => {
                        event.preventDefault();
                        document.getElementById("aadhar_bk_doc").click();
                      }}
                    >
                      <span className="font-sans text-[#9ba6bbe3] text-[0.7vw]">
                        Upload Aadhaar Back Doc
                      </span>
                    </button>
                    {inputPreview?.aadharbk ? (
                      inputPreview?.aadharbk?.startsWith("blob") ? (
                        <img
                          src={inputPreview.aadharbk}
                          className="h-[1.5vw] w-[1.5vw] absolute cursor-zoom-in top-[.2vw] right-[.3vw]"
                          alt="Aadhar Front"
                          onClick={openModal}
                        />
                      ) : (
                        <img
                          src={`${apiImgUrl}${inputPreview.aadharbk}`}
                          className="h-[1.5vw] w-[1.5vw] absolute cursor-zoom-in top-[.2vw] right-[.3vw]"
                          alt="Aadhar Front"
                          onClick={openModal}
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
                    name="aadhar_bk_doc"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.5vw] relative">
                  <label className="text-[0.9vw]"> PAN Front Document</label>
                  <div>
                    <input
                      disabled={action === "view"}
                      id="pan_doc"
                      name="pan_doc"
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      style={{ display: "none" }}
                      onChange={(event) => {
                        const files = Array.from(event.target.files);
                        setFieldValue("pan_doc", event.currentTarget.files[0]);
                        handleFileChange(event, "panfr");
                      }}
                    />
                    <div className="relative">
                      <button
                        disabled={action === "view"}
                        type="button"
                        className={`w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200`}
                        onClick={(event) => {
                          event.preventDefault();
                          document.getElementById("pan_doc").click();
                        }}
                      >
                        <span className="font-sans text-[#9ba6bbe3] text-[0.7vw]">
                          Upload PAN Front Doc
                        </span>
                      </button>
                      {inputPreview?.panfr ? (
                        inputPreview?.panfr?.startsWith("blob") ? (
                          <img
                            src={inputPreview.panfr}
                            className="h-[1.5vw] w-[1.5vw] absolute cursor-zoom-in top-[.2vw] right-[.3vw]"
                            alt="pan doc"
                            onClick={openModal}
                          />
                        ) : (
                          <img
                            src={`${apiImgUrl}${inputPreview.panfr}`}
                            className="h-[1.5vw] w-[1.5vw] absolute cursor-zoom-in top-[.2vw] right-[.3vw]"
                            alt="pan doc"
                            onClick={openModal}
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
                <div className="flex flex-col gap-[0.5vw] relative">
                  <label className="text-[0.9vw]"> PAN Back Document</label>
                  <input
                    id="pan_bk_doc"
                    disabled={action === "view"}
                    name="pan_bk_doc"
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    style={{ display: "none" }}
                    onChange={(event) => {
                      setFieldValue("pan_bk_doc", event.currentTarget.files[0]);
                      handleFileChange(event, "panbk");
                    }}
                  />
                  <div className="relative">
                    <button
                      type="button"
                      disabled={action === "view"}
                      className={`w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200`}
                      onClick={(event) => {
                        event.preventDefault();
                        document.getElementById("pan_bk_doc").click();
                      }}
                    >
                      <span className="font-sans text-[#9ba6bbe3] text-[0.7vw]">
                        Upload PAN Back Doc
                      </span>
                    </button>
                    {inputPreview?.panbk ? (
                      inputPreview?.panbk?.startsWith("blob") ? (
                        <img
                          src={inputPreview.panbk}
                          className="h-[1.5vw] w-[1.5vw] absolute cursor-zoom-in top-[.2vw] right-[.3vw]"
                          alt="pan doc"
                          onClick={openModal}
                        />
                      ) : (
                        <img
                          src={`${apiImgUrl}${inputPreview.panbk}`}
                          className="h-[1.5vw] w-[1.5vw] absolute cursor-zoom-in top-[.2vw] right-[.3vw]"
                          alt="pan doc"
                          onClick={openModal}
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
                    name="pan_bk_doc"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.5vw] relative">
                  <label className="text-[0.9vw]">Qualification Doc</label>
                  <div>
                    <input
                      id="qualification"
                      disabled={action === "view"}
                      name="qualification"
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      style={{ display: "none" }}
                      onChange={(event) => {
                        const files = Array.from(event.target.files);
                        console.log(files, "filesfiles");
                        setFieldValue(
                          "qualification",
                          event.currentTarget.files[0]
                        );
                        handleFileChange(event, "qualification");
                      }}
                    />
                    <div className="relative">
                      <button
                        type="button"
                        disabled={action === "view"}
                        className={`w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200`}
                        onClick={(event) => {
                          event.preventDefault();
                          document.getElementById("qualification").click();
                        }}
                      >
                        <span className="font-sans text-[#9ba6bbe3] text-[0.7vw]">
                          Upload Qualification Doc
                        </span>
                      </button>
                      {inputPreview?.qualification ? (
                        inputPreview?.qualification?.startsWith("blob") ? (
                          <img
                            src={inputPreview.qualification}
                            className="h-[1.5vw] w-[1.5vw] absolute cursor-zoom-in top-[.2vw] right-[.3vw]"
                            alt="Aadhar Front"
                            onClick={openModal}
                          />
                        ) : (
                          <img
                            src={`${apiImgUrl}${inputPreview.qualification}`}
                            className="h-[1.5vw] w-[1.5vw] absolute cursor-zoom-in top-[.2vw] right-[.3vw]"
                            alt="Aadhar Front"
                            onClick={openModal}
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
                    name="qualification"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.5vw] relative">
                  <label className="text-[0.9vw]"> Offer Letter Doc</label>
                  <div>
                    <input
                      id="offerletter"
                      disabled={action === "view"}
                      name="offerletter"
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      style={{ display: "none" }}
                      onChange={(event) => {
                        const files = Array.from(event.target.files);
                        console.log(files, "filesfiles");
                        setFieldValue(
                          "offerletter",
                          event.currentTarget.files[0]
                        );
                        handleFileChange(event, "offerletter");
                      }}
                    />
                    <div className="relative">
                      <button
                        type="button"
                        disabled={action === "view"}
                        className={`w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200`}
                        onClick={(event) => {
                          event.preventDefault();
                          document.getElementById("offerletter").click();
                        }}
                      >
                        <span className="font-sans text-[#9ba6bbe3] text-[0.7vw]">
                          Upload Offer Letter Doc
                        </span>
                      </button>
                      {inputPreview?.offerletter ? (
                        inputPreview?.offerletter?.startsWith("blob") ? (
                          <img
                            src={inputPreview.offerletter}
                            className="h-[1.5vw] w-[1.5vw] absolute cursor-zoom-in top-[.2vw] right-[.3vw]"
                            alt="Aadhar Front"
                            onClick={openModal}
                          />
                        ) : (
                          <img
                            src={`${apiImgUrl}${inputPreview.offerletter}`}
                            className="h-[1.5vw] w-[1.5vw] absolute cursor-zoom-in top-[.2vw] right-[.3vw]"
                            alt="Aadhar Front"
                            onClick={openModal}
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
                    name="offerletter"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>
              </div>
              {action !== "view" && (
                <div className="flex col-span-2 justify-end items-end gap-[1vw] mt-[6vw]">
                          {action === "add" && 
                  <button
                    type="button"
                    className="text-[#4C67ED] text-[0.9vw] w-[6vw] h-[2vw] rounded mt-2 border-[0.01vw] border-[#4C67ED] cursor-pointer"
                  >
                    CANCEL
                  </button>
                   }   
                    <button
                      type="submit"
                      className="bg-blue-500 text-[0.9vw] w-[6vw] h-[2vw] text-white rounded mt-2 border-[0.01vw] border-[#4C67ED] cursor-pointer"
                    >
                      SAVE
                    </button>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
      <Modal
        visible={isModalOpen}
        onCancel={closeModal}
        footer={null}
        centered
        // width="35vw"
        bodyStyle={{ padding: 0 }}
        destroyOnClose={true} // Ensures modal is destroyed on close
      >
        {/* Display the image in the modal */}
        {modalImage && (
          <img
            src={modalImage}
            alt="Documents Preview"
            style={{ width: "100%" }}
            className=""
          />
        )}
      </Modal>
    </>
  );
}
