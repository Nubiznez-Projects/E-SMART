import React from "react";

export default function DocumentsView({ clientData, setIsDocView }) {

  const img_url = import.meta.env.VITE_IMAGE_URL;

  const handleVerify = () =>{
  setIsDocView(true);
  }

  return (
    <div className="flex flex-col w-full p-[1vw]">
      <div className="flex justify-end items-center w-full gap-[1vw] mb-[0.5vw]">
        <p className="flex text-[1.3vw] font-bold">
          {clientData?.company?.client_id}
        </p>
        <img
          src={`${img_url}${clientData?.company?.company_logo}`}
          alt="client logo"
          className="h-[3vw] w-[3vw] rounded-full"
        />
      </div>
      <div className="flex justify-center items-center border-[0.1vw] w-full"></div>
      <div className="flex flex-col mt-[1vw]">
        <label className="text-[1.2vw] font-bold">Company Details</label>
        <div className="grid grid-cols-3 w-full my-[2vw] gap-[1.5vw] px-[2vw]">
          <div className="flex flex-col gap-y-[0.3vw]">
            <label className="text-[1vw]">Company Name</label>
            <p className="text-[0.75vw]">{clientData?.company?.company_name}</p>
          </div>
          <div className="flex flex-col gap-y-[0.3vw]">
            <label className="text-[1vw]">Owner Name</label>
            <p className="text-[0.75vw]">{clientData?.company?.owner_name}</p>
          </div>
          <div className="flex flex-col gap-y-[0.3vw]">
            <label className="text-[1vw]">Phone</label>
            <p className="text-[0.75vw]">{clientData?.company?.phone}</p>
          </div>
          <div className="flex flex-col gap-y-[0.3vw]">
            <label className="text-[1vw]">Type of Constitution</label>
            <p className="text-[0.75vw]">
              {clientData?.company?.type_of_constitution}
            </p>
          </div>
          <div className="flex flex-col gap-y-[0.3vw]">
            <label className="text-[1vw]">Business Background</label>
            <p className="text-[0.75vw]">
              {clientData?.company?.business_background}
            </p>
          </div>
          <div className="flex flex-col gap-y-[0.3vw]">
            <label className="text-[1vw]">Web Url</label>
            <p className="text-[0.75vw]">{clientData?.company?.web_url}</p>
          </div>
        </div>
        <label className="text-[1.2vw] font-bold">Address Details</label>
        <div className="grid grid-cols-3 w-full my-[2vw] gap-[1.5vw] px-[2vw]">
          <div className="flex flex-col gap-y-[0.3vw]">
            <label className="text-[1vw]">Address</label>
            <p className="text-[0.75vw]">{clientData?.address?.address}</p>
          </div>
          <div className="flex flex-col gap-y-[0.3vw]">
            <label className="text-[1vw]">State</label>
            <p className="text-[0.75vw]">{clientData?.address?.state}</p>
          </div>
          {/* <div className='flex flex-col gap-y-[0.3vw]'>
         <label className='text-[1vw]'>State Id</label>
         <p className='text-[0.75vw]'>{clientData?.address?.state_id}</p>
        </div> */}
          <div className="flex flex-col gap-y-[0.3vw]">
            <label className="text-[1vw]">Region</label>
            <p className="text-[0.75vw]">{clientData?.address?.region}</p>
          </div>
          <div className="flex flex-col gap-y-[0.3vw]">
            <label className="text-[1vw]">Country</label>
            <p className="text-[0.75vw]">{clientData?.address?.country}</p>
          </div>
          <div className="flex flex-col gap-y-[0.3vw]">
            <label className="text-[1vw]">Zip Code</label>
            <p className="text-[0.75vw]">{clientData?.address?.zip_code}</p>
          </div>
        </div>
        <label className="text-[1.2vw] font-bold">GST Details</label>
        <div className="grid grid-cols-3 w-full my-[2vw] gap-[1.5vw] px-[2vw]">
          <div className="flex flex-col gap-y-[0.3vw]">
            <label className="text-[1vw]">State</label>
            <p className="text-[0.75vw]">{clientData?.gst?.state_name}</p>
          </div>
          <div className="flex flex-col gap-y-[0.3vw]">
            <label className="text-[1vw]">State Code</label>
            <p className="text-[0.75vw]">
              {clientData?.gst?.state_code_number}
            </p>
          </div>
          <div className="flex flex-col gap-y-[0.3vw]">
            <label className="text-[1vw]">GSTIN</label>
            <p className="text-[0.75vw]">{clientData?.gst?.gstin}</p>
          </div>
          <div className="flex flex-col gap-y-[0.3vw]">
            <label className="text-[1vw]">Head Office</label>
            <p className="text-[0.75vw]">{clientData?.gst?.head_office}</p>
          </div>
          <div className="flex flex-col gap-y-[0.3vw]">
            <label className="text-[1vw]">Zip Code</label>
            <img
              src={`${img_url}${clientData?.gst?.upload_gst}`}
              className="h-[2vw] w-[2vw]"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center w-full ">
        <button onClick={handleVerify}
        className="flex h-[2vw] w-[6vw] bg-[#4C67ED] justify-center items-center text-amber-50 text-[1vw] rounded-[0.5vw] font-bold cursor-pointer">
          VERIFY
        </button>
      </div>
    </div>
  );
}
