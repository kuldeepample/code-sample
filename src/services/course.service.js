import { getQueryParams } from '@/helpers';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as config from '../config';
import { apiRequest, apiRequestBodyParams, apiRequestParams } from './equipment.services'

export const getCourseList = apiRequest('get', 'courses', 'GET_COURSE_LIST')

export const addCourse = apiRequestBodyParams('post', 'courses', 'ADD_COURSE')

export const editCourse = apiRequestParams('patch', 'courses', 'EDIT_COURSE')

export const acceptCourse = apiRequestParams('patch', 'course-services', 'ACCEPT_COURSE')

export const deleteCourse = apiRequestParams('delete', 'courses', 'DELETE_COURSE')

export const getCourseDetail = apiRequestParams('get', "courses", 'GET_COURSE_DETAIL')

export const getStudentsList = createAsyncThunk(
   'GET_STUDENTS_LIST',
   async (apiData) => {
       const {id, data} = apiData
      try{
         const url = `${config.API_URL + 'students/'}${id}?${getQueryParams(data)}`;
         const response = await axios.get(url)
         return response.data
      }catch(err) {
         console.log(err, 'error');
         return err.response.data
      }
   }
)

export const addStudent = apiRequestBodyParams('post', 'students', 'ADD_STUDENT')
export const addMultiStudent = apiRequestBodyParams('post', 'students/register', 'ADD_STUDENT')

export const updateStudent = apiRequestParams('patch', 'students', 'EDIT_STUDENT')

export const deleteStudent = apiRequestParams('delete', 'students', 'DELETE_STUDENT')

export const getInstructorList = createAsyncThunk(
   'GET_INSTRUCTORS_LIST',
   async (apiData) => {
       const {id, data} = apiData
      try{
         const url = `${config.API_URL + 'instructors/'}${id}?${getQueryParams(data)}`;
         const response = await axios.get(url)
         return response.data
      }catch(err) {
         console.log(err, 'error');
         return err.response.data
      }
   }
)

export const addInstructor = apiRequestBodyParams('post', 'instructors', 'ADD_INSTRUCTOR')

export const editInstructor = apiRequestParams('patch', 'instructors', 'EDIT_INSTRUCTOR')

export const deleteInstructor = apiRequestParams('delete', 'instructors', 'DELETE_INSTRUCTOR')

export const getCourseDocList = createAsyncThunk(
    'GET_COURSE_DOCUMENT',
    async (apiData) => {
        const {id, data} = apiData
       try{
          const url = `${config.API_URL + 'course-documents/list/'}${id}?${getQueryParams(data)}`;
          const response = await axios.get(url)
          return response.data
       }catch(err) {
          console.log(err, 'error');
          return err.response.data
       }
    }
 )

 export const addCourseDocument = apiRequestBodyParams('post', 'course-documents', 'ADD_COURSE_DOCUMENT')
 export const editCourseDocument = apiRequestParams('patch', 'course-documents', 'EDIT_COURSE_DOCUMENT')

 export const deleteCourseDocument = apiRequestParams('delete', 'course-documents', 'DELETE_COURSE_DOCUMENT')

 export const getStateList = apiRequest('get', 'states/list', 'GET_STATE_LIST')

 export const getAvailableStudentList = apiRequest('get', 'students/available/users', 'GET_AVAILABLE_STUDENTS')

 export const getAvailableInstructorList = apiRequest('get', 'instructors/available/users', 'GET_AVAILABLE_INSTRUCTOR')

 export const addServiceOrg = apiRequestBodyParams('post', 'course-services', 'ADD_SERVICE_ORG')

 export const getServiceOrg = apiRequest('get', 'accounts/list', 'SERVICE_ORG_LIST')

 export const updateCourseInfo = apiRequestBodyParams('post', 'courses/upsert', 'UPDATE_COURSE_INFO')