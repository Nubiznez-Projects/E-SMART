import React, { useEffect, useState } from "react";
import { getSalePO, getSalePOByID, getSalesPOAll } from "../../../API/Sales/SalesPO";
import { getCustomersByID } from "../../../API/MasterModule/Customer";
import dayjs from "dayjs";
import { DeliveryChalan } from "../DeliveryChalan/DCList";
import { SalesInvoice } from "../SalesInvoice/SalesInvoice";
import { SalesReceipt } from "../SalesReceipt/SalesReceipt";
import ViewSalesDC from "../DeliveryChalan/ViewSalesDC";
import ViewInvoice from "../SalesInvoice/ViewInvoice";
import ViewReceipt from "../SalesReceipt/ViewReceipt";
import { DebitCreditNote } from "../DebitCreditNote/DebitCreditNote";

export const ViewPurchasePO = ({ 
  poID,
  headerTab, setHeaderTab
}) => {
  const [poData, setPoData] = useState();
  const [dcData, setDCData] = useState();
  const [invoiceData, setInvoiceData] = useState();
  const [receiptData, setReceiptData] = useState();
  const [customerList, setCustomerList] = useState();
   //const [headerTab, setHeaderTab] = useState("PO");

  console.log(poData, "view_data");

    const handleTab = (name) => {
    setHeaderTab(name);
  };

    const heading =
    headerTab === "PO" ? "PURCHASE ORDER" :
    headerTab === "DC"
      ? "DELIVERY CHALLAN"
      : headerTab === "Invoice"
      ? "INVOICE"
      : headerTab === "Receipt"
      ? "RECEIPT" : 
      headerTab === "Credit"
      ? "CREDIT" : "";

      console.log(headerTab, "headerTab")

  const fetchSalesPOById = async () => {
    try {
      const response = await getSalePOByID(poID);
      setHeaderTab("PO")
      fetchCustomer(response?.CustomerID);
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllPODetails = async () =>{
    try{
     const response = await getSalesPOAll(poID);
     setPoData(response?.po);
     setDCData(response?.dc);
     setInvoiceData(response?.invoice);
     setReceiptData(response?.receipt);
     fetchCustomer(response?.po?.CustomerID);
    }catch(error){
      console.error("Error fetching in PO details", error);
    }
  }

  const fetchCustomer = async (cusId) => {
    try {
      const response = await getCustomersByID(cusId);
      setCustomerList(response);
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const parseItems = (raw) => {
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  console.log(customerList, "customerList");

  const getFullAddress = (addressRef, customer) => {
    if (!addressRef || !customer?.BillingAddress) return "";

    const [, indexStr] = addressRef.split("__");
    const index = parseInt(indexStr);

    let addresses = [];

    try {
      // Parse if it's a string
      addresses =
        typeof customer.BillingAddress === "string"
          ? JSON.parse(customer.BillingAddress)
          : customer.BillingAddress;

      const addr = addresses[index];

      return addr
        ? `${addr.doorNo}, ${addr.floor}, ${addr.street}, ${addr.area}, ${addr.district}, ${addr.pincode}`
        : "";
    } catch (err) {
      console.error("Error parsing BillingAddress:", err);
      return "";
    }
  };

  useEffect(() => {
    if (poID) {
      fetchSalesPOById();
      fetchAllPODetails();
    }
  }, [poID]);

  const totalAmount = poData?.Items?.reduce((sum, item) => {
    return sum + (item.Amount || 0);
  }, 0);

  return (
     <>
      <div className="flex w-full p-[1vw] justify-between">
              <label className="text-[1.5vw] font-bold">E-SMART</label>
              <label className="flex justify-center items-center text-[1.2vw]">
                {heading}
              </label>
              <label className="flex justify-center items-center text-[1.1vw]">
                {poData?.SPoNum}
              </label>
            </div>
            <div className="flex items-center justify-evenly pt-[1vw] gap-[0.3vw] mx-[1vw] border-t border-b-gray-950">
              {/* PO */}
                 <div
                className="flex items-center cursor-pointer"
                onClick={() => handleTab("PO")}
              >
                <div
                  className={`w-[1.7vw] h-[1.7vw] rounded-full flex items-center justify-center text-white text-[0.8vw] font-bold 
                ${headerTab === "PO" ? "bg-[#4C67ED]" : "bg-gray-400"}`}
                >
                  1
                </div>
                <span
                  className={`ml-2 text-[1vw] font-medium ${
                    headerTab === "PO" ? "text-[#4C67ED]" : "text-gray-500"
                  }`}
                >
                  PO
                </span>
              </div>
               <div className="flex w-[6vw] h-[2px] bg-gray-300"></div>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => handleTab("DC")}
              >
                <div
                  className={`w-[1.7vw] h-[1.7vw] rounded-full flex items-center justify-center text-white text-[0.8vw] font-bold 
                ${headerTab === "DC" ? "bg-[#4C67ED]" : "bg-gray-400"}`}
                >
                  2
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
                className="flex items-center cursor-pointer"
                onClick={() => handleTab("Invoice")}
              >
                <div
                  className={`w-[1.7vw] h-[1.7vw] rounded-full flex items-center justify-center text-white text-[0.8vw] font-bold 
                ${headerTab === "Invoice" ? "bg-[#4C67ED]" : "bg-gray-400"}`}
                >
                  3
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
                className="flex items-center cursor-pointer"
                onClick={() => handleTab("Receipt")}
              >
                <div
                  className={`w-[1.7vw] h-[1.7vw] rounded-full flex items-center justify-center text-white text-[0.8vw] font-bold 
                ${headerTab === "Receipt" ? "bg-[#4C67ED]" : "bg-gray-400"}`}
                >
                  4
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
                className="flex items-center cursor-pointer"
                onClick={() => handleTab("Credit")}
              >
                <div
                  className={`w-[1.7vw] h-[1.7vw] rounded-full flex items-center justify-center text-white text-[0.8vw] font-bold 
                ${headerTab === "Credit" ? "bg-[#4C67ED]" : "bg-gray-400"}`}
                >
                  5
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
     
      <div className="flex items-center justify-between px-[2vw] mt-[2vw]">
        <div className="flex w-[50vw] gap-x-[2vw]">
          <div className="flex flex-col">
            <span className="text-[0.9vw] text-[#0A0E0D99]">PO Number:</span>
            <span className="text-[0.9vw] text-[#0A0E0D99]">Issued Date:</span>
            <span className="text-[0.9vw] text-[#0A0E0D99]">
              Expected Delivery Date:
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.9vw] font-medium">{poData?.SPoNum}</span>
            <span className="text-[0.9vw] font-medium">
              {poData?.IssuedDate
                ? dayjs(poData?.IssuedDate).format("DD-MM-YYYY")
                : "-"}
            </span>

            <span className="text-[0.9vw] font-medium">
              {poData?.DeliveryDate
                ? dayjs(poData?.DeliveryDate).format("DD-MM-YYYY")
                : "-"}

              {/* !isNaN(new Date(poData.DeliveryDate)) &&
                 new Date(poData.DeliveryDate).toISOString().split("T")[0]} */}
            </span>
          </div>
        </div>
        <div className="w-[50vw] flex items-end justify-end text-[0.8vw]">
          {poData?.BillFrom}
        </div>
      </div>
      <div className="flex px-[2vw] gap-[2vw] mt-[1vw]">
        <div className="bg-[#BAC9EC4D] p-[1vw] w-[40vw] rounded-[0.75vw]">
          <div className="text-[0.95vw]">Bill To:</div>
          <div className="text-[0.95vw] font-semibold">
            {poData?.CustomerName}
          </div>
          <span className="text-[0.8vw]">
            {getFullAddress(poData?.OrderTo, customerList)}
          </span>
          <div className="text-[0.8vw]">{poData?.CustomerState}</div>
          <div>
            <span className="text-[0.9vw] font-bold">Email:</span>
            <span className="text-[0.8vw]">{poData?.Email}</span>
          </div>
          <div>
            <span className="text-[0.9vw] font-bold">Phone:</span>
            <span className="text-[0.8vw]"> {poData?.MobileNumber} </span>
          </div>
        </div>
        <div className="bg-[#BAC9EC4D] p-[1vw] w-[40vw] rounded-[0.75vw]">
          <div className="text-[0.95vw]">Delivery To:</div>
          <div className="text-[0.95vw] font-semibold">
            {poData?.CustomerName}
          </div>
          <span className="text-[0.8vw]">
            {" "}
            {getFullAddress(poData?.DeliveryAddress, customerList)}
          </span>
          <div className="text-[0.8vw]">{poData?.CustomerState}</div>
          <div>
            <span className="text-[0.9vw] font-bold">Email:</span>
            <span className="text-[0.8vw]">{poData?.Email}</span>
          </div>
          <div>
            <span className="text-[0.9vw] font-bold">Phone:</span>
            <span className="text-[0.8vw]">{poData?.MobileNumber} </span>
          </div>
        </div>
      </div>
      {headerTab === "DC" ? (
        <div className="flex w-full">
      <ViewSalesDC 
            poData={poData}
            dcData={dcData}
            setHeaderTab={setHeaderTab}
       />
       </div>
      ) : headerTab === "Invoice" ? (
       <div className="flex w-full">
        <ViewInvoice
            poData={poData}
            dcData={dcData}
            invoiceData={invoiceData}
            setHeaderTab={setHeaderTab}
       />
       </div>
      ) : headerTab === "Receipt" ? (
        <div className="flex w-full">
        <ViewReceipt
           poData={poData}
            dcData={dcData}
            receiptData={receiptData}
            setHeaderTab={setHeaderTab}
       />
       </div>
      )
      : headerTab === "Credit" ? (
        <div className="flex w-full">
        <DebitCreditNote  />
        </div>
      ) : (
      <>
       <div className="h-[47vh] overflow-auto scrollbar-hide">
         <div className="px-[2vw] mt-[1vw]">
        <div className="bg-[#BAC9EC4D] rounded-[0.6vw] py-[0.6vw] px-[0.5vw] inline-flex items-center justify-between shadow-md text-center min-w-full my-[0.25vw] ">
          <div className="flex-1 text-center text-[#0A0E0D] font-semibold text-[0.8vw]">
            S.No
          </div>
          <div className="w-px bg-gray-500 h-[1.1vw] mx-[0.5vw]"></div>

          <div className="flex-1 text-center text-[#0A0E0D] font-semibold text-[0.75vw]">
            HSN
          </div>
          <div className="w-px bg-gray-500 h-[1.1vw] mx-[0.5vw]"></div>

          <div className="flex-1 text-center text-[#0A0E0D] font-semibold text-[0.75vw]">
            Item Code
          </div>
          <div className="w-px bg-gray-500 h-[1.1vw] mx-[0.5vw]"></div>

          <div className="flex-1 text-center text-[#0A0E0D] font-semibold text-[0.75vw]">
            Item Name
          </div>
          <div className="w-px bg-gray-500 h-[1.1vw] mx-[0.5vw]"></div>

          <div className="flex-1 text-center text-[#0A0E0D] font-semibold text-[0.75vw]">
            Quantity
          </div>
          <div className="w-px bg-gray-500 h-[1.1vw] mx-[0.5vw]"></div>

          <div className="flex-1 text-center text-[#0A0E0D] font-semibold text-[0.75vw]">
            Rate
          </div>
          <div className="w-px bg-gray-500 h-[1.1vw] mx-[0.5vw]"></div>

          <div className="flex-1 text-center text-[#0A0E0D] font-semibold text-[0.75vw]">
            Net Amount
          </div>
        </div>
        <div>
          {parseItems(poData?.Items)?.map((items, index) => {
            return (
              <div
                key={index}
                className="rounded-[0.6vw] py-[0.5vw] px-[0.5vw] inline-flex items-center justify-between border-[0.1vw] border-black text-center min-w-full my-[0.25vw]"
              >
                <div className="flex-1 text-center text-[#0A0E0D] font-medium text-[0.9vw]">
                  {index + 1}
                </div>
                <div className="w-px bg-white h-[1.1vw] mx-[0.5vw]"></div>

                <div className="flex-1 text-center text-[#0A0E0D] font-medium text-[0.75vw]">
                  {items?.HSN}
                </div>
                <div className="w-px bg-white h-[1.1vw] mx-[0.5vw]"></div>

                <div className="flex-1 text-center text-[#0A0E0D] font-medium text-[0.75vw]">
                  {items?.ItemCode}
                </div>
                <div className="w-px bg-white h-[1.1vw] mx-[0.5vw]"></div>

                <div className="flex-1 text-center text-[#0A0E0D] font-medium text-[0.75vw]">
                  {items?.ItemName}
                </div>
                <div className="w-px bg-white h-[1.1vw] mx-[0.5vw]"></div>

                <div className="flex-1 text-center text-[#0A0E0D] font-medium text-[0.75vw]">
                  {items?.Quantity}
                </div>
                <div className="w-px bg-white h-[1.1vw] mx-[0.5vw]"></div>

                <div className="flex-1 text-center text-[#0A0E0D] font-medium text-[0.75vw]">
                  {items?.Rate}
                </div>
                <div className="w-px bg-white h-[1.1vw] mx-[0.5vw]"></div>

                <div className="flex-1 text-center text-[#0A0E0D] font-medium text-[0.75vw]">
                  {items?.Amount}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex w-full mt-[1vw] items-center justify-end text-[#03B34D] text-[1.1vw] font-bold">
          <span>Total Amount:</span>
          <span>{`₹ ${totalAmount}`}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 px-[2vw] gap-[2vw] mt-[3vw] ">
        <div>
          <div className="text-[1.1vw] font-semibold mb-[1vw]">
            Terms Conditions
          </div>
          <ul className="list-disc pl-5 space-y-2 text-[0.75vw]">
            <li>Payment requested by cross payees A/c Cheque only.</li>
            <li>Unless otherwise stated all prices are strictly net.</li>
            <li>
              Our responsibility ceases on delivery of the goods to angadia
              carriers motor transport, rail or post.
            </li>
            <li>Goods supplied to order will not be accepted back.</li>
            <li>
              The Cause of action shall be deemed to arise in Mumbai; disputes
              shall be settled in Mumbai.
            </li>
            <li>
              Interest @ of 24% per annum will be charged on bills remaining.
            </li>
          </ul>
        </div>
        <div>
          <span className="text-[0.8vw]">
            Any Disputes or Differences whatsoever arising between the Parties
            relating to this contract shall be subject to jurisdiction of
            Conciliation & Arbitration Sub Committee for settlement in
            accordance with Rules for Conciliation of The Clothing Manufacturers
            Association of India and if not Resolved then shall be referred to
            Arbitration in accordance with the rules Arbitration of The Indian
            Merchant Chambers as per MOU between CMAI and IMC and award made in
            pursuance thereof shall be Final and binding on the Parties.
          </span>
        </div>
      </div>
      </div>
      </>
      )}
    </>
  );
};
