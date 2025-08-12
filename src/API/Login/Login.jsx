import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const loginEndpoints = {
  client: `${BASE_URL}/clientlogin/login`,
  employee: `${BASE_URL}/emplogin/login`,
};

export const login = async (userType, values) => {
  const url = loginEndpoints[userType];
  console.log(userType, url, "userType")
  if (!url) throw new Error("Invalid user type");

  // Different field for client
  const payload =
    userType === "client"
      ? { emailid: values?.email_id, password: values?.password }
      : { email: values?.email_id, password: values?.password };

  try {
    const response = await axios.post(url, payload); // send payload directly
    console.log(response, "userType")
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Login failed. Check credentials.";
    //alert(message);
    throw error; // optional: rethrow for additional handling
  }
};
