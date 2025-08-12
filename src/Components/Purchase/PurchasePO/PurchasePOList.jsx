import { ConfigProvider, Popover, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { IoIosArrowForward, IoMdArrowDropdown } from "react-icons/io";
import { VscEdit, VscEye } from "react-icons/vsc";
import { AiOutlineDelete } from "react-icons/ai";
import DeleteModal from "../../Common/Modal/Delete/DeleteModal";
import { capitalizeFirstLetter } from "../../Common/Capitalization";
import {
  changePurchasePOStatus,
  createPurchasePO,
  getPurchasePOID,
} from "../../../API/Purchase/PurchasePO";
import DeleteList from "../../Common/Delete/DeleteComponent";
import { RiArrowDropDownLine } from "react-icons/ri";
import { fetchPurchasePo } from "../../../Redux/Slice/PurchaseModule/PurchasePOThunk";

export const PurchasePOList = ({
  currentItems,
  setPurchasePOID,
  purchasePOID,
  setOpenAddModal,
  purchasePOData,
  setPurchasePoData,
  setIsView,
  setGenerateModal,
}) => {
  const dispatch = useDispatch();
  const [deletemodalIsOpen, setDeleteModalIsOpen] = useState(false);
  // const apiUrl = "http://192.168.6.52:8092/api";
  const apiUrl = import.meta.env.VITE_API_URL;
  const [openPopoverId, setOpenPopoverId] = useState(null);
  const [selectedPONum, setSelectedPONum] = useState();
  const [callPostApi, setCallPostApi] = useState(false);

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

  const handleStatusSelect = async (rowId, newStatus) => {
    const response = await changePurchasePOStatus(rowId, newStatus);
    dispatch(fetchPurchasePo());
    console.log("Selected status for row", rowId, "is:", newStatus);
    console.log("GLOBAL PurchaseStatus is now:", newStatus);
  };

  const columns = [
    {
      title: (
        <span className="flex items-center justify-center text-[1vw] font-semibold">
          PO Number
        </span>
      ),
      key: "poNumber",
      width: "10vw",
      sorter: (a, b) => a.PONum?.localeCompare(b.PONum),
      render: (row) => {
        return (
          <div className="flex items-center justify-center text-[0.85vw] font-semibold">
            {row?.PONum}
          </div>
        );
      },
    },
    {
      title: (
        <span className="text-[1vw] font-semibold flex items-center justify-center">
          PO Date Issued
        </span>
      ),
      key: "poDate",
      width: "10vw",
      sorter: (a, b) => new Date(a.CreatedDate) - new Date(b.CreatedDate),
      render: (row) => {
        return (
          <div className="text-[0.85vw] flex items-center justify-center ">
            {dayjs(row.CreatedDate).format("DD-MM-YYYY")}
          </div>
        );
      },
    },
    {
      title: (
        <span className="text-[1vw] font-semibold flex items-center justify-center">
          Supplier
        </span>
      ),
      key: "supplier",
      width: "10vw",
      sorter: (a, b) => a.SupplierName?.localeCompare(b.SupplierName),
      render: (row) => {
        return (
          <div className="text-[0.85vw] flex items-center justify-center">
             {row?.SupplierName ? (
                          <p className="text-[0.85vw]">
                            {row?.SupplierName?.length > 20 ? (
                              <Tooltip
                                placement="top"
                                color="white"
                                overlayInnerStyle={{ color: "#0A0E0D" }}
                                title={`${capitalizeFirstLetter(row?.SupplierName)}`}
                                className="cursor-pointer"
                              >
                                {capitalizeFirstLetter(row?.SupplierName?.slice(0, 20)) + ".."}
                              </Tooltip>
                            ) : (
                              capitalizeFirstLetter(row?.SupplierName)
                            )}
                          </p>
                        ) : (
                          <div className="font-bold text-[1vw] w-full">-</div>
                        )}
          </div>
        );
      },
    },
    {
      title: (
        <span className="text-[1vw] font-semibold flex items-center justify-center">
          Expected Delivery Date
        </span>
      ),
      key: "deliveryDate",
      width: "15vw",
      sorter: (a, b) => new Date(a.DeliveryDate) - new Date(b.DeliveryDate),
      render: (row) => {
        return (
          <div className="flex items-center justify-center text-[0.85vw] pl-[1vw] ">
            {dayjs(row.DeliveryDate).format("DD-MM-YYYY")}
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
      width: "10vw",
      // sorter: (a, b) => a.SupplierID?.localeCompare(b.SupplierID),
      render: (row) => {
        const totalAmount = row?.Items?.reduce((sum, item) => {
          return sum + (item?.Total || item?.Amount || 0);
        }, 0);

        return (
          <div className="flex items-center justify-center text-[0.85vw] pl-[1vw] ">
            {totalAmount}
          </div>
        );
      },
    },
    {
      title: (
        <span className="text-[1vw] font-semibold flex items-center justify-center">
          Status
        </span>
      ),
      key: "status",
      sorter: (a, b) => a.Status?.localeCompare(b.Status),
      width: "10vw",
      render: (row) => {
        const isCurrentPopoverOpen = openPopoverId === row.PONum;
        return (
          <div className="relative flex items-center justify-center pl-[1vw] gap-[0.5vw]">
            <div className="relative inline-block">
              <button
                type="button"
                className={`status-button flex items-center justify-center text-[0.85vw] pl-[1vw] font-medium border-[0.1vw] rounded-full py-[0.1vw] pr-[0.6vw] ${getStatusClasses(
                  row?.StatusId
                )} cursor-pointer w-[7vw]`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (row.StatusId === 3) {
                    setOpenPopoverId(isCurrentPopoverOpen ? null : row.PONum);
                  }
                  setSelectedPONum(row?.PONum);
                }}
              >
                {row?.StatusId === 1
                  ? "Approved"
                  : row?.StatusId === 2
                  ? "Cancelled"
                  : "Pending"}{" "}
                {row?.StatusId === 3 ? (
                  <span className="flex items-center justify-center ml-[0.1vw]">
                    <IoMdArrowDropdown size={"1.4vw"} />
                  </span>
                ) : null}
              </button>

              {isCurrentPopoverOpen && (
                <div className="status-dropdown-content absolute z-10 mt-1 w-full min-w-[8vw] bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <button
                      className="block w-full text-left px-4 py-2 text-[0.85vw] text-gray-700 hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent click from bubbling up and closing
                        handleStatusSelect(row.PONum, 1);
                        setOpenPopoverId(null);
                      }}
                    >
                      Approved
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-[0.85vw] text-gray-700 hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusSelect(row.PONum, 3);
                        setOpenPopoverId(null);
                      }}
                    >
                      Pending
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-[0.85vw] text-gray-700 hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusSelect(row.PONum, 2);
                        setOpenPopoverId(null);
                      }}
                    >
                      Cancelled
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: (
        <span className="text-[1vw] font-semibold flex items-center justify-center">
          GRN
        </span>
      ),
      key: "chalan",
      // sorter: (a, b) => a.Status?.localeCompare(b.Status),
      width: "10vw",
      render: (row) => {
        return (
          <>
            <div className="flex items-center justify-center gap-[0.5vw]">
              <button
                type="button"
                disabled={
                  (row.StatusId === 1 && row.GRNStatusId === 2) ||
                  row.StatusId === 2 ||
                  row.StatusId === 3
                }
                className={`flex items-center text-[0.85vw] pl-[1vw] font-medium border-[0.1vw] rounded-full py-[0.1vw] pr-[0.6vw] hover:bg-[#f0f4ff] transition-colors cursor-pointer
    ${
      row.StatusId === 1 && row.GRNStatusId === 2
        ? "disabled:cursor-not-allowed disabled:bg-[#4C67ED] disabled:text-white text-[#4C67ED] border-[#4C67ED]"
        : row.StatusId === 2 || row.StatusId === 3
        ? "disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-slate-400 text-gray-500 border-gray-300  "
        : "text-[#4C67ED] border-[#4C67ED]"
    }`}
                onClick={() => {
                  setPurchasePOID(row.PONum);
                  setGenerateModal(true);
                  setOpenAddModal(true);
                }}
              >
                <div className="w-[4.5vw]">
                  {row.StatusId === 1 && row.GRNStatusId === 2 ? (
                    <span>Generated</span>
                  ) : (
                    <span>Generate</span>
                  )}
                </div>
                <div>|</div>
                <span
                  className={`text-white bg-[#4C67ED] ${
                    row.StatusId === 2 || row.StatusId === 3
                      ? "bg-slate-400"
                      : ""
                  }  rounded-full w-[1vw] h-[1vw] flex items-center justify-center ml-[0.4vw]`}
                >
                  <IoIosArrowForward />
                </span>
              </button>
            </div>
          </>
        );
      },
    },
    {
      title: (
   <span className="text-[1vw] font-semibold">Action</span>
      ),
      key: "chalan",
      // sorter: (a, b) => a.Status?.localeCompare(b.Status),
      width: "5vw",
      render: (row) => {
        return (
          <>
            <div className="flex gap-[0.5vw]">
              <div className="flex gap-[1vw]">
                <button
                  className="cursor-pointer"
                  onClick={() => {
                    setPurchasePOID(row.PONum);
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
                      setPurchasePOID(row.PONum);
                      setOpenAddModal(true);
                    }}
                  />
                </button>
                <button>
                  <AiOutlineDelete
                    className="cursor-pointer"
                    size={"1.2vw"}
                    onClick={() => {
                      setPurchasePOID(row.PONum);
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

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
    setPurchasePOID();
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 3:
        return "bg-[#FFEAA5] text-[#FF9D00] border-[#FF9D00]";
      case 1:
        return "bg-[#ECFDF3] text-[#34AE2A] border-[#34AE2A]";
      case 2:
        return "bg-[#FDECEC] text-[#E52A2A] border-[#E52A2A]";
      default:
        return "";
    }
  };

  // const handleStatusChange = async () => {
  //   try {
  //     console.log("Attempting to call createPurchasePO...");
  //     const response = await createPurchasePO(
  //       dispatch,
  //       selectedPONum,
  //       PurchaseStatus
  //     );
  //     console.log("createPurchasePO call completed. Response:", response);
  //   } catch (error) {
  //     console.error("Error submitting purchase order:", error);
  //   } finally {
  //     dispatch(fetchPurchasePo());
  //   }
  // }; 

  // useEffect(() => {
  //   if (callPostApi === true) {
  //     handleStatusChange();
  //     setCallPostApi(false);
  //   }
  // }, [callPostApi]);

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

  return (
    <>
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
          <Table
            rowKey="id" // use the 'id' field from your data
            rowSelection={{ type: "checkbox" }}
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
          title={`Want to delete this ${purchasePOData?.SupplierName}'s PO`}
          api={`${apiUrl}/purchasepo/${purchasePOID}`}
          module={"PurchasePO"}
          // filter={filter}
          // setPermission={setPermission}
        />
      </DeleteModal>
    </>
  );
};
