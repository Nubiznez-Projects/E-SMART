import React, { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { HiDotsVertical } from "react-icons/hi";
import { Button, Popover, Space } from "antd";

export default function RoleCard({
  ChangeCardName,
  setSelectedRole,
  setRoleID,
  list,
  setAddModal,
  setDeleteRoleModal,
}) {
  const [startIndex, setStartIndex] = useState(0);
  const [openPopoverId, setOpenPopoverId] = useState(false);
  const cardsPerPage = 4;
  const visibleCards = list?.slice(startIndex, startIndex + cardsPerPage);

  console.log(visibleCards, "visible_Cards");
  const showPrevious = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const showNext = () => {
    if (startIndex + cardsPerPage < list?.length) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const handleEdit = (roleId) => {
    setOpenPopoverId(false);
    console.log("Edit role:", roleId);
    setRoleID(roleId);
    setAddModal(true);
  };

  const handleDelete = (roleId) => {
    setOpenPopoverId(false);
    setRoleID(roleId);
    setDeleteRoleModal(true);
  };

  return (
    <div className="relative">
      {startIndex > 0 && (
        <button
          onClick={showPrevious}
          disabled={startIndex === 0}
          className="absolute top-[5.5vw] left-[-1.75vw] text-[0.9vw] p-[0.25vw] rounded-full bg-[#000000] hover:bg-[#2c2c2c] disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
        >
          <IoIosArrowBack size={"1vw"} color="white" />
        </button>
      )}

      <div className="flex items-start justify-start gap-x-[1.7vw] w-[92vw] h-[23vh] overflow-x-auto scrollbar-hide">
        {/* Cards section */}
        <div className="relative flex flex-col">
          <div className="flex mt-[1vw] gap-[1.7vw]">
            {visibleCards?.map((card, index) => (
              <div
                key={index}
                className="bg-white w-[17vw] h-[8vw] rounded-[1vw] relative p-[0.5vw] mt-[1vw]  hover:shadow-lg hover:shadow-[#61605B4D] cursor-pointer"
                onClick={() => {
                  setRoleID(card?.RoleId);
                  setSelectedRole(card);
                  ChangeCardName(card?.RoleName);
                }}
              >
                <div className="grid grid-cols-4 p-[0.1vw] items-center">
                  {/* Role name */}
                  <div className="col-span-2">
                    <p className="text-[1vw] font-bold">
                      {card.RoleName?.toUpperCase()}
                    </p>
                  </div>

                  {/* Users avatars */}
                  <div className="flex items-center gap-1 col-span-1">
                    {card?.RoleCount > 0 && (
                      <>
                        <img
                          className="border-2 border-white dark:border-gray-800 rounded-full h-5 w-5 -mr-2"
                          src="https://randomuser.me/api/portraits/men/44.jpg"
                          alt=""
                        />
                        <img
                          className="border-2 border-white dark:border-gray-800 rounded-full h-5 w-6 -mr-2"
                          src="https://randomuser.me/api/portraits/women/42.jpg"
                          alt=""
                        />
                        <span
                          className="flex items-center justify-center bg-white dark:bg-gray-800 text-[0.7vw]
          text-gray-800 dark:text-white font-bold border-2 border-gray-200 dark:border-gray-700 rounded-full h-7 w-7"
                        >
                          +9
                        </span>
                        <span className="text-[0.7vw]">Users</span>
                      </>
                    )}
                  </div>

                  {/* Popover menu */}
                  <div className="flex justify-end col-span-1">
                    <Popover
                      key={card.RoleId}
                      open={openPopoverId === card.RoleId}
                      onOpenChange={(open) => {
                        setOpenPopoverId(open ? card.RoleId : null);
                      }}
                      overlayInnerStyle={{
                        backgroundColor: "#F9F6EB",
                        borderColor: "black",
                        borderWidth: "0.15vw",
                        width: "5vw",
                      }}
                      content={
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleEdit(card.RoleId)}
                            className="cursor-pointer text-[1vw] hover:text-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(card.RoleId)}
                            className="cursor-pointer text-[1vw] hover:text-blue-600"
                          >
                            Delete
                          </button>
                        </div>
                      }
                      trigger="click"
                      placement="right"
                    >
                      <button>
                        <HiDotsVertical
                          className="cursor-pointer"
                          size={"1vw"}
                        />
                      </button>
                    </Popover>
                  </div>
                </div>

                <p className="flex text-[0.80vw] text-[#0A0E0D] font-thin py-[1.4vw] px-[0.4vw]">
                  {card.Narration}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Create Role Card (Fixed) */}
        <div
          className="flex items-center justify-center mt-[1vw]"
          onClick={() => {
            setAddModal(true);
            setRoleID();
          }}
        >
          <div className="border-dashed border flex items-center justify-center relative p-[0.5vw] mt-[1vw] cursor-pointer bg-white w-[15vw] h-[8vw] rounded-[1vw]">
            <div className="text-[1.1vw] font-semibold">+ CREATE NEW ROLE</div>
          </div>
        </div>
      </div>
      {list?.length > cardsPerPage &&
        startIndex + cardsPerPage < list.length && (
          <button
            onClick={showNext}
            disabled={startIndex + cardsPerPage >= list.length}
            className="absolute top-[5.5vw] right-[-1.75vw] text-[0.9vw] p-[0.25vw] rounded-full bg-[#000000] hover:bg-[#2c2c2c] disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
          >
            <IoIosArrowForward size={"1vw"} color="white" />
          </button>
        )}
    </div>
  );
}
