import React from "react";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import AddAddress from "./AddAddress";
import AddPersonal from "./AddPersonal";
import AddProfessional from "./AddProfessional";
import AddDocuments from "./AddDocuments";
import { useUserContext } from "../../../Context/UserContext";

export default function AddEmployee({ setOpenModal }) {
  const { action, headerTab, setHeaderTab } = useUserContext();
  const heading =
    headerTab === "personal"
      ? "Personal Details"
      : headerTab === "address"
      ? "Address Details"
      : headerTab === "professional"
      ? "Professional Details"
      : "Documents";

  const handleTab = (name) => {
      setHeaderTab(name);
  };

  return (
    <>
      <div className="flex w-full p-[1vw] justify-between">
        <label className="text-[1.5vw] font-bold">E-SMART</label>
        <label className="flex justify-center items-center text-[1.2vw]">
          {heading}
        </label>
      </div>
      <div className="flex items-center justify-evenly pt-[2vw] gap-[0.1vw] mx-[1vw] border-t border-b-gray-950">
        {/* {headerTab != "personal" && (
          <div
            className="flex justify-center items-center cursor-pointer"
            //onClick={handleBack}
          >
            <IoChevronBackCircleSharp size={"1.5vw"} />
          </div>
        )} */}
        {/* personal */}
        <div
          className={`flex items-center ${
            action !== "add" && "cursor-pointer"
          }`}
          onClick={() => {
           if(action === "add"){
            return
           }
           handleTab("personal")
          }}
        >
          <div
            className={`w-[1.7vw] h-[1.7vw] rounded-full flex items-center justify-center text-white text-[0.8vw] font-bold 
          ${headerTab === "personal" ? "bg-[#4C67ED]" : "bg-gray-400"}`}
          >
            1
          </div>
          <span
            className={`ml-2 text-[1vw] font-medium ${
              headerTab === "personal" ? "text-[#4C67ED]" : "text-gray-500"
            }`}
          >
            Personal Details
          </span>
        </div>

        <div className="flex w-[6vw] h-[2px] bg-gray-300"></div>

        {/* address */}
        <div
          className={`flex items-center ${
            action !== "add" && "cursor-pointer"
          }`}
          onClick={() => {
            if(action === "add"){
            return
           }
            handleTab("address")
          }}
        >
          <div
            className={`w-[1.7vw] h-[1.7vw] rounded-full flex items-center justify-center text-white text-[0.8vw] font-bold 
          ${headerTab === "address" ? "bg-[#4C67ED]" : "bg-gray-400"}`}
          >
            2
          </div>
          <span
            className={`ml-2 text-[1vw] font-medium ${
              headerTab === "address" ? "text-[#4C67ED]" : "text-gray-500"
            }`}
          >
            Address Details
          </span>
        </div>

        <div className="flex w-[6vw] h-[2px] bg-gray-300"></div>

        {/* professional */}
        <div
          className={`flex items-center ${
            action !== "add" && "cursor-pointer"
          }`}
          onClick={() => {
           if(action === "add"){
            return
           }
            handleTab("professional")
          }}
        >
          <div
            className={`w-[1.7vw] h-[1.7vw] rounded-full flex items-center justify-center text-white text-[0.8vw] font-bold 
          ${headerTab === "professional" ? "bg-[#4C67ED]" : "bg-gray-400"}`}
          >
            3
          </div>
          <span
            className={`ml-2 text-[1vw] font-medium ${
              headerTab === "professional" ? "text-[#4C67ED]" : "text-gray-500"
            }`}
          >
            Professional Details
          </span>
        </div>

        <div className="flex w-[6vw] h-[2px] bg-gray-300"></div>

        {/* documents */}
        <div
          className={`flex items-center ${
            action !== "add" && "cursor-pointer"
          }`}
          onClick={() => {
            if(action === "add"){
            return
           }
            handleTab("documents")
          }}
        >
          <div
            className={`w-[1.7vw] h-[1.7vw] rounded-full flex items-center justify-center text-white text-[0.8vw] font-bold 
          ${headerTab === "documents" ? "bg-[#4C67ED]" : "bg-gray-400"}`}
          >
            4
          </div>
          <span
            className={`ml-2 text-[1vw] font-medium ${
              headerTab === "documents" ? "text-[#4C67ED]" : "text-gray-500"
            }`}
          >
            Documents
          </span>
        </div>
      </div>
      <div className="flex w-full">
        {headerTab === "personal" ? (
          <AddPersonal handleTab={handleTab} setOpenModal={setOpenModal} />
        ) : headerTab === "address" ? (
          <AddAddress handleTab={handleTab} />
        ) : headerTab === "professional" ? (
          <AddProfessional handleTab={handleTab} />
        ) : (
          <AddDocuments handleTab={handleTab} />
        )}
      </div>
    </>
  );
}
