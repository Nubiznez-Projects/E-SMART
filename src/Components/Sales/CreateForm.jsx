import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getSalePOByID } from "../../API/Sales/SalesPO";
import { getCustomersByID } from "../../API/MasterModule/Customer";
import { DeliveryChalan } from "./DeliveryChalan/DCList";
import { SalesInvoice } from "./SalesInvoice/SalesInvoice";
import { SalesReceipt } from "./SalesReceipt/SalesReceipt";
import { MdArrowBackIosNew } from "react-icons/md";
import { IoChevronBackCircleSharp } from "react-icons/io5";

export default function CreateForm({
  setHeaderTab,
  headerTab,
  poID,
  dcID,
  invoiceId,
  setDcID,
  setInvoiceId,
}) {
  const [poData, setPoData] = useState();
  const [customerList, setCustomerList] = useState();
  const handleTab = (name) => {
    setHeaderTab(name);
  };

  const heading =
    headerTab === "DC"
      ? "DELIVERY CHALLAN"
      : headerTab === "Invoice"
      ? "INVOICE"
      : headerTab === "Receipt"
      ? "RECEIPT"
      : "CREDIT";

  const fetchSalesPOById = async () => {
    try {
      const response = await getSalePOByID(poID);
      setPoData(response);
      fetchCustomer(response?.CustomerID);
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const handleBack = async () => {
    if (headerTab === "Invoice") {
      setHeaderTab("DC");
    } else if (headerTab === "Receipt") {
      setHeaderTab("Invoice");
    } else if (headerTab === "Credit") {
      setHeaderTab("Receipt");
    }
  };

  const fetchCustomer = async (cusId) => {
    try {
      const response = await getCustomersByID(cusId);
      setCustomerList(response);
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (poID) {
      fetchSalesPOById();
    }
  }, [poID]);

  return (
    <div className="">
      <div className="flex w-full p-[1vw] justify-between">
        <label className="text-[1.5vw] font-bold">E-SMART</label>
        <label className="flex justify-center items-center text-[1.2vw]">
          {heading}
        </label>
        <label className="flex justify-center items-center text-[1.1vw]">
          {poData?.SPoNum}
        </label>
      </div>
      <div className="flex items-center justify-evenly pt-[2vw] gap-[1vw] mx-[1vw] border-t border-b-gray-950">
        {headerTab != "DC" && (
          <div
            className="flex justify-center items-center cursor-pointer"
            onClick={handleBack}
          >
            <IoChevronBackCircleSharp size={"1.5vw"}  />
          </div>
        )}
        {/* DC */}
        <div
          className="flex items-center"
          //onClick={() => handleTab("DC")}
        >
          <div
            className={`w-[1.7vw] h-[1.7vw] rounded-full flex items-center justify-center text-white text-[0.8vw] font-bold 
          ${headerTab === "DC" ? "bg-[#4C67ED]" : "bg-gray-400"}`}
          >
            1
          </div>
          <span
            className={`ml-2 text-[1vw] font-medium ${
              headerTab === "DC" ? "text-[#4C67ED]" : "text-gray-500"
            }`}
          >
            DC
          </span>
        </div>

        <div className="flex w-[6vw] h-[2px] bg-gray-300"></div>

        {/* INVOICE */}
        <div
          className="flex items-center"
          //onClick={() => handleTab("Invoice")}
        >
          <div
            className={`w-[1.7vw] h-[1.7vw] rounded-full flex items-center justify-center text-white text-[0.8vw] font-bold 
          ${headerTab === "Invoice" ? "bg-[#4C67ED]" : "bg-gray-400"}`}
          >
            2
          </div>
          <span
            className={`ml-2 text-[1vw] font-medium ${
              headerTab === "Invoice" ? "text-[#4C67ED]" : "text-gray-500"
            }`}
          >
            INVOICE
          </span>
        </div>

        <div className="flex w-[6vw] h-[2px] bg-gray-300"></div>

        {/* RECEIPT */}
        <div
          className="flex items-center"
          //onClick={() => handleTab("Receipt")}
        >
          <div
            className={`w-[1.7vw] h-[1.7vw] rounded-full flex items-center justify-center text-white text-[0.8vw] font-bold 
          ${headerTab === "Receipt" ? "bg-[#4C67ED]" : "bg-gray-400"}`}
          >
            3
          </div>
          <span
            className={`ml-2 text-[1vw] font-medium ${
              headerTab === "Receipt" ? "text-[#4C67ED]" : "text-gray-500"
            }`}
          >
            RECEIPT
          </span>
        </div>

        <div className="flex w-[6vw] h-[2px] bg-gray-300"></div>

        {/* CREDIT */}
        <div
          className="flex items-center"
          //onClick={() => handleTab("Credit")}
        >
          <div
            className={`w-[1.7vw] h-[1.7vw] rounded-full flex items-center justify-center text-white text-[0.8vw] font-bold 
          ${headerTab === "Credit" ? "bg-[#4C67ED]" : "bg-gray-400"}`}
          >
            4
          </div>
          <span
            className={`ml-2 text-[1vw] font-medium ${
              headerTab === "Credit" ? "text-[#4C67ED]" : "text-gray-500"
            }`}
          >
            CREDIT
          </span>
        </div>
      </div>

      <div className="flex">
        {headerTab === "DC" ? (
          <DeliveryChalan
            poID={poID}
            customerList={customerList}
            poData={poData}
            setHeaderTab={setHeaderTab}
            setDcID={setDcID}
            dcID={dcID}
          />
        ) : headerTab === "Invoice" ? (
          <SalesInvoice
            poID={poID}
            poData={poData}
            dcID={dcID}
            customerList={customerList}
            setHeaderTab={setHeaderTab}
            setInvoiceId={setInvoiceId}
            invoiceId={invoiceId}
          />
        ) : headerTab === "Receipt" ? (
          <SalesReceipt
            poID={poID}
            poData={poData}
            invoiceID={invoiceId}
            dcID={dcID}
            customerList={customerList}
            setHeaderTab={setHeaderTab}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
