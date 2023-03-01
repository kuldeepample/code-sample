import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as config from '../config';
import { apiRequest, apiRequestBodyParams, apiRequestParams } from "./equipment.services";


export const getCredentialsList = apiRequest('get', 'credentials', 'GET_CREDENTIAL_LIST')
export const getCredentialTypesList = apiRequest('get', 'credential-types', 'GET_CREDENTIAL_TYPES')
export const addCredential = apiRequestBodyParams('post', 'credentials', 'ADD_CREDENTIAL')
export const editCredential = createAsyncThunk(
  'EDIT_CREDENTIAL',
  async (data) => {
    const { id, payload } = data
    const url = `${config.API_URL}credentials/${id}`
    const response = await axios['patch'](url, payload)
    return response.data
  }
)

export const deleteCredential = apiRequestParams('delete', 'credentials', 'DELETE_CREDENTIAL')

export const getCategory = createAsyncThunk(
  'GET_CATEGORY',
  async (data) => {
    const url = `${config.API_URL}equipment-categories/list?status=active&slug=${data}`
    const response = await axios['get'](url)
    return response.data
  }
)

export const deleteCredentialDoc = apiRequestParams('delete', 'credential-documents', 'DELETE_CREDENTIAL_DOC')

export const getCredentialDetail = apiRequestParams('get', 'credentials', 'GET_CREDENTIAL_DETAIL')