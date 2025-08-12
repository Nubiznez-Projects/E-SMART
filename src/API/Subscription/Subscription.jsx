import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getSubscriptionList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/subscription/active-subs`);
    console.log("Get Subscription List", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting Subscription List", error);
    throw error;
  }
};

export const SearchSubData = async (term) => {
  try {
    const url =
      term?.length === 0
        ? `${BASE_URL}/subscription/active-subs`
        : `${BASE_URL}/subscription/filter?term=${term}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in searchedPurchasePO:", error);
    throw error;
  }
};

export const filterSubscription = async ({ fromDate, toDate }) => {
  try {
    const params = {};

    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    console.log("Final params sent to API:", params);
    const response = await axios.get(`${BASE_URL}/subscription/filter?`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error filtering suppliers", error);
    return [];
  }
};