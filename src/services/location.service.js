import axios from 'axios';
import * as config from '../config';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest, apiRequestBodyParams, apiRequestParams } from './equipment.services';
import { toast } from 'react-toastify';
import { getQueryParams } from '@/helpers';


export const getLocations = apiRequest('get', 'locations/list', 'GET_LOCATIONS')

export const getAvailableLocationList = apiRequest('get', 'location-users/available-locations', 'GET_AVAILABLE_LOCATIONS')

export const getComplianceStatusList = createAsyncThunk(
  'GET_COMPLIANCE_STATUS_LIST',
  async (data) => {
    const response = await axios.get(`${config.API_URL}compliance-status/list?slug=${data}`);
    return response.data
  }
);

export const getComplianceStatusLevelList = apiRequest('get', 'compliance-status/levels', 'COMPLIANCE_STATUS_LEVEL')

export const getLocationDetail = apiRequestParams('get', 'locations/detail', 'GET_LOCATION_DETAIL');


export const addLocation = apiRequest('post', 'locations/create', 'ADD_LOCATION')
export const editLocation = apiRequestParams('patch', 'locations/update', 'EDIT_LOCATION')
export const deleteLocation = apiRequestParams('delete', 'locations/delete', 'DELETE_LOCATION')

export const getUserList = apiRequest('get', 'users/list', 'GET_USERS')

export const getLocationPeople = apiRequest('get', 'location-users/users-list', 'GET_LOCATION_PEOPLE')

export const getLocationEquipments = createAsyncThunk(
  'GET_LOCATION_EQUIPMENT',
  async (id) => {
    const response = await axios.get(`${config.API_URL}location-equipments/list?location_id=${id}`)
    return response.data
  }
)

export const addUserToLocation = apiRequestBodyParams('post', 'location-users/create-multiple', 'ADD_USER_TO_LOCATION')

export const deleteLocationUser = createAsyncThunk(
  'DELETE_LOCATION_USER',
  async (data) => {
    try {
      const response = await axios.delete(`${config.API_URL}location-users/remove`, { data })
      return response.data
    } catch (err) {
      toast.error(err?.response?.data?.message)
      return err?.response?.data
    }
  }
)
export const getDocList = createAsyncThunk(
  'GET_LOCATION_DOC',
  async (params) => {
    const { id, data } = params
    try {
      const response = await axios.get(`${config.API_URL}location-documents/${id}?${getQueryParams(data)}`)
      return response.data
    } catch (err) {
      toast.error(err?.response?.data?.message)
      return err?.response?.data
    }
  }
)

// export const deleteLocationUser = apiRequestBodyParams('delete', 'location-users/remove', 'DELETE_USER_FROM_LOCATION')
export const getActivityList = apiRequest('get', 'activities/list', 'GET_ACTIVITY_LIST')
export const addActivity = apiRequestBodyParams('post', 'activities/create', 'ADD_ACTIVITY')
export const editActivity = apiRequestParams('patch', 'activities/update', 'EDIT_ACTIVITY')
export const deleteActivity = apiRequestParams('delete', 'activities/delete', 'DELETE_ACTIVITY')
export const getActivityDetails = apiRequestParams('get', 'activities/detail', 'GET_ACTIVITY_DETAIL')

export const addLocationToList = createAsyncThunk(
  'ADD_LOCATION_TO_LIST',
  (newLocation) => {
    return newLocation
  }
)

export const updateLocationTime = apiRequestBodyParams('post', 'location-times/upsert-all', 'UPDATE_LOCATION_TIME')
export const getLocationTypes = apiRequest('get', 'location-types/list', 'GET_LOCATION_TYPES')
// export const getDocList = apiRequestParams('get', 'location-documents', 'GET_LOCATION_DOC')
export const addLocationDoc = apiRequestBodyParams('post', 'location-documents', 'ADD_LOCATION_DOC')
export const editLocationDoc = apiRequestParams('patch', 'location-documents', 'EDIT_LOCATION_DOC')