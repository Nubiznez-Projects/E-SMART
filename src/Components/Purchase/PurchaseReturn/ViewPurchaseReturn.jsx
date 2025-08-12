import React from "react";
import { getPurchaseReturnById } from "../../../API/Purchase/ReturnPurchase";
import { useEffect } from "react";
import dayjs from "dayjs";
import { ConfigProvider, Table } from "antd";

export const ViewPurchaseReturn = ({
  purchaseReturnId,
  setPurchaseReturnID,
  purchaseReturnData,
  setPurchaseReturnData,
}) => {
  const columns = [
    {
      title: (
        <span className="flex items-center justify-center text-[1vw] font-semibold">
          Item Code
        </span>
      ),
      key: "poNumber",
      render: (row) => {
        return (
          <div className="flex items-center justify-center text-[0.85vw] font-semibold">
            {row?.ItemCode}
          </div>
        );
      },
    },
    {
      title: (
        <span className="flex items-center justify-center text-[1vw] font-semibold">
          Item Name
        </span>
      ),
      key: "poNumber",
      render: (row) => {
        return (
          <div className="flex items-center justify-center text-[0.85vw] font-semibold">
            {row?.ItemName}
          </div>
        );
      },
    },
    {
      title: (
        <span className="flex items-center justify-center text-[1vw] font-semibold">
          Rate
        </span>
      ),
      key: "poNumber",
      render: (row) => {
        return (
          <div className="flex items-center justify-center text-[0.85vw] font-semibold">
            {row?.Rate}
          </div>
        );
      },
    },
    {
      title: (
        <span className="flex items-center justify-center text-[1vw] font-semibold">
          Return Quantity
        </span>
      ),
      key: "poNumber",
      render: (row) => {
        return (
          <div className="flex items-center justify-center text-[0.85vw] font-semibold">
            {row?.ReturnQty}
          </div>
        );
      },
    },
    {
      title: (
        <span className="flex items-center justify-center text-[1vw] font-semibold">
          Total
        </span>
      ),
      key: "poNumber",
      render: (row) => {
        return (
          <div className="flex items-center justify-center text-[0.85vw] font-semibold">
            {`₹ ${row?.Total}`}
          </div>
        );
      },
    },
    {
      title: (
        <span className="flex items-center justify-center text-[1vw] font-semibold">
          HSN Code
        </span>
      ),
      key: "poNumber",
      render: (row) => {
        return (
          <div className="flex items-center justify-center text-[0.85vw] font-semibold">
            {row?.hsnCode}
          </div>
        );
      },
    },
  ];

  const fetchReturnByID = async () => {
    try {
      const response = await getPurchaseReturnById(purchaseReturnId);
      setPurchaseReturnData(response?.result);
    } catch (error) {
      console.error("Error :", error);
    }
  };

  useEffect(() => {
    if (purchaseReturnId) {
      fetchReturnByID();
    }
  }, [purchaseReturnId]);

  console.log("View Return Purchase :", purchaseReturnData);
  return (
    <>
      <div className="max-h-screen min-h-screen overflow-y-scroll scrollbar-hide bg-gray-100">
        {" "}
        <div className="border-t-[0.1vw] border-b-[0.1vw] border-0 border-black mt-[2vw] bg-white drop-shadow-sm">
          <div className="text-center py-[0.5vw] text-[1.25vw] font-semibold">
            Purchase Return
          </div>
        </div>
        <div className="px-[2vw] mt-[1vw] ">
          <div className="border-[0.1vw] border-[#3232327e] rounded-[0.5vw] px-[1vw] py-[0.5vw] bg-white     drop-shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-[1.1vw]">Return Details :</h3>
              <div className="flex items-center text-[1.1vw]">
                <span>Created Date :</span>
                <span>
                  {dayjs(purchaseReturnData?.ReturnDate).format("DD-MM-YYYY")}
                </span>
              </div>
            </div>
            <div className="border-0 border-b-[0.1vw] border-[#3232327e] " />
            <div className="grid grid-cols-2 gap-x-[2vw] gap-y-[0.5vw] mt-[1vw]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[1vw]">Return ID :</span>
                <span className=" text-[0.9vw]">
                  {purchaseReturnData?.POReturnID}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[1vw]">GRN Number :</span>
                <span className=" text-[0.9vw]">
                  {purchaseReturnData?.GRNNum}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[1vw]">
                  Supplier Name :
                </span>
                <span className=" text-[0.9vw]">
                  {purchaseReturnData?.SupplierName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[1vw]">
                  Contact Person :
                </span>
                <span className=" text-[0.9vw]">
                  {purchaseReturnData?.ContactPersonName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[1vw]">Email :</span>
                <span className=" text-[0.9vw]">
                  {purchaseReturnData?.Email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[1vw]">
                  Mobile Number :
                </span>
                <span className=" text-[0.9vw]">
                  {purchaseReturnData?.MobileNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[1vw]">Return Date :</span>
                <span className=" text-[0.9vw]">
                  {dayjs(purchaseReturnData?.ReturnDate).format("DD-MM-YYYY")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-x-[1vw] mt-[1vw] bg-[#323232] h-[2.5vw] rounded-[0.5vw] text-white">
              <span className=" ml-[1vw] font-semibold text-[1vw]">
                Reason :
              </span>
              <span className=" text-[0.9vw]">
                {purchaseReturnData?.Comments}
              </span>
            </div>
          </div>
        </div>
        <div className="px-[2vw] mt-[1vw]  ">
          <div className="border-[0.1vw] border-[#3232327e] rounded-[0.5vw] px-[1vw] py-[0.5vw] bg-white drop-shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-[1.1vw]">Return Items :</h3>
            </div>
            <div className="border-0 border-b-[0.1vw] border-[#3232327e] " />
            <ConfigProvider
              theme={{
                components: {
                  Table: {
                    rowHoverBg: "rgb(255, 255, 255, 0)",
                    rowSelectedBg: "rgb(255, 255, 255, 0)",
                    rowSelectedHoverBg: "rgb(255, 255, 255, 0)",
                    shadowHover: "0 0.5vw 1vw rgba(0, 0, 0, 0.15)",
                    headerSplitColor: "#000000",
                  },
                },
              }}
            >
              <Table
                rowKey="id" // use the 'id' field from your data
                className="custom-table"
                columns={columns}
                pagination={false}
                dataSource={
                  Array.isArray(purchaseReturnData?.Items)
                    ? purchaseReturnData.Items
                    : []
                }
                rowClassName={(record, index) => `custom-row-${index}`}
              />
            </ConfigProvider>
          </div>
        </div>
        <div className="px-[2vw] my-[1vw] ">
          <div className="border-[0.1vw] border-[#3232327e] rounded-[0.5vw] px-[1vw] py-[0.5vw]  bg-white drop-shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-[1.1vw]">Return Summary :</h3>
            </div>
            <div className="border-0 border-b-[0.1vw] border-[#3232327e] " />

            <div className="space-y-2 mt-[1vw]">
              <div className="flex justify-between text-[0.95vw]">
                <span className="text-gray-600">Total Items:</span>
                <span className="font-medium">
                  {purchaseReturnData?.TotalItems}
                </span>
              </div>
              <div className="flex justify-between text-[0.95vw]">
                <span className="text-gray-600">Total Quantity:</span>
                <span className="font-medium">
                  {purchaseReturnData?.TotalQuantity}
                </span>
              </div>
              <div className="flex justify-between text-[1vw] font-bold py-[1vw] border-t border-gray-200">
                <span>Total Amount:</span>
                <span>INR {purchaseReturnData?.TotalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Total Items:
// 1
// Total Quantity:
// 10
// Total Amount:
// INR 560.00
