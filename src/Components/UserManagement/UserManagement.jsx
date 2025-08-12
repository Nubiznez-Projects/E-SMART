import React, { useEffect, useRef, useState } from "react";
import Client from "./Client/ClientList";
import Employee from "./Employee/EmployeeList";
import { BiSearchAlt } from "react-icons/bi";
import { HiOutlinePlusSm } from "react-icons/hi";
import ImportIcon from "../../assets/SVG/ImportIcon";
import ExportIcon from "../../assets/SVG/ExportIcon";
import { toast } from "react-toastify";
import { ConfigProvider, DatePicker, Select } from "antd";
import Modal from "../Common/Modal/Modal";
import AddEmployee from "./Employee/AddEmployee";
import AddClient from "./Client/AddClient";
import dayjs from "dayjs";
import {
  fetchEmployee,
  fetchEmployeeSearch,
  fetchFilteredEmp,
} from "../../Redux/Slice/UserManagement/EmployeeThunk";
import { useDispatch, useSelector } from "react-redux";
import DeleteModal from "../Common/Modal/Delete/DeleteModal";
import DeleteList from "../Common/Delete/DeleteComponent";
import { useUserContext } from "../../Context/UserContext";
import {
  fetchClient,
  fetchFilterClient,
  searchClient,
} from "../../Redux/Slice/UserManagement/ClientThunk";
import ReactPaginate from "react-paginate";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import ExportButton from "../Common/Export/ExportButton";
import { SubmitEmployeeExcel } from "../../API/UserManagement/Employee/Employee";

export default function UserManagement() {
  const { RangePicker } = DatePicker;
  const [tabName, setTabName] = useState("Employee");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const { employee } = useSelector((state) => state.employee);
  const fileInputRef = useRef(null);
  const [excelData, setExcelData] = useState(null);
  const itemsPerPage = 10;
  const [clientId, setClientID] = useState(null);
  const [itemOffset, setItemOffset] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [empName, setEmpName] = useState();
  const [status, setStatus] = useState(null);
  const {
    setAction,
    action,
    setEmpId,
    setEmpData,
    empId,
    headerTab,
    setHeaderTab,
  } = useUserContext();
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const apiImgUrl = import.meta.env.VITE_IMAGE_URL;
  const { client, client_loading, client_error } = useSelector(
    (state) => state?.clients
  );
  const dispatch = useDispatch();

  const goToFirstPage = () => {
    setItemOffset(0);
    setPageNumber(1);
  };

  const statusOptionsMap = [
    { value: 5, label: "All" },
    { value: 1, label: "Draft" },
    { value: 2, label: "Active" },
    { value: 3, label: "Inactive" },
    { value: 4, label: "Hold" },
  ];

  const statusOptions = statusOptionsMap || [];

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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (tabName === "Client") {
      setSearchTerm(value);
      dispatch(searchClient(value)); // dispatch search
    } else if (tabName === "Employee") {
      setSearchTerm(value);
      dispatch(fetchEmployeeSearch(value));
    }
  };

  const indexOfLastItem = pageNumber * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const employeeList = employee || [];

  const currentItems =
    tabName === "Client"
      ? client?.slice(indexOfFirstItem, indexOfLastItem)
      : employeeList?.slice(indexOfFirstItem, indexOfLastItem);

  const pageCount =
    tabName === "Client"
      ? Math.ceil(client?.length / itemsPerPage)
      : tabName === "Employee"
      ? Math.ceil(employee?.length / itemsPerPage)
      : 0;

  const toggleTab = (key) => {
    setTabName(key);
  };

  const closeModal = () => {
    setOpenModal(false);
    setDeleteModalIsOpen(false);
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

  const handleStatusChange = (value) => {
    console.log(value, "value");
    const selectedStatus = value;
    setStatus(selectedStatus);

    const fromDate = dateRange?.[0] || null;
    const toDate = dateRange?.[1] || null;

    applyFilters(fromDate, toDate, selectedStatus);
  };

  const applyFilters = (fromDate, toDate, emp_status_id) => {
    const filters = { fromDate, toDate, emp_status_id };
    console.log(filters, "filters");
    switch (tabName) {
      case "Client":
        dispatch(fetchFilterClient(filters));
        break;
      case "Employee":
        dispatch(fetchFilteredEmp(filters));
        break;
      default:
        console.warn("No filter handler for tab:", tabName);
        break;
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setExcelData(file);
      handleExcelSubmit(file);
    }
  };

  const handleExcelSubmit = async (file) => {
    if (!file) {
      toast.error("Please select a file first!");
      return;
    }
    try {
      const response = await SubmitEmployeeExcel(file);
      dispatch(fetchEmployee());
      setExcelData(null);
      console.log(response, "response");
      toast.success(response?.message || "File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  useEffect(() => {
    if (tabName === "Client") {
      dispatch(fetchClient());
    } else {
      dispatch(fetchEmployee());
    }
  }, [tabName, dispatch]);

  useEffect(() => {
    handleGoToPage();
    goToFirstPage();
  }, [tabName]);

  return (
    <>
      <div className="flex justify-between">
        <div className="flex flex-col my-[1vw]">
          <div className="flex gap-x-[2vw] ml-[-1vw]">
            <div>
              <h1
                className={` cursor-pointer text-[1.1vw] ${
                  tabName === "Employee"
                    ? "border-b-[0.2vw] font-bold border-[#000000]"
                    : ""
                } `}
                onClick={() => toggleTab("Employee")}
              >
                Employee
              </h1>
            </div>
          </div>
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
        <div className="flex flex-col gap-y-[0.5vw] mt-[1vw]">
          <div className="flex gap-[1.5vw] justify-end ml-auto">
            <div>
              <button
                onClick={() => {
                  setEmpId();
                  setEmpData();
                  setHeaderTab("personal");
                  setAction("add");
                  setOpenModal(true);
                  setClientID(null);
                }}
                type="button"
                className="bg-[#4C67ED] hover:bg-[#3b50c2] cursor-pointer border border-[#4C67ED] shadow-md shadow-[#c4c0c0]
                   flex px-[0.2vw] h-[2.25vw] w-[9vw] justify-center gap-[0.5vw] items-center 
                   rounded-[0.7vw] transition-colors duration-200"
              >
                <HiOutlinePlusSm size={"1.3vw"} color="#FFFFFF" />
                <span className="font-bold text-white text-[0.9vw]">
                  {tabName === "Client" ? "Add Client" : "Add Employee"}
                </span>
              </button>
            </div>
            <div>
              <input
                accept=".xlsx, .xls"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <button
                onClick={handleButtonClick}
                className="bg-[#ffffff] border border-[#ebebeb] shadow-md flex px-[0.75vw] h-[2.25vw] w-[9vw] 
                 justify-center gap-[0.5vw] items-center rounded-[0.6vw] 
                 outline-[2px] outline-transparent
                 hover:outline-[#4096ff] cursor-pointer transition-all duration-200"
              >
                <ImportIcon size={"1vw"} color="#323232" />
                <span className="font-bold text-[0.9vw] text-[#323232]">
                  Import
                </span>
              </button>
            </div>
            <div>
              <input
                id="xlsxFile"
                name="xlsxFile"
                type="file"
                style={{ display: "none" }}
              />
              <ExportButton dataArray={currentItems || []} />
              {/* <button
                className="bg-[#ffffff] border border-[#ebebeb] shadow-md flex px-[0.75vw] h-[2.25vw] w-[9vw] 
                 justify-center gap-[0.5vw] items-center rounded-[0.6vw] 
                  outline-[2px] outline-transparent
                 hover:outline-[#4096ff] cursor-pointer transition-all duration-200"
              >
                <ExportIcon size={"1vw"} color="#323232" />
                <span className="font-bold text-[#323232] text-[0.9vw]">
                  Export
                </span>
              </button> */}
            </div>
          </div>
          <div className="flex gap-[1.5vw] justify-end ">
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
            <div className="">
              <ConfigProvider
                theme={{
                  components: {
                    Select: {
                      borderRadius: "0.7vw",
                    },
                  },
                }}
              >
                <Select
                  className="custom-select h-[2.2vw] text-[2vw] relative flex justify-center items-center w-[12vw] rounded-[1vw] shadow-md placeholder:text-[2vw]"
                  allowClear
                  options={statusOptions}
                  placeholder="Status"
                  onChange={handleStatusChange}
                  style={{ textAlign: "center" }} // Center the text
                  value={status}
                />

                <span className="pt-[-3vw]">
                  <svg
                    className="mt-[-2vw] pl-[0.9vw] absolute"
                    width="2vw"
                    height="1.8vw"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.3958 2.49324C14.5746 2.30813 14.8483 2.03735 15.0848 1.93578C15.3213 1.8342 15.5841 1.75289 15.8415 1.75066C16.0989 1.74842 16.4708 1.83833 16.709 1.93578C16.9472 2.03322 17.3145 2.3569 17.4965 2.53887C17.6785 2.72084 17.8714 3.03543 17.9688 3.27361C18.0663 3.5118 18.1567 3.80501 18.1545 4.06234C18.1522 4.31968 18.0704 4.62431 17.9688 4.86076C17.8672 5.09722 17.6816 5.35387 17.4965 5.53265L11.6559 11.4215C11.5032 11.5741 10.9953 11.9372 10.7863 11.9914L7.03321 12.8951L8.05577 9.07872C8.10998 8.86974 8.31054 8.57158 8.46321 8.41891L14.3958 2.49324ZM18.2402 1.66444C17.9252 1.34946 17.5513 1.0996 17.1397 0.929136C16.7281 0.758668 16.287 0.670929 15.8415 0.670929C15.396 0.670929 14.9549 0.758668 14.5433 0.929136C14.1317 1.0996 13.7578 1.34946 13.4428 1.66444L7.56957 7.53685C7.23377 7.87276 6.99386 8.29229 6.87467 8.75203L5.6884 13.3288C5.65669 13.4513 5.65751 13.58 5.69078 13.702C5.72406 13.8241 5.78863 13.9354 5.87811 14.0248C5.96759 14.1143 6.07887 14.1789 6.20096 14.2121C6.32305 14.2454 6.45172 14.2462 6.57422 14.2145L11.1516 13.0284C11.6115 12.909 12.0312 12.6688 12.367 12.3327L18.2402 6.46024C18.8761 5.82421 19.2334 4.96169 19.2334 4.06234C19.2334 3.163 18.8761 2.30047 18.2402 1.66444ZM9.54184 1.64022C10.323 1.64022 11.0809 1.74294 11.801 1.93578L10.7863 2.6926C9.276 2.47688 7.22945 2.94743 5.87811 3.65538C4.52677 4.36333 3.30777 5.79688 2.62551 7.16123C1.94324 8.52558 1.81919 10.1157 2.06357 11.6214C2.30794 13.1271 3.1566 14.7509 4.23536 15.8295C5.31412 16.9081 6.77602 17.6656 8.28191 17.9099C9.78781 18.1543 11.5822 17.9641 12.9467 17.2819C14.3112 16.5997 15.6058 15.0532 16.3139 13.702C17.0219 12.3509 17.3554 10.6265 17.1397 9.11639L17.9688 8.10277C18.4409 9.86285 18.3497 11.7266 17.708 13.4321C17.0664 15.1377 15.9065 16.5995 14.3913 17.6122C12.8762 18.6249 11.0818 19.1376 9.26027 19.0784C7.43872 19.0191 5.68149 18.3909 4.23536 17.2819C2.78923 16.1729 1.72685 14.6388 1.19743 12.8951C0.668005 11.1514 0.69813 9.28573 1.28357 7.56005C1.86902 5.83436 2.98037 4.33538 4.46155 3.27361C5.94273 2.21185 7.71933 1.64064 9.54184 1.64022Z"
                      fill="#323232"
                    />
                  </svg>
                </span>
              </ConfigProvider>
            </div>
          </div>
        </div>
      </div>
      <div className=" relative flex-1 h-[68vh] ">
        <Employee
          currentItems={currentItems}
          setOpenModal={setOpenModal}
          setDeleteModalIsOpen={setDeleteModalIsOpen}
          setEmpName={setEmpName}
        />
      </div>
      <div className="fixed bottom-[5vh] w-screen flex justify-between items-center">
        <div className="flex">
          <p className="text-[0.8vw]">
            Showing {itemOffset + 1} -{" "}
            {Math.min(itemOffset + itemsPerPage, employee?.length)} of{" "}
            {employee?.length} items
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
      <Modal isOpen={openModal} width={"60vw"} onClose={closeModal}>
        {tabName === "Client" ? (
          <AddClient
            clientId={clientId}
            setClientID={setClientID}
            setHeaderTab={setHeaderTab}
            headerTab={headerTab}
            setOpenModal={setOpenModal}
            action={action}
            setAction={setAction}
          />
        ) : (
          <AddEmployee setOpenModal={setOpenModal} />
        )}{" "}
      </Modal>

      <DeleteModal
        show={deleteModalIsOpen}
        onClose={closeModal}
        height="20vw"
        width="30vw"
        closeicon={false}
      >
        {tabName === "Employee" ? (
          <DeleteList
            setDeleteModalIsOpen={setDeleteModalIsOpen}
            title={
              empName?.length > 15 ? (
                <span title={empName}>
                  Want to delete this {empName.slice(0, 15)}...
                </span>
              ) : (
                `Want to delete this ${empName}`
              )
            }
            api={`${apiUrl}/emPersonal/${empId}`}
            module={"Employee"}
          />
        ) : (
          ""
          // <DeleteList
          //   setDeleteModalIsOpen={setDeleteModalIsOpen}
          //   title={`Want to delete this ${invoiceId}`}
          //   api={`${apiUrl}/invoice/${invoiceId}`}
          //   module={"SaleInvoice"}
          // />
        )}
      </DeleteModal>
    </>
  );
}
