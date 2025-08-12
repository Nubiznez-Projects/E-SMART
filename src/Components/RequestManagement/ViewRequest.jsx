import React, { useEffect, useState } from "react";
import { getClientDocById } from "../../API/UserManagement/Client/ClientDetails";
import { changeDocStatus } from "../../API/RequestManagement/RequestManagement";
import { fetchRequestList } from "../../Redux/Slice/RequestManagement/RequestThunk";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

export default function ViewRequest({ clientId, closeModal }) {

  const [docData, setDocData] = useState();
  const img_url = import.meta.env.VITE_IMAGE_URL;
   const dispatch = useDispatch();

  const fetchDocuments = async () => {
    try {
      const response = await getClientDocById(clientId);
      setDocData(response);
    } catch (error) {
      console.error("Error fetching documents", error);
    }
  };

  const handleVerify = async() =>{
    try{
      const newStatus = "verified";
      const response = await changeDocStatus(clientId, newStatus);
      dispatch(fetchRequestList());
      toast.success(response.message);
      closeModal();
    } catch(error){
        console.error("Error in verify doc", error);
    }
  }

  useEffect(() => {
    if (clientId) {
      fetchDocuments();
    }
  }, [clientId]);

  return (
    <>
      <div className="flex flex-col w-full h-full items-center">
        <div className="flex w-full justify-between mt-[1vw]">
          <h1 className="text-[1.3vw] font-bold">DOCUMENTS</h1>
          <p className="text-[0.95vw]">{docData?.client_id}</p>
        </div>
        <div className="border-[0.1vw] border-b-gray-800 w-full mb-[0.6vw]"></div>
        <div className="grid grid-cols-2 w-full p-[1vw] items-center gap-x-[3vw]">
          {/* <div className='flex flex-col gap-[0.3vw]'>
       <label className='text-[1vw]'>Client</label>
       <p className='text-[0.85vw]'>{docData?.client_id}</p>
      </div> */}
          <div className="flex flex-col gap-[0.3vw]">
            <label className="text-[1vw]">Aadhar Number</label>
            <p className="text-[0.85vw]">{docData?.aadhar_no}</p>
          </div>
          <div className="flex flex-col gap-[0.3vw]">
            <label className="text-[1vw]">PAN Number</label>
            <p className="text-[0.85vw]">{docData?.aadhar_no}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 w-full p-[1vw] items-center gap-x-[3vw]">
          <div className="flex flex-col gap-[0.5vw]">
            <label className="text-[1vw]">Aadhar Image</label>
            <img
              src={`${img_url}${docData?.aadhar_img}`}
              alt="Aadhar Image"
              className="h-[10vw] w-[20vw]"
            />
          </div>
          <div className="flex flex-col gap-[0.5vw]">
            <label className="text-[1vw]">PAN Image</label>
            <img
              src={`${img_url}${docData?.pan_img}`}
              alt="Aadhar Image"
              className="h-[10vw] w-[20vw]"
            />
          </div>
          <div className="flex col-span-2 mt-[1vw] w-full items-center justify-end">
            {docData?.statusId === 1 ? 
             <button 
           onClick={handleVerify}
           className="bg-blue-500 text-[0.9vw] w-[6vw] h-[2vw] text-white rounded mt-2 border-[0.01vw] border-[#4C67ED] cursor-pointer">Verify</button>
           :   <button 
           onClick={closeModal}
           className="text-[0.9vw] w-[6vw] h-[2vw] text-[#4C67ED] rounded mt-2 border-[0.01vw] border-[#4C67ED] cursor-pointer">CANCEL</button>
           }
          </div>
         
        </div>
      </div>
    </>
  );
}
