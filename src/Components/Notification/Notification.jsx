import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { capitalizeFirstLetter } from "../Common/Capitalization";
import {
  getNotification,
  MarkAllasRead,
  unReadMessage,
} from "../../API/Settings/Notifications";

export default function Notification() {
  const [getnotificationlist, setGetNotificationList] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [bgColor, setBgColor] = useState([]);
  const [expandedMessageId, setExpandedMessageId] = useState(null);

  const fetchNotification = async () => {
    try {
      const response = await getNotification();
      console.log("Notification fetching Completed", response);
      setGetNotificationList(response);
    } catch (error) {
      console.error("Notification fetching failed", error);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  const handleUpdateReading = async (notificationID) => {
    try {
      const response = await unReadMessage(notificationID);
      console.log("ID Checked :", response, notificationID);
      setGetNotificationList((prev) =>
        prev.map((item) =>
          item.id === notificationID ? { ...item, isRead: true } : item
        )
      );
    } catch (error) {
      console.error("Error Updating readings:", error);
    }
  };

  const handleMarkasRead = async () => {
    try {
      const response = await MarkAllasRead();
      console.log("ID Checked :", response);
    } catch (error) {
      console.error("Error Updating readings:", error);
    }
  };

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const handleScroll = () => {
      // Optional
    };

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (getnotificationlist?.length && bgColor.length === 0) {
      const colors = Array.from(
        { length: getnotificationlist.length },
        getRandomColor
      );
      setBgColor(colors);
    }
  }, [getnotificationlist, bgColor.length]);

  const groupNotificationsByDate = (notifications) => {
    const grouped = {};
    notifications?.forEach((notification) => {
      const date = dayjs(notification.created_date);
      let dateLabel;

      if (date.isSame(dayjs(), "day")) {
        dateLabel = "Today";
      } else if (date.isSame(dayjs().subtract(1, "day"), "day")) {
        dateLabel = "Yesterday";
      } else {
        dateLabel = date.format("D MMMM YYYY");
      }

      if (!grouped[dateLabel]) {
        grouped[dateLabel] = [];
      }

      grouped[dateLabel].push(notification);
    });

    return grouped;
  };

  const filteredNotifications = getnotificationlist?.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return item?.isRead === false;
    return true;
  });

  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

  const toggleMessageExpansion = async (id, isRead) => {
    if (expandedMessageId === id) {
      setExpandedMessageId(null);
    } else {
      setExpandedMessageId(id);

      if (!isRead) {
        await handleUpdateReading(id);

        if (activeTab === "unread") {
          setActiveTab("all");
        }
      }
    }
  };
  console.log("groupedNotifications :", groupedNotifications);

  return (
    <div className="">
      <div className="notification-header">
        <div className="notification-title">
          <div>Notification</div>
        </div>
        <div className="mark-as-read" onClick={handleMarkasRead}>
          Mark all as read
        </div>
      </div>

      <div className="notification-tabs">
        <div
          className={`cursor-pointer ${
            activeTab === "all"
              ? "text-[#1f4b7f] font-semibold border-b-[0.2vw] border-[#1F487C]"
              : "text-[#777] pb-[0.3vw]"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All
        </div>

        <div
          className={`cursor-pointer ${
            activeTab === "unread"
              ? "text-[#1f4b7f] font-semibold border-b-[0.2vw] border-[#1F487C]"
              : "text-[#777] pb-[0.3vw]"
          }`}
          onClick={() => setActiveTab("unread")}
        >
          Unread
        </div>
      </div>

      {filteredNotifications && filteredNotifications.length > 0 ? (
        <div
          ref={scrollContainerRef}
          className="notification-list-container space-y-4 max-h-[70vh] overflow-y-auto"
        >
          {Object.entries(groupedNotifications).map(
            ([dateLabel, notifications]) => (
              <div key={dateLabel}>
                <div className="notification-date-header text-[0.9vw] font-semibold text-gray-500 mb-2">
                  {/* {dayjs(dateLabel).isSame(dayjs(), "day")
                    ? "Today"
                    : dayjs(dateLabel).isSame(dayjs().subtract(1, "day"), "day")
                    ? "Yesterday"
                    : dayjs(dateLabel).format("DD-MM-YYYY")} */}
                  {["Today", "Yesterday"].includes(dateLabel)
                    ? dateLabel
                    : dayjs(dateLabel, "D MMMM YYYY").format("DD-MM-YYYY")}
                </div>
                {notifications.map((item, index) => {
                  const message = capitalizeFirstLetter(item?.message);
                  const isExpanded = expandedMessageId === item.id;
                  const isShort = message?.length <= 20;

                  return (
                    <div
                      className={`notification-item space-x-[0.4vw] px-[5vw] rounded-[0.75vw] cursor-default transition ${
                        item.isRead ? "opacity-60" : "bg-[#4c67ed1a]"
                      }`}
                      key={item.id}
                    >
                      {" "}
                      <div className="flex space-x-[1vw]  items-center justify-between w-full mx-[1vw]">
                        <div className="notification-avatar-wrapper flex-shrink-0">
                          <div
                            className="notification-avatar w-10 h-10 flex items-center justify-center text-white font-bold text-lg"
                            style={{
                              backgroundColor: bgColor[index % bgColor.length],
                            }}
                          >
                            {item.user_name
                              ? capitalizeFirstLetter(item.user_name).charAt(0)
                              : "?"}
                          </div>
                        </div>
                        <div className="notification-message-content flex-grow">
                          <div
                            className={`notification-user-name font-semibold ${
                              item?.isRead ? "text-gray-500" : "text-gray-900"
                            }`}
                          >
                            {capitalizeFirstLetter(item?.user_name)}
                          </div>

                          <div
                            className={`text-[0.9vw] mt-1 ${
                              item?.isRead ? "text-gray-400" : "text-gray-600"
                            }`}
                            onClick={async (e) => {
                              e.stopPropagation();
                              await toggleMessageExpansion(
                                item.id,
                                item.isRead
                              );
                            }}
                          >
                            {isShort || isExpanded
                              ? message
                              : `${message?.slice(0, 20)}...`}
                          </div>
                        </div>
                        <div
                          className={`notification-time text-xs flex-shrink-0 mt-1 ${
                            item.isRead ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {dayjs(item?.created_date).isSame(dayjs(), "day")
                            ? `${dayjs(item?.created_date).format("hh:mm A")}`
                            : `${dayjs(item?.created_date).format("D MMM")}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center p-8 bg-white rounded-lg shadow">
          <div className="text-center text-gray-400 text-lg">
            {activeTab === "all"
              ? "No Notifications Found"
              : "No Unread Notifications Found"}
          </div>
        </div>
      )}
    </div>
  );
}
