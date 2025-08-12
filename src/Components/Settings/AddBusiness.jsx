import React from "react";

export default function AddBusiness({ setIsEdit, setCurrentStep, clientData }) {
  return (
    <>
      <div className="w-full">
        <div className="grid grid-cols-3 w-full gap-x-[2.5vw] gap-y-[1.5vw] justify-evenly items-center p-[1vw]">
          {/* Row 1 */}

          <div></div>
          <div className="flex flex-col relative">
            <label className="block text-[0.9vw] font-medium mb-1">
              Company Name{" "}
            </label>
            <div className="w-full border-b border-gray-300 focus:outline-none py-1 text-[0.8vw] text-[#323232]">
              {clientData?.company?.company_name}
            </div>
          </div>

          <div className="flex flex-col relative">
            <label className="block text-[0.9vw] font-medium mb-1">
              Owner Name{" "}
            </label>
            <div className="w-full border-b border-gray-300 focus:outline-none py-1 text-[0.8vw] text-[#323232]">
              {clientData?.company?.owner_name}
            </div>
          </div>
          {/* Row 2 */}
          <div className="flex flex-col relative">
            <label className="block text-[0.9vw] font-medium mb-1">
              Email{" "}
            </label>
            <div className="w-full border-b border-gray-300 focus:outline-none py-1 text-[0.8vw] text-[#323232]">
              {clientData?.company?.emailid}
            </div>
          </div>
          <div className="flex flex-col relative">
            <label className="block text-[0.9vw] font-medium mb-1">
              Phone{" "}
            </label>
            <div className="w-full border-b border-gray-300 focus:outline-none py-1 text-[0.8vw] text-[#323232]">
              {clientData?.company?.phone}
            </div>
          </div>
          <div className="flex flex-col relative">
            <label className="block text-[0.9vw] font-medium mb-1">
              Type of Constitution{" "}
            </label>
            <div className="w-full border-b border-gray-300 focus:outline-none py-1 text-[0.8vw] text-[#323232]">
              {clientData?.company?.type_of_constitution}
            </div>
          </div>
          {/* Row 3 */}
          <div className="flex flex-col relative">
            <label className="block text-[0.9vw] font-medium mb-1">
              Business Background{" "}
            </label>
            <div className="w-full border-b border-gray-300 focus:outline-none py-1 text-[0.8vw] text-[#323232]">
              {clientData?.company?.business_background}
            </div>
          </div>
          <div className="flex flex-col relative">
            <label className="block text-[0.9vw] font-medium mb-1">
              Web URL{" "}
            </label>
            <div className="w-full border-b border-gray-300 focus:outline-none py-1 text-[0.8vw] text-[#323232]">
              {clientData?.company?.web_url}
            </div>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-10">
          <button
            type="button"
             onClick={() => {
              setCurrentStep(2);
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
