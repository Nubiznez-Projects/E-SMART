import { createSlice } from "@reduxjs/toolkit";
import { fetchRoles } from "./RoleThunks";



const roleSlice = createSlice({
name: "roles",
initialState: {
    role: [],
    loading: false,
    error: null
},
reducers: {},
extraReducers: (builder) => {
    builder
     .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
     })
     .addCase(fetchRoles.fulfilled, (state, action) => {
       state.loading = false;
       state.role = action.payload;
     })
     .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
     })
}
})


export default roleSlice.reducer;