import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { SocketContextProvider } from './utils/socketContext.jsx';
import ProtectedLayer from './components/helper/ProtectedLayer.jsx';
import { store } from './store/store.js';
import Login from './components/Auth/Login.jsx';
import Signup from './components/Auth/Signup.jsx';
import UserDashboard from './components/Dashboard/UserDashboard.jsx';
import Profile from './components/Profile/Profile.jsx';
import Messages from './components/messages/Messages.jsx';
import MessageDisplay from './components/helper/MessageDisplay.jsx';
import useFetchCurrentUserData from './hooks/useFetchCurrentUserData.js';
import WorkerDashboard from './components/Dashboard/WorkerDashboard.jsx';

// Create a wrapper component to handle fetching user data and routing logic
function AppRoutes() {
  const user = useFetchCurrentUserData(); // Hook is used here inside the component
  console.log( "user: ",user)

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
      element: <App />,
      children: [
        {
          path: "/",
          // Use user.role to conditionally render the dashboard
          element: user && user?.role === "worker" ? <WorkerDashboard /> : <UserDashboard/>
        },
        {
          path: "/profile/:_id",
          element: (
            <ProtectedLayer>
              <Profile />
            </ProtectedLayer>
          ),
        },
        {
          path: "/messages",
          element: (
            <ProtectedLayer>
              <Messages />
            </ProtectedLayer>
          ),
          children: [
            {
              path: ":id",
              element: (
                <ProtectedLayer>
                  <MessageDisplay />
                </ProtectedLayer>
              ),
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <SocketContextProvider>
        <AppRoutes />
      </SocketContextProvider>
    </Provider>
  </StrictMode>,
);
