import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getClientDetails = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/clients`);
    console.log("Get purchase PO response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting Suppliers", error);
    throw error;
  }
};

export const getClientDetailsById = async (clientID, setClientData) => {
  try {
    const response = await axios.get(`${BASE_URL}/clients/${clientID}`);
    console.log("Client DataBy ID :", response.data);
    setClientData(response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting Suppliers", error);
    throw error;
  }
};

export const SubmitClientExcel = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const excelEndpoint = `${BASE_URL}/clients/import-excel`;

  try {
    const response = await axios.post(excelEndpoint, formData);
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};


export const getClientDocById = async (clientID) => {
  try {
    const response = await axios.get(`${BASE_URL}/clientDoc/${clientID}`);
    console.log("Client Documents By ID :", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting Suppliers", error);
    throw error;
  }
};

export const SubmitClientDetails = async (
  clientDetails,
  clientID,
  setClientID,
  data
) => {
  try {
    const formData = new FormData();
    formData.append("company_name", clientDetails?.companyName);
    formData.append("owner_name", clientDetails?.clientName);
    formData.append("phone", clientDetails?.phone);
    formData.append("emailid", clientDetails?.emailId);
    formData.append("type_of_constitution", clientDetails?.typeOfConstitution);
    formData.append("business_background", clientDetails?.typeOfBusiness);
    formData.append("web_url", clientDetails?.webUrl);
    formData.append("company_logo_file", clientDetails?.companyProfile);
    formData.append("status_id", 1);
    formData.append("status", "Draft");
    formData.append("user_id", "admin-101");
    //formData.append("plan_type", clientDetails?.planType);
    formData.append("payment_status", "Unpaid" || data?.payment_status ); 
    formData.append("payment_status_id", 2 || data?.payment_status_id );   
    formData.append("req_status_id", 4 || data?.req_status_id );
    formData.append("req_status", "not_verified" || data?.req_status_id );

    let response;
    if (clientID) {
      response = await axios.put(`${BASE_URL}/clients/${clientID}`, formData);
    } else {
      response = await axios.post(`${BASE_URL}/clients`, formData);
      toast.success(response?.data?.message);
      console.log("Post method working :", response);
    }
    if (response?.data?.client_id) {
      setClientID(response?.data?.client_id);
    }
  } catch (error) {
    console.error("Submitting Error", error);
  }
};

export const SubmitClientAddress = async (addressDetail, clientID) => {
  const payload = {
    address: addressDetail?.address,
    state: addressDetail?.state,
    //state_id: 1,
    region: addressDetail?.region,
    //region_id: 1,
    city: addressDetail?.city,
    //city_id: 1,
    country: addressDetail?.country,
    //country_id: 1,
    zip_code: addressDetail?.postalCode?.toString(),
  };
  try {
    const response = await axios.put(
      `${BASE_URL}/clientAddress/${clientID}`,
      payload
    );
    toast.success(response?.data?.message);
    console.log("Post method working for Address:", response);
  } catch (error) {
    console.error("Submitting Error", error);
  }
};

export const SubmitGstDetails = async (gstDetails, clientID) => {
  try {
    const formData = new FormData();
    formData.append("has_gstin", "yes");
    formData.append(
      "aggregate_turnover_exceeded",
      gstDetails?.aggregate_turnover_exceeded
    );
    formData.append("state_name", gstDetails?.state);
    formData.append("state_code_number", gstDetails?.stateCode);
    formData.append("gstin", gstDetails?.gstin);
    formData.append("head_office", gstDetails?.HeadOffice);
    formData.append("upload_gst", gstDetails?.gstfile);

    let response;
    if (clientID) {
      response = await axios.put(`${BASE_URL}/clientGST/${clientID}`, formData);
      toast.success(response?.data?.message);
      console.log("Post method working for GST:", response);
    }
  } catch (error) {
    console.error("Submitting Error", error);
  }
};

export const SearchClientData = async (term) => {
  try {
    const url =
      term?.length === 0
        ? `${BASE_URL}/clients`
        : `${BASE_URL}/clients/search?term=${term}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in searchedPurchasePO:", error);
    throw error;
  }
};

export const SubmitClientDoc = async (clientId, documentsdata) => {
  try {
    const formData = new FormData();

    // Append all fields to FormData
    formData.append("aadhar_no", documentsdata.aadhar_number);
    formData.append("pan_no", documentsdata.pan_number);
    formData.append("status", documentsdata.status || "verify");
    formData.append("status_Id", documentsdata.status_Id || 1);
    if (documentsdata.aadhar_doc) {
      formData.append("aadhar_img", documentsdata.aadhar_doc);
    }

    if (documentsdata.pan_doc) {
      formData.append("pan_img", documentsdata.pan_doc);
    }

    let response;

    response = await axios.put(
      `${BASE_URL}/clientDoc/${clientId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting employee form data:", error);
    throw error;
  }
};

// ✅ Accept a single object as parameter
export const filterClient = async ({ fromDate, toDate, status }) => {
  console.log(status, "po_statuis_update");
  try {
    const params = {};

    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    if (status === 1) params.StatusId = 1;
    else if (status === 2) params.StatusId = 2;
    else if (status === 3) params.StatusId = 3;

    console.log("Final params sent to API:", params);
    const response = await axios.get(`${BASE_URL}/clients/search?`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error filtering suppliers", error);
    return [];
  }
};

export const changeClientStatus = async (clientID, status) => {
  console.log("status_api_called");
  const payload = {
    status: status,
    status_id:
      status === "Draft"
        ? 1
        : status === "Pending"
        ? 2
        : status === "Approved"
        ? 3 : null,
  };
console.log("status_api_called", payload);
  try {
    const response = await axios.put(
      `${BASE_URL}/clients/${clientID}/status`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const changePaymentStatus = async (clientID, status) => {
  console.log("status_api_called");
  const payload = {
    payment_status: status,
    payment_status_id:
      status === "Paid"
        ? 1
        : status === "Unpaid"
        ? 2 : null,
  };

  try {
    const response = await axios.put(
      `${BASE_URL}/clients/${clientID}/payment-status`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};