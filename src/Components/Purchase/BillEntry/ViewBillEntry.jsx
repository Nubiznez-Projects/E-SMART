import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
  getBillByGrn,
  getBillByPONum,
} from "../../../API/Purchase/PurchaseBill";
import { BillEntryTable } from "./BillEntryTable";
import { CreateBillEntry } from "./CreateBIllEntry";
import { getPurchaseGrnByID } from "../../../API/Purchase/PurchaseGRN";
import { ConfigProvider, Modal, Table } from "antd";
import { VscEdit, VscEye } from "react-icons/vsc";
import { AiOutlineDelete } from "react-icons/ai";
import dayjs from "dayjs";
import DeleteModal from "../../Common/Modal/Delete/DeleteModal";
import DeleteList from "../../Common/Delete/DeleteComponent";

const IMAGE_URL = import.meta.env.VITE_API_IMAGE_URL;

export const ViewBillEntry = ({ setActiveTab, captureId, purchasePOID }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [billData, setBillData] = useState();

  const [billNumber, setBillNumber] = useState(null);
  const [grnData, setGrnData] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const columns = [
    {
      title: (
        <span className="flex items-center justify-center text-[1vw] font-semibold">
          Bill No
        </span>
      ),
      width: "10vw",
      render: (row) => (
        <div className="flex items-center justify-center text-[0.85vw] font-bold">
          {row?.Bno}
        </div>
      ),
    },
    {
      title: (
        <span className="flex items-center justify-center text-[1vw] font-semibold">
          Item Category
        </span>
      ),
      width: "10vw",
      render: (row) => (
        <div className="flex items-center justify-center text-[0.85vw] font-semibold">
          {row?.ItemCategory}
        </div>
      ),
    },
    {
      title: (
        <span className="text-[1vw] font-semibold flex items-center justify-center">
          Date
        </span>
      ),
      key: "UpdatedDate",
      width: "10vw",
      sorter: (a, b) => new Date(a.UpdatedDate) - new Date(b.UpdatedDate),
      render: (row) => (
        <div className="text-[0.85vw] flex items-center justify-center">
          {dayjs(row.UpdatedDate).format("DD-MM-YYYY")}
        </div>
      ),
    },
    {
      title: (
        <span className="text-[1vw] font-semibold flex items-center justify-center">
          Amount
        </span>
      ),
      key: "Amount",
      width: "10vw",
      sorter: (a, b) => a.Amount - b.Amount,
      render: (row) => (
        <div className="text-[0.85vw] flex items-center justify-center">
          ₹ {row?.Amount}
        </div>
      ),
    },
    {
      title: (
        <span className="text-[1vw] font-semibold flex items-center justify-center">
          Bill Image
        </span>
      ),
      key: "BillImage",
      width: "15vw",
      render: (row) => {
        const fullImagePath = `${IMAGE_URL}${row?.BillImage}`; // adapt your static image server path
        console.log("Image :", fullImagePath);
        return (
          <div className="flex items-center justify-center">
            <img
              src={fullImagePath}
              alt="Bill"
              className="w-[3vw] h-[3vw] object-cover rounded-[0.5vw] cursor-pointer"
              onClick={() => openImageModal(fullImagePath)}
            />
          </div>
        );
      },
    },
  ];

  const fetchBillByPO = async () => {
    try {
      const response = await getBillByPONum(purchasePOID);
      console.log("Bill by PO Num :", response);
      setBillData(response);
    } catch (error) {
      console.error("Error in Getting Bill By PO :", error);
    }
  };

  useEffect(() => {
    fetchBillByPO();
  }, [purchasePOID]);

  const openImageModal = (imgSrc) => {
    setSelectedImage(imgSrc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  console.log("Bill Number :", billNumber);
  return (
    <>
      <div className="mt-[1vw]">
        <>
          <div className="mt-[1.5vw]">
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
                    headerSplitColor: "#000000",
                  },
                },
              }}
            >
              <Table
                className="custom-table"
                rowKey="id" // use the 'id' field from your data
                style={{ height: "68vh", width: "100%" }}
                columns={columns}
                pagination={false}
                dataSource={billData}
                rowClassName={(record, index) => `custom-row-${index}`}
              />
            </ConfigProvider>
          </div>
        </>
      </div>

      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={closeModal}
        width={"40vw"}
      >
        <img
          src={selectedImage}
          alt="Bill Preview"
          className="w-full h-auto rounded"
        />
      </Modal>
    </>
  );
};
