import React, { useState } from "react";
import { ViewPurchasePO } from "./PurchasePO/ViewPurchasePO";
import { ViewPurchaseGrn } from "./GRN/ViewPurchaseGrn";
import { ViewBillEntry } from "./BillEntry/ViewBillEntry";
import { ViewPayment } from "./Payment/ViewPayment";

export const ViewForm = ({
  purchasePOID,
  setPurchasePoData,
  purchasePOData,
}) => {
  const [activeTab, setActiveTab] = useState("PO");
  const [viewGRNID, setViewGRNID] = useState();

  const tabs = [
    { id: "PO", label: "PO" },
    { id: "GRN", label: "GRN" },
    { id: "BillEntry", label: "BILLENTRY" },
    { id: "payment", label: "PAYMENT" },
    { id: "debit", label: "DEBIT" },
  ];

  const handleTab = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="w-full h-full px-[1vw] font-sans">
      <div className="flex w-full p-[1vw] justify-between border-b-[0.2vw] border-black">
        <div className="text-[1.25vw] font-extrabold">E-SMART</div>
        <div className="text-[1.25vw] font-semibold">
          {activeTab === "PO"
            ? "VIEW PURCHASE ORDER "
            : activeTab === "GRN"
            ? "VIEW GRN"
            : activeTab === "BillEntry"
            ? "VIEW BILL Entry"
            : activeTab === "payment"
            ? "VIEW PAYMENT"
            : "VIEW DEBIT NOTE"}
        </div>
        <div className="flex items-center justify-center gap-[1vw]">
          <div className="text-[1.1vw] font-semibold">PO Num:</div>
          <div className="text-[1vw]">{purchasePOID}</div>
        </div>
      </div>
      <div className="flex items-center justify-center pt-[2vw] gap-[1vw] mx-[1vw]  border-[#323232]">
        {tabs.map((tab, index) => (
          <React.Fragment key={tab.id}>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => handleTab(tab.id)}
            >
              <div
                className={`w-[1.8vw] h-[1.8vw] rounded-full flex items-center justify-center  text-[0.9vw] font-bold
                    ${
                      activeTab === tab.id
                        ? "bg-[#323232] text-white border-[#323232] border-[0.2vw]"
                        : "bg-[#A9A9A9] text-white"
                    }`}
              >
                {index + 1}
              </div>
              <span
                className={`ml-[0.5vw] text-[1vw] font-medium ${
                  activeTab === tab.id
                    ? "text-[#323232] font-semibold"
                    : "text-[#4F4F4F]"
                }`}
              >
                {tab.label}
              </span>
            </div>
            {index < tabs.length - 1 && (
              <div className="flex w-[6vw] h-[2px] bg-[#A0A0A0]"></div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div>
        <div className="text-[0.95vw] text-[#323232]">
          {activeTab === "PO" && (
            <div>
              <ViewPurchasePO purchasePOID={purchasePOID} />
            </div>
          )}
          {activeTab === "GRN" && (
            <div>
              <ViewPurchaseGrn
                purchasePOID={purchasePOID}
                setPurchasePoData={setPurchasePoData}
                purchasePOData={purchasePOData}
                setViewGRNID={setViewGRNID}
              />
            </div>
          )}
          {activeTab === "BillEntry" && (
            <div>
              <ViewBillEntry purchasePOID={purchasePOID} />
            </div>
          )}
          {activeTab === "payment" && (
            <div>
              <ViewPayment purchasePOID={purchasePOID} />
            </div>
          )}
          {activeTab === "debit" && <div>Debit Content Goes Here...</div>}
        </div>
      </div>
    </div>
  );
};
