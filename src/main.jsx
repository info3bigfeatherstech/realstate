import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './REDUX_FEATURES/REDUX_STORE/store.js'
import { Provider } from 'react-redux'
import { setStore } from './SERVICES/Axiosinstance.js'  // ✅ ADD THIS

setStore(store);  // ✅ ADD THIS - Connect axios with Redux store

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)