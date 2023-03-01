import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as config from '../config';
import { apiRequest, apiRequestBodyParams, apiRequestParams } from './equipment.services';

export const getUserRoleList = apiRequest('get', 'user-roles/list', 'GET_USER_ROLE_LIST')
export const getUsersList = apiRequest('get', 'peoples/list', 'GET_USERS_LIST')
export const getAvailablePeople = createAsyncThunk(
    'GET_AVAILABLE_PEOPLE',
    async (end_point) => {
        const url = `${config.API_URL + end_point}`;
        const response = await axios['get'](url)
        return response.data
    }
)

export const getPeopleDetail = apiRequestParams('get', 'peoples/detail', 'GET_PEOPLE_DETAIL')
export const addPeople = apiRequest('post', 'user/sub-user-create', 'ADD_PEOPLE')

export const addLocationsToPeople = apiRequest('post', 'location-users/add-multiple-locations', 'ADD_LOCATIONS_TO_PEOPLE')
export const deletePeopleLocation = apiRequestBodyParams('delete', 'location-users/remove', 'DELETE_PEOPLE_LOCATION')

export const updatePeopleDetail = apiRequestParams('patch', 'users/update', 'UPDATE_PEOPLE_DETAIL')

export const getUserTypes = apiRequest('get', 'user-types/list', 'GET_USER_TYPES')