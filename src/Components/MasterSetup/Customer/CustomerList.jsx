import { ConfigProvider, Table, Tooltip } from "antd";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { VscEye } from "react-icons/vsc";
import { VscEdit } from "react-icons/vsc";
import { AiOutlineDelete } from "react-icons/ai";
import ReactPaginate from "react-paginate";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";
import DeleteModal from "../../Common/Modal/Delete/DeleteModal";
import DeleteList from "../../Common/Delete/DeleteComponent";
import { getCustomersByID } from "../../../API/MasterModule/Customer";
import { fetchCustomers } from "../../../Redux/Slice/MasterModule/Customers/CustomerThunks";
import { capitalizeFirstLetter } from "../../Common/Capitalization";

export default function CustomerList({
  setCustomerID,
  customerID,
  setOpenAddModal,
  setIsView,
}) {
  const dispatch = useDispatch();
  const [deletemodalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [customerData, setCustomerData] = useState("");
  const apiUrl = "http://192.168.6.77:8092/api";
  const itemsPerPage = 10;
  const [itemOffset, setItemOffset] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  const { list } = useSelector((state) => state.customers);

  const fetchCustomer = async () => {
    try {
      const response = await getCustomersByID(customerID);
      setCustomerData(response);
    } catch (error) {
      console.error("Error Fetching Customers", error);
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
  };

  const columns = [
    {
      title: <span className="text-[1vw] font-semibold">Customer ID</span>,
      align: "center",
      width: "15vw",
      sorter: (a, b) => a.CustomerID?.localeCompare(b.CustomerID),
      render: (row) => {
        return (
          <div className="text-[0.85vw] font-medium">{row?.CustomerID}</div>
        );
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">Customer Name</span>,
      align: "center",
      width: "15vw",
      sorter: (a, b) => a.CustomerName?.localeCompare(b.CustomerName),
      render: (row) => {
        return (
          <div className="text-[0.85vw]">
            <p className="text-[0.85vw]">
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
                      {capitalizeFirstLetter(row?.CustomerName?.slice(0, 20)) +
                        ".."}
                    </Tooltip>
                  ) : (
                    capitalizeFirstLetter(row?.CustomerName)
                  )}
                </p>
              ) : (
                <div className="font-bold text-[1vw] w-full">-</div>
              )}
            </p>
          </div>
        );
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">Customer Type</span>,
      align: "center",
      width: "15vw",
      sorter: (a, b) => a.CustomerType?.localeCompare(b.CustomerType),
      render: (row) => {
        return <div className="text-[0.85vw]">{row?.CustomerType}</div>;
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">Contact Person</span>,
      align: "center",
      width: "15vw",
      sorter: (a, b) => a.ContactPerson?.localeCompare(b.ContactPerson),
      render: (row) => {
        return (
          <div className="text-[0.85vw]">
            {row?.ContactPerson ? (
              <p className="text-[0.85vw]">
                {row?.ContactPerson?.length > 12 ? (
                  <Tooltip
                    placement="top"
                    color="white"
                    overlayInnerStyle={{ color: "#0A0E0D" }}
                    title={`${capitalizeFirstLetter(row?.ContactPerson)}`}
                    className="cursor-pointer"
                  >
                    {capitalizeFirstLetter(row?.ContactPerson?.slice(0, 12)) +
                      ".."}
                  </Tooltip>
                ) : (
                  capitalizeFirstLetter(row?.ContactPerson)
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
      title: <span className="text-[1vw] font-semibold">Mobile</span>,
      align: "center",
      width: "15vw",
      render: (row) => {
        return <div className="text-[0.85vw]">{row.MobileNumber}</div>;
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">Created Date</span>,
      align: "center",
      width: "15vw",
      sorter: (a, b) => new Date(a.CreatedDate) - new Date(b.CreatedDate),
      render: (row) => {
        return (
          <div className="text-[0.85vw]">
            {dayjs(row.CreatedDate).format("DD-MM-YYYY")}
          </div>
        );
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">Status</span>,
      align: "center",
      width: "10vw",
      render: (row) => {
        return (
          <div className="px-[1vw] flex items-center justify-center gap-[1.1vw]">
            <button
              className={`h-[1.7vw] w-[6.5vw] text-[0.85vw] rounded-full font-medium border 
    ${
      row?.Status
        ? "text-green-700 bg-green-100 border-green-500"
        : "text-red-700 bg-red-100 border-red-500"
    }`}
            >
              {row?.Status === true ? "Active" : "In-Active"}
            </button>
          </div>
        );
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">Action</span>,
      align: "center",
      width: "10vw",
      render: (row) => {
        return (
          <div className="px-[1vw] flex items-center justify-center gap-[1.1vw]">
            <div className="flex items-center justify-center gap-[1.1vw]">
              <VscEye
                onClick={() => {
                  setIsView(true);
                  setCustomerID(row?.CustomerID);
                  setOpenAddModal(true);
                }}
                className="cursor-pointer"
                size={"1.2vw"}
              />
              <VscEdit
                onClick={() => {
                  setCustomerID(row?.CustomerID);
                  setIsView(false);
                  setOpenAddModal(true);
                }}
                className="cursor-pointer"
                size={"1.2vw"}
              />
              <AiOutlineDelete
                onClick={() => {
                  setCustomerID(row?.CustomerID);
                  setDeleteModalIsOpen(true);
                }}
                className="cursor-pointer"
                size={"1.2vw"}
              />
            </div>
          </div>
        );
      },
    },
  ];

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

  // Calculate pagination slice based on activePage
  const indexOfLastItem = pageNumber * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = list?.slice(indexOfFirstItem, indexOfLastItem);

  const pageCount = Math.ceil(list?.length / itemsPerPage);

  // if (loading) return <p>Loading...</p>;

  // if (error) return <p>Error fetching customers</p>;

  useEffect(() => {
    if (customerID) {
      fetchCustomer();
    }
  }, [customerID]);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

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
          rowKey="id" // use the 'id' field from your data
          //rowSelection={{ type: "checkbox" }}
          style={{ height: "68vh", width: "100%" }}
          columns={columns}
          pagination={false}
          dataSource={currentItems}
          //rowClassName={(record, index) => `custom-row-${index}`}
        />
      </ConfigProvider>
      <div className="fixed bottom-[5vh] w-screen flex justify-between items-center">
        <div className="flex">
          <p className="text-[0.8vw]">
            Showing {itemOffset + 1} -{" "}
            {Math.min(itemOffset + itemsPerPage, list?.length)} of{" "}
            {list?.length} items
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
      <DeleteModal
        show={deletemodalIsOpen}
        onClose={closeDeleteModal}
        height="20vw"
        width="30vw"
        closeicon={false}
      >
        <DeleteList
          setDeleteModalIsOpen={setDeleteModalIsOpen}
          title={`Want to delete this ${customerData?.CustomerName}`}
          api={`${apiUrl}/customers/${customerID}`}
          module={"customer"}
          // filter={filter}
          // setPermission={setPermission}
        />
      </DeleteModal>
    </>
  );
}
