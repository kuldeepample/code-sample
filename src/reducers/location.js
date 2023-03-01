import { getUsersList } from '@/services/people.service';
import { createSlice } from '@reduxjs/toolkit';
import { addLocation, getActivityList, getAvailableLocationList, getComplianceStatusLevelList, getComplianceStatusList, getLocationDetail, getLocationEquipments, getLocationPeople, getLocations } from '../services/location.service';

const initialState = {
  locationList: null,
  availableLocationList: null,
  locationDetail: null,
  usersList: null,
  locationPeople: null,
  locationEquipmens: [],
  activityList: null,
  complianceStatusList: null,
  complianceStatusLevelList: null
}

const location = createSlice({
  name: 'location',
  initialState,
  reducers: {
    addLocationToList: (state, action) => {
      state.locationList = [...state.locationList, action.payload]
    }
  },
  extraReducers: {
    [addLocation.fulfilled]: (state, action) => {
      return {
        ...state,
        initialState: { data: action.payload }
      };
    },
    [getLocations.fulfilled]: (state, action) => {
      state.locationList = action.payload?.data
    },
    [getAvailableLocationList.fulfilled]: (state, action) => {
      if (action.payload && action.payload?.data) {
        return {
          ...state,
          availableLocationList: action.payload.data,
        };
      }
      else {
        return initialState;
      };
    },
    [getLocationDetail.fulfilled]: (state, action) => {
      state.locationDetail = action.payload?.data
    },
    [getUsersList.fulfilled]: (state, action) => {
      state.usersList = action.payload?.data?.data
    },
    [getLocationPeople.fulfilled]: (state, action) => {
      state.locationPeople = action.payload?.data
    },
    [getLocationEquipments.fulfilled]: (state, action) => {
      state.locationEquipmens = action.payload?.data
    },
    [getActivityList.fulfilled]: (state, action) => {
      state.activityList = action.payload?.data
    },
    [getComplianceStatusList.fulfilled]: (state, action) => {
      state.complianceStatusList = action.payload?.data
    },
    [getComplianceStatusLevelList.fulfilled]: (state,action) => {
      state.complianceStatusLevelList = action.payload?.data
    }
  }
})

export default location.reducer