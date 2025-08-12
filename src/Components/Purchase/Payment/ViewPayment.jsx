import React, { useEffect, useState } from "react";
import { getPaymentByPOID } from "../../../API/Purchase/PurchasePayment";
import { getGrnByPoNum } from "../../../API/Purchase/PurchaseGRN";
import { getPurchasePOID } from "../../../API/Purchase/PurchasePO";
import dayjs from "dayjs";

export const ViewPayment = ({ purchasePOID }) => {
  const [grnData, setGrnData] = useState();
  const [paymentData, setPaymentData] = useState();
  const [purchasePOData, setPurchasePoData] = useState();
  const paidAmount = paymentData?.reduce((sum, item) => sum + item.Amount, 0);
  const balanceDue = paymentData?.reduce((sum, item) => sum + item.balDue, 0);

  const fetchPaymentByPOID = () => {
    try {
      const response = getPaymentByPOID(purchasePOID, setPaymentData);
      return response;
    } catch (error) {
      console.error("Error In getting Payment :", error);
    }
  };

  const fetchGrnById = async () => {
    try {
      const response = await getGrnByPoNum(purchasePOID, setGrnData);
      // setGrnData(response);
      console.log("Grn Fetched Successfully :", response);
      return response?.data;
    } catch (err) {
      console.error("Getting Error in GRN :", err);
    }
  };

  console.log();
  const fetchPoByID = async () => {
    try {
      const response = await getPurchasePOID(purchasePOID);
      console.log("PO Fetched SuccessFullt:", response);
      setPurchasePoData(response);
      return response;
    } catch (error) {
      console.error("Getting Error in PO by ID:");
    }
  };
  useEffect(() => {
    fetchGrnById();
    fetchPoByID();
    fetchPaymentByPOID();
  }, []);

  console.log("balalalalalala", grnData);

  return (
    <div>
      <>
        <div className="flex gap-[2vw] text-[#323232] text-[0.95vw] mt-[2vw]">
          <div className="bg-[#F9F6EB] rounded-[0.5vw] px-[1vw] py-[0.5vw] flex flex-col gap-[0.5vw]">
            <div>To:</div>
            <div className="font-bold">{purchasePOData?.SupplierName}</div>
            <div>{purchasePOData?.SupplierAddress}</div>
            <div>
              <span className="font-semibold">Email :</span>
              <span>{purchasePOData?.Email}</span>
            </div>
            <div>
              {" "}
              <span className="font-semibold">Phone :</span>
              <span>{purchasePOData?.MobileNumber} </span>
            </div>
          </div>
          <div className="bg-[#F9F6EB] rounded-[0.5vw] px-[1vw] py-[0.5vw] flex flex-col gap-[0.5vw]">
            <div>From:</div>
            <div className="font-bold">INNOFASHION</div>
            <div>
              SAK Nagar, TN SF NO-61/2 PART, Thottipalayam village
              zone,Tirupur-641603
            </div>
            <div>
              <span className="font-semibold">Email :</span>
              <span>sandeepmauryadesigns@gmail.com</span>
            </div>
            <div>
              {" "}
              <span className="font-semibold">Phone :</span>
              <span>+91 98765 43210 </span>
            </div>
          </div>
        </div>
        <div className="h-[50vh] overflow-y-scroll scrollbar-hide">
          <div className="flex flex-col gap-y-[0.5vw] justify-between mt-[1vw]">
            {paymentData?.map((items) => {
              return (
                <>
                  <div className="flex gap-[1vw] flex-wrap border-[0.1vw] border-[#323232] rounded-[0.5vw] px-[1vw] py-[0.5vw] text-[0.9vw] text-[#323232] shadow-">
                    <div className=" flex border-0 border-b-[0.1vw] w-full">
                      {" "}
                      <div className="flex justify-between gap-[1vw] mb-[0.2vw] w-full">
                        <div>
                          <span className="font-bold">GRN Number :</span>{" "}
                          <span>{items?.GRNNum}</span>{" "}
                        </div>
                        <div className="bg-[#FFEAA5]  border-[#FF9D00] text-[#FF9D00] flex items-center justify-center rounded-full border-[0.1vw] w-[5vw] h-[1.5vw] text-[0.8vw]">
                          status
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-[0.5vw]">
                      <span className="font-bold">Paymnt ID:</span>
                      <span className="font-semibold">{items?.PaymentID}</span>
                    </div>
                    <div className="flex gap-[0.5vw]">
                      <span className="font-bold">Paymnt Mode:</span>
                      <span className="font-semibold">
                        {items?.PaymentMode}
                      </span>
                    </div>
                    <div className="flex gap-[0.5vw]">
                      <span className="font-bold">Total Amount</span>
                      <span className="font-semibold">{items?.Amount}</span>
                    </div>
                    <div className="flex gap-[0.5vw]">
                      <span className="font-bold">Balance Due:</span>
                      <span className="font-semibold">{items?.balDue}</span>
                    </div>
                    <div className="flex gap-[0.5vw]">
                      <span className="font-bold">Payment Date:</span>
                      <span className="font-semibold">
                        {dayjs(items?.PaymentDate).format("DD-MM-YYYY")}
                      </span>
                    </div>
                    <div className="flex gap-[0.5vw]">
                      <span className="font-bold">Transaction Date:</span>
                      <span className="font-semibold">
                        {dayjs(items?.transactionDate).format("DD-MM-YYYY")}
                      </span>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
          <div className="flex mt-[2vw]">
            <div className="w-3/4"></div>
            <div className="flex flex-col justify-end w-1/2">
              <div className="text-[1.1vw] font-semibold border-t-[#32323280] border-t-[0.1vw]  border-b-[0.1vw] border-0">
                <div className="flex items-center justify-between text-[#03B34D]">
                  <span>Paid Amount :</span>
                  <span>{`₹ ${paidAmount}`}</span>
                </div>
                <div className="flex items-center justify-between text-[#C21D1D]">
                  <span>Balance Amount :</span>
                  <span>{`₹ ${balanceDue}`}</span>
                </div>
                <div className="flex items-center justify-between font-bold">
                  {" "}
                  <span>Total Amount :</span>
                  <span>{`₹ ${grnData && grnData[0]?.TotalValue}`}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};
