import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Formik, Form } from "formik";
import ImgCrop from "antd-img-crop";
import { Upload, Image, Progress, Modal } from "antd";
import * as Yup from "yup";
import {
  CreateEmployeePersonal,
  getEmployeeByID,
} from "../../../API/UserManagement/Employee/Employee";
import { toast } from "react-toastify";
import { useUserContext } from "../../../Context/UserContext";
import { useDispatch } from "react-redux";

const validationSchema = Yup.object({
firstName: Yup.string()
  .trim()
  .required("First name is required")
  //.min(2, "First name must be at least 2 characters")
  .max(40, "First name maximum 40 characters."),

lastName: Yup.string()
  .trim()
  .required("Last name is required")
 // .min(2, "Last name must be at least 2 characters")
  .max(40, "Last name maximum 40 characters."),

  profileImage: Yup.mixed().required("Profile image is required"),

  gender: Yup.string()
    .required("Gender is required")
    .oneOf(["male", "female", "other"], "Invalid gender selected"),

  dateOfBirth: Yup.date()
    .required("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future"),

  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),

  altPhone: Yup.string()
    .nullable()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit alternate phone number")
    .notRequired(),

  blood: Yup.string()
    .required("Blood group is required")
    .matches(/^(A|B|AB|O)[+-]$/, "Invalid blood group (e.g., A+, B-, O+)"),

  email: Yup.string()
    .required("Email is required")
    .email("Enter a valid email address"),
});

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function AddPersonal({ handleTab, setOpenModal }) {
  const { setEmpId, empId, empData, setEmpData, action } = useUserContext();
  const [profileImage, setProfileImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [showNextButton, setShowNextButton] = useState(false);
  const apiImgUrl = import.meta.env.VITE_IMAGE_URL;
  const dispatch = useDispatch();
    const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = async ({ fileList: newFileList }, setFieldValue) => {
    const file = newFileList[0]?.originFileObj;

    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 5) {
        setFileList([]);
        setSelectedFile(null);
        setFieldValue("profileImage", null); // Reset in Formik
        return;
      } else {
        setFileList(newFileList);
        setSelectedFile(file);
        setFieldValue("profileImage", file); // ✅ Set Formik value
      }
    } else {
      setFileList([]);
      setSelectedFile(null);
      setFieldValue("profileImage", null); // ✅ Set Formik value
    }
  };

  const handleSubmit = async (values) => {
    console.log(values, "Submit employee personal");
    try {
      const response = await CreateEmployeePersonal(
        empId,
        values,
        fileList,
        dispatch
      );
      console.log(response, "Submit employee personal");
      handleTab("address");
      toast.success(response.message);
      setShowNextButton(true);
      if (empId) {
        return;
      } else {
        setEmpId(response?.emp_id);
      }
    } catch (error) {
      console.error("Error submitting Employee personal", error);
    }
  };

  const fetchEmpData = async () => {
    try {
      const response = await getEmployeeByID(empId);
      setEmpData(response);
      setSelectedFile(response?.personal?.profile_img);
      console.log("fetching emp data", response);
    } catch (error) {
      console.error("Error fetching Emp Details", error);
    }
  };

  console.log(empId, "empId");

  useEffect(() => {
    if (empId) {
      fetchEmpData();
    }
  }, [empId]);

  return (
    <>
      <div className="flex w-full justify-center items-center mt-[3vw] mx-[4vw]">
        <Formik
          initialValues={{
            firstName: empData?.personal?.emp_first_name || "",
            lastName: empData?.personal?.emp_last_name || "",
            gender: empData?.personal?.gender || "",
            dateOfBirth: empData?.personal?.date_of_birth
              ? new Date(empData?.personal?.date_of_birth)
                  .toISOString()
                  .split("T")[0]
              : "",
            profileImage: empData?.personal?.profile_img || "",
            phone: empData?.personal?.phone || "",
            altPhone: empData?.personal?.alternate_phone || "",
            blood: empData?.personal?.blood_group || "",
            email: empData?.personal?.email_id || "",
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form className="grid grid-cols-3 gap-y-[1vw] gap-x-[4vw] w-full">
              <div className="flex justify-center items-start mt-[0.6vw] relative">
                <ImgCrop showGrid rotationSlider showReset>
                  <Upload
                    name="profileImage"
                    className="custom-upload"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    disabled={action === "view"}
                    accept=".jpg,.jpeg,.png"
                    style={{ width: "8vw", height: "8vw" }}
                    beforeUpload={() => false}
                    onChange={(info) => handleChange(info, setFieldValue)}
                    onPreview={handlePreview}
                  >
                    {fileList?.length < 1 && "+ Upload"}
                  </Upload>
                </ImgCrop>
                {fileList?.length === 0 &&
                  selectedFile && ( // Check if there are no files in the fileList and selectedFile is set
                    <img
                      src={`${apiImgUrl}${selectedFile}`}
                      alt="Profile"
                      className="w-[8vw] h-[8vw] object-cover rounded-[0.2vw] top-[0vw] left-[3.25vw] absolute opacity-35 z-[1] pointer-events-none"
                    />
                  )}
                <ErrorMessage
                  name="profileImage"
                  component="div"
                  className="text-red-500 text-[0.7vw] absolute top-[8vw]"
                />
              </div>
               <Modal
                  visible={previewOpen}
                  title={previewTitle}
                  footer={null}
                  onCancel={handleCancel}
                >
                  <img
                    alt="example"
                    style={{ width: "100%" }}
                    src={previewImage}
                  />
                </Modal>
                {
                    empId && selectedFile != null ?  " " : (
                    profileImage === false && <div className="text-red-500 text-[.7vw] absolute  bottom-[-1.2vw]">
                     * Profile Image is required - (Max Size : 5MB)
                    </div>)}

              <div className="grid grid-cols-2 gap-y-[1vw] gap-x-[3vw] col-span-2">
                <div className="flex flex-col gap-[0.5vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">First Name</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    type="text"
                    name="firstName"
                    disabled={action === "view"}
                    onKeyPress={(e) => {
                      const regex = /^[A-Za-z ]$/;
                      if (!regex.test(e.key)) {
                        e.preventDefault(); // Block the keypress if it doesn't match
                      }
                    }}
                    placeholder="Enter First Name"
                    className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>

                <div className="flex flex-col gap-[0.5vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Last Name</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    type="text"
                    name="lastName"
                    disabled={action === "view"}
                    onKeyPress={(e) => {
                      const regex = /^[A-Za-z ]$/;
                      if (!regex.test(e.key)) {
                        e.preventDefault(); // Block the keypress if it doesn't match
                      }
                    }}
                    placeholder="Enter Last Name"
                    className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>

                <div className="flex flex-col gap-[0.5vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Email</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    type="text"
                    disabled={action === "view"}
                    name="email"
                    onKeyPress={(e) => {
                      const regex = /^[a-zA-Z0-9@._+-]$/;
                      if (!regex.test(e.key)) {
                        e.preventDefault(); // Block characters not allowed in emails
                      }
                    }}
                    placeholder="Enter Email"
                    className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>

                <div className="flex flex-col gap-[0.5vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Date of Birth</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    type="date"
                    disabled={action === "view"}
                    name="dateOfBirth"
                    className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="dateOfBirth"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-[3vw] gap-y-[1.5vw] col-span-3 mt-[1vw]">
                <div className="flex flex-col gap-[0.5vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Phone</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    type="text"
                    name="phone"
                    disabled={action === "view"}
                    onKeyPress={(e) => {
                      if (!/^\d$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter Phone Number"
                    className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.5vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Alternate Phone</label>
                    {/* <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span> */}
                  </div>
                  <Field
                    type="text"
                    name="altPhone"
                    disabled={action === "view"}
                    placeholder="Alternate Phone Number"
                    className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="altPhone"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.5vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Gender</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    as="select"
                    name="gender"
                    disabled={action === "view"}
                    className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Field>
                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.5vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Blood Group</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    type="text"
                    name="blood"
                    disabled={action === "view"}
                    placeholder="Enter Blood group"
                    className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="blood"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>
              </div>
              {action !== "view" && (
                <div className="flex col-span-3 justify-end items-end gap-[1vw] mt-[5vw]">
                  {action === "add" && 
                  <button
                    type="button"
                    onClick={()=> setOpenModal(false)}
                    className="text-[#4C67ED] text-[0.9vw] w-[6vw] h-[2vw] rounded mt-2 border-[0.01vw] border-[#4C67ED] cursor-pointer"
                  >
                    CANCEL
                  </button>
                   }
                    <button
                      type="submit"
                      className="bg-blue-500 text-[0.9vw] w-[6vw] h-[2vw] text-white rounded mt-2 border-[0.01vw] border-[#4C67ED] cursor-pointer"
                    >
                      {action === "add" ? "NEXT" : "SAVE"}
                    </button>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}
