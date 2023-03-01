import _ from 'lodash';
import { dashboardSchema } from "@/helpers";
import { createSlice } from "@reduxjs/toolkit";
import { getAllAed, getAllLocation, getAllMedications, getAllUser, getNotificationList, getRecentActivities, readNotification } from "@/services/dashboard.service";
import { getLicenseDetail, getLicenseHistory } from "@/services/auth.service";

const initialState = {
  people: {},
  aed: {},
  location: {},
  licenseDetail: {},
  licenseHistory: null,
  recentActivities: null,
  totalNotifications: 0,
  unreadNotifications: 0,
  notificationList: [],
  unreadNotificationList: null
};
export const dashboard = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateNotificationData: (state, action) => {
        state.notificationList = _.concat(state?.notificationList, action.payload?.notification);
        state.unreadNotifications = state?.unreadNotifications + 1;
    },
    updateNotificatioList: (state, action) => {
      state.notificationList = _.concat(action.payload?.notification, state?.notificationList);
        state.totalNotifications = state?.totalNotifications + 1;
        state.unreadNotifications = state?.unreadNotifications + 1
    },
    removeNotificationData: (state, action) => {
      if(action.payload === 'all') {
        state.unreadNotificationList = null
      } else state.unreadNotificationList = state.notificationList?.filter((item) => !item?.is_read)
    },
    clearDashboardReducer: (state, action) => {
      return state = initialState
    }
  },
  extraReducers: {
    [getAllUser.fulfilled]: (state, action) => {
      state.people = action.payload
    },
    [getAllAed.fulfilled]: (state, action) => {
      state.aed = action.payload?.data || dashboardSchema?.equipment
    },
    [getAllLocation.fulfilled]: (state, action) => {
      state.location = action.payload?.data || dashboardSchema?.location
    },
    [getAllMedications.fulfilled]: (state, action) => {
      state.medication = action.payload?.data
    },
    [getRecentActivities.fulfilled]: (state, action) => {
      state.recentActivities = action.payload?.data || []
    },
    [getNotificationList.fulfilled]: (state, action) => {
      state.totalNotifications = action.payload?.total;
        state.unreadNotifications = action.payload?.totalUnread;
        state.notificationList = _.concat(state?.notificationList, action.payload?.data)
    },
    [readNotification.fulfilled]: (state, action) => {
      let id = action?.meta?.arg?.notificationIds &&  action?.meta?.arg?.notificationIds[0]
      if (id) {
        let readNotification;
        readNotification = state.notificationList.map((item) => {
          return item.id === +id ? { ...item, is_read: true } : { ...item }
        })
        return {
          ...state,
          notificationList: readNotification,
          unreadNotifications: state?.unreadNotifications - 1
        }
      } else {
        let read = state.notificationList.map((item) => {
          return { ...item, is_read: true }
        })
        return {
          ...state,
          unreadNotifications: 0,
          notificationList: read
        };
      }
    },
    [getLicenseDetail.fulfilled]: (state, action) => {
      state.licenseDetail = action.payload?.data
    },
    [getLicenseHistory.fulfilled]: (state, action) => {
      state.licenseHistory = action.payload?.data
    }
  }
})

export const { updateNotificationData, removeNotificationData, clearDashboardReducer } = dashboard.actions
export default dashboard.reducer
