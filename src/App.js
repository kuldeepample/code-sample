import React, { Suspense, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import routes from './routes';
import { ToastContainer } from 'react-toastify';
import { isNotUser, isUserAuthenticated, pusher } from 'helpers';
import DefaultLayout from './components/Layout/DefaultLayout';
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import './theme/Colors.css';
import { getMessaging, getToken } from "firebase/messaging";
import * as config from './config';
import { getEquipmentCategoriesList } from './services/equipment.services';
import { getLicensePermissions, getUserProfile, updateDeviceToken } from './services';
import { updateNotificationData } from './reducers/dashboard';
import { Spinner } from 'react-bootstrap';
import { firebaseApp } from './index';
import './App.css';


const App = (props) => {
  const routings = isNotUser() ? routes : routes.filter((route) => !route.user)

  // const { updateNotificationData } = props
  const dispatch = useDispatch()
  const currentUserId = useSelector((state) => state.auth.user?.id)
  useEffect(() => {

    const channel = pusher.subscribe('notification');
    channel.bind("new", function (data) {
      if (+data?.notification?.user_id === currentUserId) {
        dispatch(updateNotificationData(data));
      }
    });

    return (() => channel.unbind())
  }, [])
  useEffect(() => {

    if (isUserAuthenticated()) {
      // Req user for notification permission
      requestPermission();

      dispatch(getUserProfile());
      dispatch(getLicensePermissions())
      dispatch(getEquipmentCategoriesList());
    }

  }, [isUserAuthenticated()])

  async function requestPermission() {

    if ("serviceWorker" in navigator) {
      const messaging = getMessaging(firebaseApp);
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        // Generate Token
        try {
          const token = await getToken(messaging, { vapidKey: config.VAPID_KEY });
          let data = {
            type: 'web',
            token: token,
            status: 'active'
          }
          dispatch(updateDeviceToken(data))
        } catch (e) {
          console.log(e, 'token request failed');
        }
      }
    }
  }


  const RouteComponent = ({ route }) => {
    const { component: Component, isSearch } = route;

    return route.ispublic
      ? isUserAuthenticated() === true
        ? <Navigate to='/dashboard' />
        : <Component {...route} />

      : route.isPrint
        ? <Component {...route} />

        : isUserAuthenticated() === true
          ? <DefaultLayout isSearch={isSearch}>
            <Suspense fallback={
              <div className='d-flex center flex-grow-1 vh-100'>
                <Spinner animation='border' className='d-flex align-self-center' />
              </div>
            }>
              <Component {...route} />
            </Suspense>
          </DefaultLayout>
          : <Navigate to='/' />
  }

  return (
    <React.Fragment>

      <Routes>
        {
          routings.map((route, idx) => {
            return (
              route.component && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<RouteComponent route={route} />}
                />
              )
            )
          })
        }
      </Routes>
      {/* </Suspense> */}

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={'colored'}
      />
    </React.Fragment>
  );
}

export default App;