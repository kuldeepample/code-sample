import { getLocationTypes } from "@/services";
import { createSlice } from "@reduxjs/toolkit";
import { getReportDetail, getReportDetailList, getReportEquipment, getReportList, getReportLocations, getReportUsersList } from "../services/report.service";


const initialState = {
    reportList: [],
    equipmentList: [],
    reportDetail: [],
    reportDetailList: [],
    usersList: [],
    locationList: [],
    locationTypes: []
};

export const report = createSlice({
    name: 'report',
    initialState,
    reducers: {
        clearReportList: (state) => {
            state.reportDetailList = []
        }
    },
    extraReducers: {
        [getReportEquipment.fulfilled]: (state, action) => {
            state.equipmentList = action.payload?.data
        },
        [getReportList.fulfilled]: (state, action) => {
            state.reportList = action.payload?.data
        },
        [getReportDetail.fulfilled]: (state, action) => {
            state.reportDetail = action.payload?.data
        },
        [getReportDetailList.fulfilled]: (state, action) => {
            state.reportDetailList = action.payload?.data
        },
        [getReportUsersList.fulfilled]: (state, action) => {
            state.usersList = action.payload?.data
        },
        [getReportLocations.fulfilled]: (state, action) => {
            state.locationList = action.payload?.data
        },
        [getLocationTypes.fulfilled]: (state, action) => {
            state.locationTypes = action.payload?.data
        }
    }
})
export const { clearReportList } = report.actions
export default report.reducer