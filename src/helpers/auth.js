import axios from 'axios';
import * as config from '@/config';
import Pusher from 'pusher-js'

export const getLoggedInUserToken = () => {
  const token = JSON.parse(localStorage.getItem('token'));
  if (token && token.accessToken)
    return token;
}

export const isUserAuthenticated = () => {
  const token = JSON.parse(localStorage.getItem('token'));
  axios.defaults.headers.common = {
    'Authorization': `Bearer ${token?.accessToken}`,
    'accountId': `${token?.account?.id || 1}`,
    'Accept': 'application/json'
  }

  return token?.accessToken ? true : false;
}
export const isNotUser = () => {
  const token = JSON.parse(localStorage.getItem('token'));
  let userRoleLevel = token?.user?.user_role?.level;
  return userRoleLevel < 4;
}

export const isSuperAdmin = () => {
  const token = JSON.parse(localStorage.getItem('token'));
  let userRole = token?.user?.user_role?.slug;
  return userRole === 'admin';
}

export const isDistributor = () => {
  const token = JSON.parse(localStorage.getItem('token'));
  let userRole = token?.user?.user_role?.slug;
  return userRole === 'distributor';
}

export const isManager = () => {
  const token = JSON.parse(localStorage.getItem('token'));
  let userRole = token?.user?.user_role?.slug;
  return userRole === 'account-manager';
}

export const authHeader = () => {
  let token = JSON.parse(localStorage.getItem('token'));
  return (token && token.accessToken) ? { 'Authorization': 'Bearer ' + token.accessToken } : {};
}

export const setUserToken = (data) => {
  data.account = data?.account || data.user.account;
  localStorage.setItem('token', JSON.stringify(data));

  if (data && data.accessToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
}

export const pusher = new Pusher(config.PUSHER_APP_KEY, {
  cluster: config.PUSHER_APP_CLUSTER || 'mt1',
  forceTLS: config.PUSHER_USE_TLS || false
});
export const activityChannel = pusher.subscribe('activity');