import axios from "axios";
import { fetchEmployee } from "../../../Redux/Slice/UserManagement/EmployeeThunk";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getEmployeeList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/emPersonal/combined`);
    console.log(response.data, "Response from Employee List");
    return response.data;
  } catch (error) {
    console.error("Error fetching employee List", error);
  }
};

export const CreateEmployeePersonal = async (
  empId,
  values,
  fileList,
  dispatch
) => {
  try {
    const formData = new FormData();

    // Append all fields to FormData
    formData.append("emp_first_name", values.firstName);
    formData.append("emp_last_name", values.lastName);
    formData.append("gender", values.gender);
    formData.append("date_of_birth", values.dateOfBirth);
    formData.append("phone", values.phone);
    formData.append("blood_group", values.blood);
    formData.append("email_id", values.email);
    formData.append("alternate_phone", values.altPhone);
    formData.append("owner_id", "01Af021");

    // Append profile image if exists (must be a File object)
    if (fileList[0]?.originFileObj) {
      formData.append("profile_img", fileList[0].originFileObj);
    }

    let response;

    if (empId) {
      response = await axios.put(`${BASE_URL}/emPersonal/${empId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } else {
      response = await axios.post(
        `${BASE_URL}/emPersonal/emp-personal`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    }
    dispatch(fetchEmployee());
    return response.data;
  } catch (error) {
    console.error("Error submitting employee form data:", error);
    throw error;
  }
};

export const CreateEmpAddress = async (empId, values, dispatch) => {
  try {
    const payload = {
      temp_add: values?.temp_add,
      temp_country: values?.temp_country,
      temp_state: values?.temp_state,
      temp_city: values?.temp_city,
      temp_zip_code: values?.temp_zip_code,
      temp_region: values?.temp_region,
      perm_add: values?.perm_add,
      perm_country: values?.perm_country,
      perm_state: values?.perm_state,
      perm_city: values?.perm_city,
      perm_zip_code: values?.perm_zip_code,
      perm_region: values?.perm_region,
    };

    let response;
    response = await axios.put(
      `${BASE_URL}/emPersonal/${empId}/address`,
      payload
    );
    console.log(payload, "Response from Create Emp Address", response.data);
    dispatch(fetchEmployee());
    return response.data;
  } catch (error) {
    console.error("Error Creating Emp Address", error);
    throw error;
  }
};

export const CreateEmpProfessional = async (empId, values, dispatch) => {
  try {
    const payload = {
      designation: values?.designation,
      role_type: values?.role,
      role_type_id: values?.role_type_id,
      department: values?.department,
      joining_date: values?.joiningDate,
      reporting_manager: values?.reporting,
      branch: values?.branch,
      language: values?.language,
      qualification: values?.qualification,
    };

    let response;
    response = await axios.put(
      `${BASE_URL}/emProfessional/${empId}/professional`,
      payload
    );
    console.log(
      payload,
      "Response from Create Emp Professional",
      response.data
    );
    dispatch(fetchEmployee());
    return response.data;
  } catch (error) {
    console.error("Error Creating Emp Professional", error);
    throw error;
  }
};

export const CreateEmployeeDoc = async (empId, documentsdata) => {
  try {
    const formData = new FormData();

    // Append all fields to FormData
    formData.append("aadhar_card_number", documentsdata.aadhar_number);
    formData.append("pan_card_number", documentsdata.pan_number);
    if (documentsdata.aadhar_doc) {
      formData.append("aadhar_card_front_doc", documentsdata.aadhar_doc);
    }

    if (documentsdata.aadhar_bk_doc) {
      formData.append("aadhar_card_back_doc", documentsdata.aadhar_bk_doc);
    }

    if (documentsdata.pan_doc) {
      formData.append("pan_card_front_doc", documentsdata.pan_doc);
    }

    if (documentsdata.pan_bk_doc) {
      formData.append("pan_card_back_doc", documentsdata.pan_bk_doc);
    }

    if (documentsdata.offerletter) {
      formData.append("offer_letter_doc", documentsdata.offerletter);
    }

    if (documentsdata.qualification) {
      formData.append("qualification_doc", documentsdata.qualification);
    }

    let response;

    response = await axios.put(
      `${BASE_URL}/emProfessional/${empId}/documents`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    //dispatch(fetchEmployee());
    return response.data;
  } catch (error) {
    console.error("Error submitting employee form data:", error);
    throw error;
  }
};

export const getEmployeeByID = async (empId) => {
  try {
    const response = await axios.get(`${BASE_URL}/emPersonal/${empId}`);
    console.log(response.data, "Response from Employee List");
    return response.data;
  } catch (error) {
    console.error("Error fetching employee List", error);
  }
};

export const SubmitEmployeeExcel = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const excelEndpoint = `${BASE_URL}/emPersonal/import-excel`;

  try {
    const response = await axios.post(excelEndpoint, formData);
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};


export const searchEmployee = async (term) => {
  try {
    const url =
      term?.length === 0
        ? `${BASE_URL}/emPersonal/combined` // fallback to full list
        : `${BASE_URL}/emPersonal/search?term=${term}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in searchCustomers:", error);
    throw error; // Optional: let the calling thunk handle rejection
  }
};


export const filterEmployee = async ({ fromDate, toDate, emp_status_id }) => {
  try {
    const params = {};

    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    if (emp_status_id === 1) params.emp_status_id = 1;
    else if (emp_status_id === 2) params.emp_status_id = 2;
    else if (emp_status_id === 3) params.emp_status_id = 3;
    else if (emp_status_id === 4) params.emp_status_id = 4;

    console.log("Final params sent to API:", emp_status_id,  params);

    const response = await axios.get(`${BASE_URL}/emPersonal/search`, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error filtering customers", error);
    return [];
  }
};


export const UpdateStatus = async (rowId, status, dispatch) => {
  const statusId = status === "Draft" ? 1 : status === "Active" ? 2 : status === "InActive" ? 3: 4;
  try {
    const payload = {
      emp_status: status,
      emp_status_id: statusId,
    };

    const response = await axios.put(
      `${BASE_URL}/emPersonal/${rowId}/status`,
      payload
    );
    console.log("response", response);
     dispatch(fetchEmployee());
    return response.data;
  } catch (error) {
    console.error("Error updating Emp status", error);
    throw error;
  }
};