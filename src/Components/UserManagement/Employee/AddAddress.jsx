import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Formik, Form } from "formik";
import { Checkbox } from "antd";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { CreateEmpAddress } from "../../../API/UserManagement/Employee/Employee";
import { useUserContext } from "../../../Context/UserContext";
import { useDispatch } from "react-redux";
import { Country, State, City } from "country-state-city";

const validationSchema = Yup.object({
  temp_add: Yup.string().required("Temporary address is required"),
  temp_country: Yup.string().required("Temporary country is required"),
  temp_state: Yup.string().required("Temporary state is required"),
  temp_city: Yup.string().required("Temporary city is required"),
  temp_zip_code: Yup.string()
    .matches(/^\d{5,6}$/, "Temporary postal code must be 5 or 6 digits")
    .required("Temporary postal code is required"),
  temp_region: Yup.string().required("Temporary region is required"),

  perm_add: Yup.string().required("Permanent address is required"),
  perm_country: Yup.string().required("Permanent country is required"),
  perm_state: Yup.string().required("Permanent state is required"),
  perm_city: Yup.string().required("Permanent city is required"),
  perm_zip_code: Yup.string()
    .matches(/^\d{5,6}$/, "Permanent postal code must be 5 or 6 digits")
    .required("Permanent postal code is required"),
  perm_region: Yup.string().required("Permanent region is required"),
});

export default function AddAddress({ handleTab }) {
  const { empId, empData, action } = useUserContext();
  const dispatch = useDispatch();
  const [selectedCountry1, setSelectedCountry1] = useState("");
  const [selectedState1, setSelectedState1] = useState("");
  const [selectedCountry2, setSelectedCountry2] = useState("");
  const [selectedState2, setSelectedState2] = useState("");

  const countries1 = Country.getAllCountries();
  const countries2 = Country.getAllCountries();

  const states1 = selectedCountry1
    ? State.getStatesOfCountry(selectedCountry1)
    : [];
  const cities1 = selectedState1
    ? City.getCitiesOfState(selectedCountry1, selectedState1)
    : [];

  const states2 = selectedCountry2
    ? State.getStatesOfCountry(selectedCountry2)
    : [];
  const cities2 = selectedState2
    ? City.getCitiesOfState(selectedCountry2, selectedState2)
    : [];

  const REGION_OPTIONS = [
    "Southern Region",
    "Northern Region",
    "Western Region",
    "Eastern Region",
    "Central Region",
  ];

  const handleSubmit = async (values) => {
    console.log(values, "Submit employee personal");
    try {
      const response = await CreateEmpAddress(empId, values);
      handleTab("professional");
      toast.success(response.message);
      //dispatch(fetchEmployee());
      console.log(response, "Submitted Emp Address");
    } catch (error) {
      console.error("Error submitting Emp Address", error);
    }
  };

    useEffect(() => {
      if (empData?.personal?.temp_country) {
        setSelectedCountry1(empData?.personal?.temp_country);
      }
      if (empData?.personal?.temp_state) {
        setSelectedState1(empData?.personal?.temp_state);
      }
       if (empData?.personal?.perm_country) {
        setSelectedCountry2(empData?.personal?.perm_country);
      }
      if (empData?.personal?.perm_state) {
        setSelectedState2(empData?.personal?.perm_state);
      }
    }, [empData]);

  return (
    <>
      <div className="flex w-full justify-center items-center mt-[2vw] mx-[4vw]">
        <Formik
          initialValues={{
            temp_add: empData?.personal?.temp_add || "",
            temp_country: empData?.personal?.temp_country || "",
            temp_state: empData?.personal?.temp_state || "",
            temp_city: empData?.personal?.temp_city || "",
            perm_add: empData?.personal?.perm_add || "",
            perm_country: empData?.personal?.perm_country || "",
            perm_state: empData?.personal?.perm_state || "",
            perm_city: empData?.personal?.perm_city || "",
            perm_zip_code: String(empData?.personal?.perm_zip_code ?? ""),
            temp_zip_code: String(empData?.personal?.temp_zip_code ?? ""),
            temp_region: empData?.personal?.temp_region || "",
            perm_region: empData?.personal?.perm_region || "",
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form className="w-full">
              <div className="grid grid-cols-2 gap-y-[1vw] gap-x-[4vw] h-[70vh] overflow-y-auto scrollbar-hide mb-[1vw]">
                <label className="w-full flex col-span-2 text-[1.2vw] py-[1vw] font-bold">
                  Temporary Address
                </label>
                <div className="flex flex-col gap-[0.5vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Address</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    type="text"
                    name="temp_add"
                    disabled={action === "view"}
                    onKeyPress={(e) => {
                      const regex = /^[a-zA-Z0-9\s,.-]+$/;
                      if (!regex.test(e.key)) {
                        e.preventDefault(); // block the character
                      }
                    }}
                    placeholder="Enter Address"
                    className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="temp_add"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.5vw] relative">
                  <div className="flex">
                    <label
                      htmlFor="typeOfBusiness"
                      className="block text-[0.9vw] text-[#323232]"
                    >
                      Country
                    </label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    as="select"
                    disabled={action === "view"}
                    id="temp_country"
                    name="temp_country"
                    value={selectedCountry1}
                    onChange={(e) => {
                      setSelectedCountry1(e.target.value);
                      setFieldValue("temp_country", e.target.value);
                    }}
                    className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                  >
                    <option value="">-- Select Country --</option>
                    {countries1.map((c) => (
                      <option key={c.isoCode} value={c.isoCode}>
                        {c.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="temp_country"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute bottom-[-1.2vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.5vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">State</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    as="select"
                    disabled={action === "view" || !selectedCountry1}
                    id="temp_state"
                    name="temp_state"
                    value={selectedState1}
                    onChange={(e) => {
                      setSelectedState1(e.target.value);
                      setFieldValue("temp_state", e.target.value);
                    }}
                    className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                  >
                    <option value="">-- Select State --</option>
                    {states1.map((s) => (
                      <option key={s.isoCode} value={s.isoCode}>
                        {s.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="temp_state"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>

                <div className="flex flex-col gap-[0.5vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">City</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    as="select"
                    disabled={action === "view" || !selectedState1}
                    id="temp_city"
                    name="temp_city"
                    className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                  >
                    <option value="">-- Select City --</option>
                    {cities1.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="temp_city"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.5vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Region</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    as="select"
                    disabled={action === "view"}
                    id="temp_region"
                    name="temp_region"
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
                    name="temp_region"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.5vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Postal Code</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    type="text"
                    disabled={action === "view"}
                    name="temp_zip_code"
                    onKeyPress={(e) => {
                      const regex = /^[0-9]$/;
                      if (!regex.test(e.key)) {
                        e.preventDefault(); // blocks non-digit characters
                      }
                    }}
                    placeholder="Enter Postal code"
                    className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="temp_zip_code"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>

                {/* <div className="flex flex-col gap-[0.5vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Country</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    type="text"
                    disabled={action === "view"}
                    name="temp_country"
                    onKeyPress={(e) => {
                      const regex = /^[a-zA-Z\s]+$/;
                      if (!regex.test(e.key)) {
                        e.preventDefault(); // Block non-letter characters
                      }
                    }}
                    placeholder="Enter Country"
                    className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="temp_country"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div> */}
                <div className="flex col-span-2">
                  <Checkbox
                    disabled={action === "view"}
                    onChange={(e) => {
                      if (e.target.checked) {
                        // Update form values
                        setFieldValue("perm_add", values.temp_add);
                        setFieldValue("perm_country", values.temp_country);
                        setFieldValue("perm_state", values.temp_state);
                        setFieldValue("perm_region", values.temp_region);
                        setFieldValue("perm_city", values.temp_city);
                        setFieldValue("perm_zip_code", values.temp_zip_code);

                        // Update dropdown states
                        setSelectedCountry2(values.temp_country);
                        setSelectedState2(values.temp_state);
                      } else {
                        // Clear form values
                        setFieldValue("perm_add", "");
                        setFieldValue("perm_country", "");
                        setFieldValue("perm_state", "");
                        setFieldValue("perm_city", "");
                        setFieldValue("perm_region", "");
                        setFieldValue("perm_zip_code", "");

                        // Clear dropdown states
                        setSelectedCountry2("");
                        setSelectedState2("");
                      }
                    }}
                    className="text-[#1F4B7F] font-semibold text-[0.85vw] mt-[1vw]"
                  >
                    Temporary Address same as Permanent Address
                  </Checkbox>
                </div>
                <label className="text-[1.2vw] py-[1vw] font-bold flex col-span-2">
                  Permanent Address
                </label>
                <div className="flex flex-col gap-[0.5vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Address</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    type="text"
                    disabled={action === "view"}
                    name="perm_add"
                    onKeyPress={(e) => {
                      const regex = /^[a-zA-Z0-9\s,.-]+$/;
                      if (!regex.test(e.key)) {
                        e.preventDefault(); // block the character
                      }
                    }}
                    placeholder="Enter Address"
                    className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="perm_add"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>

                <div className="flex flex-col gap-[0.5vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Country</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    as="select"
                    disabled={action === "view"}
                    id="perm_country"
                    name="perm_country"
                    value={selectedCountry2}
                    onChange={(e) => {
                      setSelectedCountry2(e.target.value);
                      setFieldValue("perm_country", e.target.value);
                    }}
                    className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                  >
                    <option value="">-- Select Country --</option>
                    {countries2.map((c) => (
                      <option key={c.isoCode} value={c.isoCode}>
                        {c.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="perm_country"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.5vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">State</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    as="select"
                    disabled={action === "view" || !selectedCountry2}
                    id="perm_state"
                    name="perm_state"
                    value={selectedState2}
                    onChange={(e) => {
                      setSelectedState2(e.target.value);
                      setFieldValue("perm_state", e.target.value);
                    }}
                    className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                  >
                    <option value="">-- Select State --</option>
                    {states2.map((s) => (
                      <option key={s.isoCode} value={s.isoCode}>
                        {s.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="perm_state"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.5vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">City</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    as="select"
                    disabled={action === "view" || !selectedState2}
                    id="perm_city"
                    name="perm_city"
                    onChange={(e) => {
                      setFieldValue("perm_city", e.target.value);
                    }}
                    className="w-full h-[2vw] border border-gray-300 rounded px-[0.3vw] py-[0.2vw] text-[0.9vw] bg-white"
                  >
                    <option value="">-- Select City --</option>
                    {cities2.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="perm_city"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.5vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Region</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    as="select"
                    disabled={action === "view"}
                    id="perm_region"
                    name="perm_region"
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
                    name="perm_region"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>
                <div className="flex flex-col gap-[0.5vw] relative">
                  <div className="flex">
                    <label className="text-[0.9vw]">Postal Code</label>
                    <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                      *
                    </span>
                  </div>
                  <Field
                    type="text"
                    disabled={action === "view"}
                    name="perm_zip_code"
                    onKeyPress={(e) => {
                      const regex = /^[0-9]$/;
                      if (!regex.test(e.key)) {
                        e.preventDefault(); // blocks non-digit characters
                      }
                    }}
                    placeholder="Enter Postal code"
                    className="w-full px-3 h-[2vw] text-[0.80vw] border-[0.1vw] border-[#38556680] rounded-[0.2vw] focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  />
                  <ErrorMessage
                    name="perm_zip_code"
                    component="div"
                    className="text-red-500 text-[0.7vw] absolute top-[4vw]"
                  />
                </div>
              </div>
              {action !== "view" && (
                <div className="flex col-span-2 justify-end items-end gap-[1vw]">
                  {action === "add" && (
                    <button
                      type="button"
                      onClick={() => handleTab("personal")}
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
