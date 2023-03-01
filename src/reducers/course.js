import { addMultiStudent, addServiceOrg, deleteStudent, getCourseDetail, getCourseList, getStateList, updateCourseInfo, updateStudent } from "@/services";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    courseList: [],
    stateList: [],
    courseDetail: { }
}
const course = createSlice({
    name: 'course',
    initialState,
    reducers: {
        updateCourseDetail: (state, action) => {
            state.courseDetail = action.payload.course
        }
    },
    extraReducers: {
        [getCourseList.fulfilled]: (state, action) => {
            state.courseList = action?.payload.data
        },
        [getStateList.fulfilled]: (state, action) => {
            state.stateList = action?.payload?.data
        },
        [getCourseDetail.fulfilled]: (state, action) => {
            state.courseDetail = action?.payload?.data
        },
        [addMultiStudent.fulfilled]: (state, action) => {
            state.courseDetail.attendees += action?.meta?.arg?.user_ids?.length
        },
        [updateStudent.fulfilled]: (state, action) => {
            action?.payload?.data?.status === 'rejected' ? state.courseDetail.attendees -= 1 :   action?.payload?.data?.status === 'approved' ? state.courseDetail.attendees += 1 : state.courseDetail.attendees +=0 ;
        },
        [deleteStudent.fulfilled]: (state, action) => {
            action?.meta?.arg?.status === 'approved' ? state.courseDetail.attendees -= 1 :  state.courseDetail.attendees -= 0
        },
        [addServiceOrg.fulfilled]: (state, action) => {
           state.courseDetail = {...state.courseDetail, service_account: {
             account : { name: action?.meta?.arg?.organization}
            }}
        },
        [updateCourseInfo.fulfilled]: (state, action) => {
            state.courseDetail = {...state.courseDetail, course_info: action?.meta?.arg }
        }
    }
})
export const { updateCourseDetail } = course.actions;
export default course.reducer;