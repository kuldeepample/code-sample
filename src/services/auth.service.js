import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as config from '../config';
import { setUserToken } from '../helpers'
import { apiRequest, apiRequestBodyParams } from "./equipment.services";


export const register = apiRequest('post', 'users/create', 'REGISTER_USER')

export const login = apiRequestBodyParams('post', 'users/login', 'LOGIN')

export const socialLogin = (data) => {
  setUserToken(data)
};

export const logout = () => {
  localStorage.clear();
};

export const forgotPassword = apiRequest('post', 'users/forgot-password', 'FORGOT_PASSWORD')
export const resetPassword = apiRequest('post', 'users/reset-password', 'RESET_PASSWORD')
export const changePassword = apiRequest('post', 'users/change-password', 'CHANGE_PASSWORD')
export const updateProfile = apiRequestBodyParams('patch', 'users', 'UPDATE_PROFILE')
export const getUserProfile = apiRequest('get', 'users/profile', 'GET_PROFILE')
export const uploadImage = createAsyncThunk(
  'UPLOAD_IMAGE',
  async (data) => {
    const { filess, getPercent } = data
    const response = await axios.post(`${config.API_URL}files/image`, filess, {
      headers: { 'Content-Type': 'application/octet-stream' },
      onUploadProgress: (e) => {
        var uploadPercent = Math.round((e.loaded * 100) / e.total);
        getPercent(uploadPercent)
      },
    })
    return response.data
  }
)


// export const uploadImage = async (data, callBack) => {
//   return await axios.post(`${config.API_URL}files/image`, data, {
//     headers: { 'Content-Type': 'application/octet-stream' },
//     onUploadProgress: (e) => {
//       var uploadPercent = Math.round((e.loaded * 100) / e.total);
//       callBack(uploadPercent)
//     },
//   })
//     .then((res) => { return res })
//     .catch((e) => { return e.response });
// };

export const uploadFile = createAsyncThunk(
  'UPLOAD_FILE',
  async (data) => {
    const response = await axios.post(`${config.API_URL}files/file`, data, { headers: { 'Content-Type': 'application/octet-stream' } })
    return response.data.data
  }
)

export const getOrganizationList = apiRequest('get', 'accounts/list', 'GET_ORGANIZATION_LIST')
export const getLicenseDetail = apiRequest('get', 'licenses/detail', 'GET_LICENSE_DETAIL')
export const getLicenseHistory = apiRequest('get', 'licenses/history', 'GET_LICENSE_HISTORY')

export const getLicensePermissions = apiRequest('get', 'licenses/check-permission', 'GET_LICENSE_PERMISSION')

export const createEnquiries = apiRequestBodyParams('post', 'enquiries/create', 'CREATE_ENQUIRIES')
export const getTimeZoneList = apiRequest('get', 'time-zones', 'GET_TIME_ZONE_LIST')
export const updateDeviceToken = apiRequest('post', 'users/upsert-token', 'UPDATE_DEVICE_TOKEN')
