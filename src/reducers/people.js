import { isNotUser, isSuperAdmin } from "@/helpers";
import { getAvailableInstructorList, getAvailableStudentList } from "@/services";
import { createSlice } from "@reduxjs/toolkit";
import _ from 'lodash'
import { getAvailablePeople, getPeopleDetail, getUserRoleList, getUsersList, getUserTypes } from "../services/people.service";


const initialState = {
   usersList: null,
   userRoleList: null,
   allRoleList: [],
   availablePeopleList: null,
};

export const people = createSlice({
   name: 'people',
   initialState,
   reducers: {
      requestRejected: (state, action) => {
         state.rejected = action?.payload.data
      }
   },
   extraReducers: {
      [getUsersList.fulfilled]: (state, action) => {
         return {
            ...state,
            usersList: action?.payload?.data,
            filteredListData: null,
            totalUser: action?.payload?.total,
         };
      },
      [getAvailablePeople.fulfilled]: (state, action) => {
         state.availablePeopleList = action?.payload?.data
      },
      [getUserRoleList.fulfilled]: (state, action = {}) => {
         let role;
         const {payload } = action;
         if (payload && payload?.data) {
            role = isSuperAdmin() ? payload.data?.filter((role) => role.level > 1)
               : !isNotUser() ? payload.data?.filter((role) => role.level > 3)
                  : payload.data?.filter((role) => role.level > 2);
            role = _.sortBy(role, role => role.level)
         }
         return {
            ...state,
            allRoleList: _.sortBy(payload?.data, role => role.level),
            userRoleList: role
         }
      },
      [getUserTypes.fulfilled]: (state, action) => {
         state.userTypes = action?.payload?.data
      },
      [getAvailableStudentList.fulfilled]: (state, action) => {
         state.availablePeopleList = action?.payload?.data
      },
      [getAvailableInstructorList.fulfilled]: (state, action) => {
         state.availablePeopleList = action?.payload?.data
      },
      [getPeopleDetail.rejected]: (state, action) => {
         
      }
   }
})
export default people.reducer