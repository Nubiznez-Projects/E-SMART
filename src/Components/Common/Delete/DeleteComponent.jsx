import React from "react";
import { useDispatch } from "react-redux";
import { MdAutoDelete } from "react-icons/md";
import { Deleteall } from "../../../API/Common";


export default function DeleteComponent({
  title,
  setDeleteModalIsOpen,
  api,
  module,
  setPermission,
}) {
  const dispatch = useDispatch();


  const handlesubmit = () => {
    setDeleteModalIsOpen(false);
    Deleteall(api, dispatch, module, setPermission);
  };


  return (
    <div>
      <div className="flex flex-col  justify-center">
        <div className="items-center flex-col flex justify-center mt-[0.5vw]">
          <MdAutoDelete color="#4C67ED80" size={"5vw"} />
          <p className="text-[1.7vw] font-semibold mt-[1vw]">Are You Sure ?</p>
          <p className="text-[1.1vw] mt-[0.5vw]">{`${title} ?`}</p>
        </div>
        <div className="flex items-center mt-[2vw] gap-[2vw] justify-center">
          <button
            className="border-[#4C67ED] cursor-pointer border-[0.1vw] rounded-[0.5vw] text-[1.1vw] font-semibold text-[#4C67ED] w-[10vw]  h-[3vw]"
            onClick={() => setDeleteModalIsOpen(false)}
          >
            No
          </button>
          <button
            className="bg-[#4C67ED] cursor-pointer text-white font-semibold text-[1.1vw] w-[10vw] h-[3vw] rounded-[0.5vw] border-[0.1vw] border-[#4C67ED]"
            onClick={() => handlesubmit()}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
