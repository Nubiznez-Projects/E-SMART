import { createAsyncThunk } from "@reduxjs/toolkit";
import { getRoles, createRoles } from "../../../../API/MasterModule/Roles";

export const fetchRoles = createAsyncThunk("roles/fetch", async () => {
    return await getRoles();
})