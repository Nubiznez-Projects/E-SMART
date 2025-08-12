import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { SubmitClientAddress } from "../../../API/UserManagement/Client/ClientDetails";
import { useUserContext } from "../../../Context/UserContext";

const validationSchema = Yup.object().shape({
  address: Yup.string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters")
    .max(255, "Address cannot exceed 255 characters"),

  postalCode: Yup.string()
    .required("Postal Code is required")
    .min(5, "Postal Code must be at least 5 characters") // More generic, e.g., for international
    .max(10, "Postal Code cannot exceed 10 characters"), // More generic, e.g., for international

  city: Yup.string()
    .required("City is required")
    .min(2, "City must be at least 2 characters")
    .max(100, "City cannot exceed 100 characters"),

  state: Yup.string()
    .required("State is required")
    .min(2, "State must be at least 2 characters")
    .max(100, "State cannot exceed 100 characters"),

  region: Yup.string()
    .required("Region is required") // Assuming optional. Change to .required() if needed
    .max(100, "Region cannot exceed 100 characters"),

  country: Yup.string()
    .required("Country is required")
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country cannot exceed 100 characters"),
});

export const AddAddressDetails = ({
  setHeaderTab,
  clientId,
  setClientID,
  clientData,
  setClientData,
  fetchClientID,
  setOpenModal,
}) => {
  console.log(clientData, clientId, "ClientAddressPage");
  const { action } = useUserContext();
const REGION_OPTIONS = [
  "Southern Region",
  "Northern Region",
  "Western Region",
  "Eastern Region",
  "Central Region",
];

  const handleSubmit = (values) => {
    try {
      const response = SubmitClientAddress(values, clientId);
      console.log("POST VALUES: ", values);
      setHeaderTab("gstDetails");
    } catch (error) {
      console.error("Error in Submitting :", error);
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchClientID();
    }
  }, [clientId]);

  return (
    <div className="w-full px-[2vw]">
      <Formik
        initialValues={{
          address: clientData?.address?.address || "",
          postalCode: clientData?.address?.zip_code || "",
          city: clientData?.address?.city || "",
          state: clientData?.address?.state || "",
          region: clientData?.address?.region || "",
          country: clientData?.address?.country || "",
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ handleSubmit, values, touched, errors, handleChange }) => (
          <Form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-[2vw] mt-[2vw]">
              <div>
                <div className="flex">
                  <label
                    htmlFor="address"
                    className="block text-[0.9vw] text-[#323232] font-semibold"
                  >
                    Address
                  </label>
                  <span className="text-[1vw] text-red-600 pl-[0.2vw]">*</span>
                </div>
                <div className="relative">
                  <Field
                    type="text"
                    name="address"
                    disabled={action === "view"}
                    placeholder="Enter Address"
                    className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white "
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                  />
                </div>
              </div>
              <div>
                <div className="flex">
                  <label
                    htmlFor="postalCode"
                    className="block text-[0.9vw] text-[#323232] font-semibold"
                  >
                    Postal Code/ Zip Code
                  </label>
                  <span className="text-[1vw] text-red-600 pl-[0.2vw]">*</span>
                </div>
                <div className="relative">
                  <Field
                    type="text"
                    name="postalCode"
                    disabled={action === "view"}
                    placeholder="Enter Zip Code"
                    className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white "
                  />
                  <ErrorMessage
                    name="postalCode"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                  />
                </div>
              </div>
              <div>
                <div className="flex">
                  <label
                    htmlFor="city"
                    className="block text-[0.9vw] text-[#323232] font-semibold"
                  >
                    City
                  </label>
                  <span className="text-[1vw] text-red-600 pl-[0.2vw]">*</span>
                </div>
                <div className="relative">
                  <Field
                    type="text"
                    name="city"
                    disabled={action === "view"}
                    placeholder="Enter City"
                    className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white "
                  />
                  <ErrorMessage
                    name="city"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                  />
                </div>
              </div>
              <div>
                <div className="flex">
                  <label
                    htmlFor="state"
                    className="block text-[0.9vw] text-[#323232] font-semibold"
                  >
                    State
                  </label>
                  <span className="text-[1vw] text-red-600 pl-[0.2vw]">*</span>
                </div>
                <div className="relative">
                  <Field
                    type="text"
                    name="state"
                    disabled={action === "view"}
                    placeholder="Enter State"
                    className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white "
                  />
                  <ErrorMessage
                    name="state"
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
                    Region
                  </label>
                  <span className="text-[1vw] text-red-600 pl-[0.2vw]">*</span>
                </div>
                <div className="relative">
                  <Field
                    as="select"
                    disabled={action === "view"}
                    id="region"
                    name="region"
                    className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                  >
                    <option value="">-- Select Region --</option>{" "}
                    {/* Default empty option */}
                    {REGION_OPTIONS.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="region"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                  />
                </div>
              </div>
              <div>
                <div className="flex">
                  <label
                    htmlFor="typeOfBusiness"
                    className="block text-[0.9vw] text-[#323232] font-semibold"
                  >
                    Country
                  </label>
                  <span className="text-[1vw] text-red-600 pl-[0.2vw]">*</span>
                </div>
                <div className="relative">
                  <Field
                    type="text"
                    name="country"
                    disabled={action === "view"}
                    placeholder="Enter Country"
                    className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white "
                  />
                  <ErrorMessage
                    name="country"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                  />
                </div>
              </div>
            </div>
            {action === "view" ? null : (
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
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};
