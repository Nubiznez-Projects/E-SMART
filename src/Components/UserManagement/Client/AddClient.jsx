import React, { act, useEffect, useState } from "react";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import { AddCompanyProfile } from "./AddCompanyProfile";
import { AddAddressDetails } from "./AddAddressDetails";
import { AddGstDetails } from "./AddGstDetails";
import { getClientDetailsById } from "../../../API/UserManagement/Client/ClientDetails";
import { useUserContext } from "../../../Context/UserContext";

export default function AddClient({
  empId,
  clientId,
  setClientID,
  setOpenModal,
}) {
  const [headerTab, setHeaderTab] = useState("companyDetails");
  const [clientData, setClientData] = useState();
  const { action } = useUserContext();

  const heading =
    headerTab === "companyDetails"
      ? "Company Details"
      : headerTab === "addressDetails"
      ? "Address Details"
      : headerTab === "gstDetails"
      ? "GST Details"
      : "Documents";

  const handleTab = (name) => {
    setHeaderTab(name);
  };

  const fetchClientID = async () => {
    try {
      const response = getClientDetailsById(clientId, setClientData);
    } catch (error) {
      console.error("Client By ID :", error);
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchClientID();
    }
  }, [clientId]);

  return (
    <>
      <div className="flex w-full p-[1vw] justify-between">
        <label className="text-[1.5vw] font-bold">E-SMART</label>
        <label className="flex justify-center items-center text-[1.2vw]">
          {heading}
        </label>
      </div>
      <div className="flex items-center justify-evenly pt-[2vw] gap-[0.1vw] mx-[1vw] border-t border-b-gray-950">
        <div
          className={`flex items-center  ${
            action === "add" ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={() => {
            if (action !== "add") {
              handleTab("companyDetails");
            }
          }}
        >
          <div
            className={`w-[1.7vw] h-[1.7vw] rounded-full flex items-center justify-center text-white text-[0.8vw] font-bold 
          ${headerTab === "companyDetails" ? "bg-[#4C67ED]" : "bg-gray-400"}`}
          >
            1
          </div>
          <span
            className={`ml-2 text-[1vw] font-medium ${
              headerTab === "companyDetails"
                ? "text-[#4C67ED]"
                : "text-gray-500"
            }`}
          >
            Company Details
          </span>
        </div>

        <div className="flex w-[6vw] h-[2px] bg-gray-300"></div>

        {/* address */}
        <div
          className={`flex items-center  ${
            action === "add" ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={() => {
            if (action !== "add") {
              handleTab("addressDetails");
            }
          }}
        >
          <div
            className={`w-[1.7vw] h-[1.7vw] rounded-full flex items-center justify-center text-white text-[0.8vw] font-bold 
          ${headerTab === "addressDetails" ? "bg-[#4C67ED]" : "bg-gray-400"}`}
          >
            2
          </div>
          <span
            className={`ml-2 text-[1vw] font-medium ${
              headerTab === "addressDetails"
                ? "text-[#4C67ED]"
                : "text-gray-500"
            }`}
          >
            Address Details
          </span>
        </div>

        <div className="flex w-[6vw] h-[2px] bg-gray-300"></div>

        {/* professional */}
        <div
          className={`flex items-center  ${
            action === "add" ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={() => {
            if (action !== "add") {
              handleTab("gstDetails");
            }
          }}
        >
          <div
            className={`w-[1.7vw] h-[1.7vw] rounded-full flex items-center justify-center text-white text-[0.8vw] font-bold 
          ${headerTab === "gstDetails" ? "bg-[#4C67ED]" : "bg-gray-400"}`}
          >
            3
          </div>
          <span
            className={`ml-2 text-[1vw] font-medium ${
              headerTab === "gstDetails" ? "text-[#4C67ED]" : "text-gray-500"
            }`}
          >
            G.S.T Details
          </span>
        </div>
      </div>
      <div className="flex w-full">
        {headerTab === "companyDetails" ? (
          <AddCompanyProfile
            setHeaderTab={setHeaderTab}
            clientId={clientId}
            setClientID={setClientID}
            clientData={clientData}
            setClientData={setClientData}
            fetchClientID={fetchClientID}
            setOpenModal={setOpenModal}
          />
        ) : headerTab === "addressDetails" ? (
          <AddAddressDetails
            setHeaderTab={setHeaderTab}
            clientId={clientId}
            setClientID={setClientID}
            clientData={clientData}
            setClientData={setClientData}
            fetchClientID={fetchClientID}
            setOpenModal={setOpenModal}
          />
        ) : headerTab === "gstDetails" ? (
          <AddGstDetails
            clientId={clientId}
            setClientID={setClientID}
            clientData={clientData}
            setClientData={setClientData}
            setOpenModal={setOpenModal}
            fetchClientID={fetchClientID}
          />
        ) : null}
      </div>
    </>
  );
}
