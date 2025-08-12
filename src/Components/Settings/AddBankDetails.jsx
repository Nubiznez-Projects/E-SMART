import React from "react";

export default function AddBankDetails({ isEdit, setIsEdit, setCurrentStep,clientData }) {
  return (
    <>
      <div className="w-full">
        <div className="grid grid-cols-3 w-full gap-x-[2.5vw] gap-y-[1.5vw] justify-evenly items-center p-[1vw]">
          {/* Row 1 */}

          <div></div>
          <div className="flex flex-col relative">
            <label className="block text-[0.9vw] font-medium mb-1">
             GSTIN
            </label>
             <div className="w-full border-b border-gray-300 focus:outline-none py-1 text-[0.8vw] text-[#323232]">
              {clientData?.gst?.gstin}
            </div>
          </div>

          <div className="flex flex-col relative">
            <label className="block text-[0.9vw] font-medium mb-1">
              Head Office 
            </label>
            <div className="w-full border-b border-gray-300 focus:outline-none py-1 text-[0.8vw] text-[#323232]">
              {clientData?.gst?.head_office}
            </div>
          </div>
           <div className="flex flex-col relative">
            <label className="block text-[0.9vw] font-medium mb-1">
              State Code
            </label>
            <div className="w-full border-b border-gray-300 focus:outline-none py-1 text-[0.8vw] text-[#323232]">
              {clientData?.gst?.state_code_number}
            </div>
          </div>

           <div className="flex flex-col relative">
            <label className="block text-[0.9vw] font-medium mb-1">
              State 
            </label>
            <div className="w-full border-b border-gray-300 focus:outline-none py-1 text-[0.8vw] text-[#323232]">
              {clientData?.gst?.state_name}
            </div>
          </div>

           <div className="flex flex-col relative">
            <label className="block text-[0.9vw] font-medium mb-1">
              GST Image 
            </label>
            <div className="w-full border-b border-gray-300 focus:outline-none py-1 text-[0.8vw] text-[#323232]">
              {clientData?.gst?.state_name}
            </div>
          </div>
         
        </div>
        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-[7vw]">
          <button
            type="button"
            onClick={() => {
              setCurrentStep(2);
              setIsEdit(false);
            }}
            className="px-6 py-2 border border-black rounded-md text-sm font-medium cursor-pointer"
          >
            BACK
          </button>
        </div>
      </div>
    </>
  );
}
