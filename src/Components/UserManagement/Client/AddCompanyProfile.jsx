import { Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import {
  getClientDetailsById,
  SubmitClientDetails,
} from "../../../API/UserManagement/Client/ClientDetails";
import { useDispatch } from "react-redux";
import { fetchClient } from "../../../Redux/Slice/UserManagement/ClientThunk";
import { useUserContext } from "../../../Context/UserContext";


const IMG_URL = import.meta.env.VITE_IMAGE_URL;
export const AddCompanyProfile = ({
  setHeaderTab,
  clientId,
  setClientID,
  clientData,
  setClientData,
  fetchClientID,
  setOpenModal,
}) => {
  const dispatch = useDispatch();

  const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const { action } = useUserContext();

  const constitutionOptions = [
    { value: "Sole Proprietorship" },
    { value: "Partnership" },
    { value: "Limited Liability Partnership (LLP)" },
    { value: "Private Limited Company" },
    { value: "Public Limited Company" },
    { value: "Hindu Undivided Family (HUF)" },
    { value: "Co-operative Society" },
    { value: "Trust" },
  ];

  const businessOptions = [
    { value: "Information Technology (IT)" },
    { value: "Finance" },
    { value: "Real Estate" },
    { value: "Manufacturing" },
    { value: "Trading" },
    { value: "Services" },
    { value: "Retail" },
    { value: "E-commerce" },
    { value: "Agriculture" },
    { value: "Education" },
    { value: "Healthcare" },
    { value: "Construction" },
    { value: "Hospitality" },
    { value: "Logistics" },
    { value: "Media and Entertainment" },
  ];

    const planTypes = [
    { value: "Monthly" },
    { value: "Quarterly (3 Months)" },
    { value: "Semi-Annual (6 Months)" },
    { value: "Annual (1 Year)" },
  ];

    const validationSchema = Yup.object().shape({
    companyProfile: Yup.mixed()
      .required("A file is required")
      .test(
        "fileType",
        "Unsupported File Format",
        (value) =>
          value && ["image/jpeg", "image/png", "image/gif"].includes(value.type)
      )
      .test(
        "fileSize",
        "File too large",
        (value) => value && value.size <= 5000000
      ),
    companyName: Yup.string()
      .required("Company Name is Required")
      .min(2, "Company Name must be at least 2 characters")
      .max(150, "Company Name cannot exceed 150 characters"),
    clientName: Yup.string()
      .required("Client Name is required")
      .min(2, "Client Name must be at least 2 characters")
      .max(100, "Client Name cannot exceed 100 characters")
      .matches(
        /^[A-Za-z\s.'-]+$/,
        "Client Name can only contain letters, spaces, hyphens, and apostrophes"
      ),
    phone: Yup.string()
      .required("Phone Number is required")
      .matches(
        /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/,
        "Invalid Indian Phone Number (e.g., +91 9876543210 or 9876543210)"
      )
      .min(10, "Phone Number must be at least 10 digits")
      .max(15, "Phone Number cannot exceed 15 digits (including country code)"),
    emailId: Yup.string()
      .required("Email ID is Required")
      .email("Invalid Email ID format (e.g., example@domain.com)"),
    typeOfConstitution: Yup.string()
      .oneOf(
        constitutionOptions
          .map((option) => option.value)
          .filter((value) => value !== ""),
        "Please select a valid Type of Constitution"
      )
      .required("Type of Constitution is required"),
    typeOfBusiness: Yup.string()
      .oneOf(
        businessOptions
          .map((option) => option.value)
          .filter((value) => value !== ""),
        "Please select a valid Type of Business"
      )
      .required("Type of Business is required"),
    // planType: Yup.string()
    //   .required("Subscription Plan is Required"),
  });

  // This is not strictly necessary for displaying, but helpful for consistent preview logic
  const urlToFile = async (url, filename, mimeType) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  };

  // Helper function to get base64 for image preview
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleChange = async ({ fileList: newFileList }, setFieldValue) => {
    // Keep only the last selected file if multiple are allowed (Ant Design default)
    const file = newFileList[0];

    if (file) {
      if (file.originFileObj) {
        // This is a newly selected file from the user
        const fileSizeInMB = file.originFileObj.size / (1024 * 1024);
        if (fileSizeInMB > 5) {
          setFileList([]);
          setSelectedFile(null);
          setFieldValue("companyProfile", null); // Reset in Formik
          return;
        } else {
          setFileList([file]); // Set the file for display
          setSelectedFile(file.originFileObj);
          setFieldValue("companyProfile", file.originFileObj); // ✅ Set Formik value to the actual File object
        }
      } else if (file.url && file.status === "done") {
        // This is an existing file (from initial `clientData` or already uploaded)
        setFileList([file]);
        setSelectedFile(file.url); // Set selectedFile to the URL
        setFieldValue("companyProfile", file.url); // Keep the URL in Formik
      }
    } else {
      // No file selected or cleared
      setFileList([]);
      setSelectedFile(null);
      setFieldValue("companyProfile", null); // ✅ Set Formik value
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview && file.originFileObj) {
      // If it's a new file and no preview is set, generate it
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url?.substring(file.url.lastIndexOf("/") + 1) || "Image"
    );
  };
  const handleSubmit = async (values) => {
    try {
      const response = await SubmitClientDetails(values, clientId, setClientID, clientData?.company);
      console.log("Details Submitted :");
      // setClientID(response.)
      setHeaderTab("addressDetails");
      dispatch(fetchClient());
    } catch (error) {
      console.error("Error in Submitting :", error);
    }
  };

  // const handleChange = async ({ fileList: newFileList }, setFieldValue) => {
  //   const file = newFileList[0]?.originFileObj;

  //   if (file) {
  //     const fileSizeInMB = file.size / (1024 * 1024);
  //     if (fileSizeInMB > 5) {
  //       setFileList([]);
  //       setSelectedFile(null);
  //       setFieldValue("companyProfile", null); // Reset in Formik
  //       return;
  //     } else {
  //       setFileList(newFileList);
  //       setSelectedFile(file);
  //       setFieldValue("companyProfile", file); // ✅ Set Formik value
  //     }
  //   } else {
  //     setFileList([]);
  //     setSelectedFile(null);
  //     setFieldValue("companyProfile", null); // ✅ Set Formik value
  //   }
  // };

  useEffect(() => {
    if (clientId) {
      fetchClientID();
    }
  }, [clientId]);

  useEffect(() => {
    if (clientData?.company?.company_logo) {
      setFileList([
        {
          uid: "-1", // A unique identifier
          name: "company_logo.png", // Or extract from URL if possible
          status: "done", // Indicates it's an existing file
          url: `${IMG_URL}${clientData.company.company_logo}`,
        },
      ]);
    } else {
      setFileList([]); // Clear if no logo
    }
  }, [clientData?.company?.company_logo]);

  return (
    <div className="w-full px-[2vw]">
      <Formik
        initialValues={{
          companyProfile: clientData?.company?.company_logo || "",
          companyName: clientData?.company?.company_name || "",
          clientName: clientData?.company?.owner_name || "",
          phone: clientData?.company?.phone || "",
          emailId: clientData?.company?.emailid || "",
          typeOfConstitution: clientData?.company?.type_of_constitution || "",
          typeOfBusiness: clientData?.company?.business_background || "",
          webUrl: clientData?.company?.web_url || "",
          //planType: clientData?.company?.plan_type || "",
        }}
        onSubmit={handleSubmit}
        enableReinitialize={true}
        validationSchema={validationSchema}
      >
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <div className="flex justify-center items-start mt-[0.6vw] relative">
              <ImgCrop showGrid rotationSlider showReset>
                <Upload
                  name="companyProfile"
                  className="custom-upload"
                  listType="picture-card"
                  fileList={fileList}
                  accept=".jpg,.jpeg,.png"
                  disabled={action === "view"}
                  // value is not used directly by Antd Upload; fileList is.
                  beforeUpload={() => false} // Prevents automatic upload
                  onChange={(info) => handleChange(info, setFieldValue)}
                  onPreview={handlePreview}
                >
                  {fileList.length < 1 && "+ Upload"}
                </Upload>
              </ImgCrop>
              <ErrorMessage
                name="companyProfile"
                component="div"
                className="text-red-500 text-[0.7vw] absolute top-[8vw]"
              />
            </div>
            <div className="grid grid-cols-2 gap-[2vw] mt-[4vw]">
              <div>
                <div className="flex">
                  <label
                    htmlFor="companyName"
                    className="block text-[0.9vw] text-[#323232] font-semibold"
                  >
                    Company Name
                  </label>
                  <span className="text-[1vw] text-red-600 pl-[0.2vw]">*</span>
                </div>
                <div className="relative">
                  <Field
                    type="text"
                    name="companyName"
                    disabled={action === "view"}
                    placeholder="Enter Client Name"
                    className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white "
                  />
                  <ErrorMessage
                    name="companyName"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                  />
                </div>
              </div>
              <div>
                <div className="flex">
                  <label
                    htmlFor="clientName"
                    className="block text-[0.9vw] text-[#323232] font-semibold"
                  >
                    Client Name
                  </label>
                  <span className="text-[1vw] text-red-600 pl-[0.2vw]">*</span>
                </div>
                <div className="relative">
                  <Field
                    type="text"
                    name="clientName"
                    disabled={action === "view"}
                    placeholder="Enter Client Name"
                    className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white "
                  />
                  <ErrorMessage
                    name="clientName"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                  />
                </div>
              </div>
              <div>
                <div className="flex">
                  <label
                    htmlFor="phone"
                    className="block text-[0.9vw] text-[#323232] font-semibold"
                  >
                    Phone
                  </label>
                  <span className="text-[1vw] text-red-600 pl-[0.2vw]">*</span>
                </div>
                <div className="relative">
                  <Field
                    type="text"
                    name="phone"
                    disabled={action === "view"}
                    placeholder="Enter Phone Number"
                    className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white "
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                  />
                </div>
              </div>
              <div>
                <div className="flex">
                  <label
                    htmlFor="emailId"
                    className="block text-[0.9vw] text-[#323232] font-semibold"
                  >
                    Email ID
                  </label>
                  <span className="text-[1vw] text-red-600 pl-[0.2vw]">*</span>
                </div>
                <div className="relative">
                  <Field
                    type="text"
                    name="emailId"
                    disabled={action === "view"}
                    placeholder="Enter Email ID"
                    className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white "
                  />
                  <ErrorMessage
                    name="emailId"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                  />
                </div>
              </div>
              <div>
                <div className="flex">
                  <label
                    htmlFor="typeOfConstitution"
                    className="block text-[0.9vw] text-[#323232] font-semibold"
                  >
                    Type of Business
                  </label>
                  <span className="text-[1vw] text-red-600 pl-[0.2vw]">*</span>
                </div>
                <div className="relative">
                  <Field
                    as="select" // Renders as a select/dropdown
                    name="typeOfConstitution"
                    disabled={action === "view"}
                    className={`w-full h-[2vw] border rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white 
                  `}
                  >
                    <option value="">--Select any of the option--</option>
                    {constitutionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.value}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="typeOfConstitution"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                  />
                </div>
              </div>

              {/* Type of Business Field */}
              <div>
                <div className="flex">
                  <label
                    htmlFor="typeOfBusiness"
                    className="block text-[0.9vw] text-[#323232] font-semibold"
                  >
                    Type of Industry
                  </label>
                  <span className="text-[1vw] text-red-600 pl-[0.2vw]">*</span>
                </div>
                <div className="relative">
                  <Field
                    as="select" // Renders as a select/dropdown
                    name="typeOfBusiness"
                    disabled={action === "view"}
                    className={`w-full h-[2vw] border rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white 
                  `}
                  >
                    <option value="">--Select any of the option--</option>
                    {businessOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.value}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="typeOfBusiness"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                  />
                </div>
              </div>

              <div>
                <div className="flex">
                  <label
                    htmlFor="webUrl"
                    className="block text-[0.9vw] text-[#323232] font-semibold"
                  >
                    Web URL
                  </label>
                </div>
                <div className="relative">
                  <Field
                    type="text"
                    name="webUrl"
                    disabled={action === "view"}
                    placeholder="Enter Web URL"
                    className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white "
                  />
                  <ErrorMessage
                    name="webUrl"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                  />
                </div>
              </div>
              <div>
                <div className="flex">
                  <label
                    htmlFor="typeOfConstitution"
                    className="block text-[0.9vw] text-[#323232] font-semibold"
                  >
                    Subscription Plan
                  </label>
                  <span className="text-[1vw] text-red-600 pl-[0.2vw]">*</span>
                </div>
                {/* <div className="relative">
                  <Field
                    as="select" // Renders as a select/dropdown
                    name="planType"
                    disabled={action === "view"}
                    className={`w-full h-[2vw] border rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white 
                  `}
                  >
                    <option value="">--Select any of the option--</option>
                    {planTypes.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.value}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="planType"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                  />
                </div> */}
              </div>
            </div>
            {action === "view" ? null : (
              <>
                <div className="flex justify-end w-full gap-[1vw] mt-[2vw]">
                  <button
                    type="button"
                    className={`h-[2.5vw] w-[6vw] text-[0.95vw] rounded-[0.3vw] font-semibold border-[0.1vw] border-[#4C67ED] cursor-pointer hover:bg-[#e8edfc42]`}
                    onClick={() => setOpenModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`h-[2.5vw] w-[6vw] text-[0.95vw] rounded-[0.3vw] font-medium border-[0.1vw] border-[#4C67ED] bg-[#4C67ED] text-white cursor-pointer hover:bg-[#3b50c2]`}
                  >
                    {action === "edit" ? "Save" : "Next"}
                  </button>
                </div>
              </>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};
