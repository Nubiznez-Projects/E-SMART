import React, { useState, useEffect } from "react";
import { ConfigProvider, Table, Tooltip } from "antd";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { IoIosArrowForward } from "react-icons/io";
import { VscEdit, VscEye } from "react-icons/vsc";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdArrowDropdown } from "react-icons/io";
import { UpdateStatus } from "../../../API/Sales/SalesPO";
import { fetchSalesPo } from "../../../Redux/Slice/SalesModule/SalePOThunk";
import { capitalizeFirstLetter } from "../../Common/Capitalization";

export const SalesPOList = ({
  sales_PO,
  setPOId,
  setDcID,
  setOpenAddModal,
  setOpenDCModal,
  setDeleteModalIsOpen,
  setPoData,
  setIsViewModal,
  setGenerateId,
  setOpenModal,
  setHeaderTab,
}) => {
  const [openPopoverId, setOpenPopoverId] = useState(null);
  const dispatch = useDispatch();

  const getStatusClasses = (status) => {
    switch (status) {
      case "Pending":
        return "bg-[#FFEAA5] text-[#FF9D00] border-[#FF9D00]";
      case "Approved":
        return "bg-[#ECFDF3] text-[#34AE2A] border-[#34AE2A]]";
      case "Cancelled":
        return "bg-[#FDECEC] text-[#E52A2A] border-[#E52A2A]";
      default:
        return "";
    }
  };

  const columns = [
    {
      title: <span className="text-[1vw] font-semibold">PO Number</span>,
      align: "center",
      width: "15vw",
      sorter: (a, b) => a.SPoNum?.localeCompare(b.SPoNum),
      render: (row) => {
        return <div className="text-[0.85vw] font-medium">{row?.SPoNum}</div>;
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">PO Issued Date</span>,
      align: "center",
      width: "15vw",
      //sorter: (a, b) => a.CustomerName?.localeCompare(b.CustomerName),
      render: (row) => {
        return (
          <div className="text-[0.85vw]">
            {" "}
            {dayjs(row.CreatedDate).format("DD-MM-YYYY")}
          </div>
        );
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">Customer</span>,
      align: "center",
      width: "15vw",
      // sorter: (a, b) => a.CustomerType?.localeCompare(b.CustomerType),
      render: (row) => {
        return <div className="text-[0.85vw]">
         {row?.CustomerName ? (
              <p className="text-[0.85vw]">
                {row?.CustomerName?.length > 20 ? (
                  <Tooltip
                    placement="top"
                    color="white"
                    overlayInnerStyle={{ color: "#0A0E0D" }}
                    title={`${capitalizeFirstLetter(row?.CustomerName)}`}
                    className="cursor-pointer"
                  >
                    {capitalizeFirstLetter(row?.CustomerName?.slice(0, 20)) + ".."}
                  </Tooltip>
                ) : (
                  capitalizeFirstLetter(row?.CustomerName)
                )}
              </p>
            ) : (
              <div className="font-bold text-[1vw] w-full">-</div>
            )}
        </div>;
      },
    },
    {
      title: (
        <span className="text-[1vw] font-semibold">Expected Delivery Date</span>
      ),
      align: "center",
      width: "15vw",
      //sorter: (a, b) => a.ContactPerson?.localeCompare(b.ContactPerson),
      render: (row) => {
        return (
          <div className="text-[0.85vw]">
            {dayjs(row.DeliveryDate).format("DD-MM-YYYY")}
          </div>
        );
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">Total Amount</span>,
      align: "center",
      width: "15vw",
      render: (row) => {
        let items = [];

        try {
          if (Array.isArray(row?.Items)) {
            items = row.Items;
          } else if (typeof row?.Items === "string") {
            items = JSON.parse(row.Items);
          }
        } catch (e) {
          console.warn("Invalid Items format:", row.Items);
        }

        const totalAmount = items.reduce(
          (sum, item) => sum + (item?.Amount || 0),
          0
        );

        return <div className="text-[0.85vw]">{totalAmount.toFixed(2)}</div>;
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">Status</span>,
      align: "center",
      width: "15vw",
      //sorter: (a, b) => new Date(a.CreatedDate) - new Date(b.CreatedDate),
      render: (row) => {
        const isCurrentPopoverOpen = openPopoverId === row.SPoNum;
        return (
          <div className="flex justify-center items-center text-[0.85vw]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (row?.StatusId === 1 || row?.StatusId === 2) {
                  return; // Do nothing
                }
                setOpenPopoverId(isCurrentPopoverOpen ? null : row.SPoNum);
                setPOId(row?.SPoNum);
              }}
              className={`status-button flex items-center justify-center text-[0.85vw] font-medium border-[0.1vw] rounded-full w-[6.6vw] gap-x-[0.7vw] py-[0.1vw] ${getStatusClasses(
                row?.Status
              )} cursor-pointer`}
            >
              <span>{row?.Status}</span>
              {row?.StatusId === 3 && <IoMdArrowDropdown size={"1.3vw"} />}
            </button>

            {isCurrentPopoverOpen && (
              <div className="status-dropdown-content absolute z-10 mt-[8vw] w-[7vw] bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-[0.4vw]">
                  {["Approved", "Pending", "Cancelled"].map((status) => (
                    <button
                      key={status}
                      className="block w-full text-left px-4 py-1 text-[0.85vw] text-gray-700 hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusSelect(row.SPoNum, status);
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">Sub Modules</span>,
      align: "center",
      width: "10vw",
      render: (row) => {
        return (
          <div className="px-[1vw] flex gap-[1.1vw]">
            <button
              type="button"
              disabled={
                row.DCStatusId === 2 || row.StatusId === 2 || row.StatusId === 3
              }
              onClick={() => {
                setPOId(row?.SPoNum);
                setPoData(row);
                setDcID();
                setGenerateId(1);
                setHeaderTab("DC");
                // if (row?.DCStatusId === 2) {
                //   return; // Do nothing
                // }
                setOpenModal(true);
              }}
              // className={`flex items-center text-[0.85vw] pl-[0.3vw] font-medium text-[#4C67ED] border-[#4C67ED]
              //   border-[0.1vw] rounded-full w-[7.5vw] py-[0.1vw] pr-[0.3vw] hover:bg-[#f0f4ff] transition-colors
              //   ${row?.DCStatusId !== 1 || row?.StatusId !== 1 ? "cursor-not-allowed" : "cursor-pointer"} `}
              className={`flex items-center text-[0.85vw] pl-[1vw] font-medium border-[0.1vw] rounded-full py-[0.1vw] pr-[0.6vw] hover:bg-[#f0f4ff] transition-colors cursor-pointer
    ${
      row.StatusId === 1 && row.DCStatusId === 2
        ? "disabled:cursor-not-allowed disabled:bg-[#4C67ED] disabled:text-white text-[#4C67ED] border-[#4C67ED]"
        : row.StatusId === 2 || row.StatusId === 3
        ? "disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-slate-400 text-gray-500 border-gray-300  "
        : "text-[#4C67ED] border-[#4C67ED]"
    }`}
            >
              <span
                className={`${row.DCStatusId !== 2 ? "w-[5vw]" : "w-[6.6vw]"} `}
              >
                {row?.DCStatus}
              </span>
              {row.DCStatusId !== 2 && (
                <>
                  <div>|</div>
                  <span
                    className={`text-white bg-[#4C67ED] rounded-full w-[1vw] h-[1vw] flex items-center justify-center ml-[0.4vw] ${
                      row.StatusId === 2 || row.StatusId === 3
                        ? "bg-slate-400"
                        : ""
                    }`}
                  >
                    <IoIosArrowForward size={"0.8vw"} />
                  </span>
                </>
              )}
            </button>
          </div>
        );
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">Action</span>,
      align: "center",
      width: "6vw",
      render: (row) => {
        return (
          <div className="px-[1vw] flex gap-[1.1vw]">
            <div className="flex justify-center items-center gap-[0.8vw]">
              <VscEye
                onClick={() => {
                  setPOId(row?.SPoNum);
                  setHeaderTab("PO");
                  setIsViewModal(true);
                }}
                className="cursor-pointer"
                size={"1.2vw"}
              />
             {/* {row?.StatusId !== 1 && ( */}
                <VscEdit
                  className="cursor-pointer"
                  size={"1.2vw"}
                  onClick={() => {
                    setPOId(row?.SPoNum);
                    setGenerateId();
                    setOpenAddModal(true);
                  }}
                />
             {/* )} */}
              {/* {row?.StatusId !== 1 && ( */}
                <AiOutlineDelete
                  onClick={() => {
                    setPOId(row?.SPoNum);
                    setPoData(row);
                    setDeleteModalIsOpen(true);
                  }}
                  className="cursor-pointer"
                  size={"1.2vw"}
                />
              {/* )} */}
            </div>
          </div>
        );
      },
    },
  ];

  const handleStatusSelect = async (rowId, newStatus) => {
    try {
      const response = await UpdateStatus(rowId, newStatus);
      console.log(rowId, "response");
      dispatch(fetchSalesPo());
      setOpenPopoverId(null);
    } catch (error) {
      console.log("Error Updating status", error);
    }
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

  return (
    <>
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
          rowKey="SPoNum" // use the 'id' field from your data
          rowSelection={{ type: "checkbox" }}
          style={{ height: "68vh", width: "100%" }}
          columns={columns}
          pagination={false}
          dataSource={sales_PO}
          rowClassName={(record, index) => `custom-row-${index}`}
        />
      </ConfigProvider>
    </>
  );
};
