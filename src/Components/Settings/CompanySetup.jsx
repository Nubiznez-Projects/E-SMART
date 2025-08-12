import React, { useEffect, useRef, useState } from "react";
import backImg from "../../assets/BackImg.png";
import AddBusiness from "./AddBusiness";
import AddAddress from "./AddAddress";
import AddBankDetails from "./AddBankDetails";
import { MdEdit } from "react-icons/md";
import {
  getCompanyByID,
  UpdateCompanyProfile,
} from "../../API/Settings/CompanySetup";
import { getClientDetailsById } from "../../API/UserManagement/Client/ClientDetails";
 
 
 
export default function CompanySetup() {
 
  const [currentStep, setCurrentStep] = useState(1);
  const [isEdit, setIsEdit] = useState(false);
  const [resetfields, setResetFields] = useState();
  const [clientData, setClientData] = useState();
  const apiImgUrl = import.meta.env.VITE_IMAGE_URL;
  const LoginUserId = sessionStorage.getItem("LoginUserId");
  const [profileImg, setprofileImg] = useState();
  const image = `${apiImgUrl}${profileImg}`;
  const steps = [
    { number: 1, label: "Business Details" },
    { number: 2, label: "Registered Address" },
    { number: 3, label: "GST Details" },
  ];
 
  const fileInputRef = useRef();
 
  const handleClick = () => {
    fileInputRef.current.click(); // trigger file input click
  };
 
const handleFileChange = async (event) => {
  const file = event.target.files[0];
  console.log("Selected file:", file);
 
  if (file) {
    // Wrap the file in the format expected by UpdateCompanyProfile
    const fakeAntdFileList = [
      {
        originFileObj: file, // mimic antd Upload's format
      },
    ];
 
    const profile = await UpdateCompanyProfile(LoginUserId, fakeAntdFileList);
    fetchBusiness();
    console.log("Uploaded profile:", profile);
  }
};
 console.log(currentStep, "currentStep")
 
  const fetchBusiness = async () => {
    try {
      const data = await getClientDetailsById(LoginUserId, setClientData);
      setprofileImg(data?.company?.company_logo);
      console.log(data, "company business details...");
    } catch (error) {
      console.error("Error submitting Business Details", error);
    }
  };
 
  useEffect(() => {
    if (LoginUserId) {
      fetchBusiness();
    }
  }, [LoginUserId]);
 
  return (
    <>
      <div className="flex w-full h-full">
        <div className="grid grid-cols-6 w-full gap-[2vw] justify-evenly items-start">
          <div className="flex col-span-1 bg-white w-full h-[75vh] rounded-[1vw] shadow-xl">
            <div className="flex flex-col w-full items-center justify-center gap-y-[0.5vw]">
              {steps.map((step, index) => (
                <div key={step.number} className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div
                    //onClick={() => setCurrentStep(step.number)}
                    className={`w-[2vw] h-[2vw] flex items-center justify-center rounded-full border text-sm font-medium  ${
                      currentStep === step.number
                        ? "bg-black text-white border-black"
                        : "text-black border-black"
                    }`}
                  >
                    {step.number}
                  </div>
 
                  {/* Label */}
                  <div
                    className={`mt-1 text-center text-[1vw] ${
                      currentStep === step.number
                        ? "font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    {step.label}
                  </div>
 
                  {/* Vertical Line (except last step) */}
                  {index < steps.length - 1 && (
                    <div className="h-[10vh] w-[0.2vw] bg-black my-[1vw]"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col col-span-5 bg-white w-full h-[75vh] rounded-[1vw] shadow-xl">
            <div className="flex flex-col w-full mx-auto p-[1vw]">
              {/* Header Banner */}
              <div className="relative">
                <img className="w-full" src={backImg} alt="Back Image" />
 
                {/* Circular Logo */}
                <div
                  className="absolute -bottom-[4.5vw] left-[6vw]"
                  // /onClick={handleClick}
                >
                  {profileImg ? (
                    <img
                      src={`${profileImg && image} `}
                      alt="Image"
                      className="w-[9vw] h-[9vw] object-cover rounded-full"
                    />
                  ) : (
                    <>
                      <div className="relative w-[8.5vw] h-[8.5vw] rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center">
                        <span className="font-bold text-sm text-center">
                          E - SMART
                        </span>
 
                        {/* Edit Icon */}
                        <div className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow">
                          <MdEdit size={"1vw"} />
                        </div>
                      </div>
                    </>
                  )}
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                 
              </div>
 
              <div className="mt-[2vw]">
                {currentStep === 1 ? (
                  <AddBusiness
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    clientData={clientData}
                    setCurrentStep={setCurrentStep}
                    setResetFields={setResetFields}
                  />
                ) : currentStep === 2 ? (
                  <AddAddress
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    clientData={clientData}
                    resetfields={resetfields}
                    setCurrentStep={setCurrentStep}
                  />
                ) : (
                  <AddBankDetails
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    clientData={clientData}
                     resetfields={resetfields}
                    setCurrentStep={setCurrentStep}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
 