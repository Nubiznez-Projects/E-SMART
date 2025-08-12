import React, { useState, useEffect } from "react";
import DCChart from "../DeliveryChalan/DCChart";
import { MdDoubleArrow } from "react-icons/md";
import { useDispatch } from "react-redux";
import CreateReceipt from "./CreateReceipt";
import { getReceiptByPoNum } from "../../../API/Sales/Receipt";
import dayjs from "dayjs";
import { MdModeEditOutline } from "react-icons/md";

export const SalesReceipt = ({
  poID,
  dcID,
  setHeaderTab,
  invoiceID,
  setPOId,
  poData,
  customerList,
  isView
}) => {
  const [openPopoverId, setOpenPopoverId] = useState(null);
  const dispatch = useDispatch();
  const [addReceipt, setAddReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState();
  const [RcptID, setRcptID] = useState();

  const getStatusClasses = (status) => {
    switch (status) {
      case "Partially":
        return "bg-[#FFEAA5] text-[#FF9D00] border-[#FF9D00]";
      case "Fully":
        return "bg-[#ECFDF3] text-[#34AE2A] border-[#34AE2A]]";
      default:
        return "";
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

  const fetchReceiptById = async () => {
    try {
      const response = await getReceiptByPoNum(invoiceID);
      setReceiptData(response);
      console.log("Invoice Fetched Successfully :", response);
    } catch (err) {
      console.error("Getting Error in Invoice :", err);
    }
  };

  const handleEdit = (id) => {
    setRcptID(id);
    setAddReceipt(true);
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
          <DCChart />
        </div>
        <div className="flex">
          <DCChart />
        </div>
        <div className="flex w-full justify-center items-center">
          <button
            className="flex flex-row items-center justify-center bg-[#4C67ED] text-white h-[1.7vw] px-[0.7vw] cursor-pointer rounded-[0.5vw]"
            onClick={() => {
              setRcptID(item?.VoucherNum);
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

  console.log(receiptData, "receiptData", data, "data");

  useEffect(() => {
    if (addReceipt === false) {
      fetchReceiptById();
    }
  }, [addReceipt]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (openPopoverId !== null) {
        const clickedElement = event.target;
        const isStatusButton = clickedElement.closest(".status-button");
        const isDropdownContent = clickedElement.closest(
          ".status-dropdown-content"
        );
        if (!isStatusButton && !isDropdownContent) {
          setOpenPopoverId(null);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openPopoverId]);

  return (
    <>
      <div className="flex h-[83vh] overflow-y-auto scrollbar-hide flex-col w-full p-[1vw] mx-[2vw]">
        {addReceipt === false ? (
          <div className="flex w-full items-end justify-end">
            <button
              className="bg-[#4C67ED] text-white px-[1vw] py-[0.25vw] rounded-[0.25vw] cursor-pointer"
              onClick={() => setAddReceipt(true)}
            >
              Add Receipt
            </button>
          </div>
        ) : (
          <div className="flex w-full items-end justify-end">
            <button
              className="bg-[#4C67ED] text-white px-[1vw] py-[0.25vw] rounded-[0.25vw] cursor-pointer"
              onClick={() => setAddReceipt(false)}
            >
              Back
            </button>
          </div>
        )}
        {addReceipt === false ? (
          !data || data?.length === 0 ? (
            <div className="text-center text-gray-500 text-[1vw] py-[1vw]">
              No data found! Click Add Button to add receipt
            </div>
          ) : (
            <>
              <div className="flex flex-nowrap gap-[2vw] mt-[1vw]">
                <div className="bg-[#BAC9EC4D] p-[1vw] rounded-[0.75vw] w-full">
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
                    <span className="text-[0.8vw]">
                      {" "}
                      {poData?.MobileNumber}{" "}
                    </span>
                  </div>
                </div>

                <div className="bg-[#BAC9EC4D] p-[1vw] rounded-[0.75vw] w-full">
                  <div className="text-[0.95vw]">Delivery To:</div>
                  <div className="text-[0.95vw] font-semibold">
                    {poData?.CustomerName}
                  </div>
                  <span className="text-[0.8vw]">
                    {getFullAddress(poData?.DeliveryAddress, customerList)}
                  </span>
                  <div className="text-[0.8vw]">{poData?.CustomerState}</div>
                  <div>
                    <span className="text-[0.9vw] font-bold">Email:</span>
                    <span className="text-[0.8vw]">{poData?.Email}</span>
                  </div>
                  <div>
                    <span className="text-[0.9vw] font-bold">Phone:</span>
                    <span className="text-[0.8vw]">{poData?.MobileNumber}</span>
                  </div>
                </div>
              </div>
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
                          className={`flex w-[7vw] items-center justify-center text-[0.7vw] font-medium border-[0.1vw] rounded-full py-[0.1vw] ${getStatusClasses(
                            items?.RecStatus
                          )}`}
                        >
                          {items?.RecStatus || "N/A"}
                        </label>
                        <span
                          onClick={() => handleEdit(items?.VoucherNum)}
                          className="cursor-pointer flex justify-center items-center"
                        >
                          <MdModeEditOutline size={"0.9vw"} />
                        </span>
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
                      <div className="flex justify-end items-end gap-x-[0.5vw] col-span-2 mr-[2.5vw]">
                                  <button
                                    className="flex flex-row items-center justify-center mt-[0.4vw] bg-[#4C67ED] text-white h-[1.3vw] px-[0.5vw] cursor-pointer rounded-[0.3vw]"
                                    onClick={() => {
                                      setHeaderTab("Credit");
                                    }}
                                  >
                                    <span className="text-[0.75vw] font-bold">Credit</span>
                                    <span className="ml-[0.5vw]">
                                      <MdDoubleArrow size={"1vw"} />
                                    </span>
                                  </button>
                       </div>
                    </div>
                  </div>
                ))}
            </>
          )
        ) : (
          <div className="min-h-[60vh] max-h-[80vh] overflow-y-auto scrollbar-hide">
            <CreateReceipt
              poID={poID}
              dcID={dcID}
              poData={poData}
              RcptID={RcptID}
              invoiceID={invoiceID}
              setAddReceipt={setAddReceipt}
              // setTabName={setTabName}
              // setOpenAddModal={setOpenAddModal}
            />
          </div>
        )}
      </div>
    </>
  );
};
