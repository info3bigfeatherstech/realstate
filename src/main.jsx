import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './REDUX_FEATURES/REDUX_STORE/store.js'
import { Provider } from 'react-redux'
// src/main.jsx me:

import { setStore } from './SERVICES/Axiosinstance.js'
import { setCustomerStore } from './SERVICES/CustomerAxiosInstance.js' // 1. Isse import karein

setStore(store);
setCustomerStore(store); // 2. Isse connect karein


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)