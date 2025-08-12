import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

console.log(BASE_URL, "BASE_URL");

export const getCustomers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/customers`);
    return response.data;
  } catch (error) {
    console.error("Error getting Customers:", error);
    throw error;
  }
};

export const searchCustomers = async (term) => {
  try {
    const url =
      term?.length === 0
        ? `${BASE_URL}/customers` // fallback to full list
        : `${BASE_URL}/customers/search?term=${term}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in searchCustomers:", error);
    throw error; // Optional: let the calling thunk handle rejection
  }
};

export const SubmitCustomerExcel = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const excelEndpoint = `${BASE_URL}/customers/import-excel`;

  try {
    const response = await axios.post(excelEndpoint, formData);
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

export const createCustomer = async (customerData, customerId) => {
const formatAddress = (addressArray) => {
  if (!Array.isArray(addressArray) || addressArray.length === 0) return "";

  const { doorNo, street, floor, area, district, pincode } = addressArray[0];
  return `${doorNo}, ${street}, ${floor}, ${area}, ${district}, ${pincode}`;
};


  try {
    const payload = {
      CustomerName: customerData.name,
      CustomerType: customerData.type,
      ContactPerson: customerData.contactPerson,
      MobileNumber: customerData.mobile,
      EmailAddress: customerData.email,
      GSTIN: customerData.gstin,
      PANNumber: customerData.pan,
      BillingAddress:customerData.billingAddress,
      ShippingAddress: formatAddress(customerData.shippingAddress),
      State: customerData.state,
      Country: customerData.country,
      CustomerCategory: customerData.category,
      Status: customerData.status === "true",
      Currency: customerData.currency,
      PaymentMode: customerData.mode,
      CreatedBy: customerData.createdBy,
      UpdatedBy: customerData.updatedBy || "",
    };

    let response;

    if (customerId) {
      // If ID is present, update existing customer (PUT)
      response = await axios.put(
        `${BASE_URL}/customers/${customerId}`,
        payload
      );
      console.log("Update customer", response.data);
    } else {
      // If no ID, create a new customer (POST)
      response = await axios.post(`${BASE_URL}/customers`, payload);
      console.log("Create customer response", response.data);
    }

    return response.data;
  } catch (error) {
    console.error("Error creating customers", error);
    throw error;
  }
};

export const getCustomersByID = async (customerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/customers/${customerId}`);
    console.log("Getting customer by ID", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting customer byId", error);
    throw error;
  }
};

// ✅ Accept a single object as parameter
export const filterCustomers = async ({ fromDate, toDate, status }) => {
  try {
    const params = {};

    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    if (status === "active") params.status = true;
    else if (status === "inactive") params.status = false;

    console.log("Final params sent to API:", params);

    const response = await axios.get(`${BASE_URL}/customers`, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error filtering customers", error);
    return [];
  }
};
