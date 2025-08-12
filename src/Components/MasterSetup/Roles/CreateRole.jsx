import { Select, Input, Radio } from "antd";
import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { createRoles, getByIDRoles } from "../../../API/MasterModule/Roles";
import { fetchRoles } from "../../../Redux/Slice/MasterModule/Roles/RoleThunks";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const { TextArea } = Input;

const validationSchema = Yup.object().shape({
  role: Yup.string().required("Role is required")
   .max(12, "Maximum length is 12"),
  permission: Yup.array()
    .min(1, "Select at least one permission")
    .required("Permissions are required"),
  status: Yup.string().required("Status is required"),
  description: Yup.string("Description is required")
   .max(100, "Maximum length is 100"),

  ModulePermissions: Yup.object()
    .test("at-least-one-true", "Select at least one module", (value) => {
      return value && Object.values(value).some((v) => v === true);
    })
    .required("Module selection is required"),

  SubModulePermissions: Yup.object()
    .test(
      "has-submodules",
      "Select at least one submodule",
      (value) =>
        value &&
        Object.values(value).some((arr) => Array.isArray(arr) && arr.length > 0)
    )
    .required("Submodule selection is required"),
});

export default function CreateRole({ roleID, closeModal }) {
  
  const dispatch = useDispatch();
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedSubmodules, setSelectedSubmodules] = useState([]);
  const [moduleMap, setModuleMap] = useState({});
  const [submoduleMap, setSubmoduleMap] = useState({});
  const [roleData, setRolesData] = useState();

  const crudPermissionOptions = [
    { label: "View", value: "view" },
    { label: "Create", value: "create" },
    { label: "Edit", value: "edit" },
    { label: "Delete", value: "delete" },
  ];

  const moduleSubmoduleMap = {
    Purchase: ["PO", "GRN", "Bill Entry", "Payment"],
    Sales: ["PO", "DC", "Invoice", "Receipt"],
    Master: ["Supplier", "Customer"],
    "Data Analytics": ["Dashboard", "Reports"],
  };

  const options = [
    { label: "Active", value: "Active" },
    { label: "InActive", value: "InActive" },
  ];

  const handleSubmit = async (values) => {
    try {
      const response = await createRoles(values, roleID);
      // Show success message
      toast.success(response.message);
      console.log(response, "data");
      closeModal();
      dispatch(fetchRoles());
    } catch (error) {
      console.log("Error creating customer", error);
      toast.error(error.message);
    }
  };

  const fetchRolesData = async () => {
    try {
      const response = await getByIDRoles(roleID);
      console.log("roles data by ID", response);
      setRolesData(response);
    } catch (error) {
      console.error("Error fetching roles", error);
    }
  };

  useEffect(() => {
    if (roleID) {
      fetchRolesData();
    }
  }, [roleID]);
  console.log("roooolllll", roleID);

  useEffect(() => {
    if (roleData?.ModulePermissions) {
      const selected = Object.entries(roleData.ModulePermissions).find(
        ([_, v]) => v
      )?.[0];

      if (selected) {
        const savedSubModules = roleData.SubModulePermissions?.[selected] || [];
        setSelectedSubmodules(savedSubModules);
      }
    }
  }, [roleData]);

  return (
    <>
      <Formik
        initialValues={{
          role: roleData?.RoleName || "",
          permission: roleData?.Permissions || [],
          selectedModule:
            Object.entries(roleData?.ModulePermissions || {}).find(
              ([_, v]) => v
            )?.[0] || "",
          ModulePermissions: roleData?.ModulePermissions || {
            Purchase: false,
            Sales: false,
            Master: false,
            "Data Analytics": false,
          },
          SubModulePermissions: roleData?.SubModulePermissions || {},
          description: roleData?.Narration || "",
          status: roleData?.Status
            ? "Active"
            : (roleData?.Status && "Inactive") || "Active", // convert boolean to string
        }}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={(values) => {
          console.log("Form submitted", values);
          handleSubmit(values); // your API call
        }}
      >
        {({
          isSubmitting,
          setFieldValue,
          values,
          handleSubmit,
          touched,
          errors,
        }) => (
          <Form onSubmit={handleSubmit}>
            <label className="font-bold text-[1.5vw]">
              {roleID ? "UPDATE ROLE" : "CREATE NEW ROLE"}
            </label>
            <div className="grid grid-cols-2 gap-x-[1vw] gap-y-[1vw] mt-[1.6vw]">
              <div className="flex flex-wrap gap-2 relative">
                <label className="text-[0.9vw] font-medium">Role Type</label>
                <Input
                  id="role"
                  type="text"
                  name="role"
                  placeholder="Enter Role Type"
                  size="large"
                  onKeyPress={(e) => {
                    const regex = /^[A-Za-z\s]$/;
                    if (!regex.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  value={values.role}
                  onChange={(e) => setFieldValue("role", e.target.value)}
                />
                <ErrorMessage
                  name="role"
                  component="div"
                  className="absolute text-red-600 text-[0.7vw] top-[3.65vw]"
                />
              </div>
              <div className="flex flex-wrap gap-2 relative">
                <label className="text-[0.9vw] font-medium">Permissions</label>
                <Select
                  mode="multiple"
                  allowClear
                  id="permission"
                  name="permission"
                  placeholder="Select Permissions"
                  className="w-[20vw] h-[2.25vw]"
                  value={values.permission}
                  onChange={(value) => setFieldValue("permission", value)} // use value directly
                  options={crudPermissionOptions}
                />

                <ErrorMessage
                  name="permission"
                  component="div"
                  className="absolute text-red-600 text-[0.7vw] top-[3.65vw]"
                />
              </div>
              <div className="flex flex-wrap gap-2 relative">
                <label className="text-[0.9vw] font-medium">
                  Module Permission
                </label>
                <Select
                  value={values.selectedModule}
                  size="large"
                  className="w-[20vw] h-[2vw]"
                  onChange={(module) => {
                    setFieldValue("selectedModule", module);

                    const updatedModules = {
                      ...values.ModulePermissions,
                      [module]: true,
                    };
                    setFieldValue("ModulePermissions", updatedModules);

                    // ✅ Load the saved submodules for that module
                    const existingSubs =
                      values.SubModulePermissions?.[module] || [];
                    setSelectedSubmodules(existingSubs);
                  }}
                  options={Object.keys(moduleSubmoduleMap).map((key) => ({
                    label: key,
                    value: key,
                  }))}
                />

                <ErrorMessage
                  name="ModulePermissions"
                  component="div"
                  className="absolute text-red-600 text-[0.7vw] top-[3.65vw]"
                />
              </div>

              <div className="flex flex-wrap gap-2 relative">
                <label className="text-[0.9vw] font-medium">Sub Modules</label>
                <Select
                  mode="multiple"
                  size="large"
                  className="w-[20vw] h-[2.25vw] "
                  value={selectedSubmodules}
                  onChange={(subs) => {
                    setSelectedSubmodules(subs);

                    const updatedSubModules = {
                      ...values.SubModulePermissions,
                      [values.selectedModule]: subs, // ✅ only update selected module
                    };

                    setFieldValue("SubModulePermissions", updatedSubModules);
                  }}
                  options={(
                    moduleSubmoduleMap[values.selectedModule] || []
                  ).map((sub) => ({
                    label: sub,
                    value: sub,
                  }))}
                />

                <ErrorMessage
                  name="SubModulePermissions"
                  component="div"
                  className="absolute text-red-600 text-[0.7vw] top-[3.65vw]"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-[2vw] relative">
                <label className="text-[0.9vw] font-medium">
                  Active Permission:
                </label>
                <div className="">
                  <Radio.Group
                    name="status"
                    value={values.status}
                    defaultValue="Active"
                    onChange={(e) =>
                      setFieldValue("status", e.target.value || e)
                    }
                    options={[
                      { label: "Active", value: "Active" },
                      { label: "Inactive", value: "Inactive" },
                    ]}
                  />
                </div>
                <ErrorMessage
                  name="status"
                  component="div"
                  className="absolute text-red-600 text-[0.7vw] mt-[0.2vw]"
                />
              </div>
              <div className="flex flex-wrap gap-2 relative">
                <label className="text-[0.9vw] font-medium">Description</label>
                <TextArea
                  id="description"
                  name="description"
                  value={values.description}
                  onChange={(e) =>
                    setFieldValue("description", e.target.value )
                  }
                  rows={2}
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="absolute text-red-600 text-[0.7vw] top-[4.5vw]"
                />
              </div>
            </div>
            <div className="flex flex-nowrap justify-end items-end w-full gap-[1vw] my-[2.3vw]">
              <button
                type="button"
                onClick={closeModal}
                className={`h-[2.5vw] w-[6vw] text-[0.95vw] rounded-[0.3vw] font-medium border-[0.1vw] border-[#4C67ED] cursor-pointer hover:bg-[#e8edfc42]`}
              >
                CANCEL
              </button>
              <button
                type="submit"
                className={`h-[2.5vw] w-[6vw] text-[0.95vw] rounded-[0.3vw] font-medium border-[0.1vw] border-[#4C67ED] bg-[#4C67ED] text-white cursor-pointer hover:bg-[#3b50c2]`}
              >
                SUBMIT
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
