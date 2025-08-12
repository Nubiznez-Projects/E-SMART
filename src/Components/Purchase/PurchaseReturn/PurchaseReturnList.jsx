import { ConfigProvider, Table, Tooltip } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiLeftArrow } from "react-icons/bi";
import {
  IoIosArrowDropdownCircle,
  IoIosArrowDropupCircle,
} from "react-icons/io";
import { VscEdit, VscEye } from "react-icons/vsc";
import { getPurchaseReturnById } from "../../../API/Purchase/ReturnPurchase";
import DeleteModal from "../../Common/Modal/Delete/DeleteModal";
import DeleteList from "../../Common/Delete/DeleteComponent";

const ImgURl = import.meta.env.VITE_IMAGE_URL;
const apiUrl = import.meta.env.VITE_API_URL;

export const PurchaseReturnList = ({
  currentItems,
  purchaseReturnId,
  setPurchaseReturnID,
  purchaseReturnData,
  setPurchaseReturnData,
  setOpenAddModal,
  isView,
  setIsView,
}) => {
  // const [expandedRowKey, setExpandedRowKey] = useState(null);
  const [deletemodalIsOpen, setDeleteModalIsOpen] = useState(false);

  const columns = [
    {
      title: (
        <span className="flex items-center justify-center text-[1vw] font-semibold">
          Return Id
        </span>
      ),
      key: "poNumber",
      sorter: (a, b) => a.POReturnID?.localeCompare(b.POReturnID),
      render: (row) => {
        return (
          <div className="flex items-center justify-center text-[0.85vw] font-semibold">
            {row?.POReturnID}
          </div>
        );
      },
    },

    {
      title: (
        <span className="text-[1vw] font-semibold flex items-center justify-center">
          GRN Number
        </span>
      ),
      key: "supplier",
      sorter: (a, b) => a.GRNNum?.localeCompare(b.GRNNum),
      render: (row) => {
        return (
          <div className="text-[0.85vw] flex items-center justify-center">
            {row?.GRNNum}
          </div>
        );
      },
    },
    {
      title: (
        <span className="text-[1vw] font-semibold flex items-center justify-center">
          Supplier Name
        </span>
      ),
      key: "supplier",
      sorter: (a, b) => a.SupplierName?.localeCompare(b.SupplierName),
      render: (row) => {
        return (
          <div className="text-[0.85vw] flex items-center justify-center">
            {row?.SupplierName}
          </div>
        );
      },
    },
    {
      title: (
        <span className="text-[1vw] font-semibold flex items-center justify-center">
          Email
        </span>
      ),
      key: "supplier",
      sorter: (a, b) => a.Email?.localeCompare(b.Email),
      render: (row) => {
        return (
          <div className="text-[0.85vw] flex items-center justify-center">
            {row?.Email}
          </div>
        );
      },
    },
    {
      title: (
        <span className="text-[1vw] font-semibold flex items-center justify-center">
          Total Amount
        </span>
      ),
      key: "amount",
      // sorter: (a, b) => a.SupplierID?.localeCompare(b.SupplierID),
      render: (row) => {
        // const totalAmount = row?.Items?.reduce((sum, item) => {
        //   return sum + (item?.Total || item?.Amount || 0);
        // }, 0);

        return (
          <div className="flex items-center justify-center text-[0.85vw] pl-[1vw] ">
            {`₹ ${row?.TotalAmount}`}
          </div>
        );
      },
    },
    {
      title: <div className="text-[1vw] text-center">Return Date</div>,
      dataIndex: "expiriy_date",
      render: (text, row) => (
        <div className="flex items-center justify-center gap-[1vw] text-[#323232] px-[2vw] text-[1vw]">
          {dayjs(row?.ReturnDate).format("DD-MM-YYYY")}
        </div>
      ),
    },
    {
      title: <span className="text-[1vw] font-semibold">Action</span>,
      key: "chalan",
      // sorter: (a, b) => a.Status?.localeCompare(b.Status),
      width: "5vw",
      render: (row) => {
        return (
          <>
            <div className="flex gap-[0.5vw] px-[0.5vw]">
              <div className="flex gap-[1vw]">
                <button
                  className="cursor-pointer"
                  onClick={() => {
                    setPurchaseReturnID(row.POReturnID);
                    setIsView(true);
                  }}
                >
                  <VscEye size={"1.2vw"} />
                </button>
                <button>
                  {" "}
                  <VscEdit
                    className="cursor-pointer"
                    size={"1.2vw"}
                    onClick={() => {
                      setPurchaseReturnID(row.POReturnID);
                      setOpenAddModal(true);
                    }}
                  />
                </button>
                <button>
                  <AiOutlineDelete
                    className="cursor-pointer"
                    size={"1.2vw"}
                    onClick={() => {
                      setPurchaseReturnID(row.POReturnID);
                      setDeleteModalIsOpen(true);
                    }}
                  />
                </button>
              </div>
            </div>
          </>
        );
      },
    },
  ];

  //   {
  //     title: (
  //       <span className="flex items-center justify-center text-[1vw] font-semibold">
  //         Item Code
  //       </span>
  //     ),
  //     key: "itemCode",
  //     sorter: (a, b) => a.ItemCode?.localeCompare(b.ItemCode),
  //     render: (row) => {
  //       return (
  //         <div className="flex items-center justify-center text-[0.85vw] font-semibold">
  //           {row?.ItemCode}
  //         </div>
  //       );
  //     },
  //   },

  //   {
  //     title: (
  //       <span className="text-[1vw] font-semibold flex items-center justify-center">
  //         Item Name
  //       </span>
  //     ),
  //     key: "supplier",
  //     sorter: (a, b) => a.ItemName?.localeCompare(b.ItemName),
  //     render: (row) => {
  //       return (
  //         <div className="text-[0.85vw] flex items-center justify-center">
  //           {row?.ItemName}
  //         </div>
  //       );
  //     },
  //   },

  //   {
  //     title: (
  //       <span className="text-[1vw] font-semibold flex items-center justify-center">
  //         Quantity
  //       </span>
  //     ),
  //     key: "amount",
  //     // sorter: (a, b) => a.SupplierID?.localeCompare(b.SupplierID),
  //     render: (row) => {
  //       return (
  //         <div className="flex items-center justify-center text-[0.85vw] pl-[1vw] ">
  //           {row?.ReturnQty}
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     title: (
  //       <span className="text-[1vw] font-semibold flex items-center justify-center">
  //         Rate
  //       </span>
  //     ),
  //     key: "amount",
  //     // sorter: (a, b) => a.SupplierID?.localeCompare(b.SupplierID),
  //     render: (row) => {
  //       return (
  //         <div className="flex items-center justify-center text-[0.85vw] pl-[1vw] ">
  //           {row?.Rate}
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     title: (
  //       <span className="text-[1vw] font-semibold flex items-center justify-center">
  //         Total
  //       </span>
  //     ),
  //     key: "amount",
  //     // sorter: (a, b) => a.SupplierID?.localeCompare(b.SupplierID),
  //     render: (row) => {
  //       return (
  //         <div className="flex items-center justify-center text-[0.85vw] pl-[1vw] ">
  //           {row?.Total}
  //         </div>
  //       );
  //     },
  //   },
  // ];

  // const handleRowClick = (record) => {
  //   setExpandedRowKey((prevKey) =>
  //     prevKey === record.key ? null : record.key
  //   );
  // };

  // const StructuredData =
  //   currentItems?.length > 0 &&
  //   currentItems?.map((item, index) => ({
  //     key: item?.POReturnID,
  //     POReturnID: item?.POReturnID,
  //     GRNNum: item?.GRNNum,
  //     Image: item?.Image,
  //     Items: item?.Items.map((grnItems) => [
  //       {
  //         HSN: grnItems?.HSN,
  //         ItemCode: grnItems?.ItemCode,
  //         ItemName: grnItems?.ItemName,
  //         Quantity: grnItems?.Quantity,
  //         a_quantity: grnItems?.a_quantity,
  //         Rate: grnItems?.Rate,
  //         Total: grnItems?.Total,
  //       },
  //     ]),
  //     hidden_details: (
  //       <>
  //         <div className="">
  //           {" "}
  //           <Table
  //             rowKey="id" // use the 'id' field from your data
  //             columns={subColumns}
  //             pagination={false}
  //             dataSource={item?.Items}
  //           />
  //         </div>
  //       </>
  //     ),
  //   }));

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
    setPurchasePOID();
  };

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

  return (
    <div>
      <div>
        <ConfigProvider
          theme={{
            components: {
              Table: {
                // Customize hover styles
                rowHoverBg: "rgb(255, 255, 255, 0)",
                rowSelectedBg: "rgb(255, 255, 255, 0)",
                rowSelectedHoverBg: "rgb(255, 255, 255, 0)",
                borderRadius: "2vw", // Row border-radius
                shadowHover: "0 0.5vw 1vw rgba(0, 0, 0, 0.15)", // Shadow for hover
                //shadowSelected: '0 4px 8px rgba(0, 0, 0, 0.2)', // Shadow for selected
              },
            },
          }}
        >
          {/* <Table
            columns={columns}
            dataSource={StructuredData}
            rowKey="key"
            pagination={false}
            locale={{ emptyText: "No Data Available" }}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
            expandable={{
              expandedRowRender: (record) => (
                <p style={{ margin: 0 }}>
                  {record.hidden_details ?? "No details available"}
                </p>
              ),
              expandRowByClick: true,
              expandIcon: () => null,
              expandIconColumnIndex: -1,
              expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
            }}
          /> */}

          <Table
            rowKey="id" // use the 'id' field from your data
            style={{ height: "68vh", width: "100%" }}
            columns={columns}
            pagination={false}
            dataSource={currentItems}
            rowClassName={(record, index) => `custom-row-${index}`}
          />
        </ConfigProvider>
      </div>
      <DeleteModal
        show={deletemodalIsOpen}
        onClose={closeDeleteModal}
        height="20vw"
        width="30vw"
        closeicon={false}
      >
        <DeleteList
          setDeleteModalIsOpen={setDeleteModalIsOpen}
          title={`Want to delete this ${purchaseReturnData?.SupplierName}'s Return`}
          api={`${apiUrl}/poReturn/${purchaseReturnId}`}
          module={"PurchaseReturn"}
          // filter={filter}
          // setPermission={setPermission}
        />
      </DeleteModal>
    </div>
  );
};
