import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
  getCompanyByID,
  UpdateCompanyAddress,
} from "../../API/Settings/CompanySetup";

const validationSchema = Yup.object().shape({
  address: Yup.string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters"),

  state: Yup.string().required("State is required"),

  region: Yup.string().required("Region is required"),

  city: Yup.string().required("City is required"),

  country: Yup.string().required("Country is required"),

  zipCode: Yup.string()
    .required("Zip Code is required")
    .matches(/^\d{5,6}$/, "Zip Code must be 5 or 6 digits"),

  gstin: Yup.string()
    .required("GSTIN is required")
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Enter a valid GSTIN"
    ),
});

export default function AddAddress({ setIsEdit, setCurrentStep, clientData }) {
  return (
    <>
      <div className="w-full">
        <div className="grid grid-cols-3 w-full gap-x-[2.5vw] gap-y-[1.5vw] justify-evenly items-center p-[1vw]">
          {/* Row 1 */}

          <div></div>
          <div className="flex flex-col relative">
            <label className="block text-[0.9vw] font-medium mb-1">
              Address
            </label>
            <div className="w-full border-b border-gray-300 focus:outline-none py-1 text-[0.8vw] text-[#323232]">
              {clientData?.address?.address}
            </div>
          </div>

          <div className="flex flex-col relative">
            <label className="block text-[0.9vw] font-medium mb-1">State</label>
            <div className="w-full border-b border-gray-300 focus:outline-none py-1 text-[0.8vw] text-[#323232]">
              {clientData?.address?.state}
            </div>
          </div>
          {/* Row 2 */}
          <div className="flex flex-col relative">
            <label className="block text-[0.9vw] font-medium mb-1">
              Region
            </label>
            <div className="w-full border-b border-gray-300 focus:outline-none py-1 text-[0.8vw] text-[#323232]">
              {clientData?.address?.region}
            </div>
          </div>

          <div className="flex flex-col relative">
            <label className="block text-[0.9vw] font-medium mb-1">City</label>
            <div className="w-full border-b border-gray-300 focus:outline-none py-1 text-[0.8vw] text-[#323232]">
              {clientData?.address?.city}
            </div>
          </div>

          <div className="flex flex-col relative">
            <label className="block text-[0.9vw] font-medium mb-1">
              Country
            </label>
            <div className="w-full border-b border-gray-300 focus:outline-none py-1 text-[0.8vw] text-[#323232]">
              {clientData?.address?.country}
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex flex-col relative">
            <label className="block text-[0.9vw] font-medium mb-1">
              Postal/Zip Code
            </label>
            <div className="w-full border-b border-gray-300 focus:outline-none py-1 text-[0.8vw] text-[#323232]">
              {clientData?.address?.zip_code}
            </div>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-10">
          <button
            type="button"
            onClick={() => {
              setCurrentStep(1);
              setIsEdit(false);
            }}
            className="px-6 py-2 border border-black rounded-md text-sm font-medium cursor-pointer"
          >
            BACK
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentStep(3);
              setIsEdit(false);
            }}
            className="px-6 py-2 bg-black text-white rounded-md text-sm font-medium cursor-pointer"
          >
            NEXT
          </button>
        </div>
      </div>
    </>
  );
}
