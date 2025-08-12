import React, { useState } from "react";
import CompanySetup from "./CompanySetup";
import Notification from "./Notification";

export default function Settings() {
  const [tabName, setTabName] = useState("Company");

  const toggleTab = (key) => {
    setTabName(key);
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="flex flex-col my-[1vw]">
          <div className="flex gap-x-[2vw] ml-[-1vw]">
            <div>
              <h1
                className={` cursor-pointer ml-[1vw] text-[1.1vw] ${
                  tabName === "Company"
                    ? "border-b-[0.2vw] font-bold border-[#000000]"
                    : ""
                } `}
                onClick={() => toggleTab("Company")}
              >
                Company Setup
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-[75vh]">
        {tabName === "Company" ? (
          <div className="w-full">
            <CompanySetup />
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
