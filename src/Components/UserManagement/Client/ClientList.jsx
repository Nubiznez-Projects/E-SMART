import React, { useState, useEffect } from "react";
import { ConfigProvider, Table, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchClient } from "../../../Redux/Slice/UserManagement/ClientThunk";
import dayjs from "dayjs";
import { VscEdit } from "react-icons/vsc";
import { VscEye } from "react-icons/vsc";
import { AiOutlineDelete } from "react-icons/ai";
import Modal from "../../Common/Modal/Modal";
import DeleteModal from "../../Common/Modal/Delete/DeleteModal";
import DeleteList from "../../Common/Delete/DeleteComponent";
import {
  changeClientStatus,
  changePaymentStatus,
  getClientDetailsById,
} from "../../../API/UserManagement/Client/ClientDetails";
import { capitalizeFirstLetter } from "../../Common/Capitalization";

const apiUrl = import.meta.env.VITE_API_URL;

const img_url = import.meta.env.VITE_IMAGE_URL;

export default function ClientList({
  currentItems,
  setOpenModal,
  setClientID,
  clientId,
  action,
  setAction,
}) {
  const dispatch = useDispatch();
  const [clientData, setClientData] = useState();
  const [deletemodalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [openPopoverId, setOpenPopoverId] = useState(null);
   const [statusPopoverId, setStatusPopoverId] = useState(null);

  console.log(openPopoverId, "openPopoverId");
  console.log(clientData, "clientData_list");

  useEffect(() => {
    function handleClickOutside(event) {
      if (openPopoverId !== null || statusPopoverId !== null) {
        const clickedElement = event.target;
        const isStatusButton = clickedElement.closest(".status-button");
        const isDropdownContent = clickedElement.closest(
          ".status-dropdown-content"
        );
        if (!isStatusButton && !isDropdownContent) {
          setOpenPopoverId(null);
          setStatusPopoverId(null);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openPopoverId, statusPopoverId]);

  const columns = [
    {
      title: <span className="text-[1vw] font-semibold">Profile</span>,
      align: "center",
      width: "10vw",
      render: (row) => {
        return (
          <div className="flex items-center justify-center text-[0.85vw] font-medium ml-[1vw] ">
            <img
              src={`${img_url}${row?.company_logo}`}
              className="w-[2.15vw] h-[2.15vw] object-cover rounded-[0.2vw]"
            />
          </div>
        );
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">Client ID</span>,
      align: "center",
      width: "10vw",
      //sorter: (a, b) => a.CustomerName?.localeCompare(b.CustomerName),
      render: (row) => {
        return <div className="text-[0.85vw]">{row?.client_id}</div>;
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
    // {
    //   title: <span className="text-[1vw] font-semibold">Business Type</span>,
    //   align: "center",
    //   width: "15vw",
    //   //sorter: (a, b) => a.ContactPerson?.localeCompare(b.ContactPerson),
    //   render: (row) => {
    //     return (
    //       <div className="text-[0.85vw]">
    //         {row?.business_background?.length > 20 ? (
    //           <Tooltip
    //             placement="top"
    //             color="white"
    //             overlayInnerStyle={{ color: "#0A0E0D" }}
    //             title={`${capitalizeFirstLetter(row?.business_background)}`}
    //             className="cursor-pointer"
    //           >
    //             {row?.business_background?.slice(0, 20) + ".."}
    //           </Tooltip>
    //         ) : (
    //           row?.business_background
    //         )}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   title: <span className="text-[1vw] font-semibold">Mobile</span>,
    //   align: "center",
    //   width: "15vw",
    //   render: (row) => {
    //     return (
    //       <div className="flex justify-center items-center text-[0.85vw]">
    //         {row?.phone}
    //       </div>
    //     );
    //   },
    // },
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
      title: <span className="text-[1vw] font-semibold">Created</span>,
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
                if (row.emp_status_id === 1) {
                  return;
                }
                e.stopPropagation();
                setOpenPopoverId(isCurrentPopoverOpen ? null : row.client_id);
                setClientID(row?.client_id);
              }}
              className={`status-button flex items-center justify-center text-[0.85vw] font-medium border-[0.1vw] rounded-full w-[6.6vw] gap-x-[0.7vw] py-[0.1vw] ${getStatusClasses(
                row?.status
              )} ${
                row.status_id === 1 ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              disabled={row?.status_id === 1}
            >
              <span>{row.status}</span>
            </button>
            {isCurrentPopoverOpen && (
              <div className="status-dropdown-content absolute z-10 mt-[4vw] w-[7vw] bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-[0.4vw]">
                  {["Approved", "Pending"].map((status) => (
                    <button
                      key={status}
                      className="block w-full text-left px-4 py-1 text-[0.85vw] text-gray-700 hover:bg-gray-100"
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
      title: <span className="text-[1vw] font-semibold">Payment Status</span>,
      align: "center",
      width: "10vw",
      render: (row) => {
        const isCurrentPopoverOpen = statusPopoverId === row.client_id;
        return (
          <div className="flex justify-center items-center text-[0.85vw]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setStatusPopoverId(isCurrentPopoverOpen ? null : row.client_id);
                setClientID(row?.client_id);
              }}
              className={`status-button flex items-center justify-center text-[0.85vw] font-medium border-[0.1vw] rounded-full w-[6.6vw] gap-x-[0.7vw] py-[0.1vw] ${getStatusClasses(
                row?.payment_status
              )} ${
                row.status_id === 1 ? "cursor-not-allowed" : "cursor-pointer"
              }`}
             disabled={row?.status_id === 1}
            >
              <span>{row.payment_status}</span>
            </button>
            {isCurrentPopoverOpen && (
              <div className="status-dropdown-content absolute z-10 mt-[6vw] w-[7vw] bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {["Paid", "Unpaid"].map((status) => (
                    <button
                      key={status}
                      className="block w-full text-left px-4 py-2 text-[0.85vw] text-gray-700 hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePaymentStatus(row.client_id, status);
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
          <div className="px-[1vw] flex gap-[1.1vw]">
            <div className="flex items-center gap-[0.8vw]">
              <VscEye
                onClick={() => {
                  setClientID(row?.client_id);
                  setAction("view");
                  setOpenModal(true);
                }}
                className="cursor-pointer"
                size={"1.2vw"}
              />
              <VscEdit
                className="cursor-pointer"
                size={"1.2vw"}
                onClick={() => {
                  setClientID(row?.client_id);
                  setOpenModal(true);
                  setAction("edit");
                }}
              />
              <AiOutlineDelete
                onClick={() => {
                  setClientID(row?.client_id);
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

  const getStatusClasses = (status) => {
    switch (status) {
      case "Pending":
        return "bg-[#FFEAA5] text-[#FF9D00] border-[#FF9D00]";
      case "Approved":
        return "bg-[#ECFDF3] text-[#34AE2A] border-[#34AE2A]]";
         case "Paid":
        return "bg-[#ECFDF3] text-[#34AE2A] border-[#34AE2A]]";
        case "Unpaid":
        return "bg-[#FDECEC] text-[#E52A2A] border-[#E52A2A]";
         case "UnPaid":
        return "bg-[#FDECEC] text-[#E52A2A] border-[#E52A2A]";
      default:
        return "bg-[#dedfe3] text-[#3e4243] border-[#3e4243]";
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
    setClientID();
  };

  const fetchClientID = async () => {
    try {
      const response = getClientDetailsById(clientId, setClientData);
    } catch (error) {
      console.error("Client By ID :", error);
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchClientID();
    }
  }, [clientId]);

  const handleStatusSelect = async (rowId, newStatus) => {
    const response = await changeClientStatus(rowId, newStatus);
    dispatch(fetchClient());
    setOpenPopoverId(null);
    console.log("Selected status for row", rowId, "is:", newStatus);
    console.log("GLOBAL PurchaseStatus is now:", newStatus);
  }; 

    const handlePaymentStatus = async (rowId, newStatus) => {
    const response = await changePaymentStatus(rowId, newStatus);
    dispatch(fetchClient());
    setStatusPopoverId(null);
  };

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
          style={{ height: "68vh", width: "100%" }}
          columns={columns}
          pagination={false}
          dataSource={currentItems}
          rowClassName={(record, index) => `custom-row-${index}`}
        />
      </ConfigProvider>

      <DeleteModal
        show={deletemodalIsOpen}
        onClose={closeDeleteModal}
        height="20vw"
        width="30vw"
        closeicon={false}
      >
        <DeleteList
          setDeleteModalIsOpen={setDeleteModalIsOpen}
          title={`Want to delete this ${
            clientData?.company?.company_name?.length > 20
              ? `${clientData?.company?.company_name.slice(0, 20) + "..."} `
              : clientData?.company?.company_name
          } Details`}
          api={`${apiUrl}/clients/${clientId}`}
          module={"clients"}
          // filter={filter}
          // setPermission={setPermission}
        />
      </DeleteModal>
    </>
  );
}
