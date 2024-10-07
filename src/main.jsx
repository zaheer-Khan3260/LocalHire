import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { SocketContextProvider } from './utils/socketContext.jsx'
import ProtectedLayer from './components/helper/ProtectedLayer.jsx'
import {store} from './store/store.js'
import Login from './components/Auth/Login.jsx'
import Signup from './components/Auth/Signup.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import Profile from './components/Profile/Profile.jsx'
import Robot from './components/Robot.jsx'
import Messages from './components/messages/Messages.jsx'
import MessageDisplay from './components/helper/MessageDisplay.jsx'




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
      },
      {
        path: "/messages",
        element: (
          <ProtectedLayer>
            <Messages/>
          </ProtectedLayer>
        ),
        children: [
          {
            path: ":id",
            element: (
              <ProtectedLayer>
                <MessageDisplay/>
              </ProtectedLayer>
            )
          }
        ]
      },
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <SocketContextProvider>
    <RouterProvider router={router}/>
    </SocketContextProvider>
    </Provider>
  </StrictMode>,
)
