import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getReqList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/request/filtered-clients`);
    console.log("Get Request List", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting Request List", error);
    throw error;
  }
};


export const changeReqStatus = async (clientID, status) => {
  console.log("status_api_called");
  const payload = {
    req_status: status,
    req_status_id:
      status === "Active"
        ? 2
        : status === "InActive"
        ? 3 : null,
  };
console.log("status_api_called", payload);
  try {
    const response = await axios.put(
      `${BASE_URL}/clients/${clientID}/req-status`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const changeDocStatus = async (clientID, status) => {
  console.log("status_api_called");
  const payload = {
    status: status,
    statusId:
      status === "verify"
        ? 1
        : status === "verified"
        ? 2 : null,
  };
console.log("status_api_called", payload);
  try {
    const response = await axios.put(
      `${BASE_URL}/clientDoc/status/${clientID}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};


export const SearchReqData = async (term) => {
  try {
    const url =
      term?.length === 0
        ? `${BASE_URL}/request/filtered-clients`
        : `${BASE_URL}/request/search-clients?term=${term}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in searchedPurchasePO:", error);
    throw error;
  }
};

export const filterRequest = async ({ fromDate, toDate }) => {
  try {
    const params = {};

    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    console.log("Final params sent to API:", params);
    const response = await axios.get(`${BASE_URL}/request/search-clients?`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error filtering suppliers", error);
    return [];
  }
};