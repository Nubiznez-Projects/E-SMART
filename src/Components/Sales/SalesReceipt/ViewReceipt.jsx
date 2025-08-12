import React, { useEffect, useState } from "react";
import { MdModeEditOutline } from "react-icons/md";
import { MdDoubleArrow } from "react-icons/md";
import CreditDaysProgressBar from "../CreditDysProgressBar";
import EfficiencyProgressBar from "../EfficiencyProgressBar";

export default function ViewReceipt({  
    poData,
    dcData,
    receiptData,
    setHeaderTab,
}) {

    const getStatusClasses = (status) => {
    switch (status) {
      case "Partially Paid":
        return "bg-[#FFEAA5] text-[#FF9D00] border-[#FF9D00]";
      case "Fully Paid":
        return "bg-[#ECFDF3] text-[#34AE2A] border-[#34AE2A]]";
      default:
        return "";
    }
  };

  const normalizedData = Array.isArray(receiptData)
    ? receiptData
    : receiptData
    ? [receiptData]
    : [];

  const data = normalizedData.map((item) => ({
    VoucherNum: item?.VoucherNum,
    InvoiceNo: item?.InvoiceNo,
    IncoiceDate: item?.IncoiceDate,
    CustomerID: item?.CustomerID,
    CustomerName: item?.CustomerName,
    Year: item?.Year,
    CreatedDate: item?.CreatedDate,
    Ledger: item?.Ledger,
    GroupLedger: item?.GroupLedger,
    ByTo: item?.ByTo,
    Amount: item?.Amount,
    Narration: item?.Narration,
    RefNum: item?.RefNum,
    RefType: item?.RefType,
    RefAmount: item?.RefAmount,
    Createdby: item?.Createdby,
    UpdatedBy: item?.UpdatedBy,
    UpdatedDate: item?.UpdatedDate,
    RecStatusId: item?.RecStatusId,
    RecStatus: item?.RecStatus,
    hidden_details: (
      <div className="grid grid-cols-3 py-[1vw] justify-center items-center">
        <div className="flex">
          <CreditDaysProgressBar />
        </div>
        <div className="flex">
          <EfficiencyProgressBar />
        </div>
        <div className="flex w-full justify-center items-center">
          <button
            className="flex flex-row items-center justify-center bg-[#4C67ED] text-white h-[1.7vw] px-[0.7vw] cursor-pointer rounded-[0.5vw]"
            onClick={() => {
              setHeaderTab("Credit");
            }}
          >
            <span className="text-[0.8vw] font-bold">Credit</span>
            <span className="ml-[0.5vw]">
              <MdDoubleArrow size={"1.3vw"} />
            </span>
          </button>
        </div>
      </div>
    ),
  }));


  return (
    <>
      <div className="flex h-[45vh] overflow-y-auto scrollbar-hide flex-col w-full mx-[2vw]">
        {!data || data?.length === 0 ? (
            <div className="text-center text-gray-500 text-[1vw] py-[1vw]">
              No data found!
            </div>
          ) : (
            <>
            {Array.isArray(data) &&
                           data.map((items, index) => (
                             <div
                               key={index}
                               className="flex flex-col h-auto border-[0.1vw] border-[#0A0E0D4D] rounded-[0.5vw] w-full mt-[1vw] p-[0.6vw] gap-y-[0.6vw]"
                             >
                               <div className="grid grid-cols-4 gap-y-[0.6vw] gap-x-[1vw] w-full">
                                 {/* Row 1 */}
                                 <div className="flex w-[20vw] gap-x-[0.3vw] items-center col-span-1">
                                   <label className="text-[0.7vw] font-bold">
                                     Receipt Number:
                                   </label>
                                   <label className="text-[0.7vw]">
                                     {items?.VoucherNum}
                                   </label>
                                 </div>
           
                                 <div className="flex w-[15vw] gap-x-[0.3vw] items-center col-span-1">
                                   <label className="text-[0.7vw] font-bold">
                                     Invoice Number:
                                   </label>
                                   <label className="text-[0.7vw]">
                                     {items?.InvoiceNo}
                                   </label>
                                 </div>
           
                                 <div className="flex w-[10vw] gap-x-[0.3vw] items-center col-span-1">
                                   <label className="text-[0.7vw] font-bold">
                                     Payment Mode:
                                   </label>
                                   <label className="text-[0.7vw]">
                                     {items?.PaymentMode} Cash
                                   </label>
                                 </div>
           
                                 {/* Status + Edit aligned to right */}
                                 <div className="flex justify-end items-center gap-x-[0.5vw] col-span-1">
                                   <label
                                     className={`flex w-[6vw] items-center justify-center text-[0.7vw] font-medium border-[0.1vw] rounded-full py-[0.1vw] ${getStatusClasses(
                                       items?.RecStatus
                                     )}`}
                                   >
                                     {items?.RecStatus || "N/A"}
                                   </label>
                                 </div>
           
                                 {/* Row 2 */}
                                 <div className="flex gap-x-[0.3vw] items-center">
                                   <label className="text-[0.7vw] font-bold">
                                     Received By:
                                   </label>
                                   <label className="text-[0.7vw]">{items?.ByTo}</label>
                                 </div>
           
                                 <div className="flex gap-x-[0.3vw] items-center">
                                   <label className="text-[0.7vw] font-bold">
                                     Received Amount:
                                   </label>
                                   <label className="text-[0.7vw]">{items?.Amount}</label>
                                 </div>
                               </div>
                             </div>
                           ))}
            </>
          )}
      </div>
    </>
  );
}
