import React, { useState, useEffect } from "react";
import { ConfigProvider, Table, Tooltip } from "antd";
import { capitalizeFirstLetter } from "../../Common/Capitalization";
import dayjs from "dayjs";
import { VscEdit, VscEye } from "react-icons/vsc";
import { AiOutlineDelete } from "react-icons/ai";
import UserProfile from "../../../assets/userProfile.jpg";
import { useUserContext } from "../../../Context/UserContext";
import { UpdateStatus } from "../../../API/UserManagement/Employee/Employee";
import { fetchEmployee } from "../../../Redux/Slice/UserManagement/EmployeeThunk";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function Employee({
  currentItems,
  setOpenModal,
  setDeleteModalIsOpen,
  setEmpName,
}) {
  const apiImgUrl = import.meta.env.VITE_IMAGE_URL;
  const { setAction, setEmpId, setHeaderTab } = useUserContext();
  const [openPopoverId, setOpenPopoverId] = useState(null);
    const dispatch = useDispatch();

  const getStatusClasses = (status) => {
    switch (status) {
      case "Hold":
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

    const handleStatusSelect = async (rowId, newStatus) => {
      try {
        const response = await UpdateStatus(rowId, newStatus, dispatch);
        console.log(rowId, "response");
        toast.success(response.message);
        setOpenPopoverId(null);
      } catch (error) {
        console.log("Error Updating status", error);
      }
    };

  const columns = [
    {
      title: <span className="text-[1vw] font-semibold">Profile</span>,
      align: "center",
      width: "8vw",
      render: (row) => {
        const image = `${apiImgUrl}${row?.profile_img}`;
        return (
          <div className="flex justify-center items-center w-full">
            <img
              src={`${row?.profile_img ? image : UserProfile} `}
              alt="Image"
              className="w-[1.7vw] h-[1.7vw] object-cover rounded-[0.2vw]"
            />
          </div>
        );
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">Employee ID</span>,
      align: "center",
      width: "15vw",
      //sorter: (a, b) => a.CustomerName?.localeCompare(b.CustomerName),
      render: (row) => {
        return <div className="text-[0.85vw] font-bold">{row?.emp_id}</div>;
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">Employee Name</span>,
      align: "center",
      width: "15vw",
      // sorter: (a, b) => a.CustomerType?.localeCompare(b.CustomerType),
      render: (row) => {
        const fullname = `${
          row?.emp_first_name.charAt(0) ===
          row?.emp_first_name.charAt(0)?.toLowerCase()
            ? capitalizeFirstLetter(row?.emp_first_name)
            : row?.emp_first_name
        } ${row?.emp_last_name}`;
        return (
          <div className="flex justify-center items-center">
            <p className="text-[0.85vw]">
              {fullname?.length > 20 ? (
                <Tooltip
                  placement="top"
                  color="white"
                  overlayInnerStyle={{ color: "#0A0E0D" }}
                  title={`${capitalizeFirstLetter(row?.emp_first_name)} ${
                    row.emp_last_name
                  }`}
                  className="cursor-pointer"
                >
                  {fullname?.slice(0, 20) + ".."}
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
      title: <span className="text-[1vw] font-semibold">Role Type</span>,
      align: "center",
      width: "15vw",
      //sorter: (a, b) => a.ContactPerson?.localeCompare(b.ContactPerson),
      render: (row) => {
        return (
          <div className="flex items-center justify-center">
            {row?.role_type ? (
              <p className="text-[0.85vw]">
                {row?.role_type?.length > 10 ? (
                  <Tooltip
                    placement="top"
                    color="white"
                    overlayInnerStyle={{ color: "#0A0E0D" }}
                    title={`${capitalizeFirstLetter(row?.role_type)}`}
                    className="cursor-pointer"
                  >
                    {capitalizeFirstLetter(row?.role_type?.slice(0, 10)) + ".."}
                  </Tooltip>
                ) : (
                  capitalizeFirstLetter(row?.role_type)
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
      title: <span className="text-[1vw] font-semibold">Designation</span>,
      align: "center",
      width: "15vw",
      render: (row) => {
        return (
          <div className="flex items-center justify-center">
            {row?.designation ? (
              <p className="text-[0.85vw]">
                {row?.designation?.length >= 12 ? (
                  <Tooltip
                    placement="top"
                    color="white"
                    overlayInnerStyle={{ color: "#0A0E0D" }}
                    title={`${capitalizeFirstLetter(row?.designation)}`}
                    className="cursor-pointer"
                  >
                    {row?.designation?.slice(0, 12) + ".."}
                  </Tooltip>
                ) : (
                  row?.designation
                )}
              </p>
            ) : (
              <div className="w-full text-[1vw] font-bold">-</div>
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
        return (
          <div className="flex items-center justify-center">
            {row?.phone ? (
              <p className="text-[0.85vw]">{row.phone}</p>
            ) : (
              <div className="font-bold text-[1vw]">-</div>
            )}
          </div>
        );
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">Email</span>,
      align: "center",
      width: "10vw",
      render: (row) => {
        return (
          <div>
            {row?.email_id?.length > 20 ? (
              <Tooltip
                color="white"
                placement="top"
                title={row?.email_id}
                overlayInnerStyle={{ color: "#0A0E0D" }}
                className="cursor-pointer"
              >
                <div className="text-[0.85vw]">
                  {" "}
                  {`${row?.email_id?.slice(0, 20)}...`}
                </div>
              </Tooltip>
            ) : row?.email_id ? (
              <div className="text-[0.85vw]">{row?.email_id?.slice(0, 20)}</div>
            ) : (
              <div className="font-bold text-[1vw] text-center">-</div>
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
          <div className="flex items-center justify-center">
            <p className="text-[0.85vw]">
              {dayjs(row.created_date).format("DD MMM, YY")}
            </p>
          </div>
        );
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">Status</span>,
      align: "center",
      width: "10vw",
      render: (row) => {
         const isCurrentPopoverOpen = openPopoverId === row.emp_id;
        return (
          <div className="flex justify-center items-center text-[0.85vw]">
            <button
              type="button"
               onClick={(e) => {
                if(row.emp_status_id === 1){
                  return
                }
                 e.stopPropagation();
                 setOpenPopoverId(isCurrentPopoverOpen ? null : row.emp_id);
                 setEmpId(row?.emp_id);
               }}
              className={`status-button flex items-center justify-center text-[0.85vw] font-medium border-[0.1vw] rounded-full w-[6.6vw] gap-x-[0.7vw] py-[0.1vw] ${getStatusClasses(
                row?.emp_status
              )} ${row.emp_status_id === 1 ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span>{row.emp_status}</span>
            </button>
            {isCurrentPopoverOpen && (
              <div className="status-dropdown-content absolute z-10 mt-[8vw] w-[7vw] bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {["Active", "InActive", "Hold"].map((status) => (
                    <button
                      key={status}
                      className="block w-full text-left px-4 py-2 text-[0.85vw] text-gray-700 hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusSelect(row.emp_id, status);
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
                  setEmpId(row?.emp_id);
                  setHeaderTab("personal");
                  setOpenModal(true);
                  setAction("view");
                }}
                className="cursor-pointer"
                size={"1.2vw"}
              />
              <VscEdit
                className="cursor-pointer"
                size={"1.2vw"}
                onClick={() => {
                  setEmpId(row?.emp_id);
                  setHeaderTab("personal");
                  setOpenModal(true);
                  setAction("edit");
                }}
              />
              <AiOutlineDelete
                onClick={() => {
                  setEmpId(row?.emp_id);
                  setEmpName(
                    `${row?.emp_first_name} ${" "} ${row?.emp_last_name}`
                  );
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
          rowKey="emp_id" // use the 'id' field from your data
          style={{ height: "68vh", width: "100%" }}
          columns={columns}
          pagination={false}
          dataSource={currentItems}
          rowClassName={(record, index) => `custom-row-${index}`}
        />
      </ConfigProvider>
    </>
  );
}
