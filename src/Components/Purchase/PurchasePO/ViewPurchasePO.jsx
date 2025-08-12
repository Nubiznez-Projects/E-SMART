import React, { useEffect, useState } from "react";
import { getPurchasePOID } from "../../../API/Purchase/PurchasePO";
import { ConfigProvider, Space, Table, Tag } from "antd";

export const ViewPurchasePO = ({ purchasePOID }) => {
  const [viewData, setViewData] = useState();

  console.log(viewData, "view_data");
  const fetchPurchasePOById = async () => {
    try {
      const response = await getPurchasePOID(purchasePOID);
      setViewData(response);
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (purchasePOID) {
      fetchPurchasePOById();
    }
  }, [purchasePOID]);

  const columns = [
    {
      title: <div className="text-[0.8vw]">S.No</div>, // Header of the column
      render: (row, items, index) => {
        return <div className="text-center text-[0.8vw]">{index + 1}</div>;
      },
    },
    {
      title: <div className="text-[0.8vw]">HSN</div>, // Header of the column
      render: (row) => {
        return (
          <div className="text-center text-[0.8vw]">
            {row.HSN}
          </div>
        );
      },
    },
    {
      title: <div className="text-[0.8vw]">Item Code</div>, // Header of the column
      render: (row) => {
        return (
          <div className="text-center text-[0.8vw]">
            {row.ItemCode}
          </div>
        );
      },
    },
    {
      title: <div className="text-[0.8vw]">Item Name</div>, // Header of the column
      render: (row) => {
        return (
          <div className="text-center text-[0.8vw]">
            {row.ItemName}
          </div>
        );
      },
    },
    {
      title: <div className="text-[0.8vw]">Quantity</div>, // Header of the column
      render: (row) => {
        return (
          <div className="text-center text-[0.8vw]">
            {row.Quantity}
          </div>
        );
      },
    },
    {
      title: <div className="text-[0.8vw]">Rate</div>, // Header of the column
      render: (row) => {
        return (
          <div className="text-center text-[0.8vw]">
            {row.Rate}
          </div>
        );
      },
    },
    {
      title: <div className="text-[0.8vw]">Total</div>, // Header of the column
      render: (row) => {
        return (
          <div className="text-center text-[0.8vw]">
            {row.Total}
          </div>
        );
      },
    },
  ];

  const totalAmount = viewData?.Items.reduce((sum, item) => {
    return sum + (item.Total || 0);
  }, 0);

  // const formatQuantity = (value) => {
  //   if (!value) return ""; // handle null or undefined
  //   const str = value.toString();
  //   return str.length > 10 ? `${str.slice(0, 10)}...` : str;
  // };

  return (
    <div>
      <div className="px-[1vw]">
        {/* <div className=" border-b-[0.1vw] border-black flex items-center justify-between">
          <div className=" font-bold text-[1.25vw] my-[1vw]">
            PURCHASE ORDER
          </div>
          <div className=" font-extrabold text-[1.5vw] my-[1vw]">E-SMART</div>
        </div> */}
      </div>
      <div className="mt-[2vw]">
        <div className="overflow-y-scroll h-[78vh] scrollbar-hide">
          <div className="flex items-center justify-between px-[1vw] my-[1vw] ">
            <div className="flex gap-[2vw]">
              <div className="flex flex-col">
                <span className="text-[0.9vw] text-[#0A0E0D99]">
                  PO Number:
                </span>
                <span className="text-[0.9vw] text-[#0A0E0D99]">
                  Issued Date:
                </span>
                <span className="text-[0.9vw] text-[#0A0E0D99]">
                  Expected Delivery Date:
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[0.9vw] font-medium">
                  {viewData?.PONum}
                </span>
                <span className="text-[0.9vw] font-medium">
                  {viewData &&
                    new Date(viewData?.CreatedDate).toISOString().split("T")[0]}
                </span>
                <span className="text-[0.9vw] font-medium">
                  {viewData &&
                    new Date(viewData?.DeliveryDate)
                      .toISOString()
                      .split("T")[0]}
                </span>
              </div>
            </div>
            <div className="flex justify-end w-[20vw] text-[0.8vw]">
              {viewData?.BillFrom}
            </div>
          </div>
          <div className="grid grid-cols-2 px-[1vw] gap-[2vw] text-[0.95vw] text-[#323232]">
            <div className="bg-[#F9F6EB] p-[1vw] rounded-[0.75vw]">
              <div>To:</div>
              <div className="font-bold">{viewData?.SupplierName}</div>
              <span>{viewData?.SupplierAddress}</span>
              <div>{viewData?.SupplierState}</div>
              <div>
                <span className="font-semibold">Email:</span>
                <span>{viewData?.Email}</span>
              </div>
              <div>
                <span className="font-semibold">Phone:</span>
                <span> {viewData?.MobileNumber}</span>
              </div>
            </div>
            <div className="bg-[#F9F6EB] p-[1vw] rounded-[0.75vw]">
              <div>From :</div>
              <div className="font-bold">{viewData?.BillFrom}</div>
              <span>{viewData?.DeliveryAddress}</span>
              <div>{viewData?.Supplier?.SupplierState}</div>
              <div>
                <span className="font-semibold">Email:</span>
                <span>sandeepmauryadesigns@gmail.com </span>
              </div>
              <div>
                <span className="font-semibold">Phone:</span>
                <span> +91 98765 43210 </span>
              </div>
            </div>
          </div>
          {/* <div className=" mt-[1vw]">
            <div className="bg-[#EADFBC80] py-[0.6vw] px-[0.5vw] inline-flex items-center justify-between shadow-md text-center min-w-full my-[0.25vw] ">
              <div className="flex-1 py-[0.25vw] text-center text-[#0A0E0D] text-[0.9vw]">
                S.No
              </div>
              <div className="w-px bg-gray-500 h-[1.1vw] mx-[0.5vw]"></div>

              <div className="flex-1 py-[0.25vw] text-center text-[#0A0E0D] text-[0.9vw]">
                HSN
              </div>
              <div className="w-px bg-gray-500 h-[1.1vw] mx-[0.5vw]"></div>

              <div className="flex-1 py-[0.25vw] text-center text-[#0A0E0D] text-[0.9vw]">
                Item Code
              </div>
              <div className="w-px bg-gray-500 h-[1.1vw] mx-[0.5vw]"></div>

              <div className="flex-1 py-[0.25vw] text-center text-[#0A0E0D] text-[0.9vw]">
                Item Name
              </div>
              <div className="w-px bg-gray-500 h-[1.1vw] mx-[0.5vw]"></div>

              <div className="flex-1 py-[0.25vw] text-center text-[#0A0E0D] text-[0.9vw]">
                Quantity
              </div>
              <div className="w-px bg-gray-500 h-[1.1vw] mx-[0.5vw]"></div>

              <div className="flex-1 py-[0.25vw] text-center text-[#0A0E0D] text-[0.9vw]">
                Rate
              </div>
              <div className="w-px bg-gray-500 h-[1.1vw] mx-[0.5vw]"></div>

              <div className="flex-1 py-[0.25vw] text-center text-[#0A0E0D] text-[0.9vw]">
                Net Amount
              </div>
            </div>
            <div>
              {viewData?.Items?.map((items, index) => {
                return (
                  <div className=" py-[0.5vw] px-[0.5vw] inline-flex items-center justify-between border-y-[0.1vw] border-black text-center min-w-full my-[0.25vw]">
                    <div className="flex-1 text-center text-[#0A0E0D] font-medium text-[0.9vw]">
                      {index + 1}
                    </div>
                    <div className="w-px bg-white h-[1.1vw] mx-[0.5vw]"></div>

                    <div className="flex-1 text-center text-[#0A0E0D] font-medium text-[0.9vw]">
                      {formatQuantity(items?.HSN)}
                    </div>
                    <div className="w-px bg-white h-[1.1vw] mx-[0.5vw]"></div>

                    <div className="flex-1 text-center text-[#0A0E0D] font-medium text-[0.9vw]">
                      {formatQuantity(items?.ItemCode)}
                    </div>
                    <div className="w-px bg-white h-[1.1vw] mx-[0.5vw]"></div>

                    <div className="flex-1 text-center text-[#0A0E0D] font-medium text-[0.9vw]">
                      {formatQuantity(items?.ItemName || items?.Description)}
                    </div>
                    <div className="w-px bg-white h-[1.1vw] mx-[0.5vw]"></div>

                    <div className="flex-1 text-center text-[#0A0E0D] font-medium text-[0.9vw]">
                      {formatQuantity(items?.Quantity)}
                    </div>
                    <div className="w-px bg-white h-[1.1vw] mx-[0.5vw]"></div>

                    <div className="flex-1 text-center text-[#0A0E0D] font-medium text-[0.9vw]">
                      {formatQuantity(items?.Rate)}
                    </div>
                    <div className="w-px bg-white h-[1.1vw] mx-[0.5vw]"></div>

                    <div className="flex-1 text-center text-[#0A0E0D] font-medium text-[0.9vw]">
                      {formatQuantity(items?.Total)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex w-full items-center justify-end text-[#03B34D] text-[1.1vw] font-bold mt-[1vw] px-[1vw]">
              <span>Total Amount:</span>
              <span>{`₹ ${totalAmount}`}</span>
            </div>
          </div> */}

          <div>
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
                columns={columns}
                pagination={false}
                dataSource={viewData?.Items}
                rowClassName={(record, index) => `custom-row-${index}`}
                className="custom-table"
              />
            </ConfigProvider>
          </div>

          <div className="flex w-full items-center justify-end text-[#03B34D] text-[1.1vw] font-bold mt-[1vw] px-[1vw]">
            <span>Total Amount:</span>
            <span>{`₹ ${totalAmount}`}</span>
          </div>
          <div className="grid grid-cols-2 px-[2vw] gap-[2vw] my-[1vw] py-[1vw] ">
            <div>
              <div className="text-[1.1vw] font-semibold mb-[1vw]">
                Terms Conditions
              </div>
              <ul class="list-disc pl-5 space-y-2 text-[0.75vw]">
                <li>Payment requested by cross payees A/c Cheque only.</li>
                <li>Unless otherwise stated all prices are strictly net.</li>
                <li>
                  Our responsibility ceases on delivery of the goods to angadia
                  carriers motor transport, rail or post.
                </li>
                <li>Goods supplied to order will not be accepted back.</li>
                <li>
                  The Cause of action shall be deemed to arise in Mumbai;
                  disputes shall be settled in Mumbai.
                </li>
                <li>
                  Interest @ of 24% per annum will be charged on bills
                  remaining.
                </li>
              </ul>
            </div>
            <div>
              <span className="text-[0.8vw]">
                Any Disputes or Differences whatsoever arising between the
                Parties relating to this contract shall be subject to
                jurisdiction of Conciliation & Arbitration Sub Committee for
                settlement in accordance with Rules for Conciliation of The
                Clothing Manufacturers Association of India and if not Resolved
                then shall be referred to Arbitration in accordance with the
                rules Arbitration of The Indian Merchant Chambers as per MOU
                between CMAI and IMC and award made in pursuance thereof shall
                be Final and binding on the Parties.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
