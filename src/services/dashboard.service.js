import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as config from '../config';
import { apiRequest, apiRequestBodyParams, apiRequestParams } from './equipment.services';


export const getAllUser = apiRequest('get', 'dashboard/users-list', 'GET_ALL_USER')
export const getAllAed = apiRequest('get', 'dashboard/aed-status', 'GET_ALL_AED')
export const getAllLocation = apiRequest('get', 'dashboard/location-status', 'GET_ALL_LOCATION')
export const getRecentActivities = createAsyncThunk(
   'GET_RECENT_ACTIVITIES',
   async(limit) => {
      const response = await axios.get(`${config.API_URL}dashboard/recent-activities?limit=${limit || ""}`);
      return response.data
   }
)

export const getAllMedications = apiRequest('get', 'dashboard/medication-status', 'GET_ALL_MEDICATION')
export const getSearchResults = apiRequest('get', 'search', 'GET_SEARCH_RESULT')
export const getNotificationList = apiRequest('get', 'notifications/list', 'GET_NOTIFICATION_LIST')
export const readNotification = apiRequestBodyParams('post', 'notifications/mark-read', 'READ_NOTIFICATION')
export const getPageContent = apiRequestParams('get', 'pages', 'GET_PAGE_CONTENT')