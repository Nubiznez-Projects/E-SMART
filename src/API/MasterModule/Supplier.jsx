import axios from "axios";
import { toast } from "react-toastify";
import { fetchSuppliers } from "../../Redux/Slice/MasterModule/Suppliers/SupplierThunks";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getSuppliers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/suppliers`);
    console.log("Get suppliers response", response.data);
    return response.data;
  } catch (error) {
   console.error("Error getting Suppliers", error);
    throw error;
  }
};

export const getSupplierByID = async (supplierID) => {
  try {
    const response = await axios.get(`${BASE_URL}/suppliers/${supplierID}`);
    console.log("Getting customer by ID", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting customer byId", error);
    throw error;
  }
};

export const SubmitSupplierExcel = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const excelEndpoint = `${BASE_URL}/suppliers/import-excel`;

  try {
    const response = await axios.post(excelEndpoint, formData);
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

export const searchSuppliers = async (term) => {
  try {
    const url =
      term?.length === 0
        ? `${BASE_URL}/suppliers` // fallback to full list
        : `${BASE_URL}/suppliers/search?term=${term}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in searchCustomers:", error);
    throw error; // Optional: let the calling thunk handle rejection
  }
};

export const CreateSuppliers = async (supplierData, supplierID, dispatch) => {
  const formatAddress = (address) => {
    if (!address) return "";
    const { doorNo, floor, street, area, district, pincode } = address;
    return `${doorNo},${floor},${street}, ${area}, ${district}, ${pincode}`;
  };
  console.log(supplierData, "supplierData_payyload");
  try {
    const payload = {
      SupplierName: supplierData.name,
      SupplierType: supplierData.type,
      ContactPersonName: supplierData.contactPerson,
      MobileNumber: supplierData.mobile,
      Email: supplierData.email,
      GSTIN: supplierData.gstin,
      PANNumber: supplierData.pan,
      Address: formatAddress(supplierData.address),
      State: supplierData.state,
      Country: supplierData.country,
      CustomerCategory: supplierData.category,
      IsActive: supplierData.status == "true",
      Currency: supplierData.currency,
      PrePaymentMode: supplierData.mode,
      CreatedBy: supplierData.createdBy,
      UpdatedBy: supplierData.updatedBy || "",
    };
    let response;
    if (supplierID) {
      response = await axios.put(
        `${BASE_URL}/suppliers/${supplierID}`,
        payload
      );
      console.log("Update supplier", response.data);
    } else {
      response = await axios.post(`${BASE_URL}/suppliers`, payload);
      console.log("Create supplier response", response.data);
    }
    dispatch(fetchSuppliers());
    toast.success(response.message);
    return response.data;
  } catch (error) {
    console.error("Error creating Suppliers", error);
    throw error;
  }
};

// ✅ Accept a single object as parameter
export const filterSupplier = async ({ fromDate, toDate, status }) => {
  try {
    const params = {};

    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    if (status === "active") params.status = true;
    else if (status === "inactive") params.status = false;

    console.log("Final params sent to API:", params);

    const response = await axios.get(`${BASE_URL}/suppliers`, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error filtering suppliers", error);
    return [];
  }
};


export const deleteSupplier = async (supplierID) => {
  try {
    const response = await axios.delete(`${BASE_URL}/suppliers/${supplierID}`);
  } catch (error) {
    console.error("Error deleting customer", error);
    throw error;
  }
};
