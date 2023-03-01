import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './common.css'
import App from './App';
import '../src/pages/dashboard/index.css'
import '../src/pages/equipment/index.css'
import '../src/pages/dashboard/index.css'
import '../src/pages/locations/index.css'
import store from './store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import * as config from './config'

const consoleMethods = [
  'assert',
  'clear',
  'count',
  'debug',
  'dir',
  'dirxml',
  'error',
  'exception',
  'group',
  'groupCollapsed',
  'groupEnd',
  'info',
  'profile',
  'profileEnd',
  'table',
  'time',
  'timeEnd',
  'timeStamp',
  'trace',
  'warn',
  // 'log'
];
consoleMethods.forEach(methodName => {
  console[methodName] = () => {
    /* noop */
  };
});

const firebaseConfig = {
    apiKey: config.API_KEY,
    authDomain: config.AUTH_DOMAIN,
    projectId: config.PROJECT_ID,
    storageBucket: config.STORAGE_BUCKET,
    messagingSenderId: config.SENDER_ID,
    appId: config.APP_ID,
    measurementId: config.MEASUREMENT_ID

  };

export const firebaseApp = initializeApp(firebaseConfig);
// export const messaging = getMessaging(firebaseApp);

if ("serviceWorker" in navigator) {
  
  navigator.serviceWorker.register('../firebase-messaging-sw.js').then((res) => {
    console.log('service worker registration successfull');
  }).catch((err) => console.log('service worker registration failed', err))

  // navigator.serviceWorker.getRegistration().then(reg => {
  // reg.showNotification('title', {});
  // navigator.serviceWorker.addEventListener("message", event => {
  //   console.dir("sdsdsdsd",event.data);
  // });
  // });
}
const container = document.getElementById('root');
const root = createRoot(container)
root.render(
  <React.Fragment>
    <Provider store={store}>
      <BrowserRouter >
        <App />
      </BrowserRouter>
    </Provider>
  </React.Fragment>
);

serviceWorker.unregister();