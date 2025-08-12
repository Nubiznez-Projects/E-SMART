import { createAsyncThunk } from "@reduxjs/toolkit";
import { filterEmployee, getEmployeeList, searchEmployee } from "../../../API/UserManagement/Employee/Employee";

export const fetchEmployee = createAsyncThunk(
  "employee/fetch",
  async () => {
    return await getEmployeeList();
  }
);

export const fetchEmployeeSearch = createAsyncThunk(
  "employee/search",
  async (term) => {
    return await searchEmployee(term);
  }
)


export const fetchFilteredEmp = createAsyncThunk(
  "employee/filter",
  async (filterParams) => {
    const response = await filterEmployee(filterParams);
    return response;
  }
)