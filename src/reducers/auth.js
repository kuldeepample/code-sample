import { isUserAuthenticated, setUserToken } from "@/helpers";
import _ from 'lodash'
import { createSlice } from "@reduxjs/toolkit";
import { forgotPassword, getLicensePermissions, getOrganizationList, getTimeZoneList, getUserProfile, login, register, uploadFile, uploadImage } from "@/services/auth.service";

const token = JSON.parse(localStorage.getItem('token'));

const initialState = token && token.user
  ? {
    isLoggedIn: true,
    user: token.user,
    image: null,
    organizationList: null,
    licensePermissions: {},
    timeZoneList: null,
    loading: false
  }
  : { isLoggedIn: false, user: null, loading: false };

export const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.clear();
      state.user = null
    }
  },
  extraReducers: {
    [register.fulfilled]: (state, action) => {
      state.isLoggedIn = false
    },
    [register.rejected]: (state, action) => {
      state.isLoggedIn = false
    },
    [login.fulfilled]: (state, action) => {
      setUserToken(action.payload?.data)
      state.isLoggedIn = true;
      state.user = action?.payload?.data?.user
    },
    [login.rejected]: (state, action) => {
      state.isLoggedIn = false
      state.user = null
    },
    [forgotPassword.fulfilled]: (state) => {
      state.isLoggedIn = false
    },
    [forgotPassword.rejected]: (state) => {
      state.isLoggedIn = false
    },
    [getUserProfile.fulfilled]: (state, action) => {
      let token1 = JSON.parse(localStorage.getItem('token'));
      token1.user = action?.payload?.data;
      setUserToken(token1);
      state.isLoggedIn = true;
      state.user = action.payload?.data
      // const role = ['admin', 'distributer']
      // if(!role.includes(action.payload?.data?.user_role?.slug)){
      //     state.loading = false
      // }
    },
    [uploadImage.fulfilled]: (state, action) => {
      state.image = action.payload?.data
    },
    [uploadFile.fulfilled]: (state, action) => {

    },
    [getOrganizationList.pending]: (state, action) => {
      state.loading = true
    },
    [getOrganizationList.fulfilled]: (state, action) => {
      let tokenOrg = JSON.parse(localStorage.getItem('token'));
      // tokenOrg.account = tokenOrg?.account || _.find(action?.payload?.data, (item) => item?.id === 1);
      tokenOrg.account = tokenOrg?.account || (action?.payload?.data && action?.payload?.data[0]);
      localStorage.setItem('token', JSON.stringify(tokenOrg));
      isUserAuthenticated()
      state.organizationList = action.payload?.data || []
      state.loading = false
    },
    [getTimeZoneList.fulfilled]: (state, action) => {
      let data = action.payload?.data;
      data = _.map(data, (item) => _.mapKeys(item, (v, keyName) => {
        if (keyName === 'text') return 'name'
        else return keyName;
      }))
      return {
        ...state,
        timeZoneList: data || [],
      };
    },
    [getLicensePermissions.fulfilled]: (state, action) => {
      state.licensePermissions = action.payload?.data
    }
  }
})

export const { logout } = auth.actions;
export default auth.reducer;
