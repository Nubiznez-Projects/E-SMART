import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getCustomersByID } from "../../../API/MasterModule/Customer";
import { getSalesDCByID } from "../../../API/Sales/SalesDC";
import { getSalePOByID } from "../../../API/Sales/SalesPO";
import { ConfigProvider, Table } from "antd";
import CreditDaysProgressBar from "../CreditDysProgressBar";
import EfficiencyProgressBar from "../EfficiencyProgressBar";
import { IoMdArrowDropup } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdDoubleArrow } from "react-icons/md";

export default function ViewSalesDC({ poData, dcData, setHeaderTab }) {
  //const [customerList, setCustomerList] = useState();
  const [viewData, setViewData] = useState();
  // const [editableRowIndex, setEditableRowIndex] = useState(null);
  const [salesPOData, setSalesPOData] = useState();
  const [gross, setGross] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

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

  // const fetchSalesDCById = async () => {
  //   try {
  //     const response = await getSalesDCByID(dcID);
  //     setViewData(response);
  //     fetchCustomer(response?.CustomerID);
  //     return response;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

    // const fetchSalesPOById = async () => {
    //   try {
    //     const response = await getSalePOByID(poID);
    //     setSalesPOData(response);
    //     return response;
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
  

  // const fetchCustomer = async (customerId) => {
  //   try {
  //     const response = await getCustomersByID(customerId);
  //     setCustomerList(response);
  //     return response;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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
      // hidden_details: (
      //   <div className="flex w-full py-[1vw] justify-between items-center gap-[12vw]">
      //     <div className="flex flex-col gap-y-[0.5vw] pl-[2vw]">
      //       <p className="text-[0.8vw]">Credit Days</p>
      //       <CreditDaysProgressBar value={45} />
      //     </div>
      //     <div className="flex flex-col gap-y-[0.5vw]">
      //       <p className="text-[0.8vw]">Efficiency</p>
      //       <EfficiencyProgressBar value={25} />
      //     </div>
      //     <div className="flex w-full">
      //       <button
      //         className="flex flex-row items-center justify-center mt-[0.4vw] bg-[#4C67ED] text-white h-[1.6vw] px-[0.7vw] cursor-pointer rounded-[0.5vw]"
      //         onClick={() => {
      //           setDcID(item?.DCNum);
      //           setHeaderTab("Invoice");
      //         }}
      //       >
      //         <span className="text-[0.75vw] font-bold">Invoice</span>
      //         <span className="ml-[0.5vw]">
      //           <MdDoubleArrow size={"1vw"} />
      //         </span>
      //       </button>
      //     </div>
      //   </div>
      // ),
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

  useEffect(() => {
    const grossAmount = parseItems(dcData?.Items)?.reduce((acc, item) => {
      const q = parseFloat(item.Quantity) || 0;
      const r = parseFloat(item.Rate) || 0;
      return acc + q * r;
    }, 0);

    const taxVal = (grossAmount * 5) / 100;
    const totalVal = grossAmount + taxVal;

    setGross(grossAmount);
    setTax(taxVal);
    setTotal(totalVal);
  }, [dcData?.Items]);


  return (
     <>
      <div className="flex h-[45vh] overflow-y-auto scrollbar-hide flex-col w-full mx-[2vw]">
        {!data || data?.length === 0 ? (
            <div className="text-center text-gray-500 text-[1vw] py-[1vw]">
              No data found!
            </div>
          ) : (
            <>
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
                        // expandable={{
                        //   expandedRowRender: (record) => (
                        //     <div style={{ margin: 0 }}>
                        //       {record.hidden_details}
                        //     </div> // ✅ Safe wrapper
                        //   ),
                        //   rowExpandable: (record) =>
                        //     record.name !== "Not Expandable",
                        //   expandIconColumnIndex: 5,
                        //   expandIcon: ({ expanded, onExpand, record }) =>
                        //     expanded ? (
                        //       <IoMdArrowDropup
                        //         size={"1vw"}
                        //         className="cursor-pointer"
                        //         onClick={(e) => {
                        //           e.stopPropagation();
                        //           onExpand(record, e);
                        //         }}
                        //       />
                        //     ) : (
                        //       <IoMdArrowDropdown
                        //         size={"1vw"}
                        //         className="cursor-pointer"
                        //         onClick={(e) => {
                        //           e.stopPropagation();
                        //           onExpand(record, e);
                        //         }}
                        //       />
                        //     ),
                        // }}
                      />
                    </ConfigProvider>
                  </div>
                </div>
              ))}
            </>
          )
        }
      </div>
    </>
  );
}
