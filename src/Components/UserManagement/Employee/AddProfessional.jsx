import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Formik, Form } from "formik";
import { Checkbox } from "antd";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { CreateEmpProfessional } from "../../../API/UserManagement/Employee/Employee";
import { useUserContext } from "../../../Context/UserContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles } from "../../../Redux/Slice/MasterModule/Roles/RoleThunks";

const validationSchema = Yup.object({
  designation: Yup.string().required("Designation is required"),

  role: Yup.string().required("Role is required"),

  department: Yup.string().required("Department is required"),

  branch: Yup.string().required("Branch is required"),

  joiningDate: Yup.date()
    .typeError("Joining date must be a valid date")
    .required("Joining date is required"),

  reporting: Yup.string().required("Reporting manager is required"),

  qualification: Yup.string().required("Qualification is required"),

  language: Yup.string().required("Language is required"),
});

export default function AddProfessional({ handleTab }) {

  const { empId, empData, action } = useUserContext();
  const [showNextButton, setShowNextButton] = useState(false);
  const { role } = useSelector((state) => state.roles || {});
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    console.log(values, "Submit employee personal");
    try {
      const response = await CreateEmpProfessional(empId, values,dispatch);
      console.log(response, "Submitting emp professional");
      setShowNextButton(true);
      handleTab("Documents");
      dispatch(fetchEmployee());
    } catch (error) {
      console.error("Error Submitting EMP professional", error);
    }
  };

    useEffect(() => {
      dispatch(fetchRoles());
    }, [dispatch]);

  return (
    <>
      <div className="flex w-full justify-center items-center mt-[4vw] mx-[4vw]">
        <Formik
          initialValues={{
            designation: empData?.professional?.designation || "",
            role: empData?.professional?.role_type || "",
            department: empData?.professional?.department || "",
            branch: empData?.professional?.branch || "",
            joiningDate: empData?.professional?.joining_date
              ? new Date(empData?.professional?.joining_date)
                  .toISOString()
                  .split("T")[0]
              : "",
            reporting: empData?.professional?.reporting_manager || "",
            qualification: empData?.professional?.qualification || "",
            language: empData?.professional?.language || "",
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form className="w-full">
              <div className="grid grid-cols-2 gap-y-[1.2vw] gap-x-[4vw] mb-[1vw]">
                <div className="flex flex-col gap-[0.5vw] relative">
                  <label className="text-[0.9vw]">Designation</label>
                  <Field
                    type="text"
                    disabled={action === "view"}
                    name="designation"
                    onKeyPress={(e) => {
                      const regex = /^[a-zA-Z\s]+$/;
                      if (!regex.test(e.key)) {
                        e.preventDefault(); // Block non-letter and non-space characters
                      }
                    }}
                    placeholder="Enter Address"
                    className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="designation"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>

                <div className="flex flex-col gap-[0.5vw] relative">
                  <label className="text-[0.9vw]">Role</label>
                  <Field
                    as="select"
                    id="role"
                    name="role"
                    onKeyPress={(e) => {
                      const regex = /^[a-zA-Z\s]+$/;
                      if (!regex.test(e.key)) {
                        e.preventDefault(); // Block non-letter and non-space characters
                      }
                    }}
                    disabled={action === "view"}
                    className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  >
                    <option value="" disabled>
                      Select Role Type
                    </option>
                    {role?.map((item) => (
                      <option key={item?.RoleId} value={item?.RoleName}>
                        {item.RoleName}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>

                <div className="flex flex-col gap-[0.5vw] relative">
                  <label className="text-[0.9vw]">Department</label>
                  <Field
                    type="text"
                    disabled={action === "view"}
                    name="department"
                    onKeyPress={(e) => {
                      const regex = /^[a-zA-Z\s]+$/;
                      if (!regex.test(e.key)) {
                        e.preventDefault(); // Block non-letter and non-space characters
                      }
                    }}
                    placeholder="Enter City"
                    className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="department"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>

                <div className="flex flex-col gap-[0.5vw] relative">
                  <label className="text-[0.9vw]">Branch</label>
                  <Field
                    type="text"
                    disabled={action === "view"}
                    name="branch"
                    onKeyPress={(e) => {
                      const regex = /^[a-zA-Z\s]+$/;
                      if (!regex.test(e.key)) {
                        e.preventDefault(); // Block non-letter and non-space characters
                      }
                    }}
                    placeholder="Enter State"
                    className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="branch"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.5vw] relative">
                  <label className="text-[0.9vw]">Joining Date</label>
                  <Field
                    name="joiningDate"
                    disabled={action === "view"}
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw]  focus:border-blue-500 focus:outline-none
                            transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="joiningDate"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.5vw] relative">
                  <label className="text-[0.9vw]">Reporting Manager</label>
                  <Field
                    type="text"
                    disabled={action === "view"}
                    name="reporting"
                    onKeyPress={(e) => {
                      const regex = /^[a-zA-Z\s]+$/;
                      if (!regex.test(e.key)) {
                        e.preventDefault(); // Block non-letter and non-space characters
                      }
                    }}
                    placeholder="Enter Country"
                    className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="reporting"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.5vw] relative">
                  <label className="text-[0.9vw]">Qualification</label>
                  <Field
                    type="text"
                    disabled={action === "view"}
                    name="qualification"
                    onKeyPress={(e) => {
                      const regex = /^[a-zA-Z\s().]+$/;
                      if (!regex.test(e.key)) {
                        e.preventDefault(); // Block anything not letter, space, ( ), or .
                      }
                    }}
                    placeholder="Enter Country"
                    className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="qualification"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.5vw] relative">
                  <label className="text-[0.9vw]">Language</label>
                  <Field
                    type="text"
                    disabled={action === "view"}
                    name="language"
                    onKeyPress={(e) => {
                      const regex = /^[a-zA-Z\s]+$/;
                      if (!regex.test(e.key)) {
                        e.preventDefault(); // Block non-letter and non-space characters
                      }
                    }}
                    placeholder="Enter Country"
                    className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="language"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>
              </div>
              {action !== "view" && (
                <div className="flex col-span-2 justify-end items-end gap-[1vw] mt-[6vw]">
                  {action === "add" && (
                    <button
                      type="button"
                      onClick={() => handleTab("address")}
                      className="text-[#4C67ED] text-[0.9vw] w-[6vw] h-[2vw] rounded mt-2 border-[0.01vw] border-[#4C67ED] cursor-pointer"
                    >
                      BACK
                    </button>
                  )}
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
