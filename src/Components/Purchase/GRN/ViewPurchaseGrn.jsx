import { ConfigProvider, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteModal from "../../Common/Modal/Delete/DeleteModal";
import DeleteList from "../../Common/Delete/DeleteComponent";
import { RiArrowDropDownLine } from "react-icons/ri";
import {
  IoIosArrowDown,
  IoIosArrowDropdownCircle,
  IoIosArrowDropupCircle,
  IoIosArrowForward,
  IoMdArrowDropdown,
} from "react-icons/io";
import { VscEdit, VscEye } from "react-icons/vsc";
import { AiOutlineDelete } from "react-icons/ai";
import dayjs from "dayjs";
import {
  changePurchaseGrnStatus,
  getGrnByPoNum,
  getPurchaseGrnByID,
} from "../../../API/Purchase/PurchaseGRN";
import { fetchPurchaseGRN } from "../../../Redux/Slice/PurchaseModule/PurchaseGRNThunk";
import { CreatePurchaseGrn } from "./CreatePurchaseGrn";
import { getPurchasePOID } from "../../../API/Purchase/PurchasePO";

export const ViewPurchaseGrn = ({
  purchasePOID,
  purchasePOData,
  setPurchasePoData,
  setViewGRNID,
}) => {
  console.log(purchasePOData, "purchasePOData");
  const dispatch = useDispatch();
  const [deletemodalIsOpen, setDeleteModalIsOpen] = useState(false);
  // const apiUrl = "http://192.168.6.52:8092/api";
  const apiUrl = import.meta.env.VITE_API_URL;
  const [openPopoverId, setOpenPopoverId] = useState(null);
  const [addGrn, setAddGrn] = useState(false);
  const [grnData, setGrnData] = useState();
  const [showFull, setShowFull] = useState(false);
  const [expandedRowKey, setExpandedRowKey] = useState(null);

  const { purchaseGrn, purchaseGrn_loading, purchaseGrn_error } = useSelector(
    (state) => state?.purchaseingGRN
  );

  useEffect(() => {
    dispatch(fetchPurchaseGRN());
  }, []);

  const handleRowClick = (record) => {
    setExpandedRowKey((prevKey) =>
      prevKey === record.key ? null : record.key
    );
  };

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

  const columns = [
    {
      title: <div className="text-[0.8vw]">S.No</div>, // Header of the column
      render: (row, items, index) => {
        return <div className="text-center text-[0.8vw]">{index + 1}</div>;
      },
    },

    {
      title: <div className="text-[0.8vw]">Quantity</div>, // Header of the column
      render: (row) => {
        const flatData = row?.Items?.flat();

        const totalQuantity = flatData.reduce(
          (sum, item) => sum + item.Quantity,
          0
        );
        return (
          <div className="text-center text-[0.8vw]">
            {/* {formatQuantity(row?.Quantity)} */}
            {totalQuantity}
          </div>
        );
      },
    },
    {
      title: <div className="text-[0.8vw]">Gross Amount</div>, // Header of the column
      render: (row) => {
        const flatData = row?.Items?.flat();
        const totalAmount = flatData.reduce((sum, item) => sum + item.Total, 0);

        return <div className="text-center text-[0.8vw]">{totalAmount}</div>;
      },
    },
    {
      title: <div className="text-[0.8vw]">Tax</div>, // Header of the column
      render: (row) => {
        return <div className="text-center text-[0.8vw]">{row?.TaxPer}</div>;
      },
    },
    {
      title: <div className="text-[0.8vw]">Tax Value</div>, // Header of the column
      render: (row) => {
        return <div className="text-center text-[0.8vw]">{row?.TaxValue}</div>;
      },
    },
    {
      title: <div className="text-[0.8vw]">Net Amount</div>, // Header of the column
      render: (row) => {
        return (
          <div className="text-center text-[0.8vw]">{row?.TotalValue}</div>
        );
      },
    },
    {
      title: <div className="text-[0.8vw] text-center"></div>,
      dataIndex: "expiriy_date",
      width: "",
      render: (text, row) => (
        <div className="flex justify-between items-center text-[#323232] px-[2vw] text-[1vw]">
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent row click propagation
              handleRowClick(row); // ✅ Use row directly
            }}
          >
            {row.key === expandedRowKey ? (
              <IoIosArrowDropupCircle
                style={{ height: "1.3vw", width: "1.3vw" }}
              />
            ) : (
              <IoIosArrowDropdownCircle
                style={{ height: "1.3vw", width: "1.3vw" }}
              />
            )}
          </button>
        </div>
      ),
    },
  ];

  const fetchPurchasePOById = async () => {
    try {
      const response = await getPurchasePOID(purchasePOID);
      setPurchasePoData(response);
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

  const fetchGrnById = async () => {
    try {
      const response = await getGrnByPoNum(purchasePOID, setGrnData);
      // setGrnData(response);
      console.log("Grn Fetched Successfully :", response);
      return response?.data;
    } catch (err) {
      console.error("Getting Error in GRN :", err);
    }
  };

  useEffect(() => {
    if (addGrn === false) {
      fetchGrnById();
    }
  }, [addGrn]);

  // useEffect(()=>{
  //   if(){
  //     setViewGRNID
  //   }
  // },[])

  console.log("GRNVIEWFORM :", grnData);
  return (
    <>
      <div className="my-[1vw]">
        <>
          {!grnData || grnData.length === 0 ? (
            <div className="text-center text-gray-500 text-[1vw] py-[1vw]">
              No data found ! Click Add Button to add GRN
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 px-[1vw] gap-[2vw] mt-[0.5vw] text-[0.95vw] text-[#323232]">
                <div className="bg-[#F9F6EB] p-[1vw] rounded-[0.75vw]">
                  <div>To :</div>
                  <div className="font-bold">
                    {purchasePOData?.SupplierName}
                    {/* INNOFASHION */}
                  </div>
                  <span>
                    {purchasePOData?.SupplierAddress}
                    {/* SAK Nagar, TN SF NO-61/2 PART, Thottipalayam village
                      zone,Tirupur-641603 */}
                  </span>
                  <div>{purchasePOData?.SupplierState}</div>
                  {/* Tamil Nadu */}
                  <div>
                    <span className="font-semibold">Email :</span>
                    <span>
                      {purchasePOData?.Email}
                      {/* sandeepmauryadesigns@gmail.com */}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Phone :</span>
                    <span>
                      {" "}
                      {/* +91 98765 43210 */}
                      {purchasePOData?.MobileNumber}{" "}
                    </span>
                  </div>
                </div>
                <div className="bg-[#F9F6EB] p-[1vw] rounded-[0.75vw]">
                  <div>From :</div>
                  <div className="font-bold">
                    {/* {viewData?.BillFrom} */}
                    AKR Industries
                  </div>
                  <span>
                    {/* {viewData?.DeliveryLoc} */}
                    SAK Nagar, TN SF NO-61/2 PART, Thottipalayam village
                    zone,Tirupur-641603
                  </span>
                  <div>
                    {/* {viewData} */}
                    Tamil Nadu
                  </div>
                  <div>
                    <span className="font-semibold">Email :</span>
                    <span>sandeepmauryadesigns@gmail.com </span>
                  </div>
                  <div>
                    <span className="font-semibold">Phone :</span>
                    <span> +91 98765 43210 </span>
                  </div>
                </div>
              </div>
              <div className="h-[50vh] overflow-y-scroll scrollbar-hide">
                {" "}
                {grnData?.map((items, index) => {
                  // const dataToDisplay = items;
                  const StructuredGrData = [
                    {
                      key: items.id ?? index,
                      id: items.id,
                      GRNNum: items?.GRNNum,
                      // ReceivedDate: items?.ReceivedDate,
                      PurchasePONum: items?.PurchasePONum,
                      // PurchasePODate: items?.PurchasePODate,
                      // SupplierName: items?.SupplierName,
                      // SupplierID: items?.SupplierID,
                      // CreditDays: items?.CreditDays,
                      // State: items?.State,
                      // Year: items?.Year,
                      TaxableValue: items?.TaxableValue,
                      TaxPer: items?.TaxPer,
                      TaxValue: items?.TaxValue,
                      TotalValue: items?.TotalValue,
                      // InvoiceNum: items?.InvoiceNum,
                      // InvoiceDate: items?.InvoiceDate,
                      // DeliveryLoc: items?.DeliveryLoc,
                      // ReceivedBy: items?.ReceivedBy,
                      // CreatedBy: items?.CreatedBy,
                      // CreatedDate: items?.CreatedDate,
                      // UpdatedDate: items?.UpdatedDate,
                      // UpdatedBy: items?.UpdatedBy,
                      // Narration: items?.Narration,
                      Items: items?.Items.map((grnItems) => [
                        {
                          HSN: grnItems?.HSN,
                          ItemCode: grnItems?.ItemCode,
                          ItemName: grnItems?.ItemName,
                          Quantity: grnItems?.Quantity,
                          a_quantity: grnItems?.a_quantity,
                          Rate: grnItems?.Rate,
                          Total: grnItems?.Total,
                        },
                      ]),
                      // StatusId: items?.StatusId,
                      // Status: items?.Status,
                      // BillStatusId: items?.BillStatusId,
                      // BillStatus: items?.BillStatus,
                      // AcceptedQty: items?.AcceptedQty,
                      // ReceivedQty: items?.ReceivedQty,
                      hidden_details: (
                        <div className="flex justify-between">
                          <div className="text-[0.8vw]">
                            Hello This Table Belongs to GRN Number :{" "}
                            {items?.GRNNum}
                          </div>
                        </div>
                      ),
                    },
                  ];

                  return (
                    <>
                      <div className="border-[0.1vw] border-[#0A0E0D4D] p-[0.25vw] rounded-[0.5vw] my-[0.5vw]">
                        <div className="flex items-center justify-between px-[1vw] my-[1vw]">
                          <div className="flex gap-x-[1vw] justify-between">
                            <span className=" text-[0.8vw] text-[#0A0E0D99]">
                              GRN Number:
                            </span>
                            <span className="text-[0.8vw] text-black">
                              {" "}
                              {items?.GRNNum}
                              {/* Grn-011001 */}
                            </span>
                          </div>
                          <div className="flex gap-x-[1vw] justify-between">
                            <span className=" text-[0.8vw] text-[#0A0E0D99]">
                              Received Date:
                            </span>
                            <span className="text-[0.8vw] text-black">
                              {" "}
                              {dayjs(items?.ReceivedDate).format("DD-MM-YYYY")}
                              {/* 20 Jun 2025 */}
                            </span>
                          </div>
                          <div className="flex gap-x-[1vw] justify-between">
                            <span className=" text-[0.8vw] text-[#0A0E0D99]">
                              Invoice Number :
                            </span>
                            <span className="text-[0.8vw] text-black">
                              {items?.InvoiceNum}
                              {/* 100850 */}
                            </span>
                          </div>
                          <div className="flex gap-x-[1vw] justify-between">
                            <span className=" text-[0.8vw] text-[#0A0E0D99]">
                              Created By :
                            </span>
                            <span className="text-[0.8vw] text-black">
                              {" "}
                              {items?.CreatedBy}
                              {/* Mahesh */}
                            </span>
                          </div>
                          <div>
                            <div
                              className={`${
                                items?.StatusId === 0
                                  ? "bg-[#FFEAA5]  border-[#FF9D00] text-[#FF9D00]"
                                  : "bg-[#ECFDF3] border-[#34AE2A] text-[#34AE2A]"
                              } flex items-center justify-center rounded-full border-[0.1vw] w-[5vw] h-[1.5vw] text-[0.8vw]`}
                            >
                              {" "}
                              {items?.StatusId === 0 ? "Partial" : "Full"}
                            </div>
                          </div>
                        </div>
                        <div key={index} style={{ cursor: "pointer" }}>
                          <ConfigProvider
                            theme={{
                              components: {
                                Table: {
                                  rowHoverBg: "rgba(255, 255, 255, 0)",
                                  rowSelectedBg: "rgba(255, 255, 255, 0)",
                                  rowSelectedHoverBg: "rgba(255, 255, 255, 0)",
                                  shadowHover:
                                    "0 0.5vw 1vw rgba(0, 0, 0, 0.15)",
                                  headerSplitColor: "#000000",
                                },
                              },
                            }}
                          >
                            {/* <Table
                              className="custom-table"
                              columns={columns}
                              pagination={false}
                              dataSource={StructuredGrData}
                              locale={{ emptyText: "No Data Available" }}
                              expandedRowRender={(record) => (
                                <p style={{ margin: 0 }}>
                                  {record?.hidden_details ||
                                    "No details available"}
                                </p>
                              )}
                              expandRowByClick={true}
                              onRow={(record) => ({
                                onClick: () => handleRowClick(record),
                              })}
                              expandIcon={() => null}
                              expandIconColumnIndex={-1}
                              expandedRowKeys={
                                expandedRowKey ? [expandedRowKey] : []
                              }
                            /> */}
                            <Table
                              className="custom-table"
                              columns={columns}
                              dataSource={StructuredGrData}
                              rowKey="key"
                              pagination={false}
                              locale={{ emptyText: "No Data Available" }}
                              onRow={(record) => ({
                                onClick: () => handleRowClick(record),
                              })}
                              expandable={{
                                expandedRowRender: (record) => (
                                  <p style={{ margin: 0 }}>
                                    {record.hidden_details ??
                                      "No details available"}
                                  </p>
                                ),
                                expandRowByClick: true,
                                expandIcon: () => null,
                                expandIconColumnIndex: -1,
                                expandedRowKeys: expandedRowKey
                                  ? [expandedRowKey]
                                  : [],
                              }}
                            />
                            {/* <Table
                              columns={columns}
                              expandable={{
                                expandedRowRender: (record) => (
                                  <p style={{ margin: 0 }}>
                                    {record.hidden_details}
                                  </p>
                                ),
                                rowExpandable: (record) =>
                                  record.name !== "Not Expandable",
                              }}
                              dataSource={StructuredGrData}
                            /> */}
                          </ConfigProvider>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </>
          )}
        </>
      </div>
    </>
  );
};
