import React, { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { ConfigProvider, Table, Tooltip, DatePicker } from "antd";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import { capitalizeFirstLetter } from "../Common/Capitalization";
import {
  fetchFilterReq,
  fetchRequestList,
  searchReq,
} from "../../Redux/Slice/RequestManagement/RequestThunk";
import { VscEye } from "react-icons/vsc";
import ReactPaginate from "react-paginate";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { changeReqStatus } from "../../API/RequestManagement/RequestManagement";
import { searchClient } from "../../Redux/Slice/UserManagement/ClientThunk";
import Modal from "../Common/Modal/Modal";
import ViewRequest from "./ViewRequest";
import DeleteModal from "../Common/Modal/Delete/DeleteModal";


export default function RequestManagement() {
  
  const { RangePicker } = DatePicker;
  const [tabName, setTabName] = useState("Client");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const itemsPerPage = 10;
  const [itemOffset, setItemOffset] = useState(0);
  const [openPopoverId, setOpenPopoverId] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [clientId, setClientID] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const { request } = useSelector((state) => state.request);

  const indexOfLastItem = pageNumber * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = request?.slice(indexOfFirstItem, indexOfLastItem);

  const pageCount = Math.ceil(request?.length / itemsPerPage) || 0;
  const goToFirstPage = () => {
    setItemOffset(0);
    setPageNumber(1);
  };
  const goToLastPage = () => {
    setItemOffset((pageCount - 1) * itemsPerPage);
    setPageNumber(pageCount);
  };

  const handlePageClick = ({ selected }) => {
    const newOffset = selected * itemsPerPage;
    setItemOffset(newOffset);
    setPageNumber(selected + 1);
  };

  const handleGoToPage = () => {
    if (pageNumber > 0 && pageNumber <= pageCount) {
      const newOffset = (pageNumber - 1) * itemsPerPage;
      setItemOffset(newOffset);
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Pending":
        return "bg-[#FFEAA5] text-[#FF9D00] border-[#FF9D00]";
      case "Active":
        return "bg-[#ECFDF3] text-[#34AE2A] border-[#34AE2A]]";
      case "InActive":
        return "bg-[#FDECEC] text-[#E52A2A] border-[#E52A2A]";
      case "Inactive":
        return "bg-[#FDECEC] text-[#E52A2A] border-[#E52A2A]";
      default:
        return "bg-[#dedfe3] text-[#3e4243] border-[#3e4243]";
    }
  };

  const columns = [
    {
      title: <span className="text-[1vw] font-semibold">Client ID</span>,
      align: "center",
      width: "10vw",
      //sorter: (a, b) => a.CustomerName?.localeCompare(b.CustomerName),
      render: (row) => {
        return <div className="text-[0.85vw] font-bold">{row?.client_id}</div>;
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">Client Name</span>,
      align: "center",
      width: "15vw",
      // sorter: (a, b) => a.CustomerType?.localeCompare(b.CustomerType),
      render: (row) => {
        const fullname = `${
          row?.company_name.charAt(0) ===
          row?.company_name.charAt(0)?.toLowerCase()
            ? capitalizeFirstLetter(row?.company_name)
            : row?.company_name
        } ${row?.company_name}`;

        return (
          <div className="text-[0.85vw]">
            {" "}
            <p className="text-[0.85vw]">
              {fullname?.length > 25 ? (
                <Tooltip
                  placement="top"
                  color="white"
                  overlayInnerStyle={{ color: "#0A0E0D" }}
                  title={`${capitalizeFirstLetter(row?.company_name)}`}
                  className="cursor-pointer"
                >
                  {fullname?.slice(0, 25) + ".."}
                </Tooltip>
              ) : (
                fullname
              )}
            </p>
          </div>
        );
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">Email</span>,
      align: "center",
      width: "15vw",
      render: (row) => {
        return (
          <div className="px-[1vw] flex justify-center items-center gap-[1.1vw] text-[0.85vw]">
            {row?.emailid?.length > 25 ? (
              <Tooltip
                placement="top"
                color="white"
                overlayInnerStyle={{ color: "#0A0E0D" }}
                title={`${capitalizeFirstLetter(row?.emailid)}`}
                className="cursor-pointer"
              >
                {row?.emailid?.slice(0, 25) + ".."}
              </Tooltip>
            ) : (
              row?.emailid
            )}
          </div>
        );
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">Received</span>,
      align: "center",
      width: "10vw",
      render: (row) => {
        return (
          <div className="flex justify-center items-center text-[0.85vw]">
            {dayjs(row?.created_date).format("DD-MM-YYYY")}
          </div>
        );
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">Status</span>,
      align: "center",
      width: "10vw",
      render: (row) => {
        const isCurrentPopoverOpen = openPopoverId === row.client_id;
        return (
          <div className="flex justify-center items-center text-[0.85vw]">
            <button
              type="button"
              onClick={(e) => {
                if(row?.statusId === 1){
                  return;
                }
                e.stopPropagation();
                setOpenPopoverId(isCurrentPopoverOpen ? null : row.client_id);
                setClientID(row?.client_id);
              }}
              className={`status-button flex items-center justify-center text-[0.85vw] font-medium border-[0.1vw] rounded-full w-[6.6vw] gap-x-[0.7vw] py-[0.1vw] ${getStatusClasses(
                row?.req_status
              )} ${row?.statusId === 1 ? "cursor-not-allowed" : "cursor-pointer"} `}
            >
              <span>{row.req_status}</span>
            </button>
            {isCurrentPopoverOpen && (
              <div className="status-dropdown-content absolute z-10 mt-[8vw] w-[7vw] bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {["Active", "InActive"].map((status) => (
                    <button
                      key={status}
                      className="block w-full text-left px-4 py-2 text-[0.85vw] text-gray-700 hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusSelect(row.client_id, status);
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
      title: <span className="text-[1vw] font-semibold">Action</span>,
      align: "center",
      width: "6vw",
      render: (row) => {
        return (
          <div className="flex  justify-center items-center">
            <VscEye
              onClick={() => {
                setClientID(row?.client_id);
                setOpenModal(true);
              }}
              className="cursor-pointer"
              size={"1.2vw"}
            />
          </div>
        );
      },
    },
  ];

  const closeModal = ()=>{
    setOpenModal(false);
  }

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(searchReq(value));
  };

  const handleDateChange = (dates) => {
    if (!dates || dates.length === 0) {
      setDateRange([null, null]);
      applyFilters(null, null, status);
      return;
    }

    const fromDate = dates[0]?.format("YYYY-MM-DD");
    const toDate = dates[1]?.format("YYYY-MM-DD");

    setDateRange([fromDate, toDate]);
    applyFilters(fromDate, toDate, status);
  };

  const applyFilters = (fromDate, toDate) => {
    const filters = { fromDate, toDate };
    console.log(filters, "filters");
    dispatch(fetchFilterReq(filters));
  };

  const handleStatusSelect = async (rowId, newStatus) => {
    const response = await changeReqStatus(rowId, newStatus);
    dispatch(fetchRequestList());
    setOpenPopoverId(null);
    console.log("Selected status for row", rowId, "is:", newStatus);
    console.log("GLOBAL PurchaseStatus is now:", newStatus);
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

  useEffect(() => {
    dispatch(fetchRequestList());
  }, [dispatch]);

  return (
    <>
      <div className="flex justify-between">
        <div className="flex flex-col my-[1vw]">
          <div className="flex">
            <div className=" mt-[1vw] relative flex items-center">
              <BiSearchAlt
                className="absolute left-[0.8vw] top-[50%] transform -translate-y-1/2"
                size={"1vw"}
                color="#323232"
              />

              <input
                type="text"
                onKeyPress={(e) => {
                  const regex = /^[a-zA-Z0-9\s_-]+$/; // Allow letters, numbers, spaces, underscore, dash
                  if (!regex.test(e.key)) {
                    e.preventDefault(); // Block the character
                  }
                }}
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-white outline-none text-[0.9vw] pl-[3vw] pr-[3vw] w-[20vw] h-[2.25vw] border-[0.1vw] border-[#dddddd] rounded-[2vw] shadow-md"
                placeholder="Search anything..."
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-[2vw]">
          <div className="flex">
            <div>
              <RangePicker
                className="custom-range-picker force-pointer w-[16.7vw]"
                onChange={handleDateChange}
                value={
                  dateRange[0] && dateRange[1]
                    ? [dayjs(dateRange[0]), dayjs(dateRange[1])]
                    : []
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div className=" relative flex-1 h-[68vh] ">
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
            rowKey="client_id" // use the 'id' field from your data
            style={{ height: "68vh", width: "100%" }}
            columns={columns}
            pagination={false}
            dataSource={currentItems}
            rowClassName={(record, index) => `custom-row-${index}`}
          />
        </ConfigProvider>
      </div>
      <div className="fixed bottom-[5vh] w-screen flex justify-between items-center">
        <div className="flex">
          <p className="text-[0.8vw]">
            Showing {itemOffset + 1} -{" "}
            {Math.min(itemOffset + itemsPerPage, request?.length)} of{" "}
            {request?.length} items
          </p>
        </div>

        {/* Pagination */}
        <div className="flex items-center bg-transparent gap-[1vw]">
          <button
            onClick={goToFirstPage}
            disabled={itemOffset === 0}
            className={`text-[0.8vw] bg-[#f9f9f9] rounded-[1vw] h-[1.5vw] w-[2.3vw] flex justify-center items-center ${
              itemOffset === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-[#0A0E0D] cursor-pointer hover:underline"
            }`}
          >
            <RxDoubleArrowLeft size="0.9vw" />
          </button>

          <ReactPaginate
            className="pagination flex gap-[0.4vw] bg-transparent"
            breakLabel="......"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            itemsCountPerPage={itemsPerPage}
            pageCount={pageCount}
            renderOnZeroPageCount={null}
            activeClassName="font-bold bg-[#0A0E0D] px-[0.3vw] text-white text-center rounded-[1vw]"
            pageClassName="text-[0.8vw] cursor-pointer hover:underline px-[0.3vw] py-[0.1vw] rounded-[1vw]"
            previousClassName="text-[0.8vw] cursor-pointer hover:underline"
            nextClassName="text-[0.8vw] cursor-pointer hover:underline"
            previousLabel={
              <SlArrowLeft
                className="mt-[0.4vw]"
                size="0.65vw"
                color="#323232"
              />
            }
            nextLabel={
              <SlArrowRight
                className="mt-[0.4vw]"
                size="0.65vw"
                color="#323232"
              />
            }
            forcePage={pageNumber - 1}
            marginPagesDisplayed={0}
          />

          <button
            onClick={goToLastPage}
            disabled={itemOffset >= (pageCount - 1) * itemsPerPage}
            className={`text-[0.8vw] bg-[#F9F9F9] rounded-[1vw] h-[1.5vw] w-[2.3vw] flex justify-center items-center ${
              itemOffset >= (pageCount - 1) * itemsPerPage
                ? "text-gray-400 cursor-not-allowed"
                : "text-[#0A0E0D] cursor-pointer hover:underline"
            }`}
          >
            <RxDoubleArrowRight size="0.9vw" />
          </button>
        </div>

        {/* Go to page */}
        <div className="mr-[10vw] flex flex-row gap-[0.5vw] items-center pr-[0.5vw] bg-transparent">
          <span className="text-[0.8vw]">Go to page</span>
          <div className="relative flex items-center">
            <input
              type="number"
              min={1}
              max={pageCount}
              value={pageNumber}
              onChange={(e) => setPageNumber(Number(e.target.value))}
              className="bg-[#F9F9F9] rounded-[1vw] px-[0.4vw] h-[1.5vw] text-[0.8vw] w-[3vw] text-center pr-[2vw]"
            />
            <div className="absolute right-[0.2vw] top-[0.8vw] transform -translate-y-1/2 flex flex-col">
              <button
                onClick={() =>
                  setPageNumber((prev) => Math.min(prev + 1, pageCount))
                }
                className="mb-[-0.3vw]"
              >
                <MdKeyboardArrowUp color="#323232" size={"1vw"} />
              </button>
              <button
                onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                className="p-[-0.5vw]"
              >
                <MdKeyboardArrowDown color="#323232" size={"1vw"} />
              </button>
            </div>
          </div>
          <button
            className="bg-[#0A0E0D] text-[0.8vw] text-white border border-[#0A0E0D] shadow-md shadow-[#d8d6d6] flex px-[0.3vw] h-[1.5vw] justify-center items-center rounded-[1vw]"
            onClick={handleGoToPage}
          >
            GO
          </button>
        </div>
      </div>

       <DeleteModal show={openModal} width={"45vw"} onClose={closeModal} closeicon={false}>
                <ViewRequest
                  clientId={clientId}
                  closeModal={closeModal}
                />
            </DeleteModal>
    </>
  );
}
