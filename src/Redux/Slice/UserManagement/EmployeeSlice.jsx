import { createSlice } from "@reduxjs/toolkit";
import { fetchEmployee, fetchEmployeeSearch, fetchFilteredEmp } from "./EmployeeThunk";

const EmployeeSlice = createSlice({
  name: "employee",
  initialState: {
    employee: [],
    emp_loading: false,
    emp_error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployee.pending, (state) => {
        state.emp_loading = true;
        state.emp_error = null; // ✅ fix typo from sales_error
      })
      .addCase(fetchEmployee.fulfilled, (state, action) => {
        state.emp_loading = false;
        state.employee = action.payload || []; // safe fallback
      })
      .addCase(fetchEmployee.rejected, (state, action) => {
        state.emp_loading = false;
        state.emp_error = action.error.message || "Failed to fetch employee data";
      })
      .addCase(fetchFilteredEmp.fulfilled, (state, action) => {
              state.employee = action.payload;
            })
       .addCase(fetchEmployeeSearch.fulfilled, (state, action) => {
              state.employee = action.payload;
            });
  },
});

export default EmployeeSlice.reducer;
