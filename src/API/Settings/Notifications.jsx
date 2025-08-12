import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getNotification = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/notification`);
    console.log("Successfully Fetched Notification", response);
    return response.data;
  } catch (error) {
    console.error("Error in Getting Notification", error);
  }
};

export const unReadMessage = async (id) => {
  const payload = {
    isRead: true,
  };
  try {
    console.log("ID passed Successfully :", id);
    if (id) {
      const response = await axios.put(
        `${BASE_URL}/notification/${id}`,
        payload
      );
      console.log("Status Change Success:", response);
    }
  } catch (error) {
    console.error("Status Change Failed :", error);
  } finally {
    getNotification();
  }
};

export const MarkAllasRead = async () => {
  const payload = {
    isRead: true,
  };
  try {
    const response = await axios.put(
      `${BASE_URL}/notification/mark-all-read`,
      payload
    );
    console.log("Status Change Success:", response);
  } catch (error) {
    console.error("Status Change Failed :", error);
  } finally {
    getNotification();
  }
};
