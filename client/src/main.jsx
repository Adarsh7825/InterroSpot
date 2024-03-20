import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './Layout.jsx'
import './index.css'
import Chat from './chat.jsx'
import Home from './components/Home/Home.jsx'
import AccessAccount from './components/AccessAccount/AccessAccount.jsx'
import CandidateAndCompanyRegister from './components/Register/CandidateAndCompanyRegister.jsx'
import CandidateAndCompanyLogin from './components/Login/CandidateAndCompanyLogin.jsx'
import BecomeAnInterviewer from './components/BecomeAnInterviewer/BecomeAnInterviewer.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path='/home' element={<Home />} />
      <Route path='/access-account' element={<AccessAccount />} />
      <Route path='/signup/candidate' element={<CandidateAndCompanyRegister />} />
      <Route path='/login/candidate' element={<CandidateAndCompanyLogin />} />
      <Route path='/become-an-interview-engineer' element={<BecomeAnInterviewer />} />

    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Chat />
  </React.StrictMode>,
)