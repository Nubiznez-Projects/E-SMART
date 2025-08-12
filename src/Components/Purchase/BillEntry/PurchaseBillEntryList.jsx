import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { getBillByGrn } from "../../../API/Purchase/PurchaseBill";
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
export const PurchaseBillEntryList = ({
  setActiveTab,
  captureId,
  purchasePOID,
}) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [billData, setBillData] = useState();
  const [addBill, setAddBill] = useState(false);
  const [billNumber, setBillNumber] = useState(null);
  const [billById, setBillById] = useState();
  const [grnData, setGrnData] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deletemodalIsOpen, setDeleteModalIsOpen] = useState(false);

  console.log("Delete Modal && Addbill :", deletemodalIsOpen);
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
    {
      title: (
        <span className="text-[1vw] font-semibold flex items-center justify-center">
          Actions
        </span>
      ),
      key: "actions",
      width: "10vw",
      render: (row) => (
        <div className="flex gap-[1vw] justify-center items-center">
          <VscEdit
            onClick={() => {
              setAddBill(true);
              setBillNumber(row?.Bno);
            }}
            className="cursor-pointer"
            size={"1.2vw"}
          />
          <AiOutlineDelete
            className="cursor-pointer"
            size={"1.2vw"}
            onClick={() => {
              setBillNumber(row.Bno);
              setDeleteModalIsOpen(true);
            }}
          />
        </div>
      ),
    },
  ];

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
    setBillNumber();
  };

  const openImageModal = (imgSrc) => {
    setSelectedImage(imgSrc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const fetchGrnById = async () => {
    try {
      const response = await getPurchaseGrnByID(captureId);
      // setGrnData(response);
      setGrnData(response[0]);
      console.log("Grn Fetched Successfully :", response);
      return response?.data;
    } catch (err) {
      console.error("Getting Error in GRN :", err);
    }
  };

  const fetchBillByGrn = () => {
    try {
      const response = getBillByGrn(captureId, setBillData);
      return response;
    } catch (error) {}
  };

  // useEffect(() => {
  //   if (billData?.length > 0) {
  //     setBillNumber(billData?.Bno);
  //   }
  // }, [billData]);

  useEffect(() => {
    if (addBill || deletemodalIsOpen === false) {
      fetchBillByGrn();
    }
  }, [addBill, deletemodalIsOpen]);

  useEffect(() => {
    fetchGrnById();
  }, [addBill]);

  console.log("Bill Number :", billNumber);
  return (
    <>
      <div className="mt-[1vw]">
        {addBill === true ? null : (
          <div className="flex items-center justify-between">
            <div className="bg-[#323232] cursor-pointer w-[1.75vw] h-[1.75vw] rounded-full flex items-center justify-center">
              <IoMdArrowRoundBack
                size={"1.25vw"}
                color="white"
                onClick={() => {
                  setActiveTab("GRN");
                }}
              />
            </div>

            <div
              className="flex items-center justify-center bg-[#323232] text-white text-[0.8vw] px-[0.5vw] py-[0.25vw] rounded-[0.25vw] "
              onClick={() => {
                setAddBill(true);
                setBillNumber(null);
                setBillById(null);
              }}
            >
              {billById && billById?.length > 0 ? "Edit Bill" : "Add Bill"}
            </div>
          </div>
        )}
        {addBill === true ? (
          <CreateBillEntry
            setAddBill={setAddBill}
            setActiveTab={setActiveTab}
            captureId={captureId}
            billData={billData}
            purchasePOID={purchasePOID}
            billNumber={billNumber}
            billById={billById}
            setBillById={setBillById}
            fetchBillByGrn={fetchBillByGrn}
            grnData={grnData}
            setGrnData={setGrnData}
          />
        ) : (
          <>
            <div className="flex justify-between w-full text-[1vw] text-[#323232] gap-[1vw] mt-[2vw]">
              <div className="flex flex-col w-1/3 gap-y-[0.75vw]">
                <div className="flex justify-between">
                  <span>PO Number :</span>
                  <span className="font-semibold">
                    {grnData?.PurchasePONum}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Innvoice Number :</span>
                  <span className="font-semibold">{grnData?.InvoiceNum}</span>
                </div>
              </div>
              <div className="flex flex-col w-1/3 gap-y-[0.75vw]">
                <div className="flex justify-between">
                  <span>GRN Number :</span>
                  <span className="font-semibold">{grnData?.GRNNum}</span>
                </div>
                <div className="flex justify-between">
                  <span>Created By :</span>
                  <span className="font-semibold">{grnData?.CreatedBy}</span>
                </div>
              </div>
            </div>

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
        )}
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
      <DeleteModal
        show={deletemodalIsOpen}
        onClose={closeDeleteModal}
        height="20vw"
        width="30vw"
        closeicon={false}
      >
        <DeleteList
          setDeleteModalIsOpen={setDeleteModalIsOpen}
          title={`Want to delete this ${billNumber}`}
          api={`${apiUrl}/billentry/${billNumber}`}
          module={"BillEntry"}
          // filter={filter}
          // setPermission={setPermission}
        />
      </DeleteModal>
    </>
  );
};
