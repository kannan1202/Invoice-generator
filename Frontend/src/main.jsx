import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import LoginForm from './pages/auth/Login'
import RegisterForm from './pages/auth/Register'
import DashboardPublic from './pages/DashboardPublic'
import DashboardPrivate from './pages/DashboardPrivate'
import AuthProvider from './components/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'


const router = createBrowserRouter([
  {
    path:'/',
    element:<App />,
    children:[
      {
        index:true,
        element:<DashboardPublic/>
      },
      {
        path:"dashboard",
        element:(
          <ProtectedRoute>
            <DashboardPrivate/>
          </ProtectedRoute>
        )
      },
      {
        path:"login",
        element:<LoginForm/>
      },
      {
        path:"register",
        element:<RegisterForm/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </AuthProvider>
)
