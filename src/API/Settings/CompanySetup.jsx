import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getCompanyByID = async (proId) => {
  try {
    const response = await axios.get(`${BASE_URL}/business/${proId}`);
    console.log(response.data, "Response from Company List");
    return response.data;
  } catch (error) {
    console.error("Error fetching company List", error);
  }
};


export const UpdateCompanyBusiness = async (proId, values, businessData) => {
  try {
    const payload = {
      CompanyName: values.company,
      OwnerName: values.owner,
      ConstitutionType: values.constitution,
      MSMENumber: values.msmeNo,
      BusinessBackground: values.businessBackground,
      TypeOfService: values.serviceType,
      MSMEType: values.msmeType,
      CurrencyCode: values.currency,
      PhoneNum: businessData?.PhoneNum, 
      EmailID: businessData?.EmailID, 
    };

    // Send PUT request with JSON payload
    const response = await axios.put(`${BASE_URL}/business/${proId}`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response?.data;
  } catch (error) {
    console.error("Error submitting business update:", error);
    throw error;
  }
};

export const UpdateCompanyAddress = async (proId, values) => {
  try {
    // Create the payload object
    const payload = {
      Region: values.region,
      PostalCode: values.zipCode,
      Address: values.address,
      City: values.city,
      GSTIN: values.gstin,
      State: values.state,
      Country: values.country,
    };

    // Send PUT request with JSON payload
    const response = await axios.put(`${BASE_URL}/address/${proId}`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response?.data;
  } catch (error) {
    console.error("Error submitting address:", error);
    throw error;
  }
};

export const UpdateBankDetails = async (proId, values) => {
  try {
    // Create the payload object
    const payload = {
  BankName: values.bank,
  Branch: values.branch,
  AccountNum: values.accNo,
  IFSC: values.ifsc,
    };

    // Send PUT request with JSON payload
    const response = await axios.put(`${BASE_URL}/bankDetail/${proId}`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response?.data;
  } catch (error) {
    console.error("Error submitting Bank Details:", error);
    throw error;
  }
};

export const UpdateCompanyProfile = async ( 
  proId,  
  fileList
) => {
   try {
    const formData = new FormData();

    // Append all fields to FormData
     if (fileList[0]?.originFileObj) {
      formData.append("ProfileImage", fileList[0].originFileObj);
    }

    let response;
      response = await axios.put(`${BASE_URL}/business/upload-profile/${proId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    return response?.data;
  } catch (error) {
    console.error("Error submitting employee form data:", error);
    throw error;
  }
};

