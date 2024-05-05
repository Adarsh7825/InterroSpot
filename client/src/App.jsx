import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import './App.css';
import Navbar from './components/common/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import Error from './pages/Error';
import MyProfile from './components/core/Dashboard/MyProfile';
import PrivateRoute from './components/core/Auth/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Settings from './components/core/Dashboard/Settings';

function App() {
  return (
    <Router>
      <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path='verify-email' element={<VerifyEmail />} />
          <Route path="dashboard/my-profile" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
          <Route element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="dashboard/Settings" element={<Settings />} />
          <Route path='*' element={<Error />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;