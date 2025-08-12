import { createSlice } from "@reduxjs/toolkit";

export const DataSlice = createSlice({
    name: 'UserData',
    initialState: {
        list: []
    },
    reducers: {
        setUserDetails: (state, action) => {
            const { name, phone, email, empid } = action.payload;
            state.name = name;
            state.phone = phone;
            state.email = email;
            state.empid = empid;
        }
    }
});

export const { setUserDetails } = DataSlice.actions;
export default DataSlice.reducer;
