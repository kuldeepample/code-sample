import axios from 'axios';
import * as config from '../config';
import { getQueryParams } from '@/helpers'
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

export const apiRequest = (method, end_point, action_type = 'CALL_API', id) => {
   return createAsyncThunk(
      action_type,
      async (data) => {
         try {
            const url = `${config.API_URL + end_point}${id ? `/${id}` : ''}?${getQueryParams(data)}`;
            const response = await axios[method](url)
            return response.data
         } catch (err) {
            return err?.response.data
         }
      }
   )
}
export const apiRequestParams = (method, end_point, action_type = 'CALL_API') => {
   return createAsyncThunk(
      action_type,
      async (apiData) => {
         try {
            const { id, data: bodyParams } = apiData
            const url = `${config.API_URL + end_point}/${id || apiData}`
            const response = await axios[method](url, bodyParams)
            return response.data
         } catch (err) {
            return err?.response?.data
         }
      }
   )
}
export const apiRequestBodyParams = (method, end_point, action_type = 'CALL_API') => {
   return createAsyncThunk(
      action_type,
      async (data) => {
         try {
            const url = `${config.API_URL + end_point}`
            const response = await axios[method](url, data)
            
            return response.data
         } catch (err) {
            toast.error(err?.response?.data?.message)
            return err?.response?.data
         }
      }
   )
}

export const getEquipmentList = apiRequest('get', `equipments/list`, 'GET_EQUIPMENT_LIST')

export const getLocationEquipment = apiRequest('get', `equipments/list`, 'GET_LOCATION_EQUIPMENT')

export const getEquipmentCategoriesList = apiRequest('get', 'equipment-categories/list?status=active', 'GET_EQUIPMENT_CATEGORIES_LIST');

export const getEquipmentModelList = apiRequest('get', 'equipment-models/list', 'GET_EQUIPMENT_MODEL_LIST')

export const getAvailableEquipments = apiRequest('get', 'equipments/available-list', 'GET_AVAILABLE_EQUIPMENT');

export const addEquipmentsToLocation = apiRequest('patch', 'equipments/update-location', 'ADD_EQUIPMENT_LOCATION');

export const addEquipmentsToPeople = apiRequestBodyParams('post', 'equipment-users/multiple-equipment', 'ADD_EQUIPMENT_TO_PEOPLE')

export const getEquipmentDetail = createAsyncThunk(
   'GET_EQUIPMENT_DETAIL',
   async (equipment_id) => {
      try {
         const response = await axios.get(`${config.API_URL}equipments/detail/${equipment_id}`)
         return response.data
      } catch (err) {
         toast.error(err?.response?.data?.message)
         return err?.response?.data
      }
   }
)

// export const updateEquipmentDetail = createAsyncThunk(
//    'UPDATE_EQUIPMENT_DETAIL',
//    (data) => {
//       return data.equipment
//    }
// )
export const getIncidentInfo = createAsyncThunk(
   'GET_INCIDENT_INFO',
   async (incident_id) => {
      const response = await axios.get(`${config.API_URL}incidents/detail/${incident_id}`)
      return response.data
   }
)

export const getEquipmentBrandList = apiRequest('get', 'equipment-brands/list')

export const addEquipment = apiRequest('post', 'equipments/create')

export const editEquipment = createAsyncThunk(
   "EDIT_EQUIPMENT",
   async (data) => {
      const { id, payload } = data
      const response = await axios.patch(`${config.API_URL}equipments/update/${id}`, payload).then((res) => {
         return res
      }).catch((err) => {
         return err.response
      })
      return response.data;
   }
)

export const addInspection = apiRequestBodyParams('post', 'inspections/create', 'ADD_INSPECTION')

export const updateInspection = createAsyncThunk(
   'UPDATE_INSPECTION',
   async (data = {}) => {
      const { inspection_id: id, payload } = data
      const response = await axios.patch(`${config.API_URL}inspections/update/${id}`, payload)
      return response.data
   }
)

export const checkSN = createAsyncThunk(
   'CHECK_SN',
   async (sn) => {
      const response = await axios.get(`${config.API_URL}equipments/count/${sn}`)
      return response.data
   }
)

export const getInspectionList = apiRequest('get', 'inspections/list', 'GET_INSPECTION_LIST');

export const addDocument = apiRequestBodyParams('post', 'equipment-documents/create', 'ADD_DOCUMENT')

export const editDocument = createAsyncThunk(
   'EDIT_DOCUMENT',
   async (data) => {
      const { documentId, payload } = data
      const response = axios.patch(`${config.API_URL}equipment-documents/update/${documentId}`, payload);
      return response.data
   }
)
export const getDocumentList = apiRequest('get', 'equipment-documents/list', 'GET_DOCUMENT_LIST')

export const getAccessoriesList = apiRequest('get', 'accessories/list', 'GET_ACCESSORIES_LIST')

export const addAccessory = apiRequestBodyParams('post', 'accessories/create', 'ADD_ACCESSORY')

export const editAccessory = apiRequestParams('patch', 'accessories/update', 'EDIT_ACCESSORY')

export const getModelAccessoriesList = createAsyncThunk(
   'GET_MODEL_ACCESSORY',
   async (id) => {
      const response = await axios.get(`${config.API_URL}model-accessories/list?equipment_model_id=${id}&status=active`)
      return response.data
   }
)

export const getEquipmentPeopleList = apiRequest('get', 'peoples/list', 'GET_EQUIPMENT_PEOPLE_LIST')

export const addUserToEquipment = apiRequestBodyParams('post', 'equipment-users/create', 'ADD_USER_TO_EQUIPMENT')

export const editEquipmentUser = apiRequestParams('patch', 'equipment-users/update', 'EDIT_EQUIPMENT_USER')

export const deleteEquipmentUser = apiRequestParams('delete', 'equipment-users/delete', 'DELETE_EQUIPMENT_USER')

export const getFormDetail = apiRequestParams('get', 'forms/detail', 'GET_FORM_DETAIL')

export const addIncident = apiRequest('post', 'incidents/create', 'ADD_INCIDENTS')

export const getIncidentList = apiRequest('get', 'incidents/list', 'GET_INCIDENT_LIST')

export const deleteIncident = apiRequestParams('delete', 'incidents/delete')

export const editIncident = apiRequestParams('patch', 'incidents/update', 'EDIT_INCIDENT')

export const registerEquipment = apiRequestBodyParams('post', 'equipments/register-equipment', 'REGISTER_EQUIPMENT')

export const registerMedication = apiRequestBodyParams('post', 'medications', 'REGISTER_MEDICATION')
export const getInspectionDetail = apiRequestParams('get', 'inspections/detail', 'GET_INSPECTION_DETAIL')
export const getAccessoryDetail = apiRequestParams('get', 'accessories/detail', 'GET_ACCESSORY_DETAIL')
export const addEquipmentImg = apiRequestBodyParams('post', 'equipment-images', 'ADD_EQUIPMENT_IMAGE')
export const editEquipmentImg = apiRequestParams('patch', 'equipment-images', 'EDIT_EQUIPMENT_IMAGE')
