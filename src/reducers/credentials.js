import { getCategory, getCredentialsList, getCredentialTypesList } from "@/services";
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    credentialList : [],
    totalCredential: 0,
    credentialTypes: [],
    credentialCategory: []
}

const credential = createSlice({
    name: 'credential',
    initialState,
    reducers: {},
    extraReducers: {
        [getCredentialsList.fulfilled]: (state, action) => {
            state.credentialList = action.payload?.data
            state.totalCredential = action.payload?.total
        },
        [getCredentialTypesList.fulfilled]: (state, action) => {
            state.credentialTypes = action.payload?.data
        },
        [getCategory.fulfilled]: (state, action) => {
            state.credentialCategory = action.payload?.data
        },
    }
})

export default credential.reducer