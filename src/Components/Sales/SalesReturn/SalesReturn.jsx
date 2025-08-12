import React, { useEffect, useState } from "react";
import { ConfigProvider, Table } from "antd";
import dayjs from "dayjs";
import { VscEdit, VscEye } from "react-icons/vsc";
import { AiOutlineDelete } from "react-icons/ai";
import DeleteModal from "../../Common/Modal/Delete/DeleteModal";
import DeleteList from "../../Common/Delete/DeleteComponent";
import { getSalesReturnById } from "../../../API/Sales/SalesReturn";

const apiUrl = import.meta.env.VITE_API_URL;

export default function SalesReturn({
  currentItems,
  salesReturnId,
  setSalesReturnID,
  salesReturnData,
  setSalesReturnData,
  setOpenAddModal,
  setIsView,
}) {
  const [deletemodalIsOpen, setDeleteModalIsOpen] = useState(false);

  const columns = [
    {
      title: <span className="text-[1vw] font-semibold">Return ID</span>,
      align: "center",
      width: "15vw",
      sorter: (a, b) => a.SPoReturnID?.localeCompare(b.SPoReturnID),
      render: (row) => {
        return (
          <div className="text-[0.85vw] font-medium">{row?.SPoReturnID}</div>
        );
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">Invoice No</span>,
      align: "center",
      width: "15vw",
      //sorter: (a, b) => a.CustomerName?.localeCompare(b.CustomerName),
      render: (row) => {
        return (
          <div className="text-[0.85vw]">{row?.InvoiceNo}</div>
        );
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">Customer</span>,
      align: "center",
      width: "15vw",
      // sorter: (a, b) => a.CustomerType?.localeCompare(b.CustomerType),
      render: (row) => {
        return <div className="text-[0.85vw]">{row?.CustomerName}</div>;
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">Email</span>,
      align: "center",
      width: "15vw",
      // sorter: (a, b) => a.CustomerType?.localeCompare(b.CustomerType),
      render: (row) => {
        return <div className="text-[0.85vw]">{row?.Email}</div>;
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">Total Amount</span>,
      align: "center",
      width: "15vw",
      render: (row) => {
        return (
          <div className="text-[0.85vw]">  {`₹ ${row?.TotalAmount}`}</div>
        );
      },
    },
    {
      title: <span className="text-[1vw] font-semibold">Return Date</span>,
      align: "center",
      width: "15vw",
      //sorter: (a, b) => a.ContactPerson?.localeCompare(b.ContactPerson),
      render: (row) => {
        return (
          <div className="text-[0.85vw]">
            {dayjs(row.ReturnDate).format("DD-MM-YYYY")}
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
                  setSalesReturnID(row.SPoReturnID);
                  setIsView(true);
                }}
                className="cursor-pointer"
                size={"1.2vw"}
              />
              {/* {row?.StatusId !== 1 && ( */}
              <VscEdit
                className="cursor-pointer"
                size={"1.2vw"}
                onClick={() => {
                  setSalesReturnID(row.SPoReturnID);
                  setOpenAddModal(true);
                }}
              />
              {/* )} */}
              {/* {row?.StatusId !== 1 && ( */}
              <AiOutlineDelete
                onClick={() => {
                  setSalesReturnID(row.SPoReturnID);
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

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
  };

   const fetchReturnByID = async () => {
      try {
        const response = await getSalesReturnById(salesReturnId);
        setSalesReturnData(response);
      } catch (error) {
        console.error("Error :", error);
      }
    };
  
    useEffect(() => {
      if (salesReturnId) {
        fetchReturnByID();
      }
    }, [salesReturnId]);

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
          rowKey="SPoReturnID" // use the 'id' field from your data
          rowSelection={{ type: "checkbox" }}
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
          title={`Want to delete this ${salesReturnData?.CustomerName?.slice(0, 20)}'s Return`}
          api={`${apiUrl}/salesReturn/${salesReturnId}`}
          module={"SalesReturn"}
          // filter={filter}
          // setPermission={setPermission}
        />
      </DeleteModal>
    </>
  );
}
