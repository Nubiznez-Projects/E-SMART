import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { ConfigProvider, Table } from "antd";
import { useDispatch } from "react-redux";
import { getInvoiceByPoNum, UpdateStatus } from "../../../API/Sales/Invoice";
import { fetchInvoice } from "../../../Redux/Slice/SalesModule/InvoiceThunk";
import CreateInvoice from "./CreateInvoice";
import { IoMdArrowDropup } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import DCChart from "../DeliveryChalan/DCChart";
import { MdDoubleArrow } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import CreditDaysProgressBar from "../CreditDysProgressBar";
import EfficiencyProgressBar from "../EfficiencyProgressBar";

export const SalesInvoice = ({
  poID,
  dcID,
  setHeaderTab,
  setPOId,
  poData,
  setIsViewModal,
  customerList,
  setInvoiceId,
  invoiceId,
  isView,
}) => {
  const [openPopoverId, setOpenPopoverId] = useState(null);
  const dispatch = useDispatch();
  const [addInvoice, setAddInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState();

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

  const handleEdit = (id) => {
    setInvoiceId(id);
    setAddInvoice(true);
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

  const data =
    invoiceData?.length > 0 &&
    Array.isArray(invoiceData) &&
    invoiceData?.map((item) => ({
      InvoiceNo: item?.InvoiceNo,
      SPoNum: item?.SPoNum,
      CreatedDate: item?.CreatedDate,
      CustomerID: item?.CustomerID,
      CustomerName: item?.CustomerName,
      DCNum: item?.DCNum,
      BankName: item?.BankName,
      Branch: item?.Branch,
      AccountNum: item?.AccountNum,
      IFSC_Code: item?.IFSC_Code,
      CustomerState: item?.CustomerState,
      Year: item?.Year,
      LedgerIncome: item?.LedgerIncome,
      GroupLedger: item?.GroupLedger,
      GrossAmount: item?.GrossAmount,
      TaxableaValue: item?.TaxableaValue,
      TaxPer: item?.TaxPer,
      TaxValue: item?.TaxValue,
      Cess: item?.Cess,
      RoundOff: item?.RoundOff,
      TotalValue: item?.TotalValue,
      VoucherType: item?.VoucherType,
      VoucherNum: item?.VoucherNum,
      CreatedBy: item?.CreatedBy,
      SPoDate: item?.SPoDate,
      InvoiceStatus: item?.InvoiceStatus,
      Items: parseItems(item?.Items?.length ? item.Items : poData?.Items).map(
        (item) => ({
          HSN: item.HSN || "",
          ItemCode: item.ItemCode || "",
          ItemName: item.ItemName || "",
          Quantity: Number(item.Quantity) || "",
          Rate: item.Rate || "",
          Amount:
            item.Quantity && item.Rate
              ? Number(item.Quantity) * Number(item.Rate)
              : 0,
        })
      ),
      hidden_details: (
        <div className="flex w-full py-[1vw] justify-between items-center gap-[10vw]">
          <div className="flex flex-col w-full items-center justify-center gap-y-[0.5vw] pl-[2vw]">
            <p className="text-[0.8vw]">Credit Days</p>
            <CreditDaysProgressBar value={73} />
          </div>
          <div className="flex flex-col w-full items-center justify-centergap-y-[0.5vw]">
            <p className="text-[0.8vw]">Efficiency</p>
            <EfficiencyProgressBar value={40} />
          </div>
          {!isView && (
            <div className="flex w-full items-center justify-center">
              <button
                className="flex flex-row items-center justify-center mt-[0.5vw] bg-[#4C67ED] text-white h-[1.6vw] px-[0.5vw] cursor-pointer rounded-[0.3vw]"
                onClick={() => {
                  setInvoiceId(item?.InvoiceNo);
                  setHeaderTab("Receipt");
                }}
              >
                <span className="text-[0.75vw] font-bold">Receipt</span>
                <span className="ml-[0.5vw]">
                  <MdDoubleArrow size={"1vw"} />
                </span>
              </button>
            </div>
          )}
        </div>
      ),
    }));

  const columns = [
    {
      title: <span className="text-[0.7vw] font-semibold">Quantity</span>,
      align: "center",
      width: "15vw",
      render: (row) => {
        let TotalQty;
        if (row?.Items && parseItems(row?.Items)) {
          TotalQty = parseItems(row?.Items)?.reduce(
            (acc, item) => acc + item.Quantity,
            0
          );
        }
        return <div className="text-[0.7vw]">{TotalQty}</div>;
      },
    },
    {
      title: <span className="text-[0.7vw] font-semibold">Gross Amount</span>,
      align: "center",
      width: "15vw",
      //sorter: (a, b) => a.CustomerName?.localeCompare(b.CustomerName),
      render: (row) => {
        let gross;
        if (row?.Items && parseItems(row?.Items)) {
          gross = parseItems(row?.Items)?.reduce(
            (acc, item) => acc + item.Amount,
            0
          );
        }

        return <div className="text-[0.7vw]">{gross}</div>;
      },
    },
    {
      title: <span className="text-[0.7vw] font-semibold">Tax</span>,
      align: "center",
      width: "15vw",
      render: (row) => {
        return <div className="text-[0.7vw]">{row?.TaxPer}</div>;
      },
    },
    {
      title: <span className="text-[0.7vw] font-semibold">Tax Value</span>,
      align: "center",
      width: "15vw",
      render: (row) => {
        return <div className="text-[0.7vw]">{row?.TaxValue}</div>;
      },
    },
    {
      title: <span className="text-[0.7vw] font-semibold">Net Amount</span>,
      align: "center",
      width: "15vw",
      render: (row) => {
        return <div className="text-[0.7vw]">{row?.TotalValue}</div>;
      },
    },
  ];

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

  const fetchInvoiceById = async () => {
    try {
      const response = await getInvoiceByPoNum(dcID);
      setInvoiceData(response);
      console.log("Invoice Fetched Successfully :", response);
      //return response;
    } catch (err) {
      console.error("Getting Error in Invoice :", err);
    }
  };

  useEffect(() => {
    if (addInvoice === false) {
      fetchInvoiceById();
    }
  }, [addInvoice]);

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

  console.log(data?.length, data, "data");

  return (
    <>
      <div className="flex h-[83vh] overflow-y-auto scrollbar-hide flex-col w-full p-[1vw] mx-[2vw]">
        {!data &&
          (addInvoice === false ? (
            <div className="flex w-full items-end justify-end">
              <button
                className="bg-[#4C67ED] text-white px-[1vw] py-[0.25vw] rounded-[0.25vw] cursor-pointer"
                onClick={() => {
                  setAddInvoice(true);
                  setInvoiceId();
                }}
              >
                Add Invoice
              </button>
            </div>
          ) : (
            <div className="flex w-full items-end justify-end">
              <button
                className="bg-[#4C67ED] text-white px-[1vw] py-[0.25vw] rounded-[0.25vw] cursor-pointer"
                onClick={() => setAddInvoice(false)}
              >
                Back
              </button>
            </div>
          ))}

        {addInvoice === false ? (
          !data || data?.length === 0 ? (
            <div className="text-center text-gray-500 text-[1vw] py-[1vw]">
              No data found! Click Add Button to add invoice
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

              {data?.map((items, index) => (
                <div
                  key={index}
                  className="flex flex-col h-auto border-[0.1vw] border-[#0A0E0D4D] rounded-[0.5vw] w-full p-[1vw] mt-[1vw]"
                >
                  <div className="flex w-full justify-between">
                    <div className="flex gap-x-[0.3vw]">
                      <label className="text-[0.7vw] font-bold">
                        Invoice Number:{" "}
                      </label>
                      <label className="text-[0.7vw]">{items?.InvoiceNo}</label>
                    </div>
                    <div className="flex gap-x-[0.3vw]">
                      <label className="text-[0.7vw] font-bold">
                        DC Number:{" "}
                      </label>
                      <label className="text-[0.7vw]">{items?.DCNum}</label>
                    </div>
                    <div className="flex gap-x-[0.3vw]">
                      <label className="text-[0.7vw] font-bold">
                        Created Date:{" "}
                      </label>
                      <label className="text-[0.7vw]">
                        {dayjs(items?.CreatedDate).format("DD-MM-YYYY")}
                      </label>
                    </div>
                    <div className="flex gap-x-[0.7vw]">
                      <label
                        className={`status-button w-[6vw] flex items-center justify-center text-[0.7vw] font-medium border-[0.1vw] rounded-full px-[1vw] py-[0.1vw]  ${getStatusClasses(
                          items?.InvoiceStatus
                        )}`}
                      >
                        {items?.InvoiceStatus || "N/A"}
                      </label>
                      <span
                        onClick={() => {
                          handleEdit(items?.InvoiceNo);
                        }}
                        className="cursor-pointer flex justify-center items-center"
                      >
                        <MdModeEditOutline size={"0.9vw"} />
                      </span>
                    </div>
                  </div>

                  <div className="flex mt-[1vw]">
                    <ConfigProvider
                      theme={{
                        components: {
                          Table: {
                            rowHoverBg: "rgb(255, 255, 255, 0)",
                            rowSelectedBg: "rgb(255, 255, 255, 0)",
                            rowSelectedHoverBg: "rgb(255, 255, 255, 0)",
                            borderRadius: "2vw",
                            shadowHover: "0 0.5vw 1vw rgba(0, 0, 0, 0.15)",
                          },
                        },
                      }}
                    >
                      <Table
                        rowKey="DCNum"
                        className="customSales-table"
                        style={{ width: "100%" }}
                        columns={columns}
                        dataSource={[items]}
                        pagination={false}
                        locale={{ emptyText: "No Data Available" }}
                        expandable={{
                          expandedRowRender: (record) => (
                            <div style={{ margin: 0 }}>
                              {record.hidden_details}
                            </div>
                          ),
                          rowExpandable: (record) =>
                            record.name !== "Not Expandable",
                          expandIconColumnIndex: 5,
                          expandIcon: ({ expanded, onExpand, record }) =>
                            expanded ? (
                              <IoMdArrowDropup
                                size={"1vw"}
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onExpand(record, e);
                                }}
                              />
                            ) : (
                              <IoMdArrowDropdown
                                size={"1vw"}
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onExpand(record, e);
                                }}
                              />
                            ),
                        }}
                      />
                    </ConfigProvider>
                  </div>
                </div>
              ))}
            </>
          )
        ) : (
          <div className="min-h-[60vh] max-h-[80vh] overflow-y-auto scrollbar-hide">
            <CreateInvoice
              poID={poID}
              dcID={dcID}
              invoiceId={invoiceId}
              poData={poData}
              setAddInvoice={setAddInvoice}
            />
          </div>
        )}
      </div>
    </>
  );
};
