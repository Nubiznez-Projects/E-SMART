import React, { useEffect, useState } from "react";
import { ConfigProvider, Table } from "antd";
import dayjs from "dayjs";
import { IoMdArrowDropup } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdDoubleArrow } from "react-icons/md";
import {
  getDcByPoNum,
} from "../../../API/Sales/SalesDC";
import CreateDC from "./CreateDC";
import { MdModeEditOutline } from "react-icons/md";

export const DeliveryChalan = ({
  poID,
  dcID,
  setDcID,
  poData,
  customerList,
  setHeaderTab,
  isView,
}) => {
  const [openPopoverId, setOpenPopoverId] = useState(null);
  const [addDC, setAddDC] = useState(false);
  const [dcData, setDCData] = useState();

  const getStatusClasses = (status) => {
    switch (status) {
      case "Partially":
        return "bg-[#FFEAA5] text-[#FF9D00] border-[#FF9D00]";
      case "partially":
        return "bg-[#FFEAA5] text-[#FF9D00] border-[#FF9D00]";
      case "Fully":
        return "bg-[#ECFDF3] text-[#34AE2A] border-[#34AE2A]";
      case "fully":
        return "bg-[#ECFDF3] text-[#34AE2A] border-[#34AE2A]";
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

  const handleEdit = (id) => {
    setDcID(id);
    setAddDC(true);
  };

  const data =
    dcData?.length > 0 &&
    Array.isArray(dcData) &&
    dcData?.map((item) => ({
      key: item.DCNum,
      DCNum: item.DCNum,
      SPoDate: item?.SPoDate,
      SPoNum: item?.SPoNum,
      TotalQty: item?.TotalQty,
      TotalWgt: item?.TotalWgt,
      CreatedBy: item?.CreatedBy,
      TaxPer: item?.TaxPer,
      TaxValue: item?.TaxValue,
      TaxableValue: item?.TaxableValue,
      TotalValue: item?.TotalValue,
      UpdatedBy: item?.UpdatedBy,
      Status: item.Status,
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
        <div className="flex w-full justify-end items-end pr-[0.5vw]">
            <button
              className="flex flex-row items-center justify-center bg-[#4C67ED] text-white h-[1.6vw] px-[0.5vw] cursor-pointer rounded-[0.3vw]"
              onClick={() => {
                setDcID(item?.DCNum);
                setHeaderTab("Invoice");
              }}
            >
              <span className="text-[0.75vw] font-bold">Invoice</span>
              <span className="ml-[0.5vw]">
                <MdDoubleArrow size={"1vw"} />
              </span>
            </button>
        </div>
      ),
    }));

  console.log(data, " data data");

  const columns = [
    {
      title: <span className="text-[0.7vw] font-semibold">Quantity</span>,
      align: "center",
      width: "15vw",
      render: (row) => {
        return <div className="text-[0.7vw]">{row?.TotalQty}</div>;
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

  const fetchDCById = async () => {
    try {
      const response = await getDcByPoNum(poID, setDCData);
      // setGrnData(response);
      console.log("DC Fetched Successfully :", response);
      return response?.data;
    } catch (err) {
      console.error("Getting Error in DC :", err);
    }
  };

  useEffect(() => {
    if (addDC === false) {
      fetchDCById();
    }
  }, [addDC]);

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
      <div className="flex h-[83vh] overflow-y-auto scrollbar-hide flex-col w-full p-[0.5vw] mx-[2vw]">
        {!isView &&
          (addDC === false ? (
            <div className="flex w-full items-end justify-end">
              <button
                className="bg-[#4C67ED] text-white px-[1vw] py-[0.25vw] rounded-[0.25vw] cursor-pointer"
                onClick={() => {
                  setAddDC(true)
                  setDcID()
                }}
              >
                Add DC
              </button>
            </div>
          ) : (
            <div className="flex w-full items-end justify-end">
              <button
                className="bg-[#4C67ED] text-white px-[1vw] py-[0.25vw] rounded-[0.25vw] cursor-pointer"
                onClick={() => setAddDC(false)}
              >
                Back
              </button>
            </div>
          ))}

        {addDC === false ? (
          !data || data.length === 0 ? (
            <div className="text-center text-gray-500 text-[1vw] py-[1vw]">
              No data found! Click Add Button to add DC
            </div>
          ) : (
            <>
            {!isView &&
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
}
              {data?.map((items, index) => (
                <div
                  key={index}
                  className="flex flex-col h-auto border-[0.1vw] border-[#0A0E0D4D] rounded-[0.5vw] w-full p-[1vw] mt-[1vw]"
                >
                  <div className="flex w-full justify-between">
                    <div className="flex gap-x-[0.3vw]">
                      <label className="text-[0.7vw]">DC Number: </label>
                      <label className="text-[0.7vw]">{items?.DCNum}</label>
                    </div>
                    <div className="flex gap-x-[0.3vw]">
                      <label className="text-[0.7vw]">Created Date: </label>
                      <label className="text-[0.7vw]">
                        {dayjs(items?.CreatedDate).format("DD-MM-YYYY")}
                      </label>
                    </div>
                    <div className="flex gap-x-[0.3vw]">
                      <label className="text-[0.7vw]">Created By: </label>
                      <label className="text-[0.7vw]">
                        {items?.CreatedBy || "N/A"}
                      </label>
                    </div>
                    <div className="flex gap-x-[0.7vw]">
                      <label
                        className={`status-button w-[6vw] flex items-center justify-center text-[0.7vw] font-medium border-[0.1vw] rounded-full px-[1vw] py-[0.1vw]  ${getStatusClasses(
                          items?.Status
                        )}`}
                      >
                        {items?.Status || "N/A"}
                      </label>
                      { !isView &&
                        <span
                        onClick={() => {
                          handleEdit(items?.DCNum);
                        }}
                        className="cursor-pointer flex justify-center items-center"
                      >
                        <MdModeEditOutline size={"0.9vw"} />
                      </span>
                      }
                    </div>
                  </div>

                  <div className="flex mt-[1vw]">
                    <ConfigProvider
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
                            </div> // ✅ Safe wrapper
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
            <CreateDC
              //closeModal={closeModal}
              poID={poID}
              dcID={dcID}
              //isView={isView}
              poData={poData}
              setAddDC={setAddDC}
              // setTabName={setTabName}
              // setOpenAddModal={setOpenAddModal}
            />
          </div>
        )}
      </div>
    </>
  );
};
