import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getRoles = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/roles`);
    console.log("Getting roles data", response.data);
    return response.data;
  } catch (error) {
    console.error("Error Fetching roles", error);
    throw error;
  }
};

export const getByIDRoles = async (roleId) => {
  try {
    const response = await axios.get(`${BASE_URL}/roles/${roleId}`);
    console.log("Getting roles data", response.data);
    return response.data;
  } catch (error) {
    console.error("Error Fetching roles", error);
    throw error;
  }
};

export const createRoles = async (rolesData, roleId) => {
  try {
    const payload = {
      RoleName: rolesData.role,
      Permissions: rolesData.permission,
      ModulePermissions: rolesData.ModulePermissions,
      SubModulePermissions: rolesData.SubModulePermissions,
      Narration: rolesData.description,
      Status: rolesData.status === "Active" ? true : false,
    };

    let response;

    if (roleId) {
      // If ID is present, update existing customer (PUT)
      response = await axios.put(`${BASE_URL}/roles/${roleId}`, payload);
      console.log("Update roles", response.data);
    } else {
      // If no ID, create a new customer (POST)
      response = await axios.post(`${BASE_URL}/roles`, payload);
      console.log("Create roles response", response.data);
    }

    return response.data;
  } catch (error) {
    console.error("Error creating roles", error);
    throw error;
  }
};
