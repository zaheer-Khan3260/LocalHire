import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import ProtectedLayer from './components/helper/ProtectedLayer.jsx'
import {store, persistor} from './store/store.js'
import { PersistGate } from 'redux-persist/integration/react';
import Login from './components/Auth/Login.jsx'
import Signup from './components/Auth/Signup.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import Profile from './components/Profile/Profile.jsx'
import Robot from './components/Robot.jsx'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/',
    element:
        <App/>,
    children: [
      {
        path: "/",
        element: <Dashboard/>
      },
      {
        path: "/profile",
        element: (
            <ProtectedLayer>
            <Profile/>
            </ProtectedLayer>
        )
        
      }, 
      {
        path: "/landing",
        element: <Robot/>
      }
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <RouterProvider router={router}/>
    </PersistGate>
    </Provider>
  </StrictMode>,
)
