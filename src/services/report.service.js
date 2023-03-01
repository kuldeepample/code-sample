import { getQueryParams } from '@/helpers';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as config from '../config';
import { apiRequest, apiRequestBodyParams, apiRequestParams } from './equipment.services';


export const getReportList = apiRequest("get", 'reports/list', 'GET_REPORT_LIST');
export const getReportEquipment = createAsyncThunk(
    'GET_REPORT_EQUIPMENT',
    async (data) => {
        const response = await axios.get(`${config.API_URL}report-filter/equipment?slug=${data}`)
        return response.data
    }
)
export const getReportUsersList = createAsyncThunk(
    'GET_REPORT_USERS_LIST',
    async (data) => {
        const response = await axios.get(`${config.API_URL}report-filter/user?${data}`)
        return response.data
    }
)
export const getReportLocations = createAsyncThunk(
    'GET_REPORT_LOCATION',
    async (data) => {
        const response = await axios.get(`${config.API_URL}report-filter/location?${data}`)
        return response.data
    }
)
export const getReportDetailList = createAsyncThunk(
    'GET_REPORT_DETAIL_LIST',
    async (data) => {
        const { type, filters } = data
        const response = await axios.post(`${config.API_URL}reports/${type}-list?slug=${filters?.category?.name || ''}`, filters)
        return response.data
    }
)

export const getReportDetail = apiRequestParams("get", 'reports/detail', 'GET_REPORT_DETAIL');
export const createReport = apiRequestBodyParams("post", 'reports/create', 'CREATE_REPORT');
export const editReport = apiRequestParams("patch", 'reports/update', 'EDIT_REPORT');
export const removeReport = apiRequestParams("delete", 'reports/delete', 'REMOVE_REPORT');
export const exportReport = createAsyncThunk(
    'EXPORT_REPORT',
    async (payload) => {
        const { data, type } = payload
        try {
            const response = await axios.get(`${config.SOCIAL_URL}reports/export/${type}?${getQueryParams(data)}`,
                { responseType: 'arraybuffer' });
            return response
        } catch (err) {
            return err.response.data
        }
    }
)