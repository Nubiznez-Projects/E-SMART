import React, { useState } from "react";
import { PurchaseGRNList } from "./GRN/PurchaseGRNList";
import { PurchaseBillEntryList } from "./BillEntry/PurchaseBillEntryList";
import { PurchasePaymentList } from "./Payment/PurchasePaymentList";

export const AddForm = ({
  closeModal,
  isView,
  purchaseGrnID,
  purchaseGrnData,
  setPurchaseGrnData,
  setOpenAddModal,
  purchasePOData,
  setTabName,
  purchasePOID,
  setPurchasePoData,
  setPurchaseGrnID,
  currentItems,
}) => {
  const [activeTab, setActiveTab] = useState("GRN");
  const [captureId, setCaptureId] = useState();

  const tabs = [
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
          {activeTab === "GRN"
            ? "CREATE GRN"
            : activeTab === "BillEntry"
            ? "CREATE BILL Entry"
            : activeTab === "payment"
            ? "CREATE PAYMENT"
            : "CREATE DEBIT NOTE"}
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
              // onClick={() => handleTab(tab.id)}
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
          {activeTab === "GRN" && (
            <div>
              <PurchaseGRNList
                currentItems={currentItems}
                closeModal={closeModal}
                isView={isView}
                purchaseGrnID={purchaseGrnID}
                purchaseGrnData={purchaseGrnData}
                setPurchaseGrnID={setPurchaseGrnID}
                setPurchaseGrnData={setPurchaseGrnData}
                setOpenAddModal={setOpenAddModal}
                purchasePOData={purchasePOData}
                setPurchasePoData={setPurchasePoData}
                purchasePOID={purchasePOID}
                setActiveTab={setActiveTab}
                setCaptureId={setCaptureId}
                captureId={captureId}
              />
            </div>
          )}
          {activeTab === "BillEntry" && (
            <div>
              <PurchaseBillEntryList
                setActiveTab={setActiveTab}
                captureId={captureId}
                purchasePOID={purchasePOID}
              />
            </div>
          )}
          {activeTab === "payment" && (
            <div>
              {" "}
              <PurchasePaymentList
                setActiveTab={setActiveTab}
                captureId={captureId}
                purchasePOID={purchasePOID}
                purchasePOData={purchasePOData}
                setPurchasePoData={setPurchasePoData}
              />
            </div>
          )}
          {activeTab === "debit" && <div>Debit Content Goes Here...</div>}
        </div>
      </div>
    </div>
  );
};
